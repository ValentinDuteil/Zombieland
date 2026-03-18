// Global Express error handling middleware
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  //log for debuging every controllers
  console.error(err)
  if (err instanceof AppError) {
    // error is anticipated → using the statusCode in AppError utils to identify it
    return res.status(err.statusCode).json({ message: err.message });
  } else {
    // bug isn't planned → returning a global 500
    return res.status(500).json({message: 'Erreur Serveur'});
  }
}

//Example of the flux 
// 1. In a controller we're writting "throw new ConflictError("Email already exists")"
// 2. Express catches it and sends it to errorHandler (thanks to "err") 
// 3. instanceof checks in AppError if it was anticipated or not 
// 4. true -> because ConflictError heritates from AppError 
// 5. err.statusCode -> 409 (because defined in ConflictError) 
// 6. err.message -> "Email already exists" is given to the constructor

//If it wasn't planned, instanceof -> false -> 500 with global message