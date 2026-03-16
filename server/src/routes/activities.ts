// Route definitions for attractions 
import { Router } from "express";
import { getActivities } from "../controllers/activities.js"

const router = Router()

// Get all attractions
router.get('/', getActivities)

export default router
