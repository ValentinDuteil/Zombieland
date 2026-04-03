// Express configuration : global middlewares, routes and error handling

import express from 'express'
// Dependencies
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import path from "path"
// Errors
import { errorHandler } from './middlewares/errorHandler.js'
// Routes
import authRoutes from './routes/auth.routes.js'
import usersRoutes from './routes/users.routes.js'
import attractionRoutes from './routes/attraction.routes.js'
import reservationsRouter from './routes/reservations.routes.js'
import ticketRoutes from './routes/ticket.routes.js'
import settingRoutes from './routes/setting.routes.js'
import { fileURLToPath } from 'url'
//CSRF
import { setCsrfToken, checkCsrf } from './middlewares/csrf.middleware.js'

const app = express()

// Middlewares
app.use(express.json())
app.use(cors({
    // URL from Vite (the only one authorized for now)
    // For prod : add "CLIENT_URL=https://ton-url" in .env
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    // allowing cookies
    credentials: true
}))
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}))
// helmet pour que les ressources peuvent être chargées depuis n'importe quelle origin (utile pour la modification et l'ajout d'une image d'une attraction)
app.use(cookieParser())

// Serve uploaded files statically
const __filename=fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// CSRF token route — called once on app load to give the client its token
app.get('/api/auth/csrf', setCsrfToken)
// Apply CSRF check on all routes below (POST, PATCH, DELETE)
// GET requests are automatically skipped inside checkCsrf
app.use(checkCsrf)

// Authentication
app.use('/api/auth', authRoutes)
// Plug the router on api/attractions
app.use("/api/attractions", attractionRoutes)
// Plug the router on api/users
app.use('/api/users', usersRoutes)
// Plug the router on /api/reservations
app.use('/api/reservations', reservationsRouter)
// Plug the router on /api/tickets
app.use('/api/tickets', ticketRoutes)
// Plug the router on /api/settings
app.use('/api/settings', settingRoutes)
// Test route
app.get('/', (req,res) => {
    res.json({ message: 'Zombieland API is running'})
})

//ErrorHandler
app.use(errorHandler)

export default app