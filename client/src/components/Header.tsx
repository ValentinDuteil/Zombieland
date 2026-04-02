// Header component - navigation bar

import { Box, Flex, Image, Text, IconButton, Menu, MenuItem, MenuList, MenuButton } from '@chakra-ui/react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import logo from '../assets/logo.webp'
import { FaUserCircle } from 'react-icons/fa'
import axios from 'axios'
import { API_URL } from '@/config/api'

function Header() {
    // State to manage the burger menu open/close

    const [firstname, setFirstname] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const [role, setRole] = useState<string | null>(null)
    const location = useLocation()
    const isAdminPage = location.pathname.startsWith('/admin')


    useEffect(() => {
        const fetchUser = async () => {
            try {
                
                const response = await axios.get(`${API_URL}/api/auth/me`,
    
                    { withCredentials: true },
                );
                const data = response.data
                setFirstname(data.firstname)
                setRole(data.role)
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        fetchUser()
    }, [location]) // re-fetch user on every route change to sync header state after login/logout via modal

    const handleLogout = async () => {
        try {

            await axios.post(`${API_URL}/api/auth/logout`,
                {},
                {
                    withCredentials: true,
                });
            setFirstname(null);
            navigate('/')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Box>
            <Box
                bg="#1A1A1A"
                px={8}
                py={4}
                top={0}
                left={0}
                right={0}
                zIndex={100}
            >
                <Flex alignItems="center" justifyContent="space-between">
                    {/* Logo + navigation links grouped on the left */}
                    <Flex alignItems="center" gap={8}>
                        <Link to="/">
                            <Image
                                src={logo}
                                alt="ZombieLand"
                                h="50px"
                                cursor="pointer"
                            />
                        </Link>

                        <Flex alignItems="center" gap={8} display={{ base: 'none', lg: 'flex' }}>
                            <Link to="/">
                                <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Accueil</Text>
                            </Link>
                            <Link to="/reservation">
                                <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Réservation</Text>
                            </Link>
                            <Link to="/attractions">
                                <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Attractions</Text>
                            </Link>
                            <Link to="/plan">
                                <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Plan</Text>
                            </Link>
                            <Link to="/contact">
                                <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Contact</Text>
                            </Link>
                        </Flex>
                    </Flex>

                    {/* Login and register links on the right - hidden on mobile */}
                    <Flex gap={6} display={{ base: 'none', lg: 'flex' }} marginLeft="auto">
                        {isLoading ? (
                            <Box w="120px" h="24px" />
                        ) : !firstname ? (
                            <>
                                <Link to="/login">
                                    <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Connexion</Text>
                                </Link>
                                <Link to="/register">
                                    <Text color="zombieland.white" cursor="pointer" fontWeight="bold" fontFamily="body">Inscription</Text>
                                </Link>
                            </>
                        ) : null}
                    </Flex>


                    <Flex alignItems="center" gap={3}>
                        {!isLoading && firstname && (
                            <Menu>
                                <MenuButton
                                    as={IconButton}
                                    mt="8px"
                                    display="flex"
                                    aria-label="Mon compte"
                                    variant="ghost"
                                    color="zombieland.white"
                                    fontSize="24px"
                                    icon={<FaUserCircle />}
                                    _hover={{ bg: 'whiteAlpha.200' }}
                                    _active={{ bg: 'whiteAlpha.300' }}
                                />
                                <MenuList bg="#1A1A1A" borderColor="whiteAlpha.300">
                                    <MenuItem
                                        bg="#1A1A1A"
                                        color="zombieland.white"
                                        fontWeight="bold"
                                        fontFamily="body"
                                        _hover={{ bg: 'whiteAlpha.200' }}
                                        as={Link}
                                        to="/my-account"
                                    >
                                        Mon profil
                                    </MenuItem>
                                    {firstname && role === 'ADMIN' && (
                                        <>
                                            <MenuItem bg="transparent" color="zombieland.cta1orange" fontWeight="bold" fontFamily="body" _hover={{ bg: 'whiteAlpha.200' }} as={Link} to="/admin">
                                                Dashboard
                                            </MenuItem>
                                        <Box display={{ base: 'block', lg:'none' }}>
                                            {isAdminPage && (
                                                <>
                                                    <MenuItem bg="transparent" color="zombieland.cta1orange" fontWeight="bold" fontFamily="body" _hover={{ bg: 'whiteAlpha.200' }} as={Link} to="/admin/attractions">
                                                        Attractions
                                                    </MenuItem>
                                                    <MenuItem bg="transparent" color="zombieland.cta1orange" fontWeight="bold" fontFamily="body" _hover={{ bg: 'whiteAlpha.200' }} as={Link} to="/admin/reservations">
                                                        Réservations
                                                    </MenuItem>
                                                    <MenuItem bg="transparent" color="zombieland.cta1orange" fontWeight="bold" fontFamily="body" _hover={{ bg: 'whiteAlpha.200' }} as={Link} to="/admin/members">
                                                        Membres
                                                    </MenuItem>
                                                    <MenuItem bg="transparent" color="zombieland.cta1orange" fontWeight="bold" fontFamily="body" _hover={{ bg: 'whiteAlpha.200' }} as={Link} to="/admin/tarifs">
                                                        Tarifs
                                                    </MenuItem>
                                                    </>
                                            )}
                                            </Box>
                                            </>
                                    )}

                                    <MenuItem
                                        bg="#1A1A1A"
                                        color="zombieland.white"
                                        fontWeight="bold"
                                        fontFamily="body"
                                        _hover={{ bg: 'whiteAlpha.200' }}
                                        onClick={handleLogout}
                                    >
                                        Se déconnecter
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        )}

                        {/* Burger menu - visible on mobile only */}
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                display={{ base: 'flex', lg: 'none' }}
                                aria-label="Menu"
                                variant="ghost"
                                color="zombieland.white"
                                fontSize="24px"
                                icon={<Text>☰</Text>}
                            />
                            <MenuList bg="rgba(26, 26, 26, 0.95)" borderColor="whiteAlpha.300" minW="200px" p={2}>
                                <MenuItem bg="transparent" color="zombieland.white" fontWeight="bold" fontFamily="body" _hover={{ bg: 'whiteAlpha.200' }} as={Link} to="/">Accueil</MenuItem>
                                <MenuItem bg="transparent" color="zombieland.white" fontWeight="bold" fontFamily="body" _hover={{ bg: 'whiteAlpha.200' }} as={Link} to="/reservation">Réserver</MenuItem>
                                <MenuItem bg="transparent" color="zombieland.white" fontWeight="bold" fontFamily="body" _hover={{ bg: 'whiteAlpha.200' }} as={Link} to="/attractions">Attractions</MenuItem>
                                <MenuItem bg="transparent" color="zombieland.white" fontWeight="bold" fontFamily="body" _hover={{ bg: 'whiteAlpha.200' }} as={Link} to="/plan">Plan</MenuItem>
                                <MenuItem bg="transparent" color="zombieland.white" fontWeight="bold" fontFamily="body" _hover={{ bg: 'whiteAlpha.200' }} as={Link} to="/contact">Contact</MenuItem>

                                {/* Show connexion/inscription only if not logged in */}
                                {!firstname && (
                                    <>
                                        <MenuItem bg="transparent" color="zombieland.white" fontWeight="bold" fontFamily="body" _hover={{ bg: 'whiteAlpha.200' }} as={Link} to="/login">Connexion</MenuItem>
                                        <MenuItem bg="transparent" color="zombieland.white" fontWeight="bold" fontFamily="body" _hover={{ bg: 'whiteAlpha.200' }} as={Link} to="/register">Inscription</MenuItem>
                                    </>
                                )}
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    )
}

export default Header