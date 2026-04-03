// Admin page to manage reservations: list, filter, edit and delete
import { useEffect, useState } from "react";
import {
    Box, Text, Button, Flex, Spinner,
    Badge, Heading,
    Input,
} from "@chakra-ui/react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminTable from "@/components/AdminTable";
import AdminMenu from "@/components/AdminNavlinkMenu";
import labodashboard from "../../assets/labodashboard.webp"
import type { Reservation } from "@/types/Reservations";
import axiosInstance from "@/lib/axiosInstance";
import { API_URL } from "@/config/api";
import ConfirmModal from "@/components/ConfirmModal";
import { useLocation, useNavigate } from "react-router-dom";

const AdminReservations = () => {
    const [sort, setSort] = useState({ by: "name", direction: "asc" })

    const [search, setSearch] = useState("")
    //State to store the total of attractions
    const [attractions, setAttractions] = useState(Number);
    //State to store the total of Members
    const [users, setUsers] = useState(String);
    // State to store the list of reservations from the API
    const [reservations, setReservations] = useState<Reservation[]>([]);
    // State to track loading status while fetching data
    const [loading, setLoading] = useState(true);
    // State to store error message if the API call fails
    const [error, setError] = useState<string | null>(null);
    // State to store the id of the reservation to cancel (opens the confirmation modal)
    const [reservationToCancel, setReservationToCancel] = useState<number | null>(null)
    const navigate = useNavigate()
    const location = useLocation()
    // x

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
                setReservations(response.data);

                // Set loading to false once data is received
                setLoading(false)
            } catch (error) {
                // Display error message if the API call fails
                setError("Erreur lors du chargement")
            }
        };
        // Call the function
        axiosReservation()

    }, [location]); // Empty dependency array: runs only once on mount

    // Function to update the status of a reservation via PATCH request
    // id: the reservation id to update
    // status: the new status ("CONFIRMED" or "CANCELLED")
    const handleCancel = async (id: number, password: string) => {
        try {
        await axiosInstance.delete(`${API_URL}/api/reservations/${id}`, {
            data: { password },
            withCredentials: true
        })
        const response = await axiosInstance.get(`${API_URL}/api/reservations`, { withCredentials: true })
        setReservations(response.data)
    } catch (error) {
        setError("Erreur lors de l'annulation")
    }
}

    //fetch all attractions
    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                const res = await axiosInstance.get(`${API_URL}/api/attractions`);
                setAttractions(res.data.length);
            } catch (err) {
                console.error("Erreur récupération attractions");
            }
        };

        fetchAttractions();
    }, [location]);
    // const totalAttractions = attractions.length;

    //fetch all users
    useEffect(() => {
        axiosInstance
            .get(`${API_URL}/api/users`, { withCredentials: true })
            .then(res => setUsers(res.data.length))
            .catch(() => console.error("Erreur récupération utilisateurs"));
    }, [location]);




    //  CALCUL REVENUS total
    if (!Array.isArray(reservations)) return null;

    const totalAmount = reservations.reduce(
        (sum, r) => sum + Number(r.total_amount),
        0
    );
    const filterTool = search.trim().toLowerCase()

    const filteredReservations = reservations
        .filter(r => {
            const fullName = `${r.user?.firstname ?? ""} ${r.user?.lastname ?? ""}`.toLowerCase()

            return (
                fullName.includes(filterTool) ||
                String(r.id_USER).includes(filterTool) ||
                r.date.toLowerCase().includes(filterTool) ||
                String(r.nb_tickets).includes(filterTool) ||
                r.status.toLowerCase().includes(filterTool) ||
                r.total_amount.includes(filterTool)
            )
        })
        .sort((a, b) => {
            const dir = sort.direction === "asc" ? 1 : -1

            switch (sort.by) {
                case "name":
                    return (
                        `${a.user.firstname} ${a.user.lastname}`
                            .localeCompare(`${b.user.firstname} ${b.user.lastname}`)
                    ) * dir

                case "member":
                    return (a.id_USER - b.id_USER) * dir

                case "date":
                    return a.date.localeCompare(b.date) * dir

                case "tickets":
                    return (a.nb_tickets - b.nb_tickets) * dir

                case "status":
                    return a.status.localeCompare(b.status) * dir

                case "total":
                    return (Number(a.total_amount) - Number(b.total_amount)) * dir

                default:
                    return 0
            }
        })
    const lastReservations = filteredReservations.slice(-4).reverse();
    const handleSortChange = (by: "name" | "member" | "date" | "tickets" | "status" | "total") => {
        if (sort.by === by) {
            setSort({ by, direction: sort.direction === "asc" ? "desc" : "asc" })
        } else {
            setSort({ by, direction: "asc" })
        }
    }

    const headerToField = {
        "Nom": "name",
        "N° Membre": "member",
        "Date": "date",
        "Billets": "tickets",
        "Statut": "status",
        "Total": "total"
    } as const


    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            bgAttachment="fixed"
            bgImage={`url(${labodashboard})`}
            bgSize="cover"
            bgRepeat="no-repeat"
            bgPosition="center top"
            w="100%"
            overflow="hidden"
        >
            <Header />

            {/* MAIN LAYOUT : sidebar + content */}
            <Flex flex="1">

                {/* LEFT SIDEBAR — 30% */}
                <Box
                    display={{ base: 'none', lg: 'block' }}
                    width={30}
                    minWidth="250px"
                    maxWidth="350px"
                    borderRight="1px solid rgba(255,255,255,0.1)"

                >
                    <AdminMenu />
                </Box>
                {/* RIGHT CONTENT — 70% */}
                <Box width={70} flex="1" px={10} pt="60px">
                    <Heading
                        fontWeight="bold"
                        color="zombieland.white"
                        textAlign="center"
                        fontFamily="heading"
                        fontSize="54px"
                        mt={6}
                        mb={8}
                    >
                        Zombieland Admin
                    </Heading>
                    <Heading
                        fontWeight="bold"
                        color="zombieland.white"
                        textAlign="left"
                        fontFamily="body"
                        fontSize="24px"
                        mb={8}
                    >
                        Admin / Dashboard
                    </Heading>
                    {/* the flex put 4 cards on same line*/}
                    <Flex
                        wrap="wrap"
                        gap="6"
                        justify={{ base: "center", lg: "center" }}
                        flexDirection="row"
                        w="100%"
                    >
                        {/* Description and details of 1 card*/}
                        <Box
                            onClick={() => navigate('/admin/reservations')}
                            w={{ base: "100%", md: "45%", lg: "22%" }}
                            h="300px"
                            bg="rgba(0, 0, 0, 0.5)"
                            border="2px"
                            _hover={{
                                transform: "translateY(-3px)",
                                boxShadow: "0 8px 20px rgba(250, 235, 220, 0.2)",
                                opacity: 0.9
                            }}
                        >
                            {/* 2 flex text between 1 flex */}
                            <Flex direction="column" justify="space-between" h="100%">
                                <Flex justify="center" mt={2}  >
                                    <Text fontSize="60" color="zombieland.white" fontWeight="extrabold">
                                        {reservations.length}
                                    </Text>
                                </Flex>

                                <Flex justify="center" >
                                    <Text fontSize="45" color="zombieland.white" fontFamily="heading" >
                                        Réservations
                                    </Text>
                                </Flex>
                            </Flex>
                        </Box >



                        <Box
                            onClick={() => navigate('/admin/members')}
                            w={{ base: "100%", md: "45%", lg: "22%" }}
                            h="300px"
                            bg="rgba(0, 0, 0, 0.5)"
                            border="2px"
                            _hover={{
                                transform: "translateY(-3px)",
                                boxShadow: "0 8px 20px rgba(250, 235, 220, 0.2)",
                                opacity: 0.9
                            }}

                        >
                            {/* 2 flex text between 1 flex */}
                            <Flex direction="column" justify="space-between" h="100%">
                                <Flex justify="center" mt={2}>
                                    <Text fontSize="60" color="zombieland.white" fontWeight="extrabold">
                                        {users}
                                    </Text>
                                </Flex>

                                <Flex justify="center" >
                                    <Text fontSize="45" color="zombieland.white" fontFamily="heading" >
                                        Membres
                                    </Text>
                                </Flex>
                            </Flex>
                        </Box>
                        <Box
                            onClick={() => navigate('/admin/attractions')}
                            w={{ base: "100%", md: "45%", lg: "22%" }}
                            h="300px"
                            bg="rgba(0, 0, 0, 0.5)"
                            border="2px"
                            _hover={{
                                transform: "translateY(-3px)",
                                boxShadow: "0 8px 20px rgba(250, 235, 220, 0.2)",
                                opacity: 0.9
                            }}
                        >
                            {/* 2 flex text between 1 flex */}
                            <Flex direction="column" justify="space-between" h="100%" >
                                <Flex justify="center" mt={2}>
                                    <Text fontSize="60" color="zombieland.white" fontWeight="extrabold">
                                        {attractions}
                                    </Text>
                                </Flex>

                                <Flex justify="center" >
                                    <Text fontSize="45" color="zombieland.white" fontFamily="heading" >
                                        Attractions
                                    </Text>
                                </Flex>
                            </Flex>


                        </Box>
                        <Box
                            w={{ base: "100%", md: "45%", lg: "22%" }}
                            h="300px"
                            bg="rgba(0, 0, 0, 0.5)"
                            border="2px"
                            onClick={() => navigate('/admin/price')}
                            _hover={{
                                transform: "translateY(-3px)",
                                boxShadow: "0 8px 20px rgba(250, 235, 220, 0.2)",
                                opacity: 0.9
                            }}

                        >
                            {/* 2 flex text between 1 flex */}
                            <Flex direction="column" justify="space-between" h="100%">
                                <Flex justify="center" mt={2}>
                                    <Text fontSize="60" color="zombieland.white" fontWeight="extrabold">
                                        {`${totalAmount.toFixed(2)} €`}
                                    </Text>
                                </Flex>

                                <Flex justify="center" >
                                    <Text fontSize="45" color="zombieland.white" fontFamily="heading" >
                                        Total revenus
                                    </Text>
                                </Flex>
                            </Flex>


                        </Box>
                    </Flex>
                    <Flex justifyContent={{ base: "center", lg: "flex-end" }} mt={8} mb={6}>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher une reservation..."
                            color="zombieland.white"
                            borderColor="zombieland.primary"
                            bg="#476182"
                            mb={6}
                        />
                    </Flex>

                    <Heading
                        fontWeight="bold"
                        color="zombieland.white"
                        textAlign="center"
                        fontFamily="heading"
                        fontSize="30px"
                        mb={10}
                        mt={10}
                    >
                        Gestion des réservations
                    </Heading>

                    {/* Loading spinner */}
                    {loading && (
                        <Flex justify="center" mt={10}>
                            <Spinner color="zombieland.primary" size="xl" />
                        </Flex>
                    )}

                    {error && <Text color="red.400">{error}</Text>}
                    <Box mb={10}>
                        {/* Reservations table */}
                        {!loading && (
                            <AdminTable
                                data={lastReservations}
                                onRowClick={(r) => navigate(`/admin/members/${r.id_USER}/reservations?reservationId=${r.id_RESERVATION}`)}
                                onHeaderClick={(header) => {
                                    const field = headerToField[header as keyof typeof headerToField]
                                    if (field) handleSortChange(field)
                                }}

                                columns={[
                                    {
                                        header: "Nom",
                                        render: (r) => r.user
                                            ? `${r.user.firstname} ${r.user.lastname}`
                                            : "Utilisateur inconnu"
                                    },
                                    {
                                        header: "N° Membre",
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
                                        header: "Total",
                                        render: (r) => (
                                            <Text > {r.total_amount} €</Text>)
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
                                            </Flex >
                                        )
                                    }
                                ]}
                            />
                        )}
                    </Box>
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

export default AdminReservations;