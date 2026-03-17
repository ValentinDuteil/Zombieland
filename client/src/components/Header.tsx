// Header component - navigation bar

import { Box, Flex, Image, Text, IconButton, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import logo from '../assets/logo.png'

function Header() {
    // State to manage the burger menu open/close
    const [isOpen, setIsOpen] = useState(false)

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

                {/* Logo + navigation links grouped on the left */}
                <Flex alignItems="center" gap={8}>
                    <Image src={logo} alt="ZombieLand" h="50px" />

                    {/* Navigation links - hidden on mobile */}
                    <Flex alignItems="center" gap={8} display={{ base: 'none', lg: 'flex' }}>
                        <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Accueil</Text>
                        <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Attractions</Text>
                        <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Plan</Text>
                        <Link to="/reservation">
                            <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Réserver</Text>
                        </Link>                        <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Contact</Text>
                    </Flex>
                </Flex>

                {/* Login and register links on the right - hidden on mobile */}
                <Flex gap={6} display={{ base: 'none', lg: 'flex' }}>
                    <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Connexion</Text>
                    <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Inscription</Text>
                </Flex>

                {/* Burger menu button - visible on mobile only */}
                <IconButton
                    display={{ base: 'flex', lg: 'none' }}
                    aria-label="Menu"
                    variant="ghost"
                    color="zombieland.white"
                    fontSize="24px"
                    icon={<Text>☰</Text>}
                    onClick={() => setIsOpen(!isOpen)}
                />
            </Flex>

            {/* slides in from the right on mobile, takes 1/3 of screen width */}
            {isOpen && (
                <Box
                    position="fixed"
                    top={0}
                    right={0}
                    h="100vh"
                    w="33%"
                    bg="rgba(26, 26, 26, 0.2)"
                    backdropFilter="blur(8px)"
                    zIndex={99}
                    display={{ base: 'flex', lg: 'none' }}
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    {/* Close button inside the drawer */}
                    <Text
                        position="absolute"
                        top={4}
                        right={4}
                        color="zombieland.white"
                        fontSize="24px"
                        cursor="pointer"
                        onClick={() => setIsOpen(false)}
                    >
                        ✕
                    </Text>

                    <VStack alignItems="center" gap={4} w="100%">
                        <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Accueil</Text>
                        <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Attractions</Text>
                        <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Plan</Text>
                        <Link to="/reservation" onClick={() => setIsOpen(false)}>
                            <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Réserver</Text>
                        </Link>                        <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Contact</Text>
                        <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Connexion</Text>
                        <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Inscription</Text>
                    </VStack>
                </Box>
            )}
        </Box>
    )
}

export default Header