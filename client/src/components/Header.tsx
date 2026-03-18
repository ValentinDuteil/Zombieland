// Header component - navigation bar

import { Box, Flex, Image, Text, IconButton, VStack } from '@chakra-ui/react'
import { Drawer, DrawerBody, DrawerOverlay, DrawerContent } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import logo from '../../public/assets/logo.png'

function Header() {
    // State to manage the burger menu open/close
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Box isolation="isolate">
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
                            <Link to="/">
                                <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Accueil</Text>
                            </Link>
                            <Link to="/attractions">
                                <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Attractions</Text>
                            </Link>
                            <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Plan</Text>
                            <Link to="/reservation">
                                <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Réserver</Text>
                            </Link>                        <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Contact</Text>
                        </Flex>
                    </Flex>

                    {/* Login and register links on the right - hidden on mobile */}
                    <Flex gap={6} display={{ base: 'none', lg: 'flex' }}>
                        <Link to="/login">
                            <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Connexion</Text>
                        </Link>
                        <Link to="/register">
                            <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Inscription</Text>
                        </Link>
                    </Flex>

                    {/* Burger menu button - visible on mobile only */}
                    <IconButton
                        // responsive
                        display={{ base: 'flex', lg: 'none'}} // mobile 
                        aria-label="Menu"
                        variant="ghost"
                        color="zombieland.white"
                        fontSize="24px"
                        icon={<Text>☰</Text>}
                        onClick={() => setIsOpen(!isOpen)}

                    />
                </Flex>
            </Box>
            {/* slides in from the right on mobile, takes 1/3 of screen width */}

            {/* for burger menu ok */}
            <Drawer isOpen={isOpen} placement="right" onClose={() => setIsOpen(false)} size="xs">
                <DrawerOverlay />
                <DrawerContent bg="rgba(26, 26, 26, 0.3)" backdropFilter="blur(8px)">
                    <DrawerBody display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                        <VStack alignItems="center" gap={4} w="100%">
                            <Link to="/" onClick={() => setIsOpen(false)}>
                                <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Accueil</Text>
                            </Link>
                            <Link to="/attractions" onClick={() => setIsOpen(false)}>
                                <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Attractions</Text>
                            </Link>
                            <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Plan</Text>
                            <Link to="/reservation" onClick={() => setIsOpen(false)}>
                                <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Réserver</Text>
                            </Link>
                            <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Contact</Text>
                            <Link to="/login" onClick={() => setIsOpen(false)}>
                                <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Connexion</Text>
                            </Link>
                            <Link to="/register" onClick={() => setIsOpen(false)}>
                                <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Inscription</Text>
                            </Link>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    )
}

export default Header