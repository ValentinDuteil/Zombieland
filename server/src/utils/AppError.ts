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

  //then, building the object "error" using the settings of the parents (message)
  //and adding the setting of a child (statusCode and isOperational)
  //AppError will always deal with specific errors we know, so "isOperztional" will always be true
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
  }
}

//Creating children classes for every cases

//BAD REQUEST, 400
export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400)
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

