// My reservations page - list of reservations with cancel button

import { useEffect, useState } from 'react'
import { Box, Button, Heading, Text, Flex } from '@chakra-ui/react'
import bgImage from '../assets/bg-image.png'
import Header from '../components/Header'
import Footer from '../components/Footer'

function MyReservations() {
    // reservations stores the list of reservations retrieved from the API
    const [reservations, setReservations] = useState([])

    // Fetch reservations when the page loads
    useEffect(() => {
        const fetchReservations = async () => {
            // Call the backend API to retrieve the reservations
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations`)
            // Convert the response to JSON
            const data = await response.json()
            setReservations(data)
        }
        fetchReservations()
    }, []) // Runs only once on mount

    // Cancel a reservation by sending a delete request to the api
    const handleCancel = async (id: number) => {
        const response = await fetch(`http://localhost:3000/api/reservations/${id}`, {
            method: 'DELETE',
            headers: {
                // send the token jwt in the request header to authentificate the user
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })

        if (response.ok) {
            // remove the canceled reservation from the list without reloading the page
            setReservations(reservations.filter((r: any) => r.id_RESERVATION !== id))
        } else {
            const data = await response.json()
            alert(data.error)
        }
    }

    return (
        <Box
            minH="100vh"
            bgImage={`url(${bgImage})`}
            bgSize="cover"
            bgAttachment="fixed"
            bgPosition="center"
            display="flex"
            flexDirection="column"
            pt="80px" // Offset for the fixed header height to prevent content from hiding behind it
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

                {reservations.length === 0 ? (
                    <Text color="zombieland.white" fontFamily="body" fontWeight="300">
                        Vous n'avez pas encore de réservations.
                    </Text>
                ) : (
                    reservations.map((reservation: any) => (
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
                                    bgImage="url('/src/assets/deleteBouton.png')"
                                    bgSize="cover"
                                    bgPosition="center"
                                    color="zombieland.white"
                                    fontFamily="body"
                                    borderRadius="full"
                                    size="sm"
                                    border="none"
                                    _hover={{ opacity: 0.8 }}
                                >
                                    Annuler
                                </Button>
                            </Flex>
                        </Box>
                    ))
                )}
            </Box>

            <Footer />
        </Box>
    )
}

export default MyReservations