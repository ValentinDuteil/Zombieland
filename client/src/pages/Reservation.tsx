// Reservation page - booking page

// Import useState to manage from data
import { useState } from 'react'
// Import Chakra UI components for styling
import { Box, Button, Checkbox, Heading, Input, Text, Flex, FormControl, FormLabel } from '@chakra-ui/react'

import bgImage from '../assets/bg-image.png'
import bgBouton from '../assets/bg-bouton.png'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Reservation() {
    // nbTickets store the number of tickets chosen by the user (1 by default)
    const [nbTickets, setNbTickets] = useState(0)
    // date stores the chosen visit date (empty by default)
    const today = new Date().toISOString().split('T')[0] // get today's date in YYYY-MM-DD format as default value

    // date stores the chosen visit date (default => today)
    const [date, setDate] = useState(today)

    // message stores the text to display after from submission
    const [message, setMessage] = useState('')

    // Price per ticket in euros
    const TICKET_PRICE = 66.66

    // confirmed stores whether the user has checked the confirmation checkbox
    const [confirmed, setConfirmed] = useState(false)

    //  handleSubmit is the function that runs when we click to "Confirm"
    const handleSubmit = async () => {
        // check if date is empty before sending
        if (!date) {
            setMessage('Veuillez choisir une date.')
            return
        }

        // Check if the user has confirmed their reservation details

        if (!confirmed) {
            setMessage("Veuillez confirmer vos informations avant de rejoindre l'horreur.")
            return
        }

        // Send the form data to the back via fetch
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations`, {
            method: 'POST', // Create a new reservation
            headers: { 'Content-Type': 'application/json' }, // Send JSON},
            body: JSON.stringify({
                nb_tickets: nbTickets, // The number of the tickets
                date: date, // The chosen date
                id_TICKET: 1
            }),
            credentials: 'include' //to get the cookie sent from the back, the browser is automatically dealing with
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
        >
            <Header />

            <Box
                flex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH={"70vh"}
                px={{ base: 4, md: 8 }}
                py={8}
            >
                <Box w="100%" maxW="1000px">
                    {/* Title at the top center */}
                    <Heading
                        mb={12}
                        textAlign="center"
                        fontFamily="heading"
                        fontSize={{ base: '36px', md: '54px' }}
                        color="zombieland.white"
                        textShadow="2px 2px 4px rgba(0,0,0,0.5)"
                    >
                        Réservation
                    </Heading>

                    <Flex
                        gap={{ base: 6, lg: 10 }}
                        alignItems="stretch"
                        flexDirection={{ base: 'column', lg: 'row' }}
                        w="100%"
                    >
                        {/* Left - Form */}
                        <Box 
                            flex={1}
                            p={{ base: 6, md: 8 }}
                            borderRadius="lg"
                            bg="rgba(0,0,0,0.08)"
                            backdropFilter="blur(10px)"
                            border="1px solid"
                            borderColor="rgba(250, 235, 220, 0.1)"
                            boxShadow="0 8px 32px rgba(0,0,0,0.3)"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Box w="100%" maxW="300px">
                                <FormControl mb={6}>
                                    <FormLabel color="zombieland.white" fontWeight="600" mb={3} fontSize="16px">
                                        Nombre de billets
                                    </FormLabel>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={nbTickets}
                                        onChange={(e) => {
                                            const num = parseInt(e.target.value) || 1;
                                            setNbTickets(Math.max(1, num));
                                        }}
                                        bg="rgba(0,0,0,0.3)"
                                        color="zombieland.white"
                                        borderColor="zombieland.primary"
                                        borderWidth="2px"
                                        transition="all 0.3s ease"
                                        _focus={{
                                            borderColor: "zombieland.primary",
                                            boxShadow: "0 0 0 3px rgba(250, 235, 220, 0.1)",
                                            bg: "rgba(0,0,0,0.4)"
                                        }}
                                        _hover={{
                                            borderColor: "zombieland.primary"
                                        }}
                                        fontSize="16px"
                                        py={3}
                                        pl={4}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel color="zombieland.white" fontWeight="600" mb={3} fontSize="16px">
                                        Date de la visite
                                    </FormLabel>
                                    <Input
                                        type="date"
                                        value={date}
                                        min={today}
                                        onChange={(e) => setDate(e.target.value)}
                                        bg="rgba(0,0,0,0.3)"
                                        color="zombieland.white"
                                        borderColor="zombieland.primary"
                                        borderWidth="2px"
                                        transition="all 0.3s ease"
                                        _focus={{
                                            borderColor: "zombieland.primary",
                                            boxShadow: "0 0 0 3px rgba(250, 235, 220, 0.1)",
                                            bg: "rgba(0,0,0,0.4)"
                                        }}
                                        _hover={{
                                            borderColor: "zombieland.primary"
                                        }}
                                        fontSize="16px"
                                        py={3}
                                        pl={4}
                                    />
                                </FormControl>
                            </Box>
                        </Box>

                        {/* Right - Summary */}
                        <Box 
                            flex={1}
                            p={{ base: 6, md: 8 }}
                            borderRadius="lg"
                            bg="rgba(0,0,0,0.08)"
                            backdropFilter="blur(10px)"
                            border="1px solid"
                            borderColor="rgba(250, 235, 220, 0.15)"
                            boxShadow="0 8px 32px rgba(0,0,0,0.3)"
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                        >
                            <Box>
                                <Text 
                                    color="zombieland.white" 
                                    fontFamily="heading"
                                    fontWeight="bold" 
                                    mb={6} 
                                    fontSize="20px"
                                    textTransform="uppercase"
                                    letterSpacing="1px"
                                    textAlign="center"
                                >
                                    Récapitulatif
                                </Text>
                                <Flex flexDirection="column" gap={4}>
                                    <Box>
                                        <Text color="rgba(250, 235, 220, 0.6)" fontFamily="body" fontWeight="500" fontSize="13px" mb={1}>
                                            Date de visite
                                        </Text>
                                        <Text color="zombieland.white" fontFamily="body" fontWeight="300" fontSize="16px">
                                            {new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text color="rgba(250, 235, 220, 0.6)" fontFamily="body" fontWeight="500" fontSize="13px" mb={1}>
                                            Nombre de billets
                                        </Text>
                                        <Text color="zombieland.white" fontFamily="body" fontWeight="300" fontSize="16px">
                                            {nbTickets} {nbTickets > 1 ? 'billets' : 'billet'}
                                        </Text>
                                    </Box>
                                </Flex>
                            </Box>

                            <Box 
                                pt={6}
                                borderTop="1px solid"
                                borderColor="rgba(250, 235, 220, 0.1)"
                            >
                                <Text color="rgba(250, 235, 220, 0.6)" fontFamily="body" fontWeight="500" fontSize="13px" mb={2}>
                                    Prix unitaire
                                </Text>
                                <Text color="zombieland.white" fontFamily="body" fontWeight="300" fontSize="14px" mb={4}>
                                    {TICKET_PRICE.toFixed(2)} € / billet
                                </Text>

                                <Box 
                                    p={4}
                                    borderRadius="md"
                                    bg="rgba(250, 235, 220, 0.06)"
                                    border="1px solid rgba(250, 235, 220, 0.2)"
                                >
                                    <Text color="rgba(250, 235, 220, 0.6)" fontFamily="body" fontWeight="500" fontSize="13px" mb={2}>
                                        Total
                                    </Text>
                                    <Text color="zombieland.white" fontFamily="heading" fontWeight="bold" fontSize="28px">
                                        {(nbTickets * TICKET_PRICE).toFixed(2)} €
                                    </Text>
                                </Box>
                            </Box>

                            <Text color="zombieland.warningprimary" fontFamily="body" fontWeight="500" fontSize="11px" mt={6} textAlign="center">
                                Annulation possible jusqu'à 10 jours avant la date de visite
                            </Text>
                        </Box>
                    </Flex>
                </Box>
            </Box>

            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                px={{ base: 4, md: 10 }}
                pb={{ base: 28, lg: 8 }}
                gap={6}
            >
                {/* checkbox before button */}
                <Checkbox
                    isChecked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    colorScheme="orange"
                    size="lg"
                >
                    <Text color="zombieland.white" fontFamily="body" fontWeight="400" fontSize="15px" ml={2}>
                        Je confirme que les dates et billets choisis sont corrects
                    </Text>
                </Checkbox>

                <Button
                    onClick={handleSubmit}
                    bgImage={`url(${bgBouton})`}
                    bgSize="cover"
                    bgPosition="center"
                    color="zombieland.secondary"
                    fontFamily="heading"
                    fontSize={{ base: '16px', md: '20px' }}
                    py={{ base: 5, md: 7 }}
                    px={{ base: 6, md: 12 }}
                    borderRadius="full"
                    letterSpacing="2px"
                    fontWeight="bold"
                    boxShadow="0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
                    textTransform="uppercase"
                    transition="all 0.3s ease"
                    _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
                    }}
                    _active={{
                        transform: "translateY(0px)",
                    }}
                >
                    → REJOINDRE L'HORREUR
                </Button>

                {message && (
                    <Box
                        p={4}
                        borderRadius="md"
                        bg="rgba(0,0,0,0.2)"
                        border="1px solid rgba(250, 235, 220, 0.2)"
                        minW="300px"
                    >
                        <Text
                            textAlign="center"
                            fontFamily="body"
                            fontWeight="500"
                            fontSize="14px"
                            color="zombieland.white"
                        >
                            {message}
                        </Text>
                    </Box>
                )}
            </Box>

            <Footer />
        </Box >
    )
}
export default Reservation