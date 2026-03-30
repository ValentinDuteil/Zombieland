import { z } from 'zod'


export const attractionSchema = z.object({
  name: z.string().min(1, {error: "Le nom est requis"}).max(100, {error: "Le nom ne peut pas dépasser 100 caractères"}),
  description: z.string().min(1, {error: "La description est requise"}).max(800, {error: "La description ne peut pas dépasser 800 caractères"}),
  min_height: z.number({error: "La hauteur minimale est requise"}).int().positive(),
  duration: z.number({error: "La durée est requise"}).int().positive(),
  capacity: z.number({error: "La capacité est requise"}).int().positive(),
  intensity: z.enum(['LOW', 'MEDIUM', 'HIGH'], {error: "Choisissez une intensité"}),
  //image is not required and managed by multer
});

export const PasswordAttractionSchema = attractionSchema.extend({
  password: z.string().min(1, { error: "Le mot de passe est requis" }),
});

export type AttractionInput = z.infer<typeof attractionSchema>
export type PasswordAttractionInput = z.infer<typeof PasswordAttractionSchema>
