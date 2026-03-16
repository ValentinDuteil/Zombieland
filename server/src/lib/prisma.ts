// création de cette config pour éviter de les utiliser dans chaque controller , permet d'essayer une connection entre prisma et prostgres
// dans chaque controlleur on mettra import { prisma } from '../lib/prisma'

import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
export const prisma = new PrismaClient({ adapter })