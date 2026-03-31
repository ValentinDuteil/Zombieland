import { useEffect, useState } from "react"
import { Box, Heading, Input, Button, Text, Flex } from "@chakra-ui/react"
import axios, { isAxiosError } from "axios"
import { API_URL } from "@/config/api"
import Header from "../../components/Header"
import bgImage from "../../assets/bg-image.webp"
import Footer from "../../components/Footer"
import AdminMenu from "@/components/AdminNavlinkMenu"
import ConfirmModal from "@/components/ConfirmModal"

// fetch price 
const AdminTarifs = () => {
    const [action, setAction] = useState<"price" | "capacity" | null>(null)
    const [capacity, setCapacity] = useState<number>(0)
    const [price, setPrice] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    // Modals
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const fetchPrice = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/tickets`, { withCredentials: true })
            setPrice(res.data.price)
        } catch {
            setMessage("Erreur lors du chargement du tarif")
        } finally {
            setLoading(false)
        }
    }
    //fetch update price
    const updatePrice = async (password: string) => {
        try {
            await axios.patch(`${API_URL}/api/tickets/price`, { price, password }, { withCredentials: true })
            setMessage("Tarif mis à jour avec succès")
        } catch (err) {
            if (isAxiosError(err)) {
                setMessage(err.response?.data.message || "Erreur lors de la mise à jour")
            }
        }
        setIsConfirmOpen(false)
    }
    //fetch capacity park
    const fetchCapacity = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/settings/capacity`, {
                withCredentials: true
            })

            setCapacity(res.data.capacity)
        } catch {
            setMessage("Erreur lors du chargement de la capacité")
        } finally {

        }
    }
    //fetch update capacity park
    const updateCapacity = async (password: string) => {
        try {
            await axios.patch(
                `${API_URL}/api/settings/capacity`,
                { capacity, password },
                { withCredentials: true }
            )

            setMessage("Capacité mise à jour avec succès")
        } catch (err) {
            if (isAxiosError(err)) {
                setMessage(err.response?.data.message || "Erreur lors de la mise à jour")
            }
        }

        setIsConfirmOpen(false)
    }

    useEffect(() => {
        const load = async () => {
            await fetchPrice()
            await fetchCapacity()
            setLoading(false)
        }

        load()
    }, [])


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

            {/* MAIN LAYOUT */}
            <Flex flex="1">
                {/* LEFT SIDEBAR */}
                <Box
                    display={{ base: "none", lg: "block" }}
                    minWidth="240px"
                    maxWidth="240px"
                    borderRight="1px solid rgba(255,255,255,0.1)"
                >
                    <AdminMenu />
                </Box>

                {/* RIGHT CONTENT */}
                <Box
                    flex="1"
                    p={3}
                    pt="70px"
                    pb="100px"
                    maxW="1000px"
                    mx="auto"
                    w="100%"
                >
                    <Text
                        fontWeight="bold"
                        color="zombieland.white"
                        mb={6}
                        textAlign="center"
                        fontFamily="heading"
                        fontSize="54px"
                    >
                        Gestion des tarifs
                    </Text>

                    {/* SECTION : Prix du billet */}
                    <Heading
                        fontWeight="bold"
                        color="zombieland.white"
                        textAlign="left"
                        fontFamily="body"
                        fontSize="24px"
                        mb={8}
                    >
                        Admin / Tarifs
                    </Heading>

                    {loading ? (
                        <Text>Chargement...</Text>
                    ) : (
                        <>
                            <Text mb={2}>Prix du billet (€)</Text>

                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                width="200px"
                                mb={4}
                                mr={4}
                            />

                            <Button
                                colorScheme="blue"
                                onClick={() => {
                                    setAction("price")
                                    setIsConfirmOpen(true)
                                }}
                            >
                                Enregistrer
                            </Button>

                            {message && <Text mt={4}>{message}</Text>}
                        </>
                    )}

                    {/* SECTION : Capacité du parc */}
                    <Heading
                        fontWeight="bold"
                        color="zombieland.white"
                        textAlign="left"
                        fontFamily="body"
                        fontSize="24px"
                        mt={12}
                        mb={8}
                    >
                        Admin / Capacité
                    </Heading>

                    {loading ? (
                        <Text>Chargement...</Text>
                    ) : (
                        <>
                            <Text mb={2}>Capacité du parc</Text>

                            <Input
                                type="number"
                                width="200px"
                                mb={4}
                                mr={4}
                                value={capacity}
                                onChange={(e) => setCapacity(Number(e.target.value))}

                            />
                            <Button
                                colorScheme="blue"
                                onClick={() => {
                                    setAction("capacity")
                                    setIsConfirmOpen(true)
                                }}
                            >
                                Enregistrer
                            </Button>



                            {message && <Text mt={4}>{message}</Text>}
                        </>
                    )}
                </Box>
            </Flex>

            <Footer />
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title={action === "price" ? "Confirmer la mise à jour du tarif" : "Confirmer la mise à jour de la capacité"}
                message={action === "price" ? "Voulez-vous vraiment modifier le prix du billet ?" : "Voulez-vous vraiment modifier la capacité du parc ?"}
                onConfirm={(password) => {
                    if (action === "price") updatePrice(password)
                    if (action === "capacity") updateCapacity(password)
                }}
            />
        </Box>
    )
}

export default AdminTarifs