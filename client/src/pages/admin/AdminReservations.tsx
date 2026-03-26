import { useState, useEffect } from "react";
import axios from "axios";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_URL } from "@/config/api";
import type { Reservation } from "@/types/Reservations";
import { Badge, Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Spinner, Text } from "@chakra-ui/react";
import AdminTable from "@/components/AdminTable";
import bgImage from '../../assets/bgadminpage.png'
import ConfirmModal from "@/components/ConfirmModal";
import AdminMenu from "@/components/AdminNavlinkMenu";



// Admin page to manage reservations: list, filter by status, and cancel reservations

const AdminReservations = () => {
    // State to store the list of reservations from the API
    const [reservations, setReservations] = useState<Reservation[]>([]);
    // State to track loading status while fetching data
    const [loading, setLoading] = useState(true);
    // State to store error message if the API call fails
    const [error, setError] = useState<string | null>(null);
    // State to filter reservations by status (All, CONFIRMED, CANCELLED)
    const [filterStatus, setFilterStatus] = useState<string>('All');
    // State to store the id of the reservation to cancel (opens the confirmation modal)
    const [reservationToCancel, setReservationToCancel] = useState<number | null>(null)

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
    const filteredReservations = reservations
        .filter(r => filterStatus === "All" || r.status === filterStatus)
        .sort((a, b) => a.id_RESERVATION - b.id_RESERVATION)
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
                    width={30}
                    minWidth="250px"
                    maxWidth="350px"
                    borderRight="1px solid rgba(255,255,255,0.1)"

                >
                    <AdminMenu />
                </Box>

                <Box flex="1" p={3} pt="100px" pb="100px" maxW="1000px" mx="auto" w="100%">

                    <Text fontWeight="bold" color="zombieland.white" mb={6} textAlign="center" fontFamily="heading" fontSize="54px">
                        Gestion des réservations
                    </Text>

                    {/* Filter button */}
                    <Flex justifyContent={{ base: "center", lg: "flex-end" }} mb={6}>
                        <Menu>
                            <MenuButton
                                color="zombieland.white"
                                px={4}
                                py={2}
                                border="2px solid"
                                borderColor="zombieland.primary"
                                borderRadius="md"
                                transition="all 0.3s ease"
                                _hover={{
                                    borderColor: "zombieland.cta1orange",
                                    color: "zombieland.cta1orange"
                                }}
                            >
                                Filtrer par status
                            </MenuButton>
                            <MenuList bg="#1a1a1a" border="1px solid #333">
                                <MenuItem bg="#1a1a1a" color="white" _hover={{ bg: "#333" }} onClick={() => setFilterStatus("All")}>Tous</MenuItem>
                                <MenuItem bg="#1a1a1a" color="white" _hover={{ bg: "#333" }} onClick={() => setFilterStatus("CONFIRMED")}>Confirmer</MenuItem>
                                <MenuItem bg="#1a1a1a" color="white" _hover={{ bg: "#333" }} onClick={() => setFilterStatus("CANCELLED")}>Annuler</MenuItem>
                            </MenuList>
                        </Menu>
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
                            columns={[
                                {
                                    header: "ID",
                                    render: (r) => r.id_RESERVATION
                                },
                                {
                                    header: "Membre",
                                    render: (r) => r.id_USER
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