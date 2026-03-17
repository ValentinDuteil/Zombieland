// Route definitions for attractions 
import { Router } from "express";
<<<<<<< HEAD:server/src/routes/attraction.ts
import { getAttraction, getFindAttraction } from "../controllers/attraction.js"
=======
import { getAttraction } from "../controllers/attraction.controller.js"
>>>>>>> b8e88ee (chore: rename controllers and routes files with proper suffixes):server/src/routes/attraction.routes.ts

const router = Router()

// Get all attractions
router.get('/', getAttraction)
// Get a single attraction by its id
router.get('/:id', getFindAttraction)

export default router
