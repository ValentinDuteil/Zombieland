import { Box, Image, Heading, Text, Badge, Button } from "@chakra-ui/react";
import type { Attraction } from "@/types";
import Card from '../assets/Card.png';
import bgBouton from '../assets/bg-bouton.png'
import { useNavigate } from "react-router-dom";


interface AttractionCardProps extends Attraction {
    image: string;
}

// Mapping API → labels internes
const intensityMap: Record<string, string> = {
    LOW: "Peur Acceptable",
    MEDIUM: "Peur Survivable",
    HIGH: "Peur Mortelle",

};

// Couleurs Chakra (ou custom si tu veux)
const categoryColors: Record<string, string> = {
    "Peur Acceptable": "#556739",
    "Peur Survivable": "#AA9430",
    "Peur Mortelle": "#F4902B",
};



const AttractionCard = ({ id_ATTRACTION, name, description, intensity, image }: AttractionCardProps) => {
    const navigate = useNavigate()
    const cat = intensityMap[intensity] ?? "Peur Acceptable";


    return (
        <Box
            width="300px"
            height="400px"
            borderRadius="lg"
            overflow="visible"
            boxShadow="0 0 15px rgba(0,0,0,0.5)"
            bgImage={`url(${Card})`}
            bgSize="cover"
            bgPosition="center"
            color="white"
            display="flex"
            flexDirection="column"
            position="relative"      // structure en colonne
        >


            {/* Image + badge positionné dessus */}
            <Box
                width="100%"
                height="180px"
                overflow="visible"
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={10}
                position="relative"          // nécessaire pour positionner le badge
            >

                {/* Badge sur l’image */}
                <Badge
                    position="absolute"
                    top="-12px"
                    left="8px"
                    color="white"
                    bg={categoryColors[cat] || "gray"}   // couleur dynamique
                    px={3}
                    py={1}
                    borderRadius="md"
                    fontSize="0.8rem"
                    zIndex={2}
                >
                    {cat.toUpperCase()}
                </Badge>

                <Image
                    src={image}
                    alt={name}
                    width="90%"
                    height="100%"
                    objectFit="cover"
                    borderRadius="md"
                />
            </Box>

            {/* Contenu */}
            <Box p={4} display="flex" flexDirection="column" flex="1">
                <Heading size="md" mb={2}>
                    {name.toUpperCase()}
                </Heading>

                <Text noOfLines={3} mb={4} flex="1">
                    {description}
                </Text>

                <Button
                    borderRadius="full"
                    bg="transparent"
                    bgImage={`url(${bgBouton})`}
                    bgSize="cover"
                    bgPosition="center"
                    color="zombieland.secondary"
                    fontFamily="body"
                    fontWeight="bold"
                    letterSpacing="1px"
                    fontSize="16px"
                    px={4}
                    py={4}
                    _hover={{ bg: "zombieland.cta2orange" }}
                    boxShadow="inset 0 2px 8px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.5)"
                    textTransform="uppercase"
                    mt="auto"
                    // pousse le bouton en bas
                    alignSelf="flex-end" // aligne le bouton à droite
                    onClick={() => navigate(`/attractions/${id_ATTRACTION}`)}


                >
                    → VOIR PLUS
                </Button>
            </Box>
        </Box>
    );
};

export default AttractionCard;