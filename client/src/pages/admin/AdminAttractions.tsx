// Admin page to manage attractions : list, filter, edit and delete
import { useEffect, useState } from "react"
import { Box, Text, Button, Flex, Menu, MenuButton, MenuList, MenuItem, Spinner } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import bgImage from '../../assets/bgadminpage.png'
import bgBouton from '../../assets/bg-bouton.png'
import type { Attraction } from "@types"
import AdminTable from "../../components/AdminTable"
import AdminMenu from "../../components/AdminNavlinkMenu"
import { FaTrash } from 'react-icons/fa'
import ConfirmModal from "../../components/ConfirmModal"


const categoryToEnum: Record<string, string> = {
    "Peur Acceptable": "LOW",
    "Peur Survivable": "MEDIUM",
    "Peur Mortelle": "HIGH",
}

const AdminAttractions = () => {
    const [attractions, setAttractions] = useState<Attraction[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const [attractionToDelete, setAttractionToDelete] = useState<number | null>(null)

    const fetchAttractions = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/attractions`)
        if (!res.ok) {
            setError("Erreur lors de la récupération des attractions")
            setLoading(false)
            return
        }
        const data: Attraction[] = await res.json()
        setAttractions(data)
        setLoading(false)
    }
    useEffect(() => {
        fetchAttractions()
    }, [])


    const handleDelete = async (id: number, password: string) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/attractions/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            // Send password in the body for verification
            body: JSON.stringify({ password })
        })
        if (!res.ok) {
            setError("Erreur lors de la suppression de l'attraction")
            return
        }
        fetchAttractions()
    }

    // Filter attractions by category
    const filteredAttractions = selectedCategory
        ? attractions.filter(a => a.intensity === categoryToEnum[selectedCategory])
        : attractions

    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            bgAttachment="fixed"
            bgImage={`url(${bgImage})`}
            bgSize="cover"
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

                    {/* Create new attraction button */}
                    <Flex justifyContent="center" mt={8} mb={6}>
                        <Button
                            bgImage={`url(${bgBouton})`}
                            bgSize="cover"
                            bgPosition="center"
                            color="zombieland.white"
                            border="none"
                            _hover={{ 
                                opacity: 0.85,
                                boxShadow: "0 8px 16px rgba(0,0,0,0.6), 0 0 30px rgba(250, 130, 52, 0.3)"
                            }}
                            fontFamily="heading"
                            fontSize="18px"
                            py={6}
                            px={12}
                            borderRadius="md"
                            letterSpacing="1px"
                            fontWeight="bold"
                            boxShadow="0 4px 15px rgba(250, 130, 52, 0.25)"
                            transition="all 0.3s ease"
                            onClick={() => navigate('/admin/attractions/create')}
                        >
                            Créer une attraction
                        </Button>
                    </Flex>

                    {/* Filter button */}
                    <Flex justifyContent={{ base: "center", lg: "flex-end" }} mt={8} mb={6}>
                        <Menu>
                            <MenuButton
                                color="zombieland.white"
                                px={4}
                                py={2}
                                border="2px solid"
                                borderColor="zombieland.primary"
                                borderRadius="md"
                                transition="all 0.3s ease"
                                _hover={{
                                    borderColor: "zombieland.cta1orange",
                                    color: "zombieland.cta1orange"
                                }}
                            >
                                Filtrer par catégorie
                            </MenuButton>
                            <MenuList bg="#1a1a1a" border="1px solid #333">
                                <MenuItem bg="#1a1a1a" color="white" _hover={{ bg: "#333" }} onClick={() => setSelectedCategory(null)}>Toutes</MenuItem>
                                <MenuItem bg="#1a1a1a" color="white" _hover={{ bg: "#333" }} onClick={() => setSelectedCategory("Peur Acceptable")}>Peur Acceptable</MenuItem>
                                <MenuItem bg="#1a1a1a" color="white" _hover={{ bg: "#333" }} onClick={() => setSelectedCategory("Peur Survivable")}>Peur Survivable</MenuItem>
                                <MenuItem bg="#1a1a1a" color="white" _hover={{ bg: "#333" }} onClick={() => setSelectedCategory("Peur Mortelle")}>Peur Mortelle</MenuItem>
                            </MenuList>
                        </Menu>
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
                                    render: (a) => a.intensity
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