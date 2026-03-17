// Header component - navigation bar

import { Box, Flex, Image, Text } from '@chakra-ui/react'
import logo from '../assets/logo.png'

function Header() {
    return (
        <Box
            bg="#1A1A1A"
            px={8}
            py={4}
            position="fixed"
            top={0}
            left={0}
            right={0}
            zIndex={100}
        >
            <Flex alignItems="center" justifyContent="space-between">

                {/* Logo and navigation on the left */}
                <Flex alignItems="center" gap={8}>
                    <Image src={logo} alt="ZombieLand" h="50px" />
                    <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Accueil</Text>
                    <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Attractions</Text>
                    <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Plan</Text>
                    <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Réserver</Text>
                    <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Contact</Text>
                </Flex>

                {/* Login and Register on the right */}
                <Flex gap={6}>
                    <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Connexion</Text>
                    <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Inscription</Text>
                </Flex>

            </Flex>
        </Box>
    )
}

export default Header