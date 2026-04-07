export interface Member {
    id_USER: number,
    email: string,
    firstname: string,
    lastname: string,
    role: "MEMBER" | "ADMIN",
    created_at: string,
    deleted_at: string | null,
    _count: { reservations: number }
}