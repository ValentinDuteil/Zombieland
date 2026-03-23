import Header from "../components/Header";
import Footer from "../components/Footer";
import bgImage from '../assets/bg-image.png';
import queue from '../assets/queue.jpg';
import zombieactor from '../assets/zombie-actor.jpg';
import parkEntryLandscape from '../assets/park-entry-landscape.png';
import { Box, Image, Center, Button, Text, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
    const navigate = useNavigate();
    return (
        <Box
            display="flex"
            flexDirection="column"
            bgSize="cover"
            bgImage={`url(${bgImage})`}
            overflow="visible"


        >
            <Header />
            <Center justifyContent="center">
                <Box pb="100px" >
                    <Image src={parkEntryLandscape} alt="Entrée du parc" width="100%" mx="auto" />
                </Box>
            </Center>
            <Button
                onClick={() => navigate('/reservation')}
                bgImage={`url(${bgImage})`}
                bgSize="cover"
                bgPosition="center"
                mx="auto"
                width="20%"
                color="zombieland.secondary"
                borderRadius="full"
                _hover={{ bg: "zombieland.cta2orange" }}
            >
                → Réserver maintenant
            </Button>
            <HStack
                spacing={8}
                align="center"
                justify="center"
                pb="100px"
            >
                {/* Image gauche */}
                <Box flex="1" >
                    <Image src={queue} alt="File d'attente" maxW="100%" />
                </Box>

                {/* Texte au centre */}
                <Box flex="1">
                    <Text textAlign="center" fontSize="lg">
                        Une ville abandonnée. Des zombies. Et vous. Bienvenue à ZombieLand, une expérience immersive où chaque attraction vous plonge au cœur d’un monde post-apocalyptique...
                        Ici, survivre fait partie du jeu. Arriverez vous à survivre? Maitriserez vous vos peurs? Bonne chance!!
                    </Text>
                </Box>

                {/* Image droite */}
                <Box flex="1">
                    <Image src={zombieactor} alt="Acteur" maxW="100%" height="75%" />
                </Box>
            </HStack>



            <Footer />
        </Box>
    );
};

export default HomePage;