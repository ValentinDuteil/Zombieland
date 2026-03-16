// Business logic for users : register, login, logout

//Waiting for a refacto of en error handler
//Waiting for a refacto of services for business logic with (findAll, Create, Delete...etc)
//Waiting for a refacto with a middlewares/validate.ts

import { Request, Response, NextFunction } from 'express';
import { UserSchema, LoginSchema } from '../schemas/auth.schema.js';
import * as argon2 from 'argon2';
import { prisma } from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

export async function register(req: Request, res: Response, next: NextFunction) {

  //1.fetching the parameters we need in the body (given by the user inputs)
  //useless if "req.body" is used as an argument for safeParse()
  //const { email, firstname, lastname, password } = req.body

  //2.validation by zod schema
  //safeParse() returns "{ success: true/false, data, error }"
  const data = UserSchema.safeParse(req.body);

  //3.conditions
  if (!data.success) {
    console.error("Form content is not approuved ");
    //waiting for refacto after setting of an error handler
    return res.status(400).json(data.error);
  }

  const parsedBody = data.data

  //4.check if the email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: parsedBody.email }
  })

  if (existingUser) {
    return res.status(409).json({ message: 'Email already exists' })
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

  //7.security, confirmed to the client the creation without returning the password
  const { password: _, ...userWithoutPassword } = newUser
  return res.status(201).json(userWithoutPassword);
}


export async function login(req: Request, res: Response, next: NextFunction) {

  //1.fetching the parameters we need in the body (given by the user inputs)
  //and validation by zod schema
  const data = LoginSchema.safeParse(req.body);

  if (!data.success) {
    console.error("Form content is not approuved ");
    //waiting for refacto after setting of an error handler
    return res.status(400).json(data.error);
  }

  const parsedBody = data.data

  //4.check if the email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: parsedBody.email }
  })

  if (!existingUser) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  //5.confirmed the hash is the same
  const rightPassword = await argon2.verify(existingUser.password, parsedBody.password)

  if (!rightPassword) {
    return res.status(401).json({ message: 'Invalid credentials' })
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

  return res.status(200).json({ token: token });
}

export async function me(req: Request, res: Response, next: NextFunction) {
  //.fetch user informations and checking if user is undefined
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const user = await prisma.user.findUnique({
    where: { id_USER: req.user.id }
  })
  //2.checking if userExist
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  //3.returning the informations to the user
  const { password: _, ...userWithoutPassword } = user
  return res.status(200).json(userWithoutPassword)
}