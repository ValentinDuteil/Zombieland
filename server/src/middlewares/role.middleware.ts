// Middleware for role-based access control

// Import Express types for request, response and next function
import { Request, Response, NextFunction } from "express"

// Factory function that creates a middleware to check the user's role
// Usage: checkRole("ADMIN") returns a middleware that only allows admins
export function checkRole(requiredRole: string) {

  // Return the actual middleware function
  return (req: Request, res: Response, next: NextFunction): void => {

    // Get the user info attached by the checkToken middleware
    const user = req.user

    // If no user info → the request didn't pass through checkToken first
    if (!user) {
      // 401 = not authenticated
      res.status(401).json({ error: "Non authentifié" })
      return
    }

    // Check if the user's role matches the required role
    if (user.role !== requiredRole) {
      // 403 = authenticated but not authorized (wrong role)
      res.status(403).json({ error: "Accès interdit : rôle non autorisé" })
      return
    }

    // Role matches → pass to the next middleware or controller
    next()
  }
}