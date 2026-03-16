// Business logic for users : register, login, logout

import { Request, Response, NextFunction } from 'express';
import UserSchema from '../schema/auth.schema.js';
import * as argon2 from 'argon2';
import { prisma } from '../lib/prisma.js';

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


//Waiting for a refacto of en error handler
//Waiting for a refacto of services for business logic with (findAll, Create, Delete...etc)