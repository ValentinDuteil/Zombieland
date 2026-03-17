import { Box, Wrap, WrapItem, Text, Flex } from "@chakra-ui/react";
import AttractionCard from "./AttractionsCard";
import type { Attraction } from "@types";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface AttractionsProps {
    attractions: Attraction[];
}

const AttractionsPage = ({ attractions }: AttractionsProps) => {
    return (
        <Flex minH="100vh" width="100%">
        <Box>
            <Header />

            <Box>
                <Text fontSize="2xl" fontWeight="bold" mb={4}>
                    Attractions
                </Text>

                <Wrap gap={8} bg="#0b8cdbff" p={4} color="#be0964ff">
                    {attractions.map((attraction) => (
                        <WrapItem key={attraction.id_ATTRACTION}>
                            <AttractionCard {...attraction} />
                        </WrapItem>
                    ))}
                </Wrap>
            </Box>

            <Footer />
        </Box>
        </Flex>
    );
};

export default AttractionsPage;