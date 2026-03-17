// Express configuration : global middlewares, routes and error handling

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './routes/auth.routes.js'
import attractionRoutes from './routes/attraction.routes.js'

// import the reservations router
import reservationsRouter from './routes/reservations.routes.js'

const app = express()

// Middlewares
app.use(express.json())
app.use(cors())
app.use(helmet())

// Authtication
app.use('/api/auth', authRoutes)

app.use("/api/attractions", attractionRoutes)
// Plug the router on /api/reservations
app.use('/api/reservations', reservationsRouter)

// Test route
app.get('/', (req,res) => {
    res.json({ message: 'Zombieland API is running'})
})

export default app