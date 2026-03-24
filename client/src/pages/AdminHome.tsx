// Admin page to manage reservations: list, filter, edit and delete
import { useEffect, useState, useRef } from "react";
import {
    Box, Text, Button, Flex, Spinner,
    AlertDialog, AlertDialogBody, AlertDialogFooter,
    AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminTable from "@/components/AdminTable";
import AdminMenu from "@/components/AdminNavlinkMenu";
import bgImage from "../assets/centrerecherche.png";
import type { Reservation } from "@types";

const AdminReservations = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [reservationToDelete, setReservationToDelete] = useState<number | null>(null);
    const cancelRef = useRef<HTMLButtonElement>(null);

    const navigate = useNavigate();

    // Fetch all reservations
    const fetchReservations = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations`, {
                credentials: "include"
            });

            if (!res.ok) {
                setError("Erreur lors de la récupération des réservations");
                setLoading(false);
                return;
            }

            const data: Reservation[] = await res.json();
            setReservations(data);
        } catch (err) {
            setError("Impossible de contacter le serveur");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    // Delete a reservation
    const handleDelete = async (id: number) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/${id}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (!res.ok) {
            setError("Erreur lors de la suppression de la réservation");
            return;
        }

        fetchReservations();
    };

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

            {/* RIGHT CONTENT — 70% */}
            <Box width={70} flex="1" px={10}>
                <Text
                    fontWeight="bold"
                    color="zombieland.white"
                    textAlign="center"
                    fontFamily="heading"
                    fontSize="54px"
                    mb={10}
                >
                    Gestion des réservations
                </Text>

                {/* Loading spinner */}
                {loading && (
                    <Flex justify="center" mt={10}>
                        <Spinner color="zombieland.primary" size="xl" />
                    </Flex>
                )}

                {error && <Text color="red.400">{error}</Text>}

                {/* Reservations table */}
                {!loading && (
                    <AdminTable
                        data={reservations}
                        onRowClick={(reservation) =>
                            navigate(`/reservations/${reservation.id_RESERVATION}`)
                        }
                        columns={[
                            {
                                header: "Numéro",
                                render: (r) => r.id_RESERVATION
                            },
                            {
                                header: "Utilisateur",
                                render: (r) => r.id_USER
                            },
                            {
                                header: "Billet",
                                render: (r) => r.id_TICKET
                            },
                            {
                                header: "Nb Tickets",
                                render: (r) => r.nb_tickets ?? "—"
                            },
                            {
                                header: "Date",
                                render: (r) =>
                                    new Date(r.date).toLocaleDateString("fr-FR")
                            },
                            {
                                header: "Montant",
                                render: (r) => `${r.total_amount} €`
                            },
                            {
                                header: "Statut",
                                render: (r) => r.status
                            },
                            {
                                header: "Actions",
                                render: (r) => (
                                    <Flex gap={3}>
                                        <Button
                                            size="sm"
                                            border="2px solid"
                                            borderColor="zombieland.primary"
                                            color="zombieland.white"
                                            bg="transparent"
                                            _hover={{
                                                borderColor: "zombieland.cta1orange",
                                                color: "zombieland.cta1orange"
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/reservations/${r.id_RESERVATION}/edit`);
                                            }}
                                        >
                                            Modifier
                                        </Button>

                                        <Button
                                            size="sm"
                                            border="2px solid"
                                            borderColor="red.500"
                                            color="red.400"
                                            bg="transparent"
                                            _hover={{ bg: "red.500", color: "white" }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setReservationToDelete(r.id_RESERVATION);
                                            }}
                                        >
                                            Supprimer
                                        </Button>
                                    </Flex>
                                )
                            }
                        ]}
                    />
                )}

                {/* Delete confirmation popup */}
                <AlertDialog
                    isOpen={reservationToDelete !== null}
                    leastDestructiveRef={cancelRef}
                    onClose={() => setReservationToDelete(null)}
                    isCentered
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent bg="#1a1a1a" border="1px solid #333">
                            <AlertDialogHeader color="zombieland.white" fontWeight="bold">
                                Supprimer la réservation
                            </AlertDialogHeader>

                            <AlertDialogBody color="gray.400">
                                Voulez-vous vraiment supprimer cette réservation ? Cette action est irréversible.
                            </AlertDialogBody>

                            <AlertDialogFooter gap={3}>
                                <Button ref={cancelRef} onClick={() => setReservationToDelete(null)}>
                                    Annuler
                                </Button>

                                <Button
                                    bg="red.500"
                                    color="white"
                                    _hover={{ bg: "red.600" }}
                                    onClick={() => {
                                        if (reservationToDelete) handleDelete(reservationToDelete);
                                        setReservationToDelete(null);
                                    }}
                                >
                                    Supprimer
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </Box>
        </Flex>

        <Footer />
    </Box>
);
}

export default AdminReservations;