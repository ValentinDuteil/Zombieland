// Zod validation schema for a ticket

// server/src/schemas/ticket.schema.ts
import { z } from 'zod'

export const updateTicketSchema = z.object({
    price: z.coerce.number({ error: "Le prix doit être un nombre" }).positive({ error: "Le prix doit être positif" }),
    password: z.string().min(1, { error: "Le mot de passe est requis" })
})