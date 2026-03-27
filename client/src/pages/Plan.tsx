// Plan page - park map

import { Box, Heading, Text, Image, Flex, Button, SimpleGrid, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import bgImage from '../assets/bg-image.png'
import planImage from '../assets/plan.png'
import Header from '../components/Header'
import Footer from '../components/Footer'
import bgBouton from '../assets/bg-bouton.png'
import { useState } from 'react'
import { PageBackground } from '../components/PageBackground'

// Park services
const services = [
    { number: 1, icon: "🚽", name: "Toilettes" },
    { number: 2, icon: "🏥", name: "Premiers secours" },
    { number: 3, icon: "🛍️", name: "Boutique" },
]


function Plan() {

    const [downloaded, setDownloaded] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <PageBackground bgImage={bgImage}>
            <Header />

            <Box
                flex={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
                px={8}
                py={10}
            >

                {/* Title */}
                <Heading
                    mb={10}
                    fontFamily="heading"
                    fontSize="54px"
                    textAlign="center"
                    color="zombieland.white"
                >
                    Plan du parc
                </Heading>

                {/* Plan image */}
                <Box
                    w="100%"
                    maxW="1000px"
                    mb={12}
                    borderRadius="md"
                    overflow="hidden"
                    boxShadow="0 0 30px rgba(0,0,0,0.7)"
                    transition="transform 0.3s ease, cursor 0.3s ease"
                    _hover={{ transform: "scale(1.02)", cursor: "pointer" }}
                    onClick={onOpen}
                >
                    <Image
                        src={planImage}
                        alt="Plan du parc Zombieland"
                        w="100%"
                        objectFit="cover"
                    />
                </Box>

                {/* Services */}
                <Box w="100%" maxW="1000px" mb={10} display="flex" flexDirection="column" alignItems="center">
                    <Text
                        color="zombieland.white"
                        fontFamily="body"
                        fontWeight="bold"
                        fontSize="20px"
                        mb={4}
                    >
                        Services
                    </Text>
                    <Flex gap={4} justifyContent="center" textAlign="center" flexWrap="wrap">
                        {services.map((service) => (
                            <Box
                                key={service.number}
                                px={4}
                                py={2}
                                borderRadius="full"
                                bg="rgba(0,0,0,0.3)"
                                borderLeft="3px solid"
                                borderColor="zombieland.primary"
                                boxShadow="inset 0 2px 6px rgba(0,0,0,0.4)"
                                display="flex"
                                alignItems="center"
                                gap={2}
                            >
                                <Text fontSize="18px">{service.icon}</Text>
                                <Text color="zombieland.white" fontFamily="body" fontWeight="300" fontSize="14px">
                                    {service.number} - {service.name}
                                </Text>
                            </Box>
                        ))}
                    </Flex>
                </Box>

                {/* How to get here */}
                <Box w="100%" maxW="1000px" mb={10}>
                    <Text
                        color="zombieland.white"
                        fontFamily="body"
                        fontWeight="bold"
                        fontSize="20px"
                        mb={4}
                        textAlign="center"
                    >
                        Comment nous trouver
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="100%">

                        {/* Address */}
                        <Box
                            p={4}
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
                            cursor="pointer"
                        >
                            <Text color="zombieland.cta1orange" fontFamily="body" fontWeight="bold" mb={2}>Adresse</Text>
                            <Text color="zombieland.white" fontFamily="body" fontWeight="300" fontSize="14px">
                                13 Rue des Morts-Vivants<br />
                                75013 Paris<br />
                                France
                            </Text>
                        </Box>

                        {/* By car */}
                        <Box
                            p={4}
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
                            cursor="pointer"
                        >
                            <Text color="zombieland.cta1orange" fontFamily="body" fontWeight="bold" mb={2}>En voiture</Text>
                            <Text color="zombieland.white" fontFamily="body" fontWeight="300" fontSize="14px">
                                Parking gratuit disponible à l'entrée du parc.
                            </Text>
                        </Box>

                        {/* By public transport */}
                        <Box
                            p={4}
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
                            cursor="pointer"
                        >
                            <Text color="zombieland.cta1orange" fontFamily="body" fontWeight="bold" mb={2}>En transport</Text>
                            <Text color="zombieland.white" fontFamily="body" fontWeight="300" fontSize="14px">
                                Métro ligne 6 — Station "Les Morts Vivants"<br />
                                Bus 27, 47, 83 — Arrêt "Zombieland"
                            </Text>
                        </Box>

                    </SimpleGrid>
                </Box>

                {/* Download plan */}
                <Box mb={10} display="flex" flexDirection="column" alignItems="center">
                    <a href="/plan.png" download="plan-zombieland.png" onClick={() => setDownloaded(true)}>
                        <Button
                            bgImage={`url(${bgBouton})`}
                            bgSize="cover"
                            bgPosition="center"
                            color="zombieland.secondary"
                            fontFamily="body"
                            fontWeight="bold"
                            fontSize="16px"
                            py={5}
                            px={6}
                            borderRadius="full"
                            letterSpacing="1px"
                            textTransform="uppercase"
                            boxShadow="inset 0 2px 8px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.5)"
                            _hover={{ bg: "zombieland.cta2orange" }}
                        >
                            Télécharger le plan
                        </Button>
                    </a>
                    {downloaded && (
                        <Text mt={3} color="zombieland.white" fontFamily="body" fontWeight="300" fontSize="14px">
                            Le plan a été téléchargé.
                        </Text>
                    )}
                </Box>
            </Box>

            {/* Modal for zoomed plan */}
            <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered motionPreset="slideInBottom">
                <ModalOverlay bg="rgba(0,0,0,0.95)" backdropFilter="blur(5px)" />
                <ModalContent bg="transparent" boxShadow="none">
                    <ModalCloseButton 
                        color="zombieland.white" 
                        fontSize="28px" 
                        position="fixed" 
                        top={4} 
                        right={4}
                        zIndex={1000}
                        _hover={{ opacity: 0.8 }}
                    />
                    <ModalBody display="flex" alignItems="center" justifyContent="center" minH="100vh" p={4}>
                        <Image
                            src={planImage}
                            alt="Plan du parc Zombieland - Vue agrandie"
                            maxW="90vw"
                            maxH="90vh"
                            objectFit="contain"
                            borderRadius="md"
                            boxShadow="0 0 50px rgba(250, 130, 52, 0.3)"
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Footer />
        </PageBackground>
    )
}

export default Plan