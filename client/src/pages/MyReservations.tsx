// My reservations page - list of reservations with cancel button

// Import useEffect to run the code when the page loads
// Import useState to store data
import { useEffect, useState } from 'react'
// Import Chakra UI components for styling
import { Box, Button, Heading, Text } from '@chakra-ui/react'

function MyReservations() {
    // reservations stores the list of reservations retrieved from the API
    // Initialilze with an empty array because we don't have data yet
    const [reservations, setReservations] = useState([])

    // We retrieve the reservations when the page loads
    useEffect(() => {
        // Function that retrieves reservations from the API
        const fetchReservations = async () => {
            // Call the backend API to retrieve the reservations
            const response = await fetch('http://localhost:3000/api/reservations')
            // Convert the response to JSON
            const data = await response.json()
            // Update the state with the retrieved reservations
            setReservations(data)
        }
        // Call the function
        fetchReservations()
    }, []) // Means useEffect only runs once

    return (
        <Box p={8}>

            <Heading
                mb={6}
                fontFamily="heading"
                fontSize="64px"
                textAlign="center"
            >
                Mes réservations
            </Heading>

            {reservations.length === 0 ? (
                <Text>Vous n'avez pas encore de réservations.</Text>
            ) : (
                reservations.map((reservation: any) => (
                    <Box key={reservation.id_RESERVATION} mb={4} p={4} borderWidth={1}>
                        <Text>Date : {new Date(reservation.date).toLocaleDateString()}</Text>
                        <Text>Billets : {reservation.nb_tickets}</Text>
                        <Text>Statut : {reservation.status}</Text>
                        <Button mt={2} colorScheme="red">
                            Annuler
                        </Button>
                    </Box>
                ))
            )}
        </Box>
    )
}

export default MyReservations