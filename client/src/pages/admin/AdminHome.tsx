// Admin page to manage reservations: list, filter, edit and delete
import { useEffect, useState } from "react";
import { Box, Text, Button, Flex, Spinner, Heading, Input, SimpleGrid } from "@chakra-ui/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminTable from "@/components/AdminTable";
import { StatusBadge } from "@/components/AdminTable";
import AdminMenu from "@/components/AdminNavlinkMenu";
import bgAnnuler from "../../assets/bg-bouton-annuler.webp"
import barbed from "../../assets/barbed-bg.webp"
import type { Reservation } from "@/types/Reservations";
import axiosInstance from "@/lib/axiosInstance";
import { API_URL } from "@/config/api";
import ConfirmModal from "@/components/ConfirmModal";
import { useLocation, useNavigate } from "react-router-dom";

const AdminHome = () => {
    //tate to manage sorting and search of reservations in the table
    const [sort, setSort] = useState({ by: "name", direction: "asc" })
    const [search, setSearch] = useState("")
    const [hideDeleted, setHideDeleted] = useState(true)
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
                setError("Erreur de récupération des réservations")
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
            const response = await axiosInstance.get(`${API_URL}/api/reservations`, {
                withCredentials: true
            })
            setReservations(response.data)
        } catch (error) {
            setError("Erreur lors de l'annulation")
        }
    }

    //fetch all attractions
    useEffect(() => {
        const axiosAttractions = async () => {
            try {
                const response = await axiosInstance.get(`${API_URL}/api/attractions`)
                setAttractions(response.data.length);
            } catch (err) {
                setError("Erreur de récupération des attractions")
            }
        };

        axiosAttractions();
    }, [location]);

    //fetch all users
    useEffect(() => {
        axiosInstance
            .get(`${API_URL}/api/users`, { withCredentials: true })
            .then(res => setUsers(res.data.length))
            .catch(() => setError("Erreur récupération utilisateurs"));
    }, [location]);

    //  CALCUL REVENUS total
    if (!Array.isArray(reservations)) return null

    const totalAmount = reservations.reduce(
        (sum, r) => sum + Number(r.total_amount),
        0
    );
    const filterTool = search.trim().toLowerCase()

    const filteredReservations = reservations
        .filter(r => {
            if (hideDeleted && r.user?.deleted_at) return false
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
    const lastReservations = filteredReservations.slice(-20).reverse();
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
            overflowX="hidden"
            overflowY="auto"
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
                {/* RIGHT CONTENT — 70% */}
                <Box
                    flex="1"
                    minWidth="0"
                    px={{ base: 4, md: 10 }}
                    pt="60px"
                >
                    <Heading
                        fontWeight="bold"
                        color="zombieland.white"
                        textAlign="center"
                        fontFamily="heading"
                        fontSize={{ base: "36px", md: "54px" }}
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
                    <SimpleGrid
                        columns={{ base: 2, lg: 4 }}
                        spacing="4"
                        w="100%"
                        mb={10}
                    >
                        {/* Description and details of 1 card*/}
                        <Box
                            onClick={() => navigate('/admin/reservations')}
                            h={{ base: "120px", md: "150px", lg: "180px" }}
                            bg="rgba(0, 0, 0, 0.5)"
                            border="2px solid"
                            borderColor="zombieland.primary"
                            borderRadius="md"
                            cursor="pointer"
                            _hover={{
                                transform: "translateY(-3px)",
                                boxShadow: "0 8px 20px rgba(250, 235, 220, 0.2)",
                                opacity: 0.9
                            }}
                        >
                            {/* 2 flex text between 1 flex */}
                            <Flex direction="column" justify="space-evenly" align="center" h="100%" p={2} >
                                <Text
                                    fontSize={{ base: "32px", md: "42px", lg: "52px" }}
                                    color="zombieland.white"
                                    fontWeight="extrabold"
                                    lineHeight="1"
                                >
                                    {reservations.length}
                                </Text>
                                <Text
                                    fontSize={{ base: "16px", md: "16px", lg: "20px" }}
                                    color="zombieland.white"
                                    fontFamily="heading"
                                    textAlign="center"
                                >
                                    Réservations
                                </Text>
                            </Flex>
                        </Box >



                        <Box
                            onClick={() => navigate('/admin/members')}
                            h={{ base: "120px", md: "150px", lg: "180px" }}
                            bg="rgba(0, 0, 0, 0.5)"
                            border="2px solid"
                            borderColor="zombieland.primary"
                            borderRadius="md"
                            _hover={{
                                transform: "translateY(-3px)",
                                boxShadow: "0 8px 20px rgba(250, 235, 220, 0.2)",
                                opacity: 0.9
                            }}

                        >
                            {/* 2 flex text between 1 flex */}
                            <Flex direction="column" justify="space-evenly" align="center" h="100%" p={2} >
                                <Text
                                    fontSize={{ base: "32px", md: "42px", lg: "52px" }}
                                    color="zombieland.white"
                                    fontWeight="extrabold"
                                    lineHeight="1"
                                >
                                    {users}
                                </Text>
                                <Text
                                    fontSize={{ base: "16px", md: "16px", lg: "20px" }}
                                    color="zombieland.white"
                                    fontFamily="heading"
                                    textAlign="center"
                                >
                                    Membres
                                </Text>
                            </Flex>
                        </Box>
                        <Box
                            onClick={() => navigate('/admin/attractions')}
                            h={{ base: "120px", md: "150px", lg: "180px" }}
                            bg="rgba(0, 0, 0, 0.5)"
                            border="2px solid"
                            borderColor="zombieland.primary"
                            borderRadius="md"
                            cursor="pointer"
                            _hover={{
                                transform: "translateY(-3px)",
                                boxShadow: "0 8px 20px rgba(250, 235, 220, 0.2)",
                                opacity: 0.9
                            }}
                        >
                            {/* 2 flex text between 1 flex */}
                            <Flex direction="column" justify="space-evenly" align="center" h="100%" p={2} >
                                <Text
                                    fontSize={{ base: "32px", md: "42px", lg: "52px" }}
                                    color="zombieland.white"
                                    fontWeight="extrabold"
                                    lineHeight="1"
                                >
                                    {attractions}
                                </Text>
                                <Text
                                    fontSize={{ base: "16px", md: "16px", lg: "20px" }}
                                    color="zombieland.white"
                                    fontFamily="heading"
                                    textAlign="center"
                                >
                                    Attractions
                                </Text>
                            </Flex>


                        </Box>
                        <Box
                            onClick={() => navigate('/admin/tarifs')}
                            h={{ base: "120px", md: "150px", lg: "180px" }}
                            bg="rgba(0, 0, 0, 0.5)"
                            border="2px solid"
                            borderColor="zombieland.primary"
                            borderRadius="md"
                            cursor="pointer"
                            _hover={{
                                transform: "translateY(-3px)",
                                boxShadow: "0 8px 20px rgba(250, 235, 220, 0.2)",
                                opacity: 0.9
                            }}

                        >
                            {/* 2 flex text between 1 flex */}
                            <Flex direction="column" justify="space-evenly" align="center" h="100%" p={2}>
                                <Text
                                    // Carte Total revenus uniquement
                                    fontSize={{ base: "18px", md: "28px", lg: "36px" }}
                                    color="zombieland.white"
                                    fontWeight="extrabold"
                                    lineHeight="1"
                                    textAlign="center"
                                    wordBreak="break-word"
                                >
                                    {`${totalAmount.toFixed(2)} €`}
                                </Text>
                                <Text
                                    mt={3}
                                    fontSize={{ base: "16px", md: "16px", lg: "20px" }}
                                    color="zombieland.white"
                                    fontFamily="heading"
                                    textAlign="center"
                                >
                                    Total revenus
                                </Text>
                            </Flex>
                        </Box>
                    </SimpleGrid>

                    <Heading
                        fontWeight="bold"
                        color="zombieland.white"
                        textAlign="center"
                        fontFamily="heading"
                        fontSize="30px"
                        mb={10}
                        mt={4}
                    >
                        Gestion des réservations
                    </Heading>

                    <Flex justifyContent="center" gap={3} mb={6} wrap="wrap">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher une reservation..."
                            color="zombieland.white"
                            borderColor="zombieland.white"
                            bg="rgba(0,0,0,0.3)"
                            _placeholder={{ color: "zombieland.white" }}
                            flex="1"
                        />
                        <Button
                            size="sm"
                            onClick={() => setHideDeleted(h => !h)}
                            border="2px solid"
                            borderColor={hideDeleted ? "transparent" : "zombieland.cta1orange"}
                            bg="rgba(0,0,0,0.3)"
                            color="zombieland.white"
                            _hover={{ borderColor: "zombieland.cta1orange" }}
                        >
                            {hideDeleted ? "Afficher comptes supprimés" : "Masquer comptes supprimés"}
                        </Button>
                    </Flex>

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
                                onRowClick={(r) => navigate(`/admin/members/${r.id_USER}/reservations`)}
                                onHeaderClick={(header) => {
                                    const field = headerToField[header as keyof typeof headerToField]
                                    if (field) handleSortChange(field)
                                }}
                                currentSortHeader={currentSortHeader}
                                currentSortDir={sort.direction as "asc" | "desc"}

                                columns={[
                                    {
                                        header: "Nom",
                                        render: (r) => (
                                            <Text color={r.user?.deleted_at ? "gray.500" : "inherit"}>
                                                {r.user ? `${r.user.firstname} ${r.user.lastname}` : "Utilisateur inconnu"}
                                                {r.user?.deleted_at && <Text as="span" fontSize="10px" color="gray.500" ml={1}>(supprimé)</Text>}
                                            </Text>
                                        )
                                    },
                                    {
                                        header: "N° Membre",
                                        render: (r) => r.id_USER,
                                        hideOnMobile: true
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
                                        render: (r) => r.nb_tickets,
                                        hideOnMobile: true
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
                                                    <Text></Text>
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

export default AdminHome;