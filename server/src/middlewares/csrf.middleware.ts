// CSRF protection middleware
// Verifies that the X-XSRF-TOKEN header matches the token generated on app load
// This prevents Cross-Site Request Forgery attacks on state-changing routes

import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { ForbiddenError } from '../utils/AppError.js'

// In-memory store of valid CSRF tokens
// Token is generated once per app load and stored here for verification
const validTokens = new Set<string>()

// Generates a random CSRF token and returns it as JSON
// The client stores it in memory (not in a cookie) via setCsrfTokenMemory()
// This approach works in cross-origin (production) unlike cookie-based CSRF
export function setCsrfToken(req: Request, res: Response): void {
    const token = crypto.randomBytes(32).toString('hex')
    validTokens.add(token)
    res.json({ csrfToken: token })
}

// Checks that the X-XSRF-TOKEN header matches a known valid token
// Applied on all state-changing routes (POST, PATCH, DELETE, PUT)
export function checkCsrf(req: Request, res: Response, next: NextFunction): void {
    // Skip CSRF check for safe methods
    const safeMethods = ['GET', 'HEAD', 'OPTIONS']
    if (safeMethods.includes(req.method)) {
        next()
        return
    }

    const headerToken = req.headers['x-xsrf-token'] as string

    if (!headerToken || !validTokens.has(headerToken)) {
        next(new ForbiddenError('Token CSRF invalide'))
        return
    }

    next()
}