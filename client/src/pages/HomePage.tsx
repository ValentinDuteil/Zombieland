import { useEffect, useState } from "react"
import AttractionCard from "../components/AttractionsCard"
import type { Attraction } from "@types"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { Box, Image, Button, Text, Wrap, WrapItem, IconButton, Flex, Heading, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure } from "@chakra-ui/react"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
// Images
import bgButton from '../assets/bg-bouton.png'
import bgImage from '../assets/bg-image.png'
import zombi from '../assets/zombi.png'
import fosse from '../assets/fosse.png'
import grandhuit from '../assets/grandhuit.png'
import reception from '../assets/reception.png'
import train from '../assets/train.png'
import parkEntryLandscape from '../assets/park-entry-landscape.png'
import img1 from "../assets/quarantaine.png"
import img2 from "../assets/ridebiomasse.png"
import img3 from "../assets/marche.png"
import img4 from "../assets/grand8.png"
import img5 from "../assets/fossecadavres.png"
import img6 from "../assets/centrerecherche.png"



import { useNavigate } from "react-router-dom";

// Conversion catégories → enum backend
const categoryToEnum: Record<string, string> = {
    "Peur Acceptable": "LOW",
    "Peur Survivable": "MEDIUM",
    "Peur Mortelle": "HIGH",
};

const carouselImages = [
    { src: zombi, alt: "Zombie" },
    { src: fosse, alt: "Fosse de cadavres" },
    { src: grandhuit, alt: "Grand 8" },
    { src: reception, alt: "Réception" },
    { src: train, alt: "Train fantôme" },
]

const HomePage = () => {


    // États & logique de données

    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [selectedCategory] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Current slide index for the carousel
    const [currentSlide, setCurrentSlide] = useState(0)

    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure()

    // Images associées aux attractions
    const attractionImages: Record<number, string> = {
        1: img1,
        2: img2,
        3: img3,
        4: img4,
        5: img5,
        6: img6,
    };

    // Récupération des attractions
    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/attractions`);
                if (!res.ok) throw new Error("Erreur récupération attractions");

                const data: Attraction[] = await res.json();
                setAttractions(data);

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                setError("Erreur lors de la récupération des attractions");
            }
        };

        fetchAttractions();
    }, []);


    // Go to previous slide
    const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1))
    // Go to next slide
    const nextSlide = () => setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1))

    // Attractions pictures filtered by category (if any)
    const filteredAttractions = selectedCategory
        ? attractions.filter(a => a.intensity === categoryToEnum[selectedCategory])
        : attractions;
    return (
        <Box
            display="flex"
            flexDirection="column"
            bgImage={`url(${bgImage})`}
            bgAttachment="fixed"
            bgSize="cover"
            w="100%"
            overflow="hidden"
        >
            <Header />

            {/* Picture enter parc */}

            <Box
                pb={6}
                transition="all 0.3s ease"
                _hover={{ transform: "scale(1.02)" }}
                overflow="hidden"
                borderRadius="md"
            >
                <Image
                    src={parkEntryLandscape}
                    alt="Entrée du parc"
                    mx="auto"
                    width="100%"
                    transition="all 0.3s ease"
                />
            </Box>


            {/* Button to navigate to reservations */}
            <Button
                onClick={() => navigate('/reservation')}
                bgImage={`url(${bgButton})`}
                bgSize="cover"
                bgPosition="center"
                mx="auto"
                color="zombieland.secondary"
                borderRadius="full"
                transition="all 0.3s ease"
                _hover={{
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 20px rgba(250, 235, 220, 0.2)",
                    opacity: 0.9
                }}
                _active={{ transform: "translateY(-1px)" }}
                mb={8}
                fontWeight="bold"
                fontSize="18px"
                py={6}
                px={12}
                boxShadow="0 4px 12px rgba(0,0,0,0.3)"
            >
                → Réserver maintenant
            </Button>
            {/* Text central */}

            <Box px={10} py={20} maxW="900px" mx="auto">
                <Text textAlign="center" fontSize="lg" color="zombieland.white" fontFamily="body" fontWeight="300">
                    Une ville abandonnée. Des zombies. Et vous. Bienvenue à ZombieLand,
                    une expérience immersive où chaque attraction vous plonge au cœur
                    d'un monde post-apocalyptique... Ici, survivre fait partie du jeu.
                    Arriverez-vous à survivre ? Maîtriserez-vous vos peurs ? Bonne chance !!
                </Text>
            </Box>

            {/* Carousel */}
            <Flex align="flex-start" justify="center" gap={6} py={12} px={8} flexDirection="column">

                {/* Top row with buttons and image */}
                <Flex align="center" justify="center" gap={6} w="100%">
                    {/* Previous button - outside image */}
                    <IconButton
                        aria-label="Précédent"
                        icon={<LuChevronLeft />}
                        onClick={prevSlide}
                        variant="ghost"
                        color="zombieland.white"
                        bgImage={`url(${bgButton})`}
                        fontSize="24px"
                        transition="all 0.3s ease"
                        _hover={{
                            transform: "scale(1.1)",
                            boxShadow: "0 4px 12px rgba(250, 235, 220, 0.2)"
                        }}
                        _active={{ transform: "scale(0.95)" }}
                    />

                    {/* Image */}
                    <Box
                        maxW="400px"
                        w="100%"
                        borderRadius="lg"
                        overflow="hidden"
                        boxShadow="0 12px 32px rgba(0,0,0,0.5)"
                        border="2px solid rgba(250, 235, 220, 0.1)"
                        transition="all 0.3s ease"
                        _hover={{ transform: "scale(1.02)", cursor: "pointer" }}
                        onClick={onOpen}
                    >
                        <Image
                            src={carouselImages[currentSlide].src}
                            alt={carouselImages[currentSlide].alt}
                            w="100%"
                            borderRadius="lg"
                            objectFit="cover"
                            maxH="600px"
                            transition="all 0.5s ease"
                        />
                    </Box>

                    {/* Next button - outside image */}
                    <IconButton
                        aria-label="Suivant"
                        icon={<LuChevronRight />}
                        bgImage={`url(${bgButton})`}
                        onClick={nextSlide}
                        variant="ghost"
                        color="zombieland.white"
                        fontSize="24px"
                        transition="all 0.3s ease"
                        _hover={{
                            transform: "scale(1.1)",
                            boxShadow: "0 4px 12px rgba(250, 235, 220, 0.2)"
                        }}
                        _active={{ transform: "scale(0.95)" }}
                    />
                </Flex>

                {/* Slide indicators - BELOW */}
                <Flex
                    justifyContent="center"
                    gap={2}
                    w="100%"
                >
                    {carouselImages.map((_, index) => (
                        <Box
                            key={index}
                            w={3}
                            h={3}
                            borderRadius="full"
                            bg={index === currentSlide ? "zombieland.cta1orange" : "whiteAlpha.500"}
                            cursor="pointer"
                            onClick={() => setCurrentSlide(index)}
                            transition="all 0.3s ease"
                            _hover={{ transform: "scale(1.2)" }}
                        />
                    ))}
                </Flex>

            </Flex>

            <Heading mb={8} fontFamily="heading" fontSize="36px" textAlign="center" color="zombieland.white" textShadow="2px 2px 4px rgba(0,0,0,0.5)" letterSpacing="1px">
                Les expériences qui vous attendent
            </Heading>

            {/* Attractions cards*/}
            <Wrap spacing="50px" justify="center" maxW="1000px" mx="auto" mb={8}>
                {filteredAttractions.slice(0, 3).map((attraction) => (
                    <WrapItem key={attraction.id_ATTRACTION}>
                        <AttractionCard
                            {...attraction}
                            image={attractionImages[attraction.id_ATTRACTION]}
                        />
                    </WrapItem>
                ))}
            </Wrap>
            {error && <Text>{error}</Text>}

            {/* Button to navigate attractions*/}
            <Button
                onClick={() => navigate('/attractions')}
                bgImage={`url(${bgButton})`}
                bgSize="cover"
                mb={12}
                bgPosition="center"
                mx="auto"
                color="zombieland.secondary"
                borderRadius="full"
                transition="all 0.3s ease"
                _hover={{
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 20px rgba(250, 235, 220, 0.2)",
                    opacity: 0.9
                }}
                _active={{ transform: "translateY(-1px)" }}
                fontWeight="bold"
                fontSize="18px"
                py={6}
                px={12}
                boxShadow="0 4px 12px rgba(0,0,0,0.3)"
            >
                → Toutes nos attractions
            </Button>

            {/* Modal for zoomed carousel image */}
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
                            src={carouselImages[currentSlide].src}
                            alt={carouselImages[currentSlide].alt}
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
        </Box>
    );
};

export default HomePage;