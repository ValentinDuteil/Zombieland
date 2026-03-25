// Reservation page - booking page

// Import useState to manage from data
import { useState, useEffect } from 'react'
// Import Chakra UI components for styling
import { Box, Button, Checkbox, Heading, Text, Input, Flex, FormControl, FormLabel } from '@chakra-ui/react'
// Import components for login before booking
import Header from '../components/Header'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
// Import the calendar component from react-day-picker
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import '../styles/calendar.css'
import { fr } from 'react-day-picker/locale'
// Import background images and card image
import bgImage from '../assets/bg-image.png'
import bgBouton from '../assets/bg-bouton.png'
//Import utility functions to handle date formats
import { toLocalDateString, isoToLocalDate, getTodayMidnight } from '../utils/date'

function Reservation() {

    //CONSTANTS
    //=========

    // Price per ticket in euros
    const TICKET_PRICE = 66.66
    // Today's date as "YYYY-MM-DD" string in local time — used as default date and reset value
    const today = toLocalDateString(new Date())
    // Past days config for DayPicker — disables all days strictly before today at midnight
    const pastDays = { before: getTodayMidnight() }

    // STATE
    //======

    // nbTickets store the number of tickets chosen by the user (1 by default)
    const [nbTickets, setNbTickets] = useState<string>('1')
    // date stores the chosen visit date (default => today)
    const [date, setDate] = useState(today)
    // message stores the text to display after from submission
    const [message, setMessage] = useState('')
    // confirmed stores whether the user has checked the confirmation checkbox
    const [confirmed, setConfirmed] = useState(false)
    // adding a modal to confirm the user is connected before confirming the reservation
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    // checking the availability of the chosen date before creating the reservation
    const [availabilities, setAvailabilities] = useState<{ date: string, available: boolean }[]>([])
    // selectedDay is the Date object used by react-day-picker to highlight the selected day in the calendar
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)

    // OTHER DATA
    //===========

    // For react-day-picker, we need to convert the date string to a Date object
    // and disableDays will be an array of Date objects corresponding to unavailable dates
    const disabledDays = availabilities
        .filter(a => !a.available)
        .map(a => (isoToLocalDate(a.date)))

    // HANDLERS
    //=========

    // Called when user clicks a day in DayPicker
    // Updates both selectedDay (Date for DayPicker) and date (string for the back)
    // toLocalDateString() avoids UTC conversion when building the "YYYY-MM-DD" string
    const handleDaySelect = (day: Date | undefined) => {
        setSelectedDay(day)
        if (day) {
            setDate(toLocalDateString(day))
        }
    }

    // useEffect to fetch availability data from the back 
    // called on mount and after each successful reservation
    const fetchAvailabilities = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/availabilities`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        const data = await response.json()
        setAvailabilities(data)
    }

    // Fetch availabilities on component mount
    useEffect(() => {
        fetchAvailabilities()
    }, [])

    // Called when user clicks "Rejoindre l'horreur"
    const handleSubmit = async () => {
        // Guard: date must be selected
        if (!date) {
            setMessage('Veuillez choisir une date.')
            return
        }
        // Guard: user must confirm their booking details
        if (!confirmed) {
            setMessage("Veuillez confirmer vos informations avant de rejoindre l'horreur.")
            return
        }
        // Guard: front-end availability check before sending to the back
        const chosenDate = availabilities.find(a => toLocalDateString(isoToLocalDate(a.date)) === date)
        if (chosenDate && !chosenDate.available) {
            setMessage('Nous sommes navrés, l\'armée des zombies a pris possession du parc !')
            return
        }

        // Send the form data to the back via fetch
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations`, {
            method: 'POST', // Create a new reservation
            headers: { 'Content-Type': 'application/json' }, // Send JSON},
            body: JSON.stringify({
                nb_tickets: parseInt(nbTickets) || 1, // The number of the tickets on by default
                date: date, // The date of the visit choosen by the client
                id_TICKET: 1
            }),
            credentials: 'include' //to get the cookie sent from the back, the browser is automatically dealing with
        })

        // The response is ok (status 200-299), success message
        if (response.ok) {
            setMessage('Réservation confirmée !')
            setNbTickets('1')
            setDate(today)
            setConfirmed(false)
            fetchAvailabilities()
        } else {
            if (response.status === 401) {
                // If the user is not authenticated, open the login modal
                setIsLoginModalOpen(true)
                setMessage('Veuillez vous connecter pour confirmer votre réservation.')
                return
            } else {
                // Otherwise, display a generic error message
                const errorData = await response.json()
                setMessage(errorData.message || 'Une erreur est survenue, veuillez réessayer.')
            }
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
                            bg="rgba(0,0,0,0.3)"
                            borderLeft="3px solid"
                            borderColor="zombieland.primary"
                            boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
                            transition="all 0.3s ease"
                            _hover={{
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                                borderColor: "zombieland.cta1orange",
                                bg: "rgba(0,0,0,0.5)"
                            }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Box w="100%" maxW="350px" mx="auto">
                                <FormControl mb={8}>
                                    <FormLabel color="zombieland.white" fontWeight="600" mb={3} fontSize="16px">
                                        Nombre de billets souhaités ?
                                    </FormLabel>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={nbTickets}
                                        onChange={(e) => setNbTickets(e.target.value)}
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
                                        Quand souhaitez-vous venir ?
                                    </FormLabel>
                                    <DayPicker
                                        mode="single"
                                        selected={selectedDay}
                                        onSelect={handleDaySelect}
                                        disabled={[pastDays, ...disabledDays]}
                                        // modifiers let us add a class to the disabled days 
                                        // to make them look different in the calendar
                                        modifiers={{
                                            past: pastDays,
                                            full: disabledDays
                                        }}
                                        modifiersClassNames={{
                                            past: 'rdp-day-past',
                                            full: 'rdp-day-full'
                                        }}
                                        locale={fr}
                                    />
                                </FormControl>
                            </Box>
                        </Box>

                        {/* Right - Summary */}
                        <Box
                            flex={1}
                            p={{ base: 6, md: 8 }}
                            borderRadius="lg"
                            bg="rgba(0,0,0,0.3)"
                            borderLeft="3px solid"
                            borderColor="zombieland.primary"
                            boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
                            transition="all 0.3s ease"
                            _hover={{
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                                borderColor: "zombieland.cta1orange",
                                bg: "rgba(0,0,0,0.5)"
                            }}
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
                                            {selectedDay
                                                ? selectedDay.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                                                : isoToLocalDate(today).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                                            }
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text color="rgba(250, 235, 220, 0.6)" fontFamily="body" fontWeight="500" fontSize="13px" mb={1}>
                                            Nombre de billets
                                        </Text>
                                        <Text color="zombieland.white" fontFamily="body" fontWeight="300" fontSize="16px">
                                            {nbTickets} {nbTickets > '1' ? 'billets' : 'billet'}
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
                                        {(parseInt(nbTickets) * TICKET_PRICE).toFixed(2)} €
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
                    isDisabled={!confirmed}
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
                    _disabled={{
                        opacity: 0.5,
                        cursor: "not-allowed",
                        pointerEvents: "none"
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
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onConfirm={() => {
                    setIsLoginModalOpen(false)
                    handleSubmit()
                }}
                title="Connexion"
            />
            <Footer />
        </Box >
    )
}
export default Reservation