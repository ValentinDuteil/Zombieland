import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
// pour tester la connection entre prisma et postgresSql
// et lancer dans le terminal pnpm tsx test.ts

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  const users = await prisma.user.findMany()
  console.log('Connexion OK !')
  console.log('Users trouvés :', users)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())