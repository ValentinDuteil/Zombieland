// Attrtaction Detail Page

import type { AttractionWithCategories } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { Badge, Box, Button, Heading, Image, Text, Wrap, WrapItem } from "@chakra-ui/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import bgImage from '../assets/bg-image.png'
import bgBouton from '../assets/bg-bouton.png'
import laboImage from '../assets/laboratoirez.png'
import Card from '../assets/Card.png';

const categoryColors: Record<string, string> = {
  "Peur Acceptable": "green",
  "Peur Survivable": "orange",
  "Peur Mortelle": "red",
};

const AttractionDetailPage = () => {
  //slug
  const { id } = useParams();
  // attrctation type
  const [attraction, setAttraction] = useState<AttractionWithCategories | null>(null);
  // loading prepare
  const [isLoading, setIsLoading] = useState(true)
  //error
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate();


  // refact fetch with axios
  useEffect(() => {
    setIsLoading(true);
    const axiosAttraction = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/attractions/${id}`);
        if (!res)
          throw new Error("Erreur lors de la récupération d'une attraction");
        setAttraction(res.data);
      } catch (error) {
        console.error(error);
        setError("Attraction non trouvé")
      } finally {
        setIsLoading(false);
      }
    };
    axiosAttraction();

  }, [id]);

  if (isLoading) {
    return <p>Chargement de l'attraction...</p>;
  }
  if (error) {
    return <p>Erreur</p>
  }
  if (!attraction) {
    return <p>Attraction non trouvé</p>
  }
  return (
    <Box
      minH="100vh"
      bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgPosition="center"
      bgAttachment="fixed"
      display="flex"
      flexDirection="column"
      pt="80px"
    >
      <Header />
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="70vh"
      >
        <Box
          w="500px"
          p={10}
          borderRadius="md"
        >

          <Heading>{attraction.name}</Heading>
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
            <Box
              width="100%"
              height="180px"
              overflow="hidden"
              display="flex"
              justifyContent="center"
              // alignItems="center"
              mt={8}
              position="relative"          // nécessaire pour positionner le badge
            >
              <Badge
                position="absolute"
                top="8px"
                left="8px"
                color="zombieland.white"
                colorScheme={categoryColors[attraction.intensity] || "gray"}
                px={3}
                py={1}
                borderRadius="md"
                fontSize="0.8rem"
                zIndex={2}                // au-dessus de l’image
                bg="zombieland.successsecondary"
              >
                {attraction.intensity.toUpperCase()}
              </Badge>
              <Image
                width="90%"
                height="100%"
                objectFit="cover"
                borderRadius="md"
                src={laboImage} />
            </Box>
            <Box
              p={4}
              display="flex"
              flexDirection="column"
              flex="1"                     // occupe tout l’espace restant
            >
              <Text noOfLines={3} mb={4} flex="1">
                {attraction.description}
              </Text>
              <Text>{attraction.duration} minutes</Text>
              <Text>{attraction.capacity} personnes</Text>
              <Text>taille minimal {attraction.min_height} cm</Text>
              {attraction.categories.map(ac =>
                <Badge key={ac.category.id_CATEGORY}
                  position="absolute"
                  top="8px"
                  left="8px"
                  color="zombieland.white"
                  // colorScheme={categoryColors[cat] || "gray"}
                  px={3}
                  py={1}
                  borderRadius="md"
                  fontSize="0.8rem"
                  zIndex={2}                // au-dessus de l’image
                  bg="zombieland.successsecondary">{ac.category.name}</Badge>
              )}
              <Button
                bgImage={`url(${bgBouton})`}
                color="zombieland.secondary"
                _hover={{ bg: "zombieland.cta2orange" }}
                fontFamily="body"
                fontSize="20px"
                py={6}
                px={3}
                borderRadius="full"
                letterSpacing="1px"
                fontWeight="bold"
                boxShadow="inset 0 2px 8px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.5)"
                textTransform="uppercase"
                onClick={() => navigate("/attractions")}
              >
                → REJOINDRE L'HORREUR
              </Button>
            </Box>
          </Box>
            </Box>
        </Box>
        <Footer />
      </Box >
      );
};

      export default AttractionDetailPage;