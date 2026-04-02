import { useEffect, useState } from "react"
import { Box, Heading, Input, Button, Text, Flex, Spinner } from "@chakra-ui/react"
import axios, { isAxiosError } from "axios"
import { API_URL } from "@/config/api"
import Header from "../../components/Header"
import bgImage from "../../assets/labodashboard.webp"
import bgBouton from "../../assets/bg-bouton.webp"
import Footer from "../../components/Footer"
import AdminMenu from "@/components/AdminNavlinkMenu"
import ConfirmModal from "@/components/ConfirmModal"

// fetch price 
const AdminTarifs = () => {
    const [action, setAction] = useState<"price" | "capacity" | null>(null)
    const [capacity, setCapacity] = useState<number>(0)
    const [price, setPrice] = useState<number>(0)
    const [loading, setLoading] = useState(true)    
    const [priceMessage, setPriceMessage] = useState("")
    const [capacityMessage, setCapacityMessage] = useState("")
    // Modals
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const fetchPrice = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/tickets`, { withCredentials: true })
            setPrice(res.data.price)
        } catch {
            setPriceMessage("Erreur lors du chargement du tarif")    
        }
    }
    //fetch update price
    const updatePrice = async (password: string) => {
        try {
            await axios.patch(`${API_URL}/api/tickets/price`, { price, password }, { withCredentials: true })
            setPriceMessage("Tarif mis à jour avec succès")
        } catch (err) {
            if (isAxiosError(err)) {
                setPriceMessage(err.response?.data.message || "Erreur lors de la mise à jour")
            }
        }
        setIsConfirmOpen(false)
    }
    //fetch capacity park
    const fetchCapacity = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/settings`, {
                withCredentials: true
            })

            setCapacity(parseInt(res.data.value))

        } catch {
            setCapacityMessage("Erreur lors du chargement de la capacité")
        }
    }
    //fetch update capacity park
    const updateCapacity = async (password: string) => {
        try {
            await axios.patch(
                `${API_URL}/api/settings`,
                { value: capacity, password },
                { withCredentials: true }
            )

            setCapacityMessage("Capacité mise à jour avec succès")
        } catch (err) {
            if (isAxiosError(err)) {
                setCapacityMessage(err.response?.data.message || "Erreur lors de la mise à jour")
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
                    pt="100px"
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
                        <Flex justify="center" mt={10}>
                            <Spinner color="zombieland.primary" size="xl" />
                        </Flex>
                    ) : (
                        <>
                            {/* SECTION : Prix du billet */}
                            <Box
                                bg="rgba(0,0,0,0.5)"
                                borderRadius="lg"
                                p={8}
                                mb={8}
                                border="1px solid rgba(255,255,255,0.1)"
                            >
                                <Heading
                                    fontWeight="bold"
                                    color="zombieland.white"
                                    fontFamily="body"
                                    fontSize="20px"
                                    mb={6}
                                    textAlign="center"
                                >
                                    Prix du billet
                                </Heading>

                                <Flex direction="column" align="center" gap={4}>
                                    <Input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        width="200px"
                                        color="zombieland.white"
                                        borderColor="zombieland.primary"
                                        bg="rgba(0,0,0,0.3)"
                                        _placeholder={{ color: "whiteAlpha.500" }}
                                    />
                                    <Button
                                        bgImage={`url(${bgBouton})`}
                                        bgSize="cover"
                                        bgPosition="center"
                                        color="zombieland.white"
                                        border="none"
                                        _hover={{ opacity: 0.85, boxShadow: "0 8px 16px rgba(0,0,0,0.6), 0 0 30px rgba(250, 130, 52, 0.3)" }}
                                        fontFamily="heading"
                                        fontSize="16px"
                                        py={5}
                                        px={8}
                                        borderRadius="md"
                                        fontWeight="bold"
                                        boxShadow="0 4px 15px rgba(250, 130, 52, 0.25)"
                                        transition="all 0.3s ease"
                                        onClick={() => { setAction("price"); setIsConfirmOpen(true) }}
                                    >
                                        Enregistrer
                                    </Button>
                                </Flex>
                                {priceMessage && (
                                    <Text mt={4} textAlign="center" color={priceMessage.includes("succès") ? "green.300" : "red.400"}>
                                        {priceMessage}
                                    </Text>
                                )}
                            </Box>

                            {/* SECTION : Capacité du parc */}
                            <Box
                                bg="rgba(0,0,0,0.5)"
                                borderRadius="lg"
                                p={8}
                                border="1px solid rgba(255,255,255,0.1)"
                            >
                                <Heading
                                    fontWeight="bold"
                                    color="zombieland.white"
                                    fontFamily="body"
                                    fontSize="20px"
                                    mb={6}
                                    textAlign="center"
                                >
                                    Capacité du parc (billets/jour)
                                </Heading>

                                <Flex direction="column" align="center" gap={4}>
                                    <Input
                                        type="number"
                                        width="200px"
                                        value={capacity}
                                        onChange={(e) => setCapacity(Number(e.target.value))}
                                        color="zombieland.white"
                                        borderColor="zombieland.primary"
                                        bg="rgba(0,0,0,0.3)"
                                        _placeholder={{ color: "whiteAlpha.500" }}
                                    />
                                    <Button
                                        bgImage={`url(${bgBouton})`}
                                        bgSize="cover"
                                        bgPosition="center"
                                        color="zombieland.white"
                                        border="none"
                                        _hover={{ opacity: 0.85, boxShadow: "0 8px 16px rgba(0,0,0,0.6), 0 0 30px rgba(250, 130, 52, 0.3)" }}
                                        fontFamily="heading"
                                        fontSize="16px"
                                        py={5}
                                        px={8}
                                        borderRadius="md"
                                        fontWeight="bold"
                                        boxShadow="0 4px 15px rgba(250, 130, 52, 0.25)"
                                        transition="all 0.3s ease"
                                        onClick={() => { setAction("capacity"); setIsConfirmOpen(true) }}
                                    >
                                        Enregistrer
                                    </Button>
                                </Flex>
                                {capacityMessage && (
                                    <Text mt={4} textAlign="center" color={capacityMessage.includes("succès") ? "green.300" : "red.400"}>
                                        {capacityMessage}
                                    </Text>
                                )}
                            </Box>
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