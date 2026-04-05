import { z } from 'zod'

export const updateSettingSchema = z.object({
    value: z.coerce.number({ error: "La valeur doit être un nombre" }).int().positive({ error: "La valeur doit être positive" }),
    password: z.string().min(1, { error: "Le mot de passe est requis" })
})