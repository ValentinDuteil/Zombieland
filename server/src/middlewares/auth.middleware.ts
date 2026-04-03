// Middleware for JWT token verification

// Import Express types for request, response and next function
import { Request, Response, NextFunction } from "express"
// Import jsonwebtoken library to verify JWT tokens
import jwt from "jsonwebtoken"
// Import our custom JwtPayload type that defines the shape of the decoded token
import { JwtPayload } from "../types/express.js"
// Import de la gestion des erreurs
import { UnauthorizedError } from "../utils/AppError.js"
// Import Prisma client to access the database
import { prisma } from "../lib/prisma.js"

// Middleware that checks if the user has a valid JWT token
export async function checkToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  
  
  // Get the Token from the cookie created in auth.controller (register ou login)
  const token = req.cookies.token
  
  // Check if the token exists
  if (!token) {
    // Token is invalid or expired → 401 Unauthorized
    next(new UnauthorizedError("Token manquant"))
    return
  }
  
  try {
    // Verify and decode the token using the secret key from .env
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload
    
    const user = await prisma.user.findUnique({ where: { id_USER: decoded.id } })
if (user?.deleted_at) {
    next(new UnauthorizedError("Compte supprimé"))
    return
}
    
    // Attach the decoded user info to the request object
    req.user = decoded

    // Token is valid → pass to the next middleware or controller
    next()

  } catch (error) {
    // Token is invalid or expired → 401 Unauthorized
    next(new UnauthorizedError("Token invalide ou expiré"))
    return
  }
}