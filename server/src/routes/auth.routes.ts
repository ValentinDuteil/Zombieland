// Route definitions for authentification

import { Router } from "express";
import { register, login, me, logout } from "../controllers/auth.controller.js"
import { checkToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { UserSchema, LoginSchema } from "../schemas/auth.schema.js";

const router = Router()

router.get('/me', checkToken, me)
//Using validation to check the inputs and targeting the errors
router.post('/register', validate(UserSchema), register)
router.post('/login', validate(LoginSchema), login)
router.post('/logout', logout)

export default router
