// Attrtaction Detail Page

import type { AttractionWithCategories } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Badge, Box, Button, Flex, Heading, Image, Text, Wrap, WrapItem } from "@chakra-ui/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import bgImage from '../assets/bg-image.png'
import Card from '../assets/Card.png';
import { API_URL } from '../config/api.ts'
import bgBouton from '../assets/bg-bouton.png'
import img1 from "../assets/quarantaine.png"
import img2 from "../assets/ridebiomasse.png"
import img3 from "../assets/marche.png"
import img4 from "../assets/grand8.png"
import img5 from "../assets/fossecadavres.png"
import img6 from "../assets/centrerecherche.png"


const categoryColors: Record<string, string> = {
  "Peur Acceptable": "#556739",
  "Peur Survivable": "#AA9430",
  "Peur Mortelle": "#F4902B",
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

  const attractionImages: Record<number, string> = {
    1: img1,
    2: img2,
    3: img3,
    4: img4,
    5: img5,
    6: img6,

  };
  // refact fetch with axios
  useEffect(() => {
    setIsLoading(true);
    const axiosAttraction = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/attractions/${id}`);
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

  const intensityMap: Record<string, string> = {
    LOW: "Peur Acceptable",
    MEDIUM: "Peur Survivable",
    HIGH: "Peur Mortelle",

  };

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
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      bgAttachment="fixed"
      bgImage={`url(${bgImage})`}
      bgSize="cover"
    >
      <Header />

      <Box flex="1" p={3} pt={{ base: "60px", lg: "100px" }} pb="100px">

        {/* Title */}
        <Heading
          mb={12}
          fontFamily="heading"
          fontSize="54px"
          textAlign="center"
          color="zombieland.white"
        >
          {attraction.name}
        </Heading>

        {/*Cartes filtrées */}
        <Flex
          justify={{ base: "center", lg: "center" }}
          align="center"
          pr={{ base: 0, lg: 8 }}
          mb={6}
          minH="60px"
          direction={{ base: "column", md: "column", lg: "row" }} // responsive
        >
          <Box
            width={{ base: "95%", md: "90%", lg: "1300px" }} // responsive
            minHeight={{ base: "auto", lg: "500px" }}
            borderRadius="lg"
            overflow="hidden"
            boxShadow="0 0 15px rgba(0,0,0,0.5)"
            bgImage={`url(${Card})`}
            bgSize="cover"
            bgPosition="center"
            color="white"
            display="flex"
            flexDirection={{ base: "column", lg: "row" }} // responsive
            position="relative"
            transition="all 0.3s ease"
            border="2px solid"
            borderColor="zombieland.primary"
            _hover={{
              transform: { lg: "scale(1.02)" }, // hover desktop only
              boxShadow: { lg: "0 12px 30px rgba(0,0,0,0.6)" },
              borderColor: "zombieland.cta1orange",
            }}
          >

            {/* IMAGE (GAUCHE) */}
            <Box
              width={{ base: "100%", lg: "40%" }} // responsive
              height={{ base: "250px", md: "300px", lg: "auto" }} // responsive
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={{ base: 2, md: 4 }} // responsive
            >
              <Badge
                position="absolute"
                top="10px"
                left="10px"
                color="white"
                bg={categoryColors[intensityMap[attraction.intensity] ?? "Peur Acceptable"]}
                px={3}
                py={1}
                borderRadius="md" // responsive
                zIndex={2}
              >
                {(intensityMap[attraction.intensity] ?? "").toUpperCase()}
              </Badge>

              <Image
                src={
                  attraction.image
                    ? `${API_URL}${attraction.image}`
                    : attractionImages[attraction.id_ATTRACTION]
                }
                width="100%"
                height="100%"
                objectFit="cover"
                borderRadius="md"
              />
            </Box>

            {/* CONTENU (DROITE) */}
            <Box
              width={{ base: "100%", lg: "60%" }} // responsive
              p={{ base: 4, md: 6 }} // responsive
              display="flex"
              flexDirection="column"
              fontSize={{ base: 16, md: 18, lg: 21 }} // responsive
            >
              <Text mb={12} mt={8}>
                {attraction.description}
              </Text>

              <Text mb={2}>
                🎢 Durée : {attraction.duration ?? "Inconnue"} min
              </Text>

              <Text mb={2}>
                📏 Taille min : {attraction.min_height ?? "Aucune"} cm
              </Text>

              <Text mb={4}>
                👥 Capacité : {attraction.capacity ?? "N/A"}
              </Text>

              {/* CATEGORIES */}
              <Wrap mb={4}>
                {attraction.categories?.map((cat) => (
                  <WrapItem key={cat.category.id_CATEGORY}>

                  </WrapItem>
                ))}
              </Wrap>

              {/* BOUTONS */}
              <Flex
                mt="auto"
                alignSelf="flex-end"
                gap={{ base: 3, md: 5 }}// responsive
                direction={{ base: "column", md: "row" }}// responsive
                width={{ base: "100%", md: "auto" }}// responsive
              >
                <Button
                  borderRadius="full"
                  bg="transparent"
                  bgImage={`url(${bgBouton})`}
                  bgSize="cover"
                  bgPosition="center"
                  color="zombieland.secondary"
                  fontWeight="bold"
                  px={6}
                  py={5}
                  _hover={{ bg: "zombieland.cta2orange" }}
                  onClick={() => navigate("/attractions")}
                  width={{ base: "100%", md: "auto" }} // responsive
                >
                  ← RETOUR
                </Button>

                <Button
                  borderRadius="full"
                  bg="transparent"
                  bgImage={`url(${bgBouton})`}
                  bgSize="cover"
                  bgPosition="center"
                  color="zombieland.secondary"
                  fontWeight="bold"
                  px={6}
                  py={5}
                  _hover={{ bg: "zombieland.cta2orange" }}
                  onClick={() => navigate("/reservation")}
                  width={{ base: "100%", md: "auto" }} // responsive
                >
                   REJOINDRE L'HORREUR →
                </Button>
              </Flex>
            </Box>

          </Box>
        </Flex>
      </Box>

      {error && <Text>{error}</Text>}

      <Footer />
    </Box>
  );
};

export default AttractionDetailPage;