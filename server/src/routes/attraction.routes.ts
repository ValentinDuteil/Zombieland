// Route definitions for attractions 
import { Router } from "express";
import { getAttraction, getFindAttraction } from "../controllers/attraction.controller.js"

const router = Router()

// Get all attractions
router.get('/', getAttraction)

// Get a single attraction by its id
router.get('/:id', getFindAttraction)

export default router