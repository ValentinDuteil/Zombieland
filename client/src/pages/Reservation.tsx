// Reservation page - booking page

// Import useState to manage from data
import { useState } from 'react'
// Import Chakra UI components for styling
import { Box, Button, Heading, Input, Text } from '@chakra-ui/react'

import bgImage from '../../public/assets/bg-image.png'
import bgBouton from '../../public/assets/bg-bouton.png'
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
        // check if date is empty before sending
        if (!date) {
            setMessage('Veuillez choisir une date.')
            return
        }

        // Send the form data to the back via fetch
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations`, {
            method: 'POST', // Create a new reservation
            headers: {
                'Content-Type': 'application/json', // Send JSON
                'Authorization': `Bearer ${localStorage.getItem('token')}`
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
            bgAttachment={'fixed'}
            display="flex"
            flexDirection="column"
            pt="80px" // Add padding top for the fixed header height to prevent content from hiding behind it
        >
            <Header />

            <Box
                flex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH={"70vh"}
            >
                <Box
                    w="500px"
                    p={10}
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

                    <Text mb={2} color="zombieland.white" fontWeight="300">Nombre de billets</Text>
                    <Input
                        type="number"
                        min={1}
                        value={nbTickets}
                        onChange={(e) => setNbTickets(Number(e.target.value))}
                        bg="rgba(0,0,0,0.3)"
                        color="zombieland.white"
                        borderColor="zombieland.primary"
                        boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
                        mb={4}
                    />

                    <Text mb={2} color="zombieland.white" fontWeight="300">Date de la visite</Text>
                    <Input
                        type="date"
                        value={date}
                        min={today}
                        onChange={(e) => setDate(e.target.value)}
                        bg="rgba(0,0,0,0.3)"
                        color="zombieland.white"
                        borderColor="zombieland.primary"
                        boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
                        mb={6}
                    />
                </Box>
            </Box>

            <Box
                display="flex"
                flexDirection="column"
                alignItems={{ base: 'center', lg: 'flex-end' }}
                px={10}
                pb={{ base: 28, lg: 6 }}
            >
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Button
                        onClick={handleSubmit}
                        bgImage={`url(${bgBouton})`}
                        color="zombieland.secondary"
                        _hover={{ bg: "zombieland.cta2orange" }}
                        fontFamily="body"
                        fontSize="20px"
                        py={6}
                        px={3}
                        borderRadius="full"
                        letterSpacing="1px"
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
                            fontFamily="body"
                            fontWeight="300"
                            color={message.includes('confirmée') ? 'zombieland.white' : 'zombieland.warningprimary'}
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