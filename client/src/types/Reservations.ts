export interface Reservation {
    id_RESERVATION: number
    nb_tickets: number
    date: string
    total_amount: string
    status: string
    user: { email: string; firstname: string; lastname: string; deleted_at: string | null }
    id_USER: number
    id_TICKET: number

}