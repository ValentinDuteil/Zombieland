// Business logic for users : profile, plannning, delection

import { Request, Response, NextFunction } from 'express';
import { UpdateProfileSchema } from '../schemas/auth.schema.js';
import * as argon2 from 'argon2';
import { prisma } from '../lib/prisma.js';
import { BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError } from "../utils/AppError.js";

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {

  //1.fetching the users with req.user.id (because we already have the cookie) 
  //and checking if users exist
  // selecting the informations we need and the count of reservations for each user with _count and select
  // for the AdminMembers page
  if (!req.user) {
    throw new UnauthorizedError('Accès refusé')
  }
  const users = await prisma.user.findMany({
    select: {
      id_USER: true,
      email: true,
      firstname: true,
      lastname: true,
      role: true,
      created_at: true,
      _count: {
        select: { reservations: true }
      }
    }
  })
  //2.if not valid, returning 404 error
  if (!users.length) {
    throw new NotFoundError("Utilisateurs introuvables")
  }
  //3.returning Users (without passwords)
  return res.status(200).json(users)
}


export async function getProfile(req: Request, res: Response, next: NextFunction) {

  //1.fetching the user with req.user.id (beacause we already have the cookie) 
  //and checking if the user exists
  if (!req.user) {
    throw new UnauthorizedError('Accès refusé')
  }

  const id = parseInt(req.params.id as string)
  if (isNaN(id)) {
    throw new BadRequestError("ID invalide")
  }

  // a "MEMBER" can only his own profile (id from URL(req.params) has to be the same as id from cookie(req.user)
  if (req.user.role !== 'ADMIN' && id !== req.user.id) {
    throw new ForbiddenError('Accès interdit')
  }

  const user = await prisma.user.findUnique({
    where: { id_USER: id }
  })
  //2.if not valid, returning 404 error
  if (!user) {
    throw new NotFoundError("Utilisateur introuvable")
  }
  //3.returning User (without password)
  const { password: _, ...userWithoutPassword } = user
  return res.status(200).json(userWithoutPassword)
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {

  //1. Check if the user is connected via cookie
  if (!req.user) {
    throw new UnauthorizedError('Accès refusé')
  }

  //2. Get and validate the id from the URL
  //parseInt() converts the string to a number
  //"as string" tells TypeScript to trust me that "it's a string !"
  const id = parseInt(req.params.id as string)
  if (isNaN(id)) {
    throw new BadRequestError("Id invalide")
  }

  //3. If "MEMBER" tries to update another profile → 403
  // a "MEMBER" can only update his own profile (id from URL(req.params) has to be the same as id from cookie(req.user)
  if (req.user.role !== 'ADMIN' && id !== req.user.id) {
    throw new ForbiddenError('Accès interdit')
  }

  //4. Validate the data with Zod schema
  //partial() makes all the fields optional → Prisma ignores the undefined fields
  // safeParse() returns "{ success: true/false, data, error } " 
  // and we stock the data in a variable "data"
  const UpdateSchema = UpdateProfileSchema
  const data = UpdateSchema.safeParse(req.body)
  if (!data.success) {
    throw new BadRequestError("Données invalides")
  }
  const parsedBody = data.data

  //5 If "MEMBER" → check the current password before updating (security)
  // "ADMIN" can update without password
  if (req.user.role !== 'ADMIN') {
    const currentPassword = req.body.currentPassword
    // checking user in DB with hashed password, 
    // because we need to compare the hash with the current password with argon2.verify()
    const user = await prisma.user.findUnique({
      where: { id_USER: req.user.id }
    })
    if (!user) {
      throw new NotFoundError('Utilisateur introuvable')
    }
    // if the user exist, we compare the clear hash and the current password with argon2.verify()
    if (user) {
      const rightPassword = await argon2.verify(user.password, currentPassword)
      if (!rightPassword) {
        throw new UnauthorizedError('Mot de passe incorrect')
      }
    }
  }

  //6. If "MEMBER" tries to change the role → 403
  // only "ADMIN" can change the role
  if (req.user.role !== 'ADMIN' && parsedBody.role) {
    throw new ForbiddenError('Modification réservée aux Administrateurs')
  }

  //7. If a new password is given → hash it with argon2 before storing it in the DB
  // if not provided, parsedBody.password is undefined → Prisma ignores it 
  // and the password stay the same in the DB
  if (parsedBody.password) {
    parsedBody.password = await argon2.hash(parsedBody.password);
  }

  //8. Updating the profile in the DB with Prisma
  // thanks to the id from the URL(id = req.params) the "ADMIN" can also update other profiles
  const newUser = await prisma.user.update({
    where: { id_USER: id },
    data: {
      email: parsedBody.email,
      lastname: parsedBody.lastname,
      firstname: parsedBody.firstname,
      password: parsedBody.password, // undefined if not provided → Prisma ignores it
      role: parsedBody.role // undefined if not provided → Prisma ignores it
    }
  })

  //9.returning User (without password)
  // we stock the password in an non use variable "_" 
  // then we keep the rest of the information thanks to the spread "..."userWithoutPassword.
  const { password: _, ...userWithoutPassword } = newUser
  return res.status(200).json(userWithoutPassword)
}

export async function deleteProfile(req: Request, res: Response, next: NextFunction) {

  //1.getProfile
  if (!req.user) throw new UnauthorizedError('Accès refusé')
  //telling to TypeScript "trust me" it's a string  
  const id = parseInt(req.params.id as string)
  if (isNaN(id)) throw new BadRequestError("Id invalide")

  // a "MEMBER" can only delete his own profile (id from URL(req.params) has to be the same as id from cookie(req.user)
  if (req.user.role !== 'ADMIN' && id !== req.user.id) {
    throw new ForbiddenError('Accès interdit')
  }

  //2.check if it exists
  const user = await prisma.user.findUnique({
    where: { id_USER: id }
  })

  //3.if the data isn't found, return a 404 error
  if (!user) {
    throw new NotFoundError("Utilisateur introuvable")
  }

  // 3.5checking the passwword of ADMIN before deleting the profile, for security
  const { password } = req.body
  const admin = await prisma.user.findUnique({
    where: { id_USER: req.user.id }
  })
  if (!admin) throw new NotFoundError("Administrateur introuvable")

  const rightPassword = await argon2.verify(admin.password, password)
  if (!rightPassword) throw new UnauthorizedError("Mot de passe incorrect")

  //4.delete
  await prisma.user.update({
    where: { id_USER: id },
    data: { deleted_at: new Date() }
  })

  //5.returning confirmation
  return res.status(200).json('☠️ Ton profile a bien été supprimé ☠️')
}