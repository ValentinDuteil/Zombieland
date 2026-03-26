import { useEffect, useState } from "react";
import { Box, Wrap, WrapItem, Menu, MenuButton, MenuList, MenuItem, Text, Heading } from "@chakra-ui/react";
import AttractionCard from "../components/AttractionsCard";
import type { Attraction } from "@types";
import Header from "../components/Header";
import Footer from "../components/Footer";
import bgImage from '../assets/bg-image.png';
import img1 from "../assets/quarantaine.png"
import img2 from "../assets/ridebiomasse.png"
import img3 from "../assets/marche.png"
import img4 from "../assets/grand8.png"
import img5 from "../assets/fossecadavres.png"
import img6 from "../assets/centrerecherche.png"

const categoryToEnum: Record<string, string> = {
    "Peur Acceptable": "LOW",
    "Peur Survivable": "MEDIUM",
    "Peur Mortelle": "HIGH",
};

const AttractionsPage = () => {
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null)

    const attractionImages: Record<number, string> = {
        1: img1,
        2: img2,
        3: img3,
        4: img4,
        5: img5,
        6: img6,

    };

    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/attractions`);
                if (!res.ok) throw new Error("Erreur récupération attractions");
                const data: Attraction[] = await res.json();
                setAttractions(data);
            } catch (err) {
                setError("Erreur lors de la récupération des attractions")
            }
        };
        fetchAttractions();
    }, []);

    // Filtrage des attractions
    const filteredAttractions = selectedCategory
        ? attractions.filter(a => a.intensity === categoryToEnum[selectedCategory])
        : attractions;

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

            <Box flex="1" p={3} pt={{ base: "60px", md: "100px" }} pb="100px">

                {/* Title */}
                <Heading
                    mb={12}
                    fontFamily="heading"
                    fontSize="54px"
                    textAlign="center"
                    color="zombieland.white"
                >
                    Nos attractions
                </Heading>

                {/* Bouton unique Filtrer par catégorie */}
                <Box display="flex" justifyContent={{ base: "center", lg: "center" }} alignItems="center" pr={{ base: 0, lg: 8 }} mb={6} minH="60px">
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
                            Filtrer par catégorie
                        </MenuButton>

                        <MenuList bg="#1a1a1a" border="1px solid #333">
                            <MenuItem
                                bg="#1a1a1a"
                                color="white"
                                _hover={{ bg: "#333" }}
                                onClick={() => setSelectedCategory(null)}
                            >
                                Toutes
                            </MenuItem>

                            <MenuItem
                                bg="#1a1a1a"
                                color="white"
                                _hover={{ bg: "#333" }}
                                onClick={() => setSelectedCategory("Peur Acceptable")}
                            >
                                Peur Acceptable
                            </MenuItem>

                            <MenuItem
                                bg="#1a1a1a"
                                color="white"
                                _hover={{ bg: "#333" }}
                                onClick={() => setSelectedCategory("Peur Survivable")}
                            >
                                Peur Survivable
                            </MenuItem>

                            <MenuItem
                                bg="#1a1a1a"
                                color="white"
                                _hover={{ bg: "#333" }}
                                onClick={() => setSelectedCategory("Peur Mortelle")}
                            >
                                Peur Mortelle
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Box>

                {/*Cartes filtrées */}
                <Wrap spacing="30px" justify="center" maxW="1000px" mx="auto">
                    {filteredAttractions.map((attraction) => (
                        <WrapItem key={attraction.id_ATTRACTION}>
                            <AttractionCard
                                {...attraction}
                                image={attraction.image ? `${import.meta.env.VITE_API_URL}${attraction.image}` : attractionImages[attraction.id_ATTRACTION]}
                            />
                        </WrapItem>
                    ))}
                </Wrap>
            </Box>

            {error && <Text>{error}</Text>}

            <Footer />
        </Box>
    );
};

export default AttractionsPage;