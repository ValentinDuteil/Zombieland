// CSRF protection middleware
// Verifies that the X-XSRF-TOKEN header matches the XSRF-TOKEN cookie
// This prevents Cross-Site Request Forgery attacks on state-changing routes

import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { ForbiddenError } from '../utils/AppError.js'

// Generates a random CSRF token and sets it in a readable cookie (not httpOnly)
// Called once when the app loads to give the client its CSRF token
export function setCsrfToken(req: Request, res: Response): void {
    const token = crypto.randomBytes(32).toString('hex')
    res.cookie('XSRF-TOKEN', token, {
        httpOnly: false, // ← must be readable by JS (Axios reads it)
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    })
    res.json({ csrfToken: token })
}

// Checks that the X-XSRF-TOKEN header sent by Axios matches the XSRF-TOKEN cookie
// Applied on all state-changing routes (POST, PATCH, DELETE, PUT)
export function checkCsrf(req: Request, res: Response, next: NextFunction): void {
    // Skip CSRF check for GET and OPTIONS requests
    const safeMethods = ['GET', 'HEAD', 'OPTIONS']
    if (safeMethods.includes(req.method)) {
        next()
        return
    }

    const cookieToken = req.cookies['XSRF-TOKEN']
    const headerToken = req.headers['x-xsrf-token']

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        next(new ForbiddenError('Token CSRF invalide'))
        return
    }

    next()
}