import { z } from 'zod'


export const attractionSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  image: z.string().url("L'image doit être une URL valide").optional(),
  min_height: z.number().int().positive().optional(),
  duration: z.number().int().positive().optional(),
  capacity: z.number().int().positive().optional(),
  intensity: z.enum(['LOW','MEDIUM','HIGH']).optional(),
  password: z.string().min(1, "Le mot de passe est requis")
})