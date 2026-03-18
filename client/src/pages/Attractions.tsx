import { useEffect, useState } from "react";
import { Box, Wrap, WrapItem } from "@chakra-ui/react";
import AttractionCard from "./AttractionsCard";
import type { Attraction } from "@types";
import Header from "../components/Header";
import Footer from "../components/Footer";
import bgImage from '../../public/assets/bg-image.png'

const AttractionsPage = () => {
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const attractionImages: Record<number, string> = {
        1: "/assets/spectacle.png",
        2: "/assets/dead rise.png",
        3: "/assets/foret.png",
        4: "/assets/granderoue.png",
        5: "/assets/piscine.png",
        6: "/assets/ghost-train-landscape.png",
    };

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
            bgImage={`url(${bgImage})`}
        >
            <Header />

            
            <Box flex="1" p={3} pt="100px">
                {/* 3 cards */}
                <Wrap spacing="30px" justify="center" maxW="1000px" mx="auto">
                    {attractions.map((attraction) => (
                        <WrapItem key={attraction.id_ATTRACTION}>
                            <AttractionCard
                                {...attraction}
                                image={attractionImages[attraction.id_ATTRACTION]}
                            />
                        </WrapItem>
                    ))}
                </Wrap>
            </Box>

            <Footer />
        </Box>
    );
};

export default AttractionsPage;


