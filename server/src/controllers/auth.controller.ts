// Business logic for users : register, login, logout

//Waiting for a refacto of en error handler
//Waiting for a refacto of services for business logic with (findAll, Create, Delete...etc)
//Waiting for a refacto with a middlewares/validate.ts

import { Request, Response, NextFunction } from 'express';
import { UserSchema, LoginSchema } from '../schemas/auth.schema.js';
import * as argon2 from 'argon2';
import { prisma } from '../lib/prisma.js';
import jwt from 'jsonwebtoken';
import { BadRequestError, UnauthorizedError, NotFoundError, ConflictError } from "../utils/AppError.js";

export async function register(req: Request, res: Response, next: NextFunction) {

  //1.fetching the parameters we need in the body (given by the user inputs)
  //useless if "req.body" is used as an argument for safeParse()
  //const { email, firstname, lastname, password } = req.body

  //2.validation by zod schema
  //safeParse() returns "{ success: true/false, data, error }"
  const data = UserSchema.safeParse(req.body);

  //3.if the data is invalid, return a 400 error
  if (!data.success) {
    throw new BadRequestError("Données invalides")
  }

  const parsedBody = data.data

  //4.check if the email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: parsedBody.email }
  })

  if (existingUser) {
    throw new ConflictError('Email already exists')
  }

  //5.password hash required before pushing in db
  const hash = await argon2.hash(parsedBody.password);

  //6.push the validated informations of the new user in the db with prisma schema
  const newUser = await prisma.user.create({
    data: {
      email: parsedBody.email,
      lastname: parsedBody.lastname,
      firstname: parsedBody.firstname,
      password: hash,
    }
  })

  //7.adding a token using JWT
  const token = jwt.sign(
    {
      id: newUser.id_USER,
      role: newUser.role
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' },
  )
  //checking if the user is an admin, because if it's an admin, it's probably a registration by an admin for another user
  const existingToken = req.cookies?.token
  let isAdmin = false

  if (existingToken) {
    try {
      const decoded = jwt.verify(existingToken, process.env.JWT_SECRET!) as { role: string }
      isAdmin = decoded.role === 'ADMIN'
    } catch {
      // token invalide ou expiré → on ignore
    }
  }
  //8.putting the token in a cookie httpOnly only if the user is not an admin 
  // (because if it's an admin, it's probably a registration by an admin for another user, 
  // so we don't want to log in as the new user)
  if (!isAdmin) {

    res.cookie('token', token, {
      httpOnly: true,                 // JavaScript can't read it → protection XSS
      secure: process.env.NODE_ENV === 'production',   // true in production (HTTPS), false in development (HTTP)
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // cookie is send only from the same website "Lax"→ CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // lifetime in milliseconds
    })
  }

  //9.security, confirmed to the client the creation without returning the password
  const { password: _, ...userWithoutPassword } = newUser
  return res.status(201).json(userWithoutPassword);
}


export async function login(req: Request, res: Response, next: NextFunction) {

  //1.fetching the parameters we need in the body (given by the user inputs)
  //plus validation by zod schema, 
  //and if the data is invalid, return a 400 error
  const data = LoginSchema.safeParse(req.body);

  if (!data.success) {
    throw new BadRequestError("Contenu du formulaire non approuvé")
  }

  const parsedBody = data.data

  //4.check if the email already exists 
  //if not, return a 401
  const existingUser = await prisma.user.findUnique({
    where: { email: parsedBody.email }
  })

  if (!existingUser) {
    throw new UnauthorizedError('Identifiants invalides')
  }

  //5.confirmed the hash is the same
  //if not, return a 401
  const rightPassword = await argon2.verify(existingUser.password, parsedBody.password)

  if (!rightPassword) {
    throw new UnauthorizedError('Identifiants invalides')
  }

  //6.adding a token using JWT
  const token = jwt.sign(
    {
      id: existingUser.id_USER,
      role: existingUser.role
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' },
  )

  //7.putting the token in a cookie httpOnly
  res.cookie('token', token, {
    httpOnly: true,                 // JavaScript can't read it → protection XSS
    secure: process.env.NODE_ENV === 'production', // true in production (HTTPS), false in development (HTTP)
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',  // cookie is send only from the same website "Lax"→ CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000 // lifetime in milliseconds
  })

  return res.status(200).json({ message: "Connexion réussie" });
}

export async function me(req: Request, res: Response, next: NextFunction) {

  //1.fetch user informations and checking if user is undefined
  if (!req.user) {
    throw new UnauthorizedError('Accès refusé')
  }
  const user = await prisma.user.findUnique({
    where: { id_USER: req.user.id }
  })
  //2.checking if userExist
  if (!user) {
    throw new NotFoundError("Utilisateur introuvable")
  }
  //3.returning the informations to the user
  const { password: _, ...userWithoutPassword } = user
  return res.status(200).json(userWithoutPassword)
}

export async function logout(req: Request, res: Response, next: NextFunction) {

  //1.Logout
  res.clearCookie('token', {
    httpOnly: true,                 // JavaScript can't read it → protection XSS
    secure: process.env.NODE_ENV === 'production', // true in production (HTTPS), false in development (HTTP)
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',   // cookie is send only from the same website "Lax"→ CSRF protection
  })
  //2.returning the informations to the user
  return res.status(200).json('Déconnexion')
}