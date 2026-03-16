// server/src/types/express.d.ts

// Ce sont les infos qu'on stocke dans le token JWT
// quand un user se connecte (login)
export interface JwtPayload {
  id_USER: number
  email: string
  role: string
}

// On étend le type Request d'Express pour ajouter .user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}