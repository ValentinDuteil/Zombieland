// Middleware for request body validation using Zod schemas

// Import Express types for request, response and next function
import { Request, Response, NextFunction } from "express"
// Import Zod types for schema validation
import { ZodType, ZodError, ZodIssue } from "zod"

// Factory function that creates a validation middleware from any Zod schema
// Usage: validate(RegisterSchema) returns a middleware that validates req.body
export function validate(schema: ZodType) {

  // Return the actual middleware function
  return (req: Request, res: Response, next: NextFunction): void => {

    // safeParse validates the data without throwing an error
    // Returns { success: true, data } or { success: false, error }
    const result = schema.safeParse(req.body)

    // If validation failed
    if (!result.success) {
      // Cast the error to ZodError to access its properties
      const zodError = result.error as ZodError

      // Return 400 Bad Request with formatted error details
      res.status(400).json({
        error: "Données invalides",
        // Map each validation issue to a clean format for the frontend
        details: zodError.issues.map((issue: ZodIssue) => ({
          // The field name that failed validation (e.g. "email", "password")
          champ: issue.path.join("."),
          // The error message defined in the Zod schema
          message: issue.message,
        })),
      })
      return
    }

    // Validation passed → replace req.body with the cleaned data
    // Zod strips any extra fields not defined in the schema (security)
    req.body = result.data

    // Pass to the next middleware or controller
    next()
  }
}