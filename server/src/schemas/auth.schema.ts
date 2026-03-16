import * as z from "zod";

export const UserSchema = z.object({
  email: z.string().email(),
  firstname: z.string().min(1).max(20),
  lastname: z.string().min(1).max(20),
  password: z.string().min(8)
    .regex(/[A-Z]/, "votre mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "votre mot de passe doit contenir au moins un chiffre")
    .regex(/[^a-zA-Z0-9]/, "votre mot de passe doit contenir au moins un caractère spécial"),
  //password confirmation checked by front not to overuse the back
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})