import { useEffect, useState } from "react"
import { Box, Heading, Input, Button, Text, Flex } from "@chakra-ui/react"
import axios from "axios"
import { API_URL } from "@/config/api"
import Header from "../../components/Header"
import bgImage from "../../assets/bg-image.webp"
import Footer from "../../components/Footer"
import AdminMenu from "@/components/AdminNavlinkMenu"

const AdminTarifs = () => {
    const [price, setPrice] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const fetchPrice = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/ticket/amount`)
            setPrice(res.data.price)
        } catch {
            setMessage("Erreur lors du chargement du tarif")
        } finally {
            setLoading(false)
        }
    }

    const updatePrice = async () => {
        try {
            await axios.put(`${API_URL}/api/ticket/amount`, { price })
            setMessage("Tarif mis à jour avec succès")
        } catch {
            setMessage("Erreur lors de la mise à jour")
        }
    }

    useEffect(() => {
        fetchPrice()
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
                            />

                            <Button colorScheme="blue" onClick={updatePrice}>
                                Enregistrer
                            </Button>

                            {message && <Text mt={4}>{message}</Text>}
                        </>
                    )}
                </Box>
            </Flex>

            <Footer />
        </Box>
    )
}

export default AdminTarifs