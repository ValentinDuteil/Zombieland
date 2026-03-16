// Zod validation schema for user login

// Import Zod library for schema definition
import * as z from "zod";

// Define the shape and rules for login data
export const LoginSchema = z.object({
  // Must be a valid email format
  email: z.string().email("Email invalide"),
  // Must not be empty
  password: z.string().min(1, "Le mot de passe est requis"),
})

// Infer a TypeScript type from the schema
// Equivalent to: { email: string; password: string }
export type LoginInput = z.infer<typeof LoginSchema>