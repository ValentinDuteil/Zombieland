import { useEffect, useState } from "react"
import { Box, Heading, Input, Text, Flex, Spinner } from "@chakra-ui/react"
import axiosInstance from "@/lib/axiosInstance"
import { isAxiosError } from "axios"
import { API_URL } from "@/config/api"
import Header from "../../components/Header"
import barbed from '../../assets/barbed-bg.webp'
import Footer from "../../components/Footer"
import { ZButton } from "../../components/Buttons"
import AdminMenu from "@/components/AdminNavlinkMenu"
import ConfirmModal from "@/components/ConfirmModal"

// fetch price.
const AdminTarifs = () => {
    const [action, setAction] = useState<"price" | "capacity" | null>(null)
    const [capacity, setCapacity] = useState<string>("")
    const [price, setPrice] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const [priceMessage, setPriceMessage] = useState("")
    const [capacityMessage, setCapacityMessage] = useState("")
    const [confirmError, setConfirmError] = useState('')
    // Modals
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const fetchPrice = async () => {
        try {
            const res = await axiosInstance.get(`${API_URL}/api/tickets`, { withCredentials: true })
            setPrice(String(res.data.price))
        } catch {
            setPriceMessage("Erreur lors du chargement du tarif")
        }
    }
    //fetch update price
    const updatePrice = async (password: string) => {
        try {
            await axiosInstance.patch(`${API_URL}/api/tickets/price`, { price, password }, { withCredentials: true })
            setPriceMessage("Tarif mis à jour avec succès")
        } catch (err) {
            if (isAxiosError(err)) {
                setConfirmError(err.response?.data.message || "Erreur lors de la mise à jour")
            }
            return
        }
        setIsConfirmOpen(false)
        setConfirmError('')
        setPriceMessage("Tarif mis à jour avec succès")
    }
    //fetch capacity park
    const fetchCapacity = async () => {
        try {
            const res = await axiosInstance.get(`${API_URL}/api/settings`, {
                withCredentials: true
            })

            setCapacity(String(res.data.value))

        } catch {
            setCapacityMessage("Erreur lors du chargement de la capacité")
        }
    }
    //fetch update capacity park
    const updateCapacity = async (password: string) => {
        try {
            await axiosInstance.patch(
                `${API_URL}/api/settings`,
                { value: capacity, password },
                { withCredentials: true }
            )

            setCapacityMessage("Capacité mise à jour avec succès")
        } catch (err) {
            if (isAxiosError(err)) {
                setConfirmError(err.response?.data.message || "Erreur lors de la mise à jour")
            }
            return
        }
        setIsConfirmOpen(false)
        setConfirmError('')
        setCapacityMessage("Capacité mise à jour avec succès")
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
            bgImage={`url(${barbed})`}
            bgSize="cover"
            bgPosition="center"
            bgRepeat="no-repeat"
            bgAttachment="fixed"
            w="100%"
            overflow="hidden"
        >
            <Header />

            {/* MAIN LAYOUT */}
            <Flex flex="1">
                {/* LEFT SIDEBAR */}
                <Box
                    width={{ base: "0px", lg: "250px" }}
                    minWidth={{ base: "0px", lg: "250px" }}
                    overflow="hidden"
                    transition="width 0.3s ease, min-width 0.3s ease"
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
                    minWidth="0"
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
                                        onChange={(e) => {
                                            setPrice(e.target.value);
                                            if (priceMessage) setPriceMessage(""), setCapacityMessage("");
                                        }}
                                        width="200px"
                                        color="zombieland.white"
                                        borderColor="zombieland.primary"
                                        bg="rgba(0,0,0,0.3)"
                                        _placeholder={{ color: "whiteAlpha.500" }}
                                    />
                                    <ZButton
                                        onClick={() => { setAction("price"); setIsConfirmOpen(true) }}
                                    >
                                        Enregistrer
                                    </ZButton>
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
                                        onChange={(e) => {
                                            setCapacity(e.target.value);
                                            if (priceMessage) setPriceMessage(""), setCapacityMessage("");
                                        }}
                                        color="zombieland.white"
                                        borderColor="zombieland.primary"
                                        bg="rgba(0,0,0,0.3)"
                                        _placeholder={{ color: "whiteAlpha.500" }}
                                    />
                                    <ZButton
                                        onClick={() => { setAction("capacity"); setIsConfirmOpen(true) }}
                                    >
                                        Enregistrer
                                    </ZButton>
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
                onClose={() => {
                    setIsConfirmOpen(false)
                    setConfirmError('')
                }}
                title={action === "price" ? "Confirmer la mise à jour du tarif" : "Confirmer la mise à jour de la capacité"}
                message={action === "price" ? "Voulez-vous vraiment modifier le prix du billet ?" : "Voulez-vous vraiment modifier la capacité du parc ?"}
                onConfirm={(password) => {
                    if (action === "price") updatePrice(password)
                    if (action === "capacity") updateCapacity(password)
                }}
                errorMessage={confirmError}
            />
        </Box>
    )
}

export default AdminTarifs