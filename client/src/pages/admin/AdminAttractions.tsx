// Admin page to manage attractions : list, filter, edit and delete
import { useEffect, useState } from "react"
import { Box, Text, Button, Flex, Input, Spinner, Heading } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import bgImage from '../../assets/bg-bouton.webp'
import type { Attraction } from "@types"
import AdminTable from "../../components/AdminTable"
import AdminMenu from "../../components/AdminNavlinkMenu"
import { FaTrash } from 'react-icons/fa'
import ConfirmModal from "../../components/ConfirmModal"
import { API_URL } from "@/config/api"
import axiosInstance from "@/lib/axiosInstance"


const intensityToLabel: Record<string, string> = {
    "LOW": "Acceptable",
    "MEDIUM": "Survivable",
    "HIGH": "Mortelle"
}

const AdminAttractions = () => {
    const [attractions, setAttractions] = useState<Attraction[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const [attractionToDelete, setAttractionToDelete] = useState<number | null>(null)

    const [search, setSearch] = useState("")
    const [sort, setSort] = useState({ by: "name", direction: "asc" })

    const fetchAttractions = async () => {
        setLoading(true)
        try {
            const res = await axiosInstance.get<Attraction[]>(`${API_URL}/api/attractions`)
            setAttractions(res.data)

        } catch (error) {

            setError("Erreur lors de la récupération des attractions")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAttractions()
    }, [])

    const handleDelete = async (id: number, password: string) => {
        try {
            await axiosInstance.delete(`${API_URL}/api/attractions/${id}`, {
                data: { password },

                withCredentials: true,
            })
            fetchAttractions()

        } catch (error) {
            setError("Erreur lors de la suppression de l'attraction")
        }
    }

    // Filter attractions by category
    const filterTool = search.trim().toLowerCase()
    const filteredAttractions = attractions
        .filter(a =>
            a.name.toLowerCase().includes(filterTool) ||
            a.intensity.toLowerCase().includes(filterTool)
        )
        .sort((a, b) => {
            if (sort.by === "name") return a.name.localeCompare(b.name) * (sort.direction === "asc" ? 1 : -1)
            if (sort.by === "intensity") return a.intensity.localeCompare(b.intensity) * (sort.direction === "asc" ? 1 : -1)
            if (sort.by === "duration") return ((a.duration ?? 0) - (b.duration ?? 0)) * (sort.direction === "asc" ? 1 : -1)
            if (sort.by === "capacity") return ((a.capacity ?? 0) - (b.capacity ?? 0)) * (sort.direction === "asc" ? 1 : -1)
            if (sort.by === "min_height") return ((a.min_height ?? 0) - (b.min_height ?? 0)) * (sort.direction === "asc" ? 1 : -1)
            return 0
        })

    const handleSortChange = (by: "name" | "intensity" | "duration" | "capacity" | "min_height") => {
        if (sort.by === by) {
            setSort({ by, direction: sort.direction === "asc" ? "desc" : "asc" })
        }
        else {
            setSort({ by, direction: "asc" })
        }
    }

    const headerToField = {
        "Nom": "name",
        "Intensité": "intensity",
        "Durée": "duration",
        "Capacité": "capacity",
        "Taille min.": "min_height"
    } as const

    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            bgAttachment="fixed"
            bgImage={`url(${bgImage})`}
            bgSize="cover"
            bgRepeat="no-repeat"
            bgPosition="center top"
            w="100%"
            overflow="hidden"
        >
            <Header />

            {/* MAIN LAYOUT : sidebar + content */}
            <Flex flex="1">

                {/* LEFT SIDEBAR */}

                <Box
                    display={{ base: 'none', lg: 'block' }}
                    minWidth="240px"
                    maxWidth="240px"
                    borderRight="1px solid rgba(255,255,255,0.1)"
                >
                    <AdminMenu />
                </Box>

                {/* RIGHT CONTENT */}
                <Box flex="1" p={3} pt="100px" pb="100px" maxW="1000px" mx="auto" w="100%">

                    <Text fontWeight="bold" color="zombieland.white" mb={6} textAlign="center" fontFamily="heading" fontSize="54px">
                        Gestion des attractions
                    </Text>
                    <Heading
                                            fontWeight="bold"
                                            color="zombieland.white"
                                            textAlign="left"
                                            fontFamily="body"
                                            fontSize="24px"
                                            mb={8}
                                        >
                                            Admin / Attractions
                                        </Heading>

                    {/* Create new attraction button */}
                    <Flex justifyContent="center" mt={8} mb={6}>
                        <Button
                            bg="zombieland.cta1orange"
                            color="zombieland.white"
                            _hover={{ opacity: 0.85, boxShadow: "0 8px 16px rgba(0,0,0,0.6)" }}
                            fontSize="18px"
                            py={6}
                            px={12}
                            borderRadius="md"
                            fontWeight="bold"
                            fontFamily="heading"
                            boxShadow="0 4px 15px rgba(0,0,0,0.4)"
                            onClick={() => navigate('/admin/attractions/create')}
                        >
                            Créer une attraction
                        </Button>
                    </Flex>

                    {/* Searchbar */}
                    <Flex justifyContent={{ base: "center", lg: "flex-end" }} mt={8} mb={6}>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher une attraction..."
                            color="zombieland.white"
                            borderColor="zombieland.white"
                            bg="rgba(0,0,0,0.3)"
                            _placeholder={{ color: "zombieland.white" }}
                            mb={6}
                        />
                    </Flex>

                    {/* Loading spinner */}
                    {loading && (
                        <Flex justify="center" mt={10}>
                            <Spinner color="zombieland.primary" size="xl" />
                        </Flex>
                    )}

                    {error && <Text color="red.400">{error}</Text>}

                    {/* Attractions table */}
                    {!loading && (
                        <AdminTable
                            data={filteredAttractions}
                            onHeaderClick={(header) => {
                                const field = headerToField[header as keyof typeof headerToField]
                                if (field) handleSortChange(field)
                            }}
                            columns={[
                                {
                                    header: "Nom",
                                    render: (a) => (
                                        <Text
                                            fontWeight="bold"
                                            cursor="pointer"
                                            _hover={{ color: "zombieland.cta1orange", textDecoration: "underline" }}
                                            onClick={() => navigate(`/attractions/${a.id_ATTRACTION}`)}
                                        >
                                            {a.name}
                                        </Text>
                                    )
                                },
                                {
                                    header: "Intensité",
                                    render: (a) => intensityToLabel[a.intensity] ?? a.intensity
                                },
                                {
                                    header: "Durée",
                                    render: (a) => a.duration ?? "—"
                                },
                                {
                                    header: "Capacité",
                                    render: (a) => a.capacity ?? "—"
                                },
                                {
                                    header: "Taille min.",
                                    render: (a) => a.min_height ? `${a.min_height} cm` : "—"
                                },
                                {
                                    header: "Actions",
                                    render: (a) => (
                                        <Flex gap={3}>
                                            <Button
                                                size="sm"
                                                bg="#3E4D28"
                                                color="white"
                                                _hover={{ opacity: 0.8 }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    navigate(`/admin/attractions/${a.id_ATTRACTION}/edit`)
                                                }}
                                            >
                                                Modifier
                                            </Button>
                                            <Button
                                                size="sm"
                                                bg="#8C6E21"
                                                color="white"
                                                _hover={{ bg: "#6e5519" }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setAttractionToDelete(a.id_ATTRACTION)
                                                }}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </Flex>
                                    )
                                }
                            ]}
                        />
                    )}

                </Box>
            </Flex>

            {/* Confirmation modal before deletion */}
            <ConfirmModal
                isOpen={attractionToDelete !== null}
                onClose={() => setAttractionToDelete(null)}
                title="Supprimer l'attraction"
                message="Voulez-vous vraiment supprimer cette attraction ? Cette action est irréversible."
                onConfirm={(password) => {
                    if (attractionToDelete) handleDelete(attractionToDelete, password)
                    setAttractionToDelete(null)
                }}
            />

            <Footer />
        </Box>
    )
}

export default AdminAttractions