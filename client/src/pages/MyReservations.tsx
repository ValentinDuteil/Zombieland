// My reservations page - list of reservations with cancel button

import { useEffect, useState } from 'react'
import { Box, Button, Heading, Text, Flex, Spinner } from '@chakra-ui/react'
import bgImage from '../assets/bg-image.png'
import bgBouton from '../assets/bg-bouton.png'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

// defines the shape of a reservation object
// use an interface instead of any allows ts to check that we are accessing valid fiels
interface Reservation {
    id_RESERVATION: number
    nb_tickets: number
    date: string
    total_amount: string
    status: string
    created_at: string
    updated_at: string
    id_USER: number
    id_TICKET: number
}

function MyReservations() {
    // reservations stores the list of reservations retrieved from the API
    // tells ts that this state is always an aray of reservation objects
    const [reservations, setReservations] = useState<Reservation[]>([])
    // loading stores the loading state of the page
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [message, setMessage] = useState('')

    // Fetch reservations when the page loads
    useEffect(() => {
        const fetchReservations = async () => {
            // Call the backend API to retrieve the reservations
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/me`, {
                credentials: 'include' // Send the cookie to authenticate the user
            })
            const data = await response.json()
            if (!response.ok) {
                setLoading(false)
                return

            }
            setReservations(data)
            setLoading(false)
        }
        fetchReservations()
    }, []) // Runs only once on mount

    // Cancel a reservation by sending a delete request to the api
    const handleCancel = async (id: number) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/${id}`, {
            method: 'DELETE',
            credentials: 'include' //to get the cookie sent from the back, the browser is automatically dealing with
        })

        if (response.ok) {
            // remove the canceled reservation from the list without reloading the page
            setReservations(reservations.filter((r: Reservation) => r.id_RESERVATION !== id))
            if (response.ok) {
                setReservations(reservations.filter((r: Reservation) => r.id_RESERVATION !== id))
                setMessage('Votre annulation a bien été prise en compte.')
                navigate('/my-account', { state: { refresh: Date.now() } })
            }
        } else {
            const data = await response.json()
            alert(data.error)
        }
    }

    const activeReservations = reservations.filter((r: Reservation) => r.status !== 'CANCELLED')
    return (
        <Box
            minH="100vh"
            bgImage={`url(${bgImage})`}
            bgSize="cover"
            // bgAttachment="fixed"
            bgPosition="center"
            display="flex"
            flexDirection="column"
        // pt="80px" // Offset for the fixed header height to prevent content from hiding behind it
        >
            <Header />

            <Box
                flex={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
                px={8}
                py={10}
                minH="70vh"
            >
                <Heading
                    mb={10}
                    fontFamily="heading"
                    fontSize="54px"
                    textAlign="center"
                    color="zombieland.white"
                >
                    Mes réservations
                </Heading>

                {loading ? (
                    <Spinner color="zombieland.white" size="xl" />

                ) : activeReservations.length === 0 ? (
                    <Box display="flex" flexDirection="column" alignItems="center" gap={4}>
                        <Text color="zombieland.white" fontFamily="body" fontWeight="300">
                            Vous n'avez pas encore de réservations.
                        </Text>
                        <Button
                            onClick={() => navigate('/reservation')}
                            bgImage={`url(${bgBouton})`}
                            bgSize="cover"
                            bgPosition="center"
                            color="zombieland.secondary"
                            fontFamily="body"
                            fontWeight="bold"
                            fontSize="16px"
                            py={5}
                            px={4}
                            borderRadius="full"
                            letterSpacing="1px"
                            textTransform="uppercase"
                            boxShadow="inset 0 2px 8px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.5)"
                            _hover={{ bg: "zombieland.cta2orange" }}
                        >
                            → Réserver maintenant
                        </Button>
                    </Box>
                ) : (
                    activeReservations.map((reservation: Reservation) => (
                        <Box
                            key={reservation.id_RESERVATION}
                            mb={4}
                            p={6}
                            w="100%"
                            maxW="500px"
                            borderRadius="md"
                            bg="rgba(0,0,0,0.3)"
                            boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
                            borderLeft="3px solid"
                            borderColor="zombieland.primary"
                            transition="all 0.3s ease" // Smooth animation on hover
                            _hover={{
                                transform: "translateY(-4px)", // Slight lift effect
                                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                                borderColor: "zombieland.cta1orange", // Border changes color on hover
                                bg: "rgba(0,0,0,0.5)"
                            }}
                            cursor="pointer"
                        >
                            {/* Reservation details */}
                            <Text color="zombieland.white" fontFamily="body" fontWeight="300" mb={1}>
                                - Date : {new Date(reservation.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </Text>
                            <Text color="zombieland.white" fontFamily="body" fontWeight="300" mb={1}>
                                - Billets : {reservation.nb_tickets}
                            </Text>
                            <Text color="zombieland.white" fontFamily="body" fontWeight="300" mb={4}>
                                - Statut : {reservation.status}
                            </Text>

                            {/* Cancel button aligned to the right */}
                            <Flex justifyContent="flex-end">
                                <Button
                                    // trigger the cancel function when the button is clicked
                                    onClick={() => handleCancel(reservation.id_RESERVATION)}
                                    bgImage={`url(${bgBouton})`}
                                    bgSize="cover"
                                    bgPosition="center"
                                    color="zombieland.secondary"
                                    fontFamily="body"
                                    fontWeight="bold"
                                    fontSize="14px"
                                    py={3}
                                    px={4}
                                    borderRadius="full"
                                    boxShadow="inset 0 2px 8px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.5)"
                                    _hover={{ opacity: 0.8 }}
                                >
                                    Annuler
                                </Button>
                            </Flex>
                        </Box>
                    ))
                )}
            </Box>
            {message && (
                <Text
                    mt={4}
                    textAlign="center"
                    fontFamily="body"
                    fontWeight="300"
                    color="zombieland.white"
                >
                    {message}
                </Text>
            )}
            <Footer />
        </Box>
    )
}

export default MyReservations