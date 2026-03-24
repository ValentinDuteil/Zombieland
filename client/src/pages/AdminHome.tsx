import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Box, Heading } from "@chakra-ui/react";
import centrerecherche from "../assets/centrerecherche.png";
import AdminNavlinkMenu from "@/components/AdminNavlinkMenu";

const AdminHomePage = () => {
    return (
        <Box
            minH="100vh"
            bgImage={`url(${centrerecherche})`}
            bgSize="cover"
            bgPosition="center"
            bgAttachment="fixed"
            display="flex"
            flexDirection="column"
        >
            <Header />
            <AdminNavlinkMenu />

            <Heading
                mb={8}
                textAlign="center"
                fontFamily="heading"
                fontSize="54px"
                color="zombieland.white"
            >
                Zombieland Admin
            </Heading>

            <Footer />
        </Box>
    );
};

export default AdminHomePage;