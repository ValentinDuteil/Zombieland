// Route definitions for authentification

import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller.js"
import { checkToken } from "../middlewares/auth.middleware.js";

const router = Router()

router.get('/me', checkToken, me)

router.post('/register', register)
router.post('/login', login)


export default router
