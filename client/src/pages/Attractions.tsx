import { useEffect, useState } from "react";
import { Box, Wrap, WrapItem, Text } from "@chakra-ui/react";
import AttractionCard from "./AttractionsCard";
import type { Attraction } from "@types";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AttractionsPage = () => {
    const [attractions, setAttractions] = useState<Attraction[]>([]);

    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/attractions`);
                if (!res.ok) throw new Error("Erreur récupération attractions");
                const data: Attraction[] = await res.json();
                setAttractions(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAttractions();
    }, []);

    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
        >
            <Header />

            {/* Contenu qui pousse le footer vers le bas */}
            <Box flex="1" p={4}>
                <Wrap>
                    {attractions.map((attraction) => (
                        <WrapItem key={attraction.id_ATTRACTION}>
                            <AttractionCard {...attraction} />
                        </WrapItem>
                    ))}
                </Wrap>
            </Box>

            <Footer />
        </Box>
    );
};

export default AttractionsPage;


