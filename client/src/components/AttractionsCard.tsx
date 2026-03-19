import { Box, Image, Heading, Text, Badge, Button } from "@chakra-ui/react";
import type { Attraction } from "@/types";
import Card from '../assets/Card.png';
import bgBouton from '../assets/bg-bouton.png'

interface AttractionCardProps extends Attraction {
    image: string;
}

const categoryColors: Record<string, string> = {
    "Peur Acceptable": "green",
    "Peur Survivable": "orange",
    "Peur Mortelle": "red",
};

const AttractionCard = ({ name, description, intensity, image }: AttractionCardProps) => {
    const cat = intensity ?? "Peur Acceptable";


    return (
        <Box
            width="300px"
            height="400px"                 // hauteur FIXE pour toutes les cartes
            borderRadius="lg"
            overflow="hidden"
            boxShadow="0 0 15px rgba(0,0,0,0.5)"
            bgImage={`url(${Card})`}
            bgSize="cover"
            bgPosition="center"
            color="white"
            display="flex"
            flexDirection="column"         // structure en colonne
        >
            {/* Image + badge positionné dessus */}
            <Box
                width="100%"
                height="180px"
                overflow="hidden"
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={8}
                position="relative"          // nécessaire pour positionner le badge
            >
                {/* Badge sur l’image */}
                <Badge
                    position="absolute"
                    top="8px"
                    left="8px"
                    color="zombieland.white"
                    colorScheme={categoryColors[cat] || "gray"}
                    px={3}
                    py={1}
                    borderRadius="md"
                    fontSize="0.8rem"
                    zIndex={2}                // au-dessus de l’image
                    bg="zombieland.successsecondary"
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
            <Box
                p={4}
                display="flex"
                flexDirection="column"
                flex="1"                     // occupe tout l’espace restant
            >

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
                    alignSelf="flex-end"
                >
                    → VOIR PLUS
                </Button>
            </Box>
        </Box>
    );
};

export default AttractionCard;