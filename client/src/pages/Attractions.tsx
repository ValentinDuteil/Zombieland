import { useEffect, useState } from "react";
import { Box, Button, Flex, Wrap, WrapItem, Text, Heading } from "@chakra-ui/react";
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

    // Filtering attractions based on selected category
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

                {/* Intensity filter buttons
                cat = current map value: null (All) or string (intensity)
                selectedCategory === cat → orange border on the active button
                null is used as the "no filter" value → displays all attractions */}
                <Flex justifyContent="center" gap={2} wrap="wrap" mb={8}>
                    {([null, "Peur Acceptable", "Peur Survivable", "Peur Mortelle"] as const).map((cat) => (
                        <Button
                            key={cat ?? "all"}
                            size="sm"
                            onClick={() => setSelectedCategory(cat)}
                            bgImage={`url(${bgFiltres})`}
                            bgSize="120%"
                            bgPosition="center"
                            bgRepeat="no-repeat"
                            color="zombieland.secondary"
                            fontWeight="bold"
                            border="2px solid"
                            borderColor={selectedCategory === cat ? "zombieland.cta1orange" : "transparent"}
                            boxShadow={selectedCategory === cat ? "0 0 8px rgba(184, 95, 0, 0.5)" : "none"}
                            _hover={{ opacity: 0.85, borderColor: "zombieland.cta1orange" }}
                        >
                            {cat ?? "Toutes"}
                        </Button>
                    ))}
                </Flex>

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