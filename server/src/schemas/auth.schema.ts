// Zod validation schema for user registration

// Import Zod library for schema definition
import * as z from "zod";

// Define the shape and rules for registration data
// Each field has validation rules and custom error messages
export const RegisterSchema = z.object({
  // Must be a valid email format
  email: z.string().email("Email invalide"),
  // Must be at least 8 characters long
  password: z.string().min(8, "Le mot de passe doit faire minimum 8 caractères"),
  // Must be at least 2 characters long
  firstname: z.string().min(2, "Le prénom doit faire minimum 2 caractères"),
  // Must be at least 2 characters long
  lastname: z.string().min(2, "Le nom doit faire minimum 2 caractères"),
})

// Infer a TypeScript type from the schema
// Equivalent to: { email: string; password: string; firstname: string; lastname: string }
export type RegisterInput = z.infer<typeof RegisterSchema>