//Error already exists as a Class in JS
//It countains : 
// "message": the text 
// "stack": the trace (which files, which folder) 
// and "name": "Error" by default
//no HTTP or distinction between what was anticipated or not

//So, we have to extend the Class to add the "statusCode" 
// and a specific "message"
//using class "AppError extends Error {...}" (here are the specific cases)

//Then, errorHadnler just identify if it's an anticipated one (409/404...etc) 
//if yes, we're using the statusCode, 
//if not, it returns a global 500

//To recognize it, we're using "instanceof" 
//to check if the error was planned in AppError

//Creating an extention of the class to identify specific errors
export class AppError extends Error {
  //here are the elements to identify the error
  statusCode: number
  isOperational: boolean
  details?: { champ: string; message: string }[]

  //then, building the object "error" using the settings of the parents (message)
  //and adding the setting of a child (statusCode and isOperational)
  //AppError will always deal with specific errors we know, so "isOperztional" will always be true
  constructor(message: string, statusCode: number, details?: { champ: string; message: string }[] ) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    this.details = details
  }
}

//==================================================================================
//ABOUT "DETAILS" AND ZOD ERRORS (that you can find in "validate.middleware.ts")
//==================================================================================
//
//When Zod try to validate a form but fails, it generates errors like this :
//  [
//    { "champ": "email", "message": "Invalid email" },
//    { "champ": "password", "message": "doit contenir au moins une majuscule" }
//  ]
//
//That means that in front we have the message we need under the input that failed
//but "BadRequestError" for instance only cares a string "Données Invalide"
//so we need to have the entire error to know which input failed
//
//To solve the issue we can add "Details" as OPTIONAL SETTING (with the "?"
//in AppError to care the informations we need
//
//Then in "validate.middleware.ts" we can use :
//  throw new BadRequestError("Données invalides", details)
// where details = [{ champ: "email", message: "Invalid email" }, ...]
//
//FLUX
//
//If the result of this line in validate.middleware.ts "const result = schema.safeParse(req.body)"
//send { success: false, error }, it might looks like an object like this
//
//  {
//    "path": ["email"],
//    "message": "Invalid email",
//    "code": "invalid_string"
//  }
//So, thanks to the ".map()" we change the issue as "{ champ, message }"
//to have a tablke like this "details = [{ champ, message }, ...]"
//
//Zod datects 2 errors 
//    ↓
//validate.ts transformes the issues Zod in "[{ champ, message }, { champ, message }]"
//    ↓
//throw new BadRequestError("Données invalides", details)
//    ↓
//errorHandler receives the error with "err.details"
//    ↓
//res.json({ message: "Données invalides", details: [...] })
//    ↓
//The Front can display on screen the right message under the input that failed
//===================================================================================

//Creating children classes for every cases

//BAD REQUEST, 400
export class BadRequestError extends AppError {
  constructor(message = 'Bad request', details?: { champ: string; message: string }[]) {
    super(message, 400, details)
  }
}

//UNAUTHORIZED, 401
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
  }
}

//FORBIDDEN, 403
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403)
  }
}

//NOT FOUND, 404
export class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(message, 404)
  }
}

//CONFLICT, 409
export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409)
  }
}

//TEA POT, 418
export class TeaPotError extends AppError {
  constructor(message = 'Don\'t ask me making coffee, I\'m a teapot !') {
    super(message, 418)
  }
}

