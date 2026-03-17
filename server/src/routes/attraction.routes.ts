// Route definitions for attractions 
import { Router } from "express";
import { getAttraction } from "../controllers/attraction.js"

const router = Router()

// Get all attractions
router.get('/', getAttraction)

export default router
