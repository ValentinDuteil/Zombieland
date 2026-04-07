import { useEffect, useState } from "react";
import { Box, Wrap, WrapItem, Menu, MenuButton, MenuList, MenuItem, Text, Heading } from "@chakra-ui/react";
import AttractionCard from "../components/AttractionsCard";
import type { Attraction } from "@types";
import Header from "../components/Header";
import Footer from "../components/Footer";
import bgImage from '../assets/bg-image.webp';
import defaultImage from "../assets/quarantaine.webp"
import bgFiltres from '../assets/bg-bouton-filtres.webp'
import { PageBackground } from "../components/PageBackground";
import { API_URL } from "@/config/api";
import axiosInstance from "@/lib/axiosInstance";

const categoryToEnum: Record<string, string> = {
    "Peur Acceptable": "LOW",
    "Peur Survivable": "MEDIUM",
    "Peur Mortelle": "HIGH",
};

const AttractionsPage = () => {
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                const res = await axiosInstance.get<Attraction[]>(`${API_URL}/api/attractions`);

                setAttractions(res.data);
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
        <PageBackground bgImage={bgImage}>
            <Header />
            <Heading as="h1" size="2xl" textAlign="center" mt={10} color="zombieland.white">
                Nos Attractions
            </Heading>
            <Box flex="1" p={3} pt="100px" pb="100px">

                {/* Bouton unique Filtrer par catégorie */}
                <Box display="flex" justifyContent="flex-end" pr={8} mb={6}>
                    <Menu>
                        <MenuButton
                            bgImage={`url(${bgFiltres})`}
                            bgSize="120%"
                            bgPosition="center"
                            bgRepeat="no-repeat"
                            color="zombieland.secondary"
                            fontWeight="bold"
                            px={4}
                            py={2}
                            border="2px solid"
                            borderColor="zombieland.primary"
                            borderRadius="md"
                            transition="all 0.3s ease"
                            _hover={{ opacity: 0.85, borderColor: "zombieland.cta1orange" }}
                        >
                            Filtrer par catégorie
                        </MenuButton>

                        <MenuList bg="#1a1a1a" border="1px solid #333">
                            <MenuItem bg="#1a1a1a" color="white" _hover={{ bg: "#333" }} onClick={() => setSelectedCategory(null)}>
                                Toutes
                            </MenuItem>
                            <MenuItem bg="#1a1a1a" color="white" _hover={{ bg: "#333" }} onClick={() => setSelectedCategory("Peur Acceptable")}>
                                Peur Acceptable
                            </MenuItem>
                            <MenuItem bg="#1a1a1a" color="white" _hover={{ bg: "#333" }} onClick={() => setSelectedCategory("Peur Survivable")}>
                                Peur Survivable
                            </MenuItem>
                            <MenuItem bg="#1a1a1a" color="white" _hover={{ bg: "#333" }} onClick={() => setSelectedCategory("Peur Mortelle")}>
                                Peur Mortelle
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Box>

                {/* Cartes filtrées */}
                <Wrap spacing="30px" justify="center" maxW="1000px" mx="auto">
                    {filteredAttractions.map((attraction) => (
                        <WrapItem key={attraction.id_ATTRACTION}>
                            <AttractionCard
                                {...attraction}
                                image={attraction.image ? `${API_URL}${attraction.image}` : defaultImage}
                            />
                        </WrapItem>
                    ))}
                </Wrap>

                {error && <Text>{error}</Text>}
            </Box>

            <Footer />
        </PageBackground>
    );
};

export default AttractionsPage;