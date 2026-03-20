import Header from "../components/Header";
import Footer from "../components/Footer";
import bgImage from '../assets/bg-image.png';
import { Box } from "@chakra-ui/react";


const HomePage = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            bgAttachment="fixed"
            bgImage={`url(${bgImage})`}
        >
            <Header />
            <Box flex="1" p={3} pt="100px" pb="100px"></Box>
            <Footer />

        </Box>
            )};

export default HomePage;