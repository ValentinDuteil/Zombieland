import * as z from "zod";

export const UserSchema = z.object({
  email: z.string().email({ error: "Email invalide" }),
  firstname: z.string().min(1, { error: "Le prénom est requis" }).max(20, { error: "Le prénom ne peut pas dépasser 20 caractères" }),
  lastname: z.string().min(1, { error: "Le nom est requis" }).max(20, { error: "Le nom ne peut pas dépasser 20 caractères" }),
  password: z.string().min(8, { error: "Le mot de passe doit contenir au moins 8 caractères" })
    .regex(/[A-Z]/, { error: "Votre mot de passe doit contenir au moins une majuscule" })
    .regex(/[0-9]/, { error: "Votre mot de passe doit contenir au moins un chiffre" })
    .regex(/[^a-zA-Z0-9]/, { error: "Votre mot de passe doit contenir au moins un caractère spécial" }),
  role: z.enum(['ADMIN', 'MEMBER']).optional()
})

export const LoginSchema = z.object({
  email: z.string().email({ error: "Email invalide" }),
  password: z.string().min(1, { error: "Le mot de passe est requis" }),
})

export const UpdateProfileSchema = UserSchema.partial().extend({
  password: z.string().min(8, { error: "Le mot de passe doit contenir au moins 8 caractères" })
    .regex(/[A-Z]/, { error: "Votre mot de passe doit contenir au moins une majuscule" })
    .regex(/[0-9]/, { error: "Votre mot de passe doit contenir au moins un chiffre" })
    .regex(/[^a-zA-Z0-9]/, { error: "Votre mot de passe doit contenir au moins un caractère spécial" })
    .optional()
})

export type UserInput = z.infer<typeof UserSchema>