// Middleware for JWT token verification

// Import Express types for request, response and next function
import { Request, Response, NextFunction } from "express"
// Import jsonwebtoken library to verify JWT tokens
import jwt from "jsonwebtoken"
// Import our custom JwtPayload type that defines the shape of the decoded token
import { JwtPayload } from "../types/express.js"

// Middleware that checks if the user has a valid JWT token
export function checkToken(req: Request, res: Response, next: NextFunction): void {

  // Get the Authorization header from the request
  const authorization = req.headers.authorization

  // Check if the header exists and starts with "Bearer "
  if (!authorization || !authorization.startsWith("Bearer ")) {
    // No token provided → 401 Unauthorized
    res.status(401).json({ error: "Token manquant" })
    return
  }

  // Extract the token by removing the "Bearer " prefix
  const token = authorization.split(" ")[1]

  try {
    // Verify and decode the token using the secret key from .env
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload

    // Attach the decoded user info to the request object
    req.user = decoded

    // Token is valid → pass to the next middleware or controller
    next()

  } catch (error) {
    // Token is invalid or expired → 401 Unauthorized
    res.status(401).json({ error: "Token invalide ou expiré" })
    return
  }
}