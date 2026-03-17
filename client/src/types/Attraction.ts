// Global type definitions for Attraction in the Zombieland project

// Prisma-like Attraction type (without relations)

export interface Attraction {
    id_ATTRACTION: number
    name: string
    description?: string
    image?: string
    min_height?: number
    duration?: number
    capacity?: number
    intensity: "LOW" | "MEDIUM" | "HIGH"
    created_at: string | Date
    updated_at: string | Date
}

// Attraction with its categories (N-N relation)

export interface AttractionWithCategories extends Attraction {
    categories: {
        category: {
            id_CATEGORY: number
            name: string
        }
    }[]
}
