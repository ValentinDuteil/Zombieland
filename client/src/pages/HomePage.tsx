import { useEffect, useState } from "react";
import AttractionCard from "../components/AttractionsCard";
import type { Attraction } from "@types";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Box, Image, Button, Text, Wrap, WrapItem, IconButton, Flex, Heading } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
// Images
import bgButton from '../assets/bg-bouton.png';
import bgImage from '../assets/bg-image.png';
import zombi from '../assets/zombi.png';
import fosse from '../assets/fosse.png';
import grandhuit from '../assets/grandhuit.png';
import reception from '../assets/reception.png';
import train from '../assets/train.png';
import parkEntryLandscape from '../assets/park-entry-landscape.png';
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
        >
            <Header />

            {/* Picture enter parc */}

            <Box pb="100px" >
                <Image
                    src={parkEntryLandscape}
                    alt="Entrée du parc"
                    mx="auto"
                    width="100%"
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
                _hover={{ bg: "zombieland.cta2orange" }}
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
            <Flex align="center" justify="center" gap={4} pt={10} pb="100px" px={8}>

                {/* Previous button - outside image */}
                <IconButton
                    aria-label="Précédent"
                    icon={<LuChevronLeft />}
                    onClick={prevSlide}
                    variant="ghost"
                    color="zombieland.white"
                    bgImage={`url(${bgButton})`}
                    fontSize="24px"
                    _hover={{ bg: 'whiteAlpha.300' }}
                />

                {/* Image + indicators */}
                <Box maxW="400px" w="100%">
                    <Image
                        src={carouselImages[currentSlide].src}
                        alt={carouselImages[currentSlide].alt}
                        w="100%"
                        borderRadius="md"
                        objectFit="cover"
                        maxH="600px"
                    />
                    {/* Slide indicators */}
                    <Flex justifyContent="center" gap={2} mt={4}>
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
                            />
                        ))}
                    </Flex>
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
                    _hover={{ bg: 'whiteAlpha.300' }}
                />

            </Flex>

            <Heading mb={12} fontFamily="heading" fontSize="36px" textAlign="center" color="zombieland.white">
                Les expériences qui vous attendent
            </Heading>

            {/* Attractions cards*/}
            <Wrap spacing="50px" justify="center" maxW="1000px" mx="auto" mb="100px">
                {filteredAttractions.map((attraction) => (
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
                mb="10"
                bgPosition="center"
                mx="auto"
                color="zombieland.secondary"
                borderRadius="full"
                _hover={{ bg: "zombieland.cta2orange" }}
            >
                → Toutes nos attractions
            </Button>
            <Footer />
        </Box>
    );
};

export default HomePage;