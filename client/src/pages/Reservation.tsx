// Reservation page - booking page

// Import useState to manage from data
import { useState } from 'react'
// Import Chakra UI components for styling
import { Box, Button, Heading, Input, Text } from '@chakra-ui/react'

import bgImage from '../assets/bg-image.png'
import bgBouton from '../assets/bg-bouton.png'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Reservation() {
    // nbTickets store the number of tickets chosen by the user (1 by default)
    const [nbTickets, setNbTickets] = useState(1)
    // date stores the chosen visit date (empty by default)
    const today = new Date().toISOString().split('T')[0] // get today's date in YYYY-MM-DD format as default value

    // date stores the chosen visit date (default => today)
    const [date, setDate] = useState(today)

    // message stores the text to display after from submission
    const [message, setMessage] = useState('')

    //  handleSubmit is the function that runs when we click to "Confirm"
    const handleSubmit = async () => {
        // Check if date is empty before sending
        if (!date) {
            setMessage('Veuillez choisir une date.')
            return
        }

        // Send the form data to the back via fetch
        const response = await fetch('http://localhost:3000/api/reservations', {
            method: 'POST', // Create a new reservation
            headers: {
                'Content-Type': 'application/json' // Send JSON
            },
            body: JSON.stringify({
                nb_tickets: nbTickets, // The number of the tickets
                date: date, // The chosen date
                id_TICKET: 1
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
        <Box
            minH="100vh"
            bgImage={`url(${bgImage})`}
            bgSize="cover"
            bgPosition="center"
            display="flex"
            flexDirection="column"
        >
            <Header />

            <Box
                flex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Box
                    w="500px"
                    p={10}
                    bg="zombieland.secondary"
                    borderRadius="md"
                >
                    <Heading
                        mb={8}
                        textAlign="center"
                        fontFamily="heading"
                        fontSize="54px"
                        color="zombieland.white"
                    >
                        Réservation
                    </Heading>

                    <Text mb={2} color="zombieland.white">Nombre de billets</Text>
                    <Input
                        type="number"
                        min={1}
                        value={nbTickets}
                        onChange={(e) => setNbTickets(Number(e.target.value))}
                        bg="zombieland.bgsecondary"
                        color="zombieland.white"
                        borderColor="zombieland.primary"
                        mb={4}
                    />

                    <Text mb={2} color="zombieland.white">Date de la visite</Text>
                    <Input
                        type="date"
                        value={date}
                        min={today}
                        onChange={(e) => setDate(e.target.value)}
                        bg="zombieland.bgsecondary"
                        color="zombieland.white"
                        borderColor="zombieland.primary"
                        mb={6}
                    />

                    <Button
                        onClick={handleSubmit}
                        w="100%"
                        bgImage={`url(${bgBouton})`}
                        color="zombieland.secondary"
                        _hover={{ bg: "zombieland.cta2orange" }}
                        fontFamily="body"
                        fontSize="20px"
                        py={8}
                        borderRadius="full"
                        letterSpacing="3px"
                        fontWeight="bold"
                        boxShadow="inset 0 2px 8px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.5)"
                        textTransform="uppercase"
                    >
                        → REJOINDRE L'HORREUR
                    </Button>

                    {message && (
                        <Text
                            mt={4}
                            textAlign="center"
                            color={message.includes('confirmée') ? 'zombieland.successprimary' : 'zombieland.warningprimary'}
                        >
                            {message}
                        </Text>
                    )}
                </Box>
            </Box>

            <Footer />
        </Box>
    )
}
export default Reservation