// Reservation page - booking page

// Import useState to manage from data
import { useState } from 'react'
// Import Chakra UI components for styling
import { Box, Button, Heading, Input, Text } from '@chakra-ui/react'

function Reservation() {
    // nbTickets store the number of tickets chosen by the user (1 by default)
    const [nbTickets, setNbTickets] = useState(1)
    // date stores the chosen visit date (empty by default)
    const [date, setDate] = useState('')
    // message stores the text to display after form submission
    const [message, setMessage] = useState('')

    //  handleSubmit is the function that runs when we click to "Confirm"
    const handleSubmit = async () => {
        // Send the form data to the back via fetch
        const response = await fetch('http://localhost:3000/api/reservations', {
            method: 'POST', // Create a new reservation
            headers: {
                'Content-Type': 'application/json' // Send JSON
            },
            body: JSON.stringify({
                nb_tickets: nbTickets, // The number of the tickets
                date: date, // The chosen date
                id_TICKET: 1 // A remplacer par le vrai id du billet
            })
        })

        // The response is ok (status 200-299), success message
        if (response.ok) {
            setMessage('Réservation confirmée !')
        } else {
            // Otherwise we display an error message
            setMessage('Une erreur est survenue, veuillez réessayer.')
        }
    }

    return (

        <Box p={8}>
            <Heading mb={6}>Réserver votre visite</Heading>

            <Text mb={2}>Nombre de billets</Text>
            <Input // Input number to choose the number of tickets
                type="number"
                min={1}
                value={nbTickets}
                onChange={(e) => setNbTickets(Number(e.target.value))} // updates nbTickets when the user changes the value
                mb={4}
            />

            <Text mb={2}>Date de la visite</Text>
            <Input // Input date to choose the visit date
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)} // updates dates when the user changes the value
                mb={6}
            />


            <Button onClick={handleSubmit}>
                Confirmer la réservation
            </Button>

            {message && <Text mt={4}>{message}</Text>}
        </Box>
    )
}

export default Reservation