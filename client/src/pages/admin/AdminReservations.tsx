import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_URL } from "@/config/api";
import type { Reservation } from "@/types/Reservations";
import { Box, Button, Flex, Heading, Input, Spinner, Text } from "@chakra-ui/react";
import AdminTable, { StatusBadge } from "@/components/AdminTable";
import barbed from '../../assets/barbed-bg.webp'
import bgAnnuler from '../../assets/bg-bouton-annuler.webp'
import ConfirmModal from "@/components/ConfirmModal";
import AdminMenu from "@/components/AdminNavlinkMenu";
import { useNavigate } from "react-router-dom";



// Admin page to manage reservations: list, filter by status, and cancel reservations

const AdminReservations = () => {
    // State to store the list of reservations from the API
    const [reservations, setReservations] = useState<Reservation[]>([]);
    // State to track loading status while fetching data
    const [loading, setLoading] = useState(true);
    // State to store error message if the API call fails
    const [error, setError] = useState<string | null>(null);
    // State to store the id of the reservation to cancel (opens the confirmation modal)
    const [reservationToCancel, setReservationToCancel] = useState<number | null>(null)
    // State to search and filter reservations
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState({ by: "id_RESERVATION", direction: "asc" })
    const [hideDeleted, setHideDeleted] = useState(true)
    // Navigate hook
    const navigate = useNavigate()

    // Fetch all reservations from the API when the component mounts
    useEffect(() => {
        const axiosReservation = async () => {
            try {
                // GET request to retrieve all reservations (admin only route)
                // withCredentials: true sends the httpOnly cookie for authentication
                const response = await axiosInstance.get(`${API_URL}/api/reservations`,
                    {
                        withCredentials: true,
                    });
                // Store the reservations data in state
                setReservations(response.data)
                // Set loading to false once data is received
                setLoading(false)
            } catch (error) {
                // Display error message if the API call fails
                setError("Erreur lors du chargement")
            }
        };
        // Call the function
        axiosReservation()
    }, []); // Empty dependency array: runs only once on mount

    // Function to update the status of a reservation via DELETE request
    const handleCancel = async (id: number, password: string) => {
        try {
            await axiosInstance.delete(`${API_URL}/api/reservations/${id}`, {
                data: { password },
                withCredentials: true
            })
            // Re-fetch pour mettre à jour le state
            const response = await axiosInstance.get(`${API_URL}/api/reservations`, { withCredentials: true })
            setReservations(response.data)
        } catch (error) {
            setError("Erreur lors de l'annulation")
        }
    }

    // Filter reservations by status and sort by id (ascending)
    const filterTool = search.trim().toLowerCase()
    const filteredReservations = reservations
        .filter(r => {
            if (hideDeleted && r.user?.deleted_at) return false
            return (
                String(r.id_RESERVATION).includes(filterTool) ||
                String(r.nb_tickets).includes(filterTool) ||
                r.user?.email.toLowerCase().includes(filterTool) ||
                r.status.toLowerCase().includes(filterTool) ||
                r.total_amount.includes(filterTool)
            )
        })
        .sort((a, b) => {
            if (sort.by === "date") return (new Date(a.date).getTime() - new Date(b.date).getTime()) * (sort.direction === "asc" ? 1 : -1)
            if (sort.by === "nb_tickets") return (a.nb_tickets - b.nb_tickets) * (sort.direction === "asc" ? 1 : -1)
            if (sort.by === "total_amount") return (Number(a.total_amount) - Number(b.total_amount)) * (sort.direction === "asc" ? 1 : -1)
            if (sort.by === "status") return a.status.localeCompare(b.status) * (sort.direction === "asc" ? 1 : -1)
            if (sort.by === "email") return (a.user?.email ?? "").localeCompare(b.user?.email ?? "") * (sort.direction === "asc" ? 1 : -1)
            return (a.id_RESERVATION - b.id_RESERVATION) * (sort.direction === "asc" ? 1 : -1)
        })

    const handleSortChange = (by: "id_RESERVATION" | "date" | "nb_tickets" | "status" | "email" | "total_amount") => {
        if (sort.by === by) {
            setSort({ by, direction: sort.direction === "asc" ? "desc" : "asc" })
        } else {
            setSort({ by, direction: "asc" })
        }
    }

    const headerToField = {
        "N° Réservation": "id_RESERVATION",
        "Membre": "email",
        "Date": "date",
        "Billets": "nb_tickets",
        "Total": "total_amount",
        "Statut": "status"
    } as const

    const currentSortHeader = Object.keys(headerToField).find(
        key => headerToField[key as keyof typeof headerToField] === sort.by
    ) ?? ""

    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            bgImage={`url(${barbed})`}
            bgSize="cover"
            bgPosition="center"
            bgRepeat="no-repeat"
            bgAttachment="fixed"
            w="100%"
            overflow="hidden"
        >
            <Header />
            {/* MAIN LAYOUT : sidebar + content */}
            <Flex flex="1">

                {/* LEFT SIDEBAR — 30% */}
                <Box
                    width={{ base: "0px", lg: "250px" }}
                    minWidth={{ base: "0px", lg: "250px" }}
                    overflow="hidden"
                    transition="width 0.3s ease, min-width 0.3s ease"
                    borderRight="1px solid rgba(255,255,255,0.1)"
                >
                    <AdminMenu />
                </Box>

                <Box
                    flex="1"
                    minWidth="0"
                    px={{ base: 4, md: 10 }}
                    pt="60px"
                    pb="100px"
                >

                    <Text fontWeight="bold" color="zombieland.white" mb={6} textAlign="center" fontFamily="heading" fontSize="54px">
                        Gestion des réservations
                    </Text>
                    <Heading
                        fontWeight="bold"
                        color="zombieland.white"
                        textAlign="left"
                        fontFamily="body"
                        fontSize="24px"
                        mb={8}
                    >
                        Admin / Réservations
                    </Heading>
                    {/* Searchbar */}
                    <Flex direction={{ base: "column", lg: "row" }} justifyContent="center" gap={3} mb={6} wrap="wrap">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher un membre..."
                            color="zombieland.white"
                            borderColor="zombieland.white"
                            bg="rgba(0,0,0,0.3)"
                            _placeholder={{ color: "zombieland.white" }}
                            flex="1"
                        />
                        <Button
                            size="sm"
                            onClick={() => setHideDeleted(s => !s)}
                            border="2px solid"
                            borderColor={hideDeleted ? "transparent" : "zombieland.cta1orange"}
                            bg="rgba(0,0,0,0.3)"
                            color="zombieland.white"
                            _hover={{ borderColor: "zombieland.cta1orange" }}
                        >
                            {hideDeleted ? "Masquer comptes supprimés" : "Afficher comptes supprimés"}
                        </Button>
                    </Flex>

                    {/* Loading spinner */}
                    {loading && (
                        <Flex justify="center" mt={10}>
                            <Spinner color="zombieland.primary" size="xl" />
                        </Flex>
                    )}

                    {error && <Text color="red.400">{error}</Text>}

                    {!loading && (
                        <AdminTable
                            data={filteredReservations}
                            onHeaderClick={(header) => {
                                const field = headerToField[header as keyof typeof headerToField]
                                if (field) handleSortChange(field)
                            }}
                            currentSortHeader={currentSortHeader}
                            currentSortDir={sort.direction as "asc" | "desc"}
                            onRowClick={(r) => navigate(`/admin/members/${r.id_USER}`)}
                            columns={[
                                {
                                    header: "N° Réservation",
                                    render: (r) => r.id_RESERVATION
                                },
                                {
                                    header: "Membre",
                                    render: (r) => (
                                        <Text fontWeight="bold" color={r.user?.deleted_at ? "gray.500" : "inherit"}>
                                            {r.user?.email ?? "Utilisateur inconnu"}
                                            {r.user?.deleted_at && <Text as="span" fontSize="10px" color="gray.500" ml={1}>(supprimé)</Text>}
                                        </Text>
                                    )
                                },
                                {
                                    header: "Date",
                                    render: (r) => new Date(r.date).toLocaleDateString('fr-FR', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                },
                                {
                                    header: "Billets",
                                    render: (r) => r.nb_tickets
                                },
                                {
                                    header: "Total",
                                    render: (r) => (
                                        <Text > {r.total_amount} €</Text>)
                                },
                                {
                                    header: "Statut",
                                    render: (r) => (
                                        <StatusBadge status={r.status} />
                                    ),
                                    hideOnMobile: true
                                },
                                {
                                    header: "Actions",
                                    render: (r) => (
                                        <Flex gap={3}>
                                            {r.status === "CONFIRMED" && !r.user?.deleted_at && (
                                                <Button
                                                    size="sm"
                                                    bgImage={`url(${bgAnnuler})`}
                                                    bgSize="120%"
                                                    bgPosition="center"
                                                    bgRepeat="no-repeat"
                                                    color="zombieland.white"
                                                    fontWeight="bold"
                                                    border="2px solid"
                                                    borderColor="zombieland.primary"
                                                    borderRadius="md"
                                                    _hover={{ opacity: 0.8, borderColor: "zombieland.cta1orange" }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setReservationToCancel(r.id_RESERVATION)
                                                    }}
                                                >
                                                    Annuler
                                                </Button>
                                            )}
                                            {r.status === "CANCELLED" && (
                                                <Text>Annulé</Text>
                                            )}
                                        </Flex>
                                    )
                                }
                            ]}
                        />
                    )}
                </Box>
                {/* Confirmation modal: opens when the admin clicks "Annuler" on a reservation */}
                <ConfirmModal
                    isOpen={reservationToCancel !== null}
                    onClose={() => setReservationToCancel(null)}
                    title="Annuler la réservation"
                    message="Voulez-vous vraiment annuler cette réservation ? Cette action est irréversible."
                    onConfirm={(password) => {
                        if (reservationToCancel) handleCancel(reservationToCancel, password)
                        setReservationToCancel(null)
                    }}
                />
            </Flex>
            <Footer />
        </Box>
    )
}


export default AdminReservations
