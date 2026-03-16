// Express configuration : global middlewares, routes and error handling

// Express configuration : global middlewares, routes and error handling

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import activitiesRoutes from './routes/activities.js'

const app = express()

// Middlewares
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use("/activities", activitiesRoutes)

// Test route
app.get('/', (req,res) => {
    res.json({ message: 'Zombieland API is running'})
})

export default app