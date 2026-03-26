import { useState, useEffect } from "react";
import axios from "axios";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_URL } from "@/config/api";
import type { Reservation } from "@/types/Reservations";
import { Badge, Box, Button, Flex, Input, Spinner, Text } from "@chakra-ui/react";
import AdminTable from "@/components/AdminTable";
import bgImage from '../../assets/bgadminpage.png'
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
    // Navigate hook
    const navigate = useNavigate()

    // Fetch all reservations from the API when the component mounts
    useEffect(() => {
        const axiosReservation = async () => {
            try {
                // GET request to retrieve all reservations (admin only route)
                // withCredentials: true sends the httpOnly cookie for authentication
                const response = await axios.get(`${API_URL}/api/reservations`,
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

    // Function to update the status of a reservation via PATCH request
    // id: the reservation id to update
    // status: the new status ("CONFIRMED" or "CANCELLED")
    const handleStatusChange = async (id: number, status: string) => {
        // Send PATCH request to update the reservation status
        // 1st arg: URL with reservation id
        // 2nd arg: body with the new status
        // 3rd arg: config with credentials for cookie authentication
        await axios.patch(`${API_URL}/api/reservations/${id}`,
            { status },
            { withCredentials: true }
        )
        // Update the local state to reflect the change without refetching
        // .map() creates a new array where only the modified reservation has its status changed
        setReservations(reservations.map(r =>
            r.id_RESERVATION === id ? { ...r, status } : r
        ))
    }

    // Filter reservations by status and sort by id (ascending)
    // If filterStatus is "All", show all reservations
    // Otherwise, show only reservations matching the selected status
    const filterTool = search.trim().toLowerCase()
    const filteredReservations = reservations
        .filter(r =>
            String(r.id_RESERVATION).includes(filterTool) ||
            String(r.nb_tickets).includes(filterTool) ||
            r.user?.email.toLowerCase().includes(filterTool) ||
            r.status.toLowerCase().includes(filterTool)
        )
        .sort((a, b) => {
            if (sort.by === "date") return (new Date(a.date).getTime() - new Date(b.date).getTime()) * (sort.direction === "asc" ? 1 : -1)
            if (sort.by === "nb_tickets") return (a.nb_tickets - b.nb_tickets) * (sort.direction === "asc" ? 1 : -1)
            if (sort.by === "status") return a.status.localeCompare(b.status) * (sort.direction === "asc" ? 1 : -1)
            if (sort.by === "email") return (a.user?.email ?? "").localeCompare(b.user?.email ?? "") * (sort.direction === "asc" ? 1 : -1)
            return (a.id_RESERVATION - b.id_RESERVATION) * (sort.direction === "asc" ? 1 : -1)
        })

    const handleSortChange = (by: "id_RESERVATION" | "date" | "nb_tickets" | "status" | "email") => {
        if (sort.by === by) {
            setSort({ by, direction: sort.direction === "asc" ? "desc" : "asc" })
        } else {
            setSort({ by, direction: "asc" })
        }
    }

    const headerToField = {
        "ID": "id_RESERVATION",
        "Membre": "email",
        "Date": "date",
        "Billets": "nb_tickets",
        "Statut": "status"
    } as const

    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            bgAttachment="fixed"
            bgImage={`url(${bgImage})`}
            bgSize="cover"
        >
            <Header />
            {/* MAIN LAYOUT : sidebar + content */}
            <Flex flex="1">

                {/* LEFT SIDEBAR — 30% */}
                <Box
                    display={{ base: 'none', lg: 'block' }}
                    minWidth="240px"
                    maxWidth="240px"
                    borderRight="1px solid rgba(255,255,255,0.1)"
                >
                    <AdminMenu />
                </Box>

                <Box flex="1" p={3} pt="100px" pb="100px" maxW="1000px" mx="auto" w="100%">

                    <Text fontWeight="bold" color="zombieland.white" mb={6} textAlign="center" fontFamily="heading" fontSize="54px">
                        Gestion des réservations
                    </Text>

                    {/* Searchbar */}
                    <Flex justifyContent={{ base: "center", lg: "flex-end" }} mb={6}>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher une réservation..."
                            color="zombieland.white"
                            borderColor="zombieland.primary"
                            bg="rgba(0,0,0,0.3)"
                            mb={6}
                        />
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
                            onRowClick={(r) => navigate(`/admin/members/${r.id_USER}`)}
                            columns={[
                                {
                                    header: "ID",
                                    render: (r) => r.id_RESERVATION
                                },
                                {
                                    header: "Membre",
                                    render: (r) => r.user?.email ?? "—"
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
                                    header: "Statut",
                                    render: (r) => (
                                        <Badge colorScheme={r.status === "CONFIRMED" ? "green" : "red"}>
                                            {r.status}
                                        </Badge>
                                    )
                                },
                                {
                                    header: "Actions",
                                    render: (r) => (
                                        <Flex gap={3}>
                                            {r.status === "CONFIRMED" && (
                                                <Button
                                                    size="sm"
                                                    bg="#8C6E21"
                                                    color="white"
                                                    _hover={{ bg: "#6e5519" }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setReservationToCancel(r.id_RESERVATION)
                                                    }}
                                                >
                                                    Annuler
                                                </Button>
                                            )}
                                            {r.status === "CANCELLED" && (
                                                <Text color="red.400" fontWeight="bold">Annulée</Text>
                                            )}
                                        </Flex>
                                    )
                                }
                            ]}
                        />
                    )}
                </Box>
                {/* Confirmation modal: opens when the admin clicks "Annuler" on a reservation */}
                {/* The admin must enter their password to confirm the cancellation */}
                {/* isOpen: true when a reservation id is stored in reservationToCancel */}
                {/* onClose: resets the state to null, closing the modal */}
                {/* onConfirm: calls handleStatusChange with "CANCELLED" status then closes the modal */}
                {/* The password parameter comes from the modal input but is not sent to the API */}
                {/* It serves as a confirmation step to prevent accidental cancellations */}
                <ConfirmModal
                    isOpen={reservationToCancel !== null}
                    onClose={() => setReservationToCancel(null)}
                    title="Annuler la réservation"
                    message="Voulez-vous vraiment annuler cette réservation ? Cette action est irréversible."
                    onConfirm={() => {
                        if (reservationToCancel) handleStatusChange(reservationToCancel, "CANCELLED")
                        setReservationToCancel(null)
                    }}
                />
            </Flex>
            <Footer />
        </Box>
    )
}


export default AdminReservations