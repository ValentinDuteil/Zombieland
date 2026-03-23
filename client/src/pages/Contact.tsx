// Contact page

import { Box, Heading, Text, SimpleGrid } from '@chakra-ui/react'
import bgImage from '../assets/bg-image.png'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Contact() {
    return (
        <Box
            minH="100vh"
            bgImage={`url(${bgImage})`}
            bgSize="cover"
            bgPosition="center"
            bgAttachment="fixed"
            display="flex"
            flexDirection="column"
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
                {/* Title */}
                <Heading
                    mb={12}
                    fontFamily="heading"
                    fontSize="54px"
                    textAlign="center"
                    color="zombieland.white"
                >
                    Contactez-nous
                </Heading>

                {/* Contact info */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="100%" maxW="900px">

                    <Box
                        p={8}
                        borderRadius="md"
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
                        <Text color="zombieland.cta1orange" fontFamily="body" fontWeight="bold" fontSize="16px" mb={3}>
                            Téléphone
                        </Text>
                        <Text color="zombieland.white" fontFamily="body" fontWeight="300" mb={2}>
                            06 66 66 66 66
                        </Text>
                        <Text color="zombieland.white" fontFamily="body" fontWeight="300" fontSize="13px" mt={3} opacity={0.7} mb={2}>
                            Du lundi au vendredi : 9h — 18h
                        </Text>
                        <Text color="zombieland.white" fontFamily="body" fontWeight="300" fontSize="13px" opacity={0.7}>
                            Le week-end : 10h — 17h
                        </Text>
                    </Box>

                    <Box
                        p={8}
                        borderRadius="md"
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
                        <Text color="zombieland.cta1orange" fontFamily="body" fontWeight="bold" fontSize="16px" mb={3}>
                            Email
                        </Text>
                        <Text color="zombieland.white" fontFamily="body" fontWeight="300" mb={2}>
                            contact@au-dela-des-morts.fr
                        </Text>
                        <Text color="zombieland.white" fontFamily="body" fontWeight="300" fontSize="13px" mt={3} opacity={0.7}>
                            Réponse sous 48h
                        </Text>
                    </Box>

                    <Box
                        p={8}
                        borderRadius="md"
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
                        <Text color="zombieland.cta1orange" fontFamily="body" fontWeight="bold" fontSize="16px" mb={3}>
                            Adresse
                        </Text>
                        <Text color="zombieland.white" fontFamily="body" fontWeight="300" mb={2}>
                            13 Rue des Morts-Vivants
                        </Text>
                        <Text color="zombieland.white" fontFamily="body" fontWeight="300">
                            75013 Paris
                        </Text>
                    </Box>

                </SimpleGrid>

                {/* FAQ Section */}
                <Box w="100%" maxW="900px" mt={16} mb={12}>
                    <Heading mb={8} fontFamily="heading" fontSize="36px" textAlign="center" color="zombieland.white">
                        Questions fréquentes
                    </Heading>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
                        <Box p={6} borderRadius="md" bg="rgba(0,0,0,0.3)" borderLeft="3px solid" borderColor="zombieland.primary" boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)" transition="all 0.3s ease" _hover={{ transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", borderColor: "zombieland.cta1orange", bg: "rgba(0,0,0,0.5)" }}>
                            <Text color="zombieland.cta1orange" fontFamily="body" fontWeight="bold" fontSize="16px" mb={3}>
                                Combien de temps dure la visite ?
                            </Text>
                            <Text color="zombieland.white" fontFamily="body" fontWeight="300" fontSize="14px">
                                Comptez environ 4 à 5 heures pour profiter de l'ensemble du parc. Si vous souhaitez explorer les boutiques et vous restaurer sur place, prévoyez plus de temps.
                            </Text>
                        </Box>

                        <Box p={6} borderRadius="md" bg="rgba(0,0,0,0.3)" borderLeft="3px solid" borderColor="zombieland.primary" boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)" transition="all 0.3s ease" _hover={{ transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", borderColor: "zombieland.cta1orange", bg: "rgba(0,0,0,0.5)" }}>
                            <Text color="zombieland.cta1orange" fontFamily="body" fontWeight="bold" fontSize="16px" mb={3}>
                                Le parc est-il adapté aux enfants ?
                            </Text>
                            <Text color="zombieland.white" fontFamily="body" fontWeight="300" fontSize="14px">
                                Zombieland est un parc à sensations fortes recommandé à partir de 16 ans. Certaines attractions peuvent être déconseillées aux personnes sensibles aux effets de peur ou aux situations stressantes.
                            </Text>
                        </Box>

                        <Box p={6} borderRadius="md" bg="rgba(0,0,0,0.3)" borderLeft="3px solid" borderColor="zombieland.primary" boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)" transition="all 0.3s ease" _hover={{ transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", borderColor: "zombieland.cta1orange", bg: "rgba(0,0,0,0.5)" }}>
                            <Text color="zombieland.cta1orange" fontFamily="body" fontWeight="bold" fontSize="16px" mb={3}>
                                Y a-t-il des tarifs de groupe ?
                            </Text>
                            <Text color="zombieland.white" fontFamily="body" fontWeight="300" fontSize="14px">
                                Le tarif est unique pour tous : 66,66€ par personne.
                            </Text>
                        </Box>

                        <Box p={6} borderRadius="md" bg="rgba(0,0,0,0.3)" borderLeft="3px solid" borderColor="zombieland.primary" boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)" transition="all 0.3s ease" _hover={{ transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", borderColor: "zombieland.cta1orange", bg: "rgba(0,0,0,0.5)" }}>
                            <Text color="zombieland.cta1orange" fontFamily="body" fontWeight="bold" fontSize="16px" mb={3}>
                                Comment annuler ma réservation ?
                            </Text>
                            <Text color="zombieland.white" fontFamily="body" fontWeight="300" fontSize="14px">
                                L'annulation est possible jusqu'à 10 jours avant votre visite depuis votre espace personnel. Passé ce délai, aucune annulation est possible.
                            </Text>
                        </Box>
                    </SimpleGrid>
                </Box>

            </Box>

            <Footer />
        </Box>
    )
}

export default Contact