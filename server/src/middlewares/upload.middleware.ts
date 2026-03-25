// Middleware for handling file uploads with multer
import multer from 'multer'
import path from 'path'

// Configure storage : destination and filename
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Save files in the uploads folder
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        // Name the file : attraction-{id}-{timestamp}.ext
        const ext = path.extname(file.originalname)
        cb(null, `attraction-${req.params.id}-${Date.now()}${ext}`)
    }
})

// Only allow image files
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('Fichier non autorisé'))
    }
}

export const upload = multer({ storage, fileFilter })