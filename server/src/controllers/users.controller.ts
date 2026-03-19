// Business logic for users : profile, plannning, delection

import { Request, Response, NextFunction } from 'express';
import { UserSchema } from '../schemas/auth.schema.js';
import * as argon2 from 'argon2';
import { prisma } from '../lib/prisma.js';
import { BadRequestError, UnauthorizedError, NotFoundError } from "../utils/AppError.js";

export async function getProfile(req: Request, res: Response, next: NextFunction) {

  //1.fetching the user with req.user.id (beacause we already have the cookie) 
  //and checking if the user exists
  if (!req.user) {
    throw new UnauthorizedError('Accès refusé')
  }
  const user = await prisma.user.findUnique({
    where: { id_USER: req.user.id }
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

  //1.getProfile
  if (!req.user) throw new UnauthorizedError('Accès refusé')
  //telling to TypeScript "trust me" it's a string  
  const id = parseInt(req.params.id as string)
  if (isNaN(id)) throw new BadRequestError("Id invalide")

  //2.check the informations with the zodSchema and making it optionnal
  //partial() makes the fields optionnal
  const UpdateSchema = UserSchema.partial()
  //safeParse() returns "{ success: true/false, data, error }"
  const data = UpdateSchema.safeParse(req.body)
  //using parsedBody instead of data.data
  const parsedBody = data.data

  //3.if the data is invalid, return a 400 error
  if (!data.success) {
    throw new BadRequestError("Données invalides")
  }

  //4.if the password is given, using the hash
  if (!parsedBody) {
    throw new UnauthorizedError('Accès refusé')
  }
  //if the user gave a new password, hash is the new password (but clear), 
  //if not, hash is undefined
  // ⚠️ DETTE TECHNIQUE
  // Ajouter vérification du mot de passe actuel avant modification
  // Nécessite : nouveau champ "currentPassword" dans le body + argon2.verify()
  let hash = parsedBody.password
  if (parsedBody.password) {
    //here wer hash the new one
    hash = await argon2.hash(parsedBody.password);
  }

  //5.updating the DB with Prisma
  const newUser = await prisma.user.update({
    where: { id_USER: req.user.id },
    data: {
      email: parsedBody.email,
      lastname: parsedBody.lastname,
      firstname: parsedBody.firstname,
      password: hash,
    }
  })

  //6.returning User (without password)
  const { password: _, ...userWithoutPassword } = newUser
  return res.status(200).json(userWithoutPassword)
}

export async function deleteProfile(req: Request, res: Response, next: NextFunction) {

  //1.getProfile
  if (!req.user) throw new UnauthorizedError('Accès refusé')
  //telling to TypeScript "trust me" it's a string  
  const id = parseInt(req.params.id as string)
  if (isNaN(id)) throw new BadRequestError("Id invalide")

  //2.check if it exists
  const user = await prisma.user.findUnique({
    where: { id_USER: req.user.id }
  })

  //3.if the data isn't found, return a 404 error
  if (!user) {
    throw new NotFoundError("Utilisateur introuvable")
  }

  //4.delete
  await prisma.user.delete({
    where: { id_USER: req.user.id }
  })

  //5.returning confirmation
  return res.status(200).json('☠️ Ton profile a bien été supprimé ☠️')
}