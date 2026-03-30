// Route definitions for attractions 
import { Router } from "express";
import { getAttractions, getAttractionById, createAttraction, deleteAttraction, updateAttraction, updateAttractionImage } from "../controllers/attraction.controller.js"
import { checkToken } from "../middlewares/auth.middleware.js"
import { checkRole } from "../middlewares/role.middleware.js"
import { upload } from "../middlewares/upload.middleware.js"
import { attractionSchema, PasswordAttractionSchema } from "../schemas/attraction.schema.js"
import { validate } from "../middlewares/validate.middleware.js";


const router = Router()

// Get all attractions
router.get('/', getAttractions)

// Get a single attraction by its id
router.get('/:id', getAttractionById)

// when someone calls post /api/attractions, execute createAttraction admin only
router.post('/', checkToken, checkRole("ADMIN"), validate(PasswordAttractionSchema),createAttraction)
// when someone calls delete /api/attractions/:id, execute deleteAttraction admin only
// → .pick() let us validate only the password field from the attractionWithPasswordSchema, 
// since that's the only field we need to check for authentication when deleting an attraction
router.delete('/:id', checkToken, checkRole("ADMIN"),validate(PasswordAttractionSchema.pick({ password: true })), deleteAttraction)
// when someone calls patch /api/attractions/:id, execute updateAttraction admin only
router.patch('/:id', checkToken, checkRole("ADMIN"), validate(PasswordAttractionSchema.partial()), updateAttraction)
// when someone calls patch /api/attractions/:id/image, execute updateAttractionImage admin only
router.patch('/:id/image', checkToken, checkRole("ADMIN"), upload.single('image'), updateAttractionImage)

export default router