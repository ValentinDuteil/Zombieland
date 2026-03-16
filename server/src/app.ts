// Express configuration : global middlewares, routes and error handling

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import activitiesRoutes from './routes/activities.js'

// import the reservations router
import reservationsRouter from './routes/reservations.js'

const app = express()

// Middlewares
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use("/activities", activitiesRoutes)

// Plug the router on /api/reservations
app.use('/api/reservations', reservationsRouter)

// Test route
app.get('/', (req,res) => {
    res.json({ message: 'Zombieland API is running'})
})

export default app