import { z } from 'zod'


export const attractionSchema = z.object({
  name: z.string().min(1, {error: "Le nom est requis"}).max(100, {error: "Le nom ne peut pas dépasser 100 caractères"}),
  description: z.string().optional(),
  image: z.string().optional(),
  min_height: z.number().int().positive().optional(),
  duration: z.number().int().positive().optional(),
  capacity: z.number().int().positive().optional(),
  intensity: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});

export const PasswordAttractionSchema = attractionSchema.extend({
  password: z.string().min(1, { error: "Le mot de passe est requis" }),
});

export type AttractionInput = z.infer<typeof attractionSchema>
export type PasswordAttractionInput = z.infer<typeof PasswordAttractionSchema>
