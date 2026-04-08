// My reservations page - list of reservations with cancel button

import { useEffect, useState } from 'react'
import { Box, Button, Input, Heading, Text, Flex, Spinner } from '@chakra-ui/react'
import bgImage from '../assets/bg-image.webp'
import barbed from '../assets/barbed-bg.webp'
import bgBouton from '../assets/bg-bouton.webp'
import bgAdmin from '../assets/bgadmin.webp'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AdminMenu from '../components/AdminNavlinkMenu'
import { PageBackground } from '../components/PageBackground'
import { useSearchParams, useNavigate, useParams } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'
import InfoModal from '../components/InfoModal'
import { API_URL } from '@/config/api'
import axiosInstance from '@/lib/axiosInstance'
import { isAxiosError } from 'axios'
import { isoToLocalDate } from '@/utils/date'



// defines the shape of a reservation object...
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
    const [searchParams] = useSearchParams()
    const reservationId = searchParams.get('reservationId')
    // Sort and filter states
    const [sortBy, setSortBy] = useState<'created_at' | 'date' | 'total_amount'>('created_at')
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL')
    // loading stores the loading state of the page
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const [cancelError, setCancelError] = useState('')
    const [currentUser, setCurrentUser] = useState<{ role: string } | null>(null)
    const [memberName, setMemberName] = useState<string | null>(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [reservationToCancel, setReservationToCancel] = useState<number | null>(null)
    const [blockedMessage, setBlockedMessage] = useState<string | null>(null)
    // pagination states
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    // id management
    // isAdmin is true only if the connected user is an admin AND there is a member id in the URL
    // this prevents members from accessing other members' reservations even if they know the URL
    const { id } = useParams()
    const isAdmin = currentUser?.role === 'ADMIN' && !!id

    // Filtering and sorting the reservations based on the search term and the current page
    const filteredReservations = reservations
        .filter((r) => {
            if (reservationId) return r.id_RESERVATION === parseInt(reservationId)
            // Filtre par statut
            if (statusFilter !== 'ALL' && r.status !== statusFilter) return false
            // Filtre par recherche date
            const search = searchTerm.toLowerCase()
            if (!search) return true
            const dateShort = new Date(r.date).toLocaleDateString('fr-FR').toLowerCase()
            const dateLong = new Date(r.date).toLocaleDateString('fr-FR', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            }).toLowerCase()
            return dateShort.includes(search) || dateLong.includes(search)
        })
        .sort((a, b) => {
            const dir = sortDir === 'asc' ? 1 : -1
            switch (sortBy) {
                case 'created_at':
                    return (a.id_RESERVATION - b.id_RESERVATION) * dir
                case 'date':
                    return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir
                case 'total_amount':
                    return (Number(a.total_amount) - Number(b.total_amount)) * dir
                default:
                    return 0
            }
        })

    // Pagination logic
    // 4. Pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredReservations.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredReservations.length / itemsPerPage)

    // Fetch reservations when the page loads
    useEffect(() => {
        setLoading(true)
        const init = async () => {
            try {
                // 1. Fetch user first
                const resUser = await axiosInstance.get(`${API_URL}/api/auth/me`, {
                    withCredentials: true
                })
                const userData = resUser.data
                setCurrentUser(userData)

                // 2. Then fetch reservations based on role

                const isAdminUser = userData.role === 'ADMIN' && !!id
                // Fetch member name if admin consulting a member's reservations
                if (isAdminUser) {
                    const resMember = await axiosInstance.get(`${API_URL}/api/users/${id}/profile`, { withCredentials: true })
                    setMemberName(`${resMember.data.firstname} ${resMember.data.lastname}`)
                }

                const url = isAdminUser
                    ? `${API_URL}/api/reservations/user/${id}`
                    : `${API_URL}/api/reservations/me`

                const response = await axiosInstance.get(url, { withCredentials: true })
                setReservations(response.data)

            } catch (error) {
                setMessage("Erreur lors de la récupération d'une réservation")
            } finally {
                setLoading(false);
            }
        }
        init()
    }, [id]) // Runs only once on mount


    // Check if the reservation is less than 10 days away
    const isWithin10Days = (dateStr: string) => {
        const reservationDate = isoToLocalDate(dateStr)
        const today = new Date()
        // Set time to midnight for accurate day comparison
        today.setHours(0, 0, 0, 0)
        // Calculate the difference in days between the reservation date and today
        const diffTime = reservationDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        // Return true if the reservation is within 10 days, false otherwise
        return diffDays <= 10
    }

    // Handle cancel button click — check 10 days rule first

    const handleCancelClick = (reservation: Reservation) => {
        if (isWithin10Days(reservation.date)) {
            setBlockedMessage(`Impossible d'annuler cette réservation car elle est dans moins de 10 jours (le ${new Date(reservation.date)
                .toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}).`)
            return
        }
        setReservationToCancel(reservation.id_RESERVATION)
    }

    // Cancel a reservation by sending a delete request to the api
    const handleCancel = async (reservationId: number, password: string) => {
        try {
            await axiosInstance.delete(`${API_URL}/api/reservations/${reservationId}`, {
                data: { password },
                withCredentials: true,
            })
            setReservationToCancel(null)
            setCancelError('')
            // Re-fetch instead of local state update — keeps dashboard in sync
            const resUser = await axiosInstance.get(`${API_URL}/api/auth/me`, { withCredentials: true })
            const userData = resUser.data
            const isAdminUser = userData.role === 'ADMIN' && !!id
            const url = isAdminUser
                ? `${API_URL}/api/reservations/user/${id}`
                : `${API_URL}/api/reservations/me`
            const response = await axiosInstance.get(url, { withCredentials: true })
            setReservations(response.data)
            setMessage('Votre annulation a bien été prise en compte.')
            if (!isAdminUser) {
                navigate('/my-account/reservations')
            }

        } catch (error) {
            if (isAxiosError(error)) {
                setCancelError("Mot de passe incorrect")
            } else {
                setMessage("Votre annulation n'a pas été prise en compte")
            }
        }
    }

    // Page content — shared between admin and public layouts
    const pageContent = (
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
                fontSize={{ base: "36px", md: "54px" }}
                textAlign="center"
                color="zombieland.white"
            >
                {isAdmin
                    ? `Réservations de ${memberName ?? '...'}`
                    : "Mes réservations"}
            </Heading>

            {!reservationId && (
                <Flex direction="column" align="center" gap={3} maxW="500px" w="100%" mb={8}>
                    <Input
                        placeholder="Rechercher par date..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                        color="zombieland.white"
                        borderColor="zombieland.primary"
                        bg="rgba(0,0,0,0.3)"
                        _placeholder={{ color: "gray.400" }}
                    />
                    <Flex gap={2} wrap="wrap" justify="center">
                        {(['ALL', 'CONFIRMED', 'CANCELLED'] as const).map((s) => (
                            <Button
                                key={s}
                                size="sm"
                                onClick={() => { setStatusFilter(s); setCurrentPage(1) }}
                                bgImage={`url(${bgAdmin})`}
                                bgSize="120%"
                                bgPosition="center"
                                bgRepeat="no-repeat"
                                color="zombieland.secondary"
                                fontWeight="bold"
                                border="2px solid"
                                borderColor={statusFilter === s ? "zombieland.cta1orange" : "transparent"}
                                boxShadow={statusFilter === s ? "0 0 8px rgba(184, 95, 0, 0.5)" : "none"}
                                _hover={{ opacity: 0.85, borderColor: "zombieland.cta1orange" }}
                            >
                                {s === 'ALL' ? 'Toutes' : s === 'CONFIRMED' ? 'Confirmées' : 'Annulées'}
                            </Button>
                        ))}
                    </Flex>
                    <Flex gap={2} wrap="wrap" justify="center">
                        {([
                            { value: 'created_at', label: 'N° réservation' },
                            { value: 'date', label: 'Date visite' },
                            { value: 'total_amount', label: 'Montant' }
                        ] as const).map((opt) => (
                            <Button
                                key={opt.value}
                                size="sm"
                                onClick={() => {
                                    if (sortBy === opt.value) {
                                        setSortDir(d => d === 'asc' ? 'desc' : 'asc')
                                    } else {
                                        setSortBy(opt.value)
                                        setSortDir('desc')
                                    }
                                    setCurrentPage(1)
                                }}
                                bgImage={`url(${bgAdmin})`}
                                bgSize="120%"
                                bgPosition="center"
                                bgRepeat="no-repeat"
                                color="zombieland.secondary"
                                fontWeight="bold"
                                border="2px solid"
                                borderColor={sortBy === opt.value ? "zombieland.cta1orange" : "transparent"}
                                boxShadow={sortBy === opt.value ? "0 0 8px rgba(184, 95, 0, 0.5)" : "none"}
                                _hover={{ opacity: 0.85, borderColor: "zombieland.cta1orange" }}
                            >
                                {opt.label} {sortBy === opt.value ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                            </Button>
                        ))}
                    </Flex>
                </Flex>
            )}

            {loading ? (
                <Spinner color="zombieland.white" size="xl" />
            ) : filteredReservations.length === 0 ? (
                <Box display="flex" flexDirection="column" alignItems="center" gap={4}>
                    <Text color="zombieland.white" fontFamily="body" fontWeight="300">
                        {searchTerm ? "Aucun résultat pour cette recherche." : "Vous n'avez pas encore de réservations."}
                    </Text>
                    {!searchTerm && !isAdmin && (
                        <Button
                            onClick={() => navigate('/reservation')}
                            bgImage={`url(${bgBouton})`}
                            bgSize="cover"
                            bgPosition="center"
                            color="zombieland.secondary"
                            fontFamily="body"
                            fontWeight="bold"
                            fontSize={{ base: "12px", md: "16px" }}
                            py={5}
                            px={4}
                            borderRadius="full"
                            letterSpacing="1px"
                            textTransform="uppercase"
                            boxShadow="inset 0 2px 8px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.5)"
                            _hover={{ bg: "zombieland.cta2orange", color: "zombieland.white" }}
                            aria-label="Réserver une visite à Zombieland"
                        >
                            → Réserver maintenant
                        </Button>
                    )}
                </Box>
            ) : (
                <>
                    {currentItems.map((reservation: Reservation) => (
                        <Box
                            key={reservation.id_RESERVATION}
                            mb={4}
                            p={6}
                            w="100%"
                            maxW="500px"
                            borderRadius="md"
                            bg="rgba(0,0,0,0.3)"
                            boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
                            border="2px solid"
                            borderColor="zombieland.primary"
                            transition="all 0.3s ease"
                            _hover={{
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                                borderColor: "zombieland.cta1orange",
                                bg: "rgba(0,0,0,0.5)"
                            }}
                            cursor="pointer"
                        >
                            <Text color="zombieland.white" fontFamily="body" fontWeight="300" mb={1}>
                                - Date : {new Date(reservation.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </Text>
                            <Text color="zombieland.white" fontFamily="body" fontWeight="300" mb={1}>
                                - Billets : {reservation.nb_tickets}
                            </Text>
                            <Text color="zombieland.white" fontFamily="body" fontWeight="300" mb={1}>
                                - Montant : {reservation.status === 'CANCELLED'
                                    ? '👣 Remboursé'
                                    : `${Number(reservation.total_amount).toFixed(2)} €`}
                            </Text>
                            <Text color="zombieland.white" fontFamily="body" fontWeight="300" mb={4}>
                                - Statut : {reservation.status}
                            </Text>

                            {new Date(reservation.date) >= new Date() && reservation.status !== 'CANCELLED' && (
                                <Flex justifyContent="flex-end">
                                    <Button
                                        onClick={() => {
                                            if (currentUser?.role === 'ADMIN') {
                                                setReservationToCancel(reservation.id_RESERVATION)
                                            } else {
                                                handleCancelClick(reservation)
                                            }
                                        }}
                                        bgImage={`url(${bgBouton})`}
                                        bgSize="cover"
                                        bgPosition="center"
                                        color="zombieland.secondary"
                                        fontFamily="body"
                                        fontWeight="bold"
                                        fontSize={{ base: "12px", md: "14px" }}
                                        py={3}
                                        px={4}
                                        borderRadius="full"
                                        boxShadow="inset 0 2px 8px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.5)"
                                        _hover={{ opacity: 0.8 }}
                                        aria-label={`Annuler la réservation du ${new Date(reservation.date).toLocaleDateString('fr-FR')}`}
                                    >
                                        Annuler
                                    </Button>
                                </Flex>
                            )}
                        </Box>
                    ))}

                    <Flex mt={6} gap={4} alignItems="center" justifyContent="center">
                        <Button
                            size="sm"
                            variant="outline"
                            color="zombieland.white"
                            borderColor="zombieland.primary"
                            _hover={{ bg: "zombieland.primary", color: "black" }}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            isDisabled={currentPage === 1}
                            aria-label="Page précédente"
                        >
                            Précédent
                        </Button>
                        <Text color="zombieland.white" fontSize="sm">
                            Page {currentPage} sur {totalPages || 1}
                        </Text>
                        <Button
                            size="sm"
                            variant="outline"
                            color="zombieland.white"
                            borderColor="zombieland.primary"
                            _hover={{ bg: "zombieland.primary", color: "black" }}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            isDisabled={currentPage === totalPages || totalPages === 0}
                            aria-label="Page suivante"
                        >
                            Suivant
                        </Button>
                    </Flex>
                </>
            )}

            {message && (
                <Text mt={4} textAlign="center" fontFamily="body" fontWeight="300" color="zombieland.white">
                    {message}
                </Text>
            )}

            <InfoModal
                isOpen={blockedMessage !== null}
                onClose={() => setBlockedMessage(null)}
                title="Annulation impossible"
                message={blockedMessage ?? ""}
            />
            <ConfirmModal
                isOpen={reservationToCancel !== null}
                onClose={() => {
                    setReservationToCancel(null)
                    setCancelError('')
                }}
                title="Annuler la réservation"
                message="Voulez-vous vraiment annuler cette réservation ? Cette action est irréversible."
                errorMessage={cancelError}
                onConfirm={(password) => {
                    if (reservationToCancel) {
                        handleCancel(reservationToCancel, password)
                    }
                }}
            />
            <InfoModal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false)
                    setTimeout(() => {
                        const destination = (isAdmin && id)
                            ? `/admin/members/${id}`
                            : '/my-account/reservations'
                        navigate(destination)
                    }, 300)
                }}
                title="Annulation confirmée"
                message="Votre réservation a été annulée avec succès. Vous allez être redirigé."
            />
        </Box>
    )

    // Admin layout — with sidebar
    if (isAdmin) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                minHeight="100vh"
                bgImage={`url(${barbed})`}
                bgSize="cover"
                bgRepeat="no-repeat"
                bgAttachment="fixed"
                bgPosition="center top"
                w="100%"
                overflowX="hidden"
                overflowY="auto"
            >
                <Header />
                <Flex flex="1">
                    {/* LEFT COLUMN — sidebar */}
                    <Box
                        width={{ base: "0px", lg: "250px" }}
                        minWidth={{ base: "0px", lg: "250px" }}
                        overflow="hidden"
                        transition="width 0.3s ease, min-width 0.3s ease"
                        borderRight="1px solid rgba(255,255,255,0.1)"
                    >
                        <AdminMenu />
                    </Box>
                    {/* RIGHT COLUMN — content */}
                    <Box flex="1" minWidth="0">
                        {pageContent}
                    </Box>
                </Flex>
                <Footer />
            </Box>
        )
    }

    // Public layout
    return (
        <PageBackground bgImage={bgImage}>
            <Header />
            {pageContent}
            <Footer />
        </PageBackground>
    )
}


export default MyReservations