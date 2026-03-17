import { useEffect, useState } from "react";
import { Box, Wrap, WrapItem, Text } from "@chakra-ui/react";
import AttractionCard from "./AttractionsCard";
import type { Attraction } from "@types";

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
        <Box>
            <Text>Attractions</Text>
            <Wrap gap={8} bg="#042032" p={4} color="#be0964ff">
                {attractions.map((attraction) => (
                    <WrapItem key={attraction.id_ATTRACTION}>
                        <AttractionCard {...attraction} />
                    </WrapItem>
                ))}
            </Wrap>
        </Box>
    );
};

export default AttractionsPage;





