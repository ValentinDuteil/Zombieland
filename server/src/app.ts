// Express configuration : global middlewares, routes and error handling

import express from 'express'
// Dependencies
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
// Errors
import { errorHandler } from './middlewares/errorHandler.js'
// Routes
import authRoutes from './routes/auth.routes.js'
import usersRoutes from './routes/users.routes.js'
import attractionRoutes from './routes/attraction.routes.js'
import reservationsRouter from './routes/reservations.routes.js'

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
app.use(helmet())
app.use(cookieParser())

// Authentication
app.use('/api/auth', authRoutes)
// Plug the router on api/attractions
app.use("/api/attractions", attractionRoutes)
// Plug the router on api/users
app.use('/api/users', usersRoutes)
// Plug the router on /api/reservations
app.use('/api/reservations', reservationsRouter)

// Test route
app.get('/', (req,res) => {
    res.json({ message: 'Zombieland API is running'})
})

//ErrorHandler
app.use(errorHandler)

export default app