import { Box, Image, Heading, Text, Badge, Button } from "@chakra-ui/react";
import type { Attraction } from "@/types";

interface AttractionCardProps extends Attraction {
    image: string; // ton image locale
}

// Couleurs des badges selon la catégorie
const categoryColors: Record<string, string> = {
    "Peur Acceptable": "green",
    "Peur Survivable": "orange",
    "Peur Mortelle": "red",
};

const AttractionCard = ({ name, description, categorie, image }: AttractionCardProps) => {
    // Sécurise la catégorie si elle est absente
    const cat = categorie ?? "Peur Acceptable";

    return (
        <Box
            width="300px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="0 0 15px rgba(0,0,0,0.5)"
            bg="#1a1a1a"
            color="white"
        >
            {/* Image centrée avec marge */}
            <Box display="flex" justifyContent="center" mt={4}>
                <Image
                    src={image}
                    alt={name}
                    width="90%"
                    height="180px"
                    objectFit="cover"
                    borderRadius="md"
                />
            </Box>

            <Box p={4}>
                {/* Badge catégorie */}
                <Badge
                    colorScheme={categoryColors[cat] || "gray"}
                    mb={2}
                    px={3}
                    py={1}
                    borderRadius="md"
                    fontSize="0.8rem"
                >
                    {cat.toUpperCase()}
                </Badge>

                {/* Titre */}
                <Heading size="md" mb={2}>
                    {name.toUpperCase()}
                </Heading>

                {/* Description */}
                <Text noOfLines={3} mb={4}>
                    {description}
                </Text>

                {/* Bouton */}
                <Button
                    borderRadius="15px"
                    width="30%"
                    bg="zombieland.cta1orange"
                    color="white"
                    _hover={{ bg: "zombieland.cta2orange" }}
                >
                    VOIR PLUS
                </Button>
            </Box>
        </Box>
    );
};

export default AttractionCard;

