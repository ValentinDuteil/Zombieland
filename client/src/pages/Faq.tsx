// FAQ and legal mentions page

import { Box, Heading, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import bgImage from '../assets/bg-image.png'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Faq() {
    return (
        <Box
            minH="100vh"
            bgImage={`url(${bgImage})`}
            bgSize="cover"
            bgPosition="center"
            bgAttachment="fixed"
            display="flex"
            flexDirection="column"
            pt="80px"
        >
            <Header />

            <Box
                flex={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
                px={8}
                py={10}
                minH="70vh"
            >
                {/* FAQ Section */}
                <Heading
                    mb={8}
                    textAlign="center"
                    fontFamily="heading"
                    fontSize="54px"
                    color="zombieland.white"
                >
                    FAQ
                </Heading>

                <Box w="100%" maxW="700px" mb={16}>
                    <Accordion allowToggle>

                        <AccordionItem border="none" mb={2}>
                            <AccordionButton
                                bg="rgba(0,0,0,0.3)"
                                color="zombieland.white"
                                borderRadius="md"
                                _hover={{ bg: "rgba(0,0,0,0.5)" }}
                                _expanded={{ bg: "rgba(71,97,130,0.4)", borderBottomRadius: "none" }}
                            >
                                <Box flex="1" textAlign="left" fontFamily="body" fontWeight="300">
                                    Quels sont les horaires d'ouverture ?
                                </Box>
                                <AccordionIcon color="zombieland.white" />
                            </AccordionButton>
                            <AccordionPanel bg="rgba(0,0,0,0.2)" color="zombieland.white" fontFamily="body" fontWeight="300" borderBottomRadius="md">
                                Du lundi au vendredi de 10h à 21h, le week-end de 10h à 23h.
                            </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none" mb={2}>
                            <AccordionButton
                                bg="rgba(0,0,0,0.3)"
                                color="zombieland.white"
                                borderRadius="md"
                                _hover={{ bg: "rgba(0,0,0,0.5)" }}
                                _expanded={{ bg: "rgba(71,97,130,0.4)", borderBottomRadius: "none" }}
                            >
                                <Box flex="1" textAlign="left" fontFamily="body" fontWeight="300">
                                    Quel est le prix d'un billet ?
                                </Box>
                                <AccordionIcon color="zombieland.white" />
                            </AccordionButton>
                            <AccordionPanel bg="rgba(0,0,0,0.2)" color="zombieland.white" fontFamily="body" fontWeight="300" borderBottomRadius="md">
                                Le billet d'entrée est au tarif unique de 66,66€. Les billets sont disponiles en ligne dans la rubrique "Réserver".
                            </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none" mb={2}>
                            <AccordionButton
                                bg="rgba(0,0,0,0.3)"
                                color="zombieland.white"
                                borderRadius="md"
                                _hover={{ bg: "rgba(0,0,0,0.5)" }}
                                _expanded={{ bg: "rgba(71,97,130,0.4)", borderBottomRadius: "none" }}
                            >
                                <Box flex="1" textAlign="left" fontFamily="body" fontWeight="300">
                                    Y a-t-il un parking ?
                                </Box>
                                <AccordionIcon color="zombieland.white" />
                            </AccordionButton>
                            <AccordionPanel bg="rgba(0,0,0,0.2)" color="zombieland.white" fontFamily="body" fontWeight="300" borderBottomRadius="md">
                                Un parking est disponible à l'entrée du parc dans la limite des places disponibles.
                            </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none" mb={2}>
                            <AccordionButton
                                bg="rgba(0,0,0,0.3)"
                                color="zombieland.white"
                                borderRadius="md"
                                _hover={{ bg: "rgba(0,0,0,0.5)" }}
                                _expanded={{ bg: "rgba(71,97,130,0.4)", borderBottomRadius: "none" }}
                            >
                                <Box flex="1" textAlign="left" fontFamily="body" fontWeight="300">
                                    Puis-je annuler ma réservation ?
                                </Box>
                                <AccordionIcon color="zombieland.white" />
                            </AccordionButton>
                            <AccordionPanel bg="rgba(0,0,0,0.2)" color="zombieland.white" fontFamily="body" fontWeight="300" borderBottomRadius="md">
                                Oui, l'annulation est possible jusqu'à 10 jours avant la date de visite depuis votre espace personnel.
                            </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none" mb={2}>
                            <AccordionButton
                                bg="rgba(0,0,0,0.3)"
                                color="zombieland.white"
                                borderRadius="md"
                                _hover={{ bg: "rgba(0,0,0,0.5)" }}
                                _expanded={{ bg: "rgba(71,97,130,0.4)", borderBottomRadius: "none" }}
                            >
                                <Box flex="1" textAlign="left" fontFamily="body" fontWeight="300">
                                    Que faire en cas de météo défavorable ?
                                </Box>
                                <AccordionIcon color="zombieland.white" />
                            </AccordionButton>
                            <AccordionPanel bg="rgba(0,0,0,0.2)" color="zombieland.white" fontFamily="body" fontWeight="300" borderBottomRadius="md">
                                Le parc reste ouvert par mauvais temps. Des ralentissements d'attractions peuvent cependant survenir pour votre sécurité.
                            </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none" mb={2}>
                            <AccordionButton
                                bg="rgba(0,0,0,0.3)"
                                color="zombieland.white"
                                borderRadius="md"
                                _hover={{ bg: "rgba(0,0,0,0.5)" }}
                                _expanded={{ bg: "rgba(71,97,130,0.4)", borderBottomRadius: "none" }}
                            >
                                <Box flex="1" textAlign="left" fontFamily="body" fontWeight="300">
                                    Le parc est-il accessible aux personnes handicapées ?
                                </Box>
                                <AccordionIcon color="zombieland.white" />
                            </AccordionButton>
                            <AccordionPanel bg="rgba(0,0,0,0.2)" color="zombieland.white" fontFamily="body" fontWeight="300" borderBottomRadius="md">
                                Oui, le parc est entièrement accessible aux personnes à mobilité réduite.
                            </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none" mb={2}>
                            <AccordionButton
                                bg="rgba(0,0,0,0.3)"
                                color="zombieland.white"
                                borderRadius="md"
                                _hover={{ bg: "rgba(0,0,0,0.5)" }}
                                _expanded={{ bg: "rgba(71,97,130,0.4)", borderBottomRadius: "none" }}
                            >
                                <Box flex="1" textAlign="left" fontFamily="body" fontWeight="300">
                                    Y a-t-il un âge minimum pour les attractions ?
                                </Box>
                                <AccordionIcon color="zombieland.white" />
                            </AccordionButton>
                            <AccordionPanel bg="rgba(0,0,0,0.2)" color="zombieland.white" fontFamily="body" fontWeight="300" borderBottomRadius="md">
                                Il n'y a pas d'âge minimum pour accéder au parc. Cependant, certaines attractions sont soumises à une taille minimum, indiquée à l'entrée de chaque attraction.
                            </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none" mb={2}>
                            <AccordionButton
                                bg="rgba(0,0,0,0.3)"
                                color="zombieland.white"
                                borderRadius="md"
                                _hover={{ bg: "rgba(0,0,0,0.5)" }}
                                _expanded={{ bg: "rgba(71,97,130,0.4)", borderBottomRadius: "none" }}
                            >
                                <Box flex="1" textAlign="left" fontFamily="body" fontWeight="300">
                                    Comment contacter le service client ?
                                </Box>
                                <AccordionIcon color="zombieland.white" />
                            </AccordionButton>
                            <AccordionPanel bg="rgba(0,0,0,0.2)" color="zombieland.white" fontFamily="body" fontWeight="300" borderBottomRadius="md">
                                Par email à contact@au-dela-des-morts.fr ou par téléphone au 06 66 66 66 66.
                            </AccordionPanel>
                        </AccordionItem>

                    </Accordion>
                </Box>

                {/* Legal mentions section */}
                <Heading
                    mb={8}
                    textAlign="center"
                    fontFamily="heading"
                    fontSize="54px"
                    color="zombieland.white"
                >
                    Mentions légales
                </Heading>

                <Box w="100%" maxW="700px" mb={10}>

                    <Box mb={4} p={6} borderRadius="md" bg="rgba(0,0,0,0.3)" borderLeft="3px solid" borderColor="zombieland.primary">
                        <Text color="zombieland.white" fontFamily="body" fontWeight="bold" mb={2}>Éditeur du site</Text>
                        <Text color="zombieland.white" fontFamily="body" fontWeight="300">Zombieland SAS — Capital social : 50 000€</Text>
                        <Text color="zombieland.white" fontFamily="body" fontWeight="300">Siège social : 13 Rue des Morts-Vivants, 75013 Paris</Text>
                        <Text color="zombieland.white" fontFamily="body" fontWeight="300">RCS Paris : 123 456 789</Text>
                        <Text color="zombieland.white" fontFamily="body" fontWeight="300">Directeur de publication : Petval Daphyohan</Text>
                    </Box>

                    <Box mb={4} p={6} borderRadius="md" bg="rgba(0,0,0,0.3)" borderLeft="3px solid" borderColor="zombieland.primary">
                        <Text color="zombieland.white" fontFamily="body" fontWeight="bold" mb={2}>Hébergement</Text>
                        <Text color="zombieland.white" fontFamily="body" fontWeight="300">OVH SAS — 2 rue Kellermann, 59100 Roubaix</Text>
                    </Box>

                    <Box mb={4} p={6} borderRadius="md" bg="rgba(0,0,0,0.3)" borderLeft="3px solid" borderColor="zombieland.primary">
                        <Text color="zombieland.white" fontFamily="body" fontWeight="bold" mb={2}>Données personnelles</Text>
                        <Text color="zombieland.white" fontFamily="body" fontWeight="300">Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits : contact@au-dela-des-morts.fr</Text>
                    </Box>

                    <Box mb={4} p={6} borderRadius="md" bg="rgba(0,0,0,0.3)" borderLeft="3px solid" borderColor="zombieland.primary">
                        <Text color="zombieland.white" fontFamily="body" fontWeight="bold" mb={2}>Cookies</Text>
                        <Text color="zombieland.white" fontFamily="body" fontWeight="300">Le site utilise des cookies fonctionnels pour la gestion de votre session. Aucun cookie publicitaire n'est utilisé.</Text>
                    </Box>

                    <Box mb={4} p={6} borderRadius="md" bg="rgba(0,0,0,0.3)" borderLeft="3px solid" borderColor="zombieland.primary">
                        <Text color="zombieland.white" fontFamily="body" fontWeight="bold" mb={2}>Propriété intellectuelle</Text>
                        <Text color="zombieland.white" fontFamily="body" fontWeight="300">L'ensemble du contenu du site (textes, images, logos) est la propriété exclusive de Zombieland SAS et est protégé par le droit d'auteur.</Text>
                    </Box>

                </Box>
            </Box>

            <Footer />
        </Box>
    )
}

export default Faq