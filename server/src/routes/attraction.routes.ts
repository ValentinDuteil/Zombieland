// Route definitions for attractions 
import { Router } from "express";
import { getAttractions, getAttractionById } from "../controllers/attraction.controller.js"

const router = Router()

// Get all attractions
router.get('/', getAttractions)

// Get a single attraction by its id
router.get('/:id', getAttractionById)

export default router