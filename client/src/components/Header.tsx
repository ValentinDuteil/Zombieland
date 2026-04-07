// Header component - navigation bar

import { Box, Flex, Image, Text, IconButton, Menu, MenuItem, MenuList, MenuButton, MenuDivider } from '@chakra-ui/react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import logo from '../assets/logo.webp'
import { FaUserCircle } from 'react-icons/fa'
import axiosInstance from '@/lib/axiosInstance'
import { API_URL } from '@/config/api'

function Header() {
    const [firstname, setFirstname] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [role, setRole] = useState<string | null>(null)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(`${API_URL}/api/auth/me`, { withCredentials: true })
                const data = response.data
                setFirstname(data.firstname)
                setRole(data.role)
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        fetchUser()
    }, [location]) // re-fetch user on every route change to sync header state after login/logout

    const handleLogout = async () => {
        try {
            await axiosInstance.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true })
            setFirstname(null)
            navigate('/')
        } catch (error) {
            console.error(error)
        }
    }

    const isAdmin = role === 'ADMIN'

    // Shared menu item styles
    const publicStyle = {
        bg: "transparent",
        color: "zombieland.white",
        fontWeight: "bold",
        fontFamily: "body",
        _hover: { bg: 'whiteAlpha.200' }
    }

    const adminStyle = {
        bg: "transparent",
        color: "zombieland.cta1orange",
        fontWeight: "bold",
        fontFamily: "body",
        _hover: { bg: 'whiteAlpha.200' }
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

                    {/* Logo + desktop nav links */}
                    <Flex alignItems="center" gap={8}>
                        <Link to="/">
                            <Image src={logo} alt="ZombieLand" h="50px" cursor="pointer" />
                        </Link>
                        <Flex alignItems="center" gap={8} display={{ base: 'none', lg: 'flex' }}>
                            <Link to="/"><Text {...publicStyle}>Accueil</Text></Link>
                            <Link to="/reservation"><Text {...publicStyle}>Réservation</Text></Link>
                            <Link to="/attractions"><Text {...publicStyle}>Attractions</Text></Link>
                            <Link to="/plan"><Text {...publicStyle}>Plan</Text></Link>
                            <Link to="/contact"><Text {...publicStyle}>Contact</Text></Link>
                        </Flex>
                    </Flex>

                    {/* Desktop right side — login/register if not logged in, profile icon if logged in */}
                    <Flex gap={6} display={{ base: 'none', lg: 'flex' }} marginLeft="auto" alignItems="center">
                        {!isLoading && !firstname && (
                            <>
                                <Link to="/login"><Text {...publicStyle}>Connexion</Text></Link>
                                <Link to="/register"><Text {...publicStyle}>Inscription</Text></Link>
                            </>
                        )}
                        {!isLoading && firstname && (
                            <Flex alignItems="center" gap={2}>
                                <Text
                                    color="zombieland.cta1orange"
                                    fontFamily="body"
                                    fontWeight="bold"
                                    fontSize="13px"
                                >
                                    {firstname}
                                </Text>
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        aria-label="Mon compte"
                                        variant="ghost"
                                        color="zombieland.white"
                                        fontSize="24px"
                                        icon={<FaUserCircle />}
                                        _hover={{ bg: 'whiteAlpha.200' }}
                                        _active={{ bg: 'whiteAlpha.300' }}
                                    />
                                    <MenuList bg="#1A1A1A" borderColor="whiteAlpha.300">
                                        {isAdmin && (
                                            <>
                                                <MenuItem {...adminStyle} as={Link} to="/admin">Dashboard</MenuItem>
                                                <MenuItem {...adminStyle} as={Link} to="/admin/attractions">Attractions</MenuItem>
                                                <MenuItem {...adminStyle} as={Link} to="/admin/reservations">Réservations</MenuItem>
                                                <MenuItem {...adminStyle} as={Link} to="/admin/members">Membres</MenuItem>
                                                <MenuItem {...adminStyle} as={Link} to="/admin/tarifs">Tarifs</MenuItem>
                                                <MenuDivider borderColor="whiteAlpha.300" />
                                            </>
                                        )}
                                        <MenuItem {...publicStyle} as={Link} to="/my-account">Mon profil</MenuItem>
                                        <MenuItem {...publicStyle} onClick={handleLogout}>Se déconnecter</MenuItem>
                                    </MenuList>
                                </Menu>
                            </Flex>
                        )}
                    </Flex>

                    {/* Mobile right side — firstname indicator + burger menu */}
                    <Flex alignItems="center" gap={3}>
                        {!isLoading && firstname && (
                            <Text
                                display={{ base: 'flex', lg: 'none' }}
                                color="zombieland.cta1orange"
                                fontFamily="body"
                                fontWeight="bold"
                                fontSize="13px"
                            >
                                {firstname}
                            </Text>
                        )}

                        {/* Burger menu — mobile only */}
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                display={{ base: 'flex', lg: 'none' }}
                                aria-label="Menu"
                                variant="ghost"
                                color="zombieland.white"
                                fontSize="24px"
                                _hover={{ bg: 'whiteAlpha.200' }}
                                _active={{ bg: 'whiteAlpha.300' }}
                                icon={<Text>☰</Text>}
                            />
                            <MenuList bg="rgba(26, 26, 26, 0.95)" borderColor="whiteAlpha.300" minW="200px" p={2}>

                                {/* — SITE — */}
                                <Text px={3} py={1} fontSize="10px" color="whiteAlpha.500" textTransform="uppercase" letterSpacing="2px">
                                    Site
                                </Text>
                                <MenuItem {...publicStyle} as={Link} to="/">Accueil</MenuItem>
                                <MenuItem {...publicStyle} as={Link} to="/reservation">Réserver</MenuItem>
                                <MenuItem {...publicStyle} as={Link} to="/attractions">Nos attractions</MenuItem>
                                <MenuItem {...publicStyle} as={Link} to="/plan">Plan</MenuItem>
                                <MenuItem {...publicStyle} as={Link} to="/contact">Contact</MenuItem>

                                {/* — ADMIN — visible for admins only */}
                                {isAdmin && (
                                    <>
                                        <MenuDivider borderColor="whiteAlpha.300" />
                                        <Text px={3} py={1} fontSize="10px" color="zombieland.cta1orange" textTransform="uppercase" letterSpacing="2px">
                                            Admin
                                        </Text>
                                        <MenuItem {...adminStyle} as={Link} to="/admin">Dashboard</MenuItem>
                                        <MenuItem {...adminStyle} as={Link} to="/admin/attractions">Gestion des attractions</MenuItem>
                                        <MenuItem {...adminStyle} as={Link} to="/admin/attractions/create">Nouvelle attraction</MenuItem>
                                        <MenuItem {...adminStyle} as={Link} to="/admin/reservations">Gestion des réservations</MenuItem>
                                        <MenuItem {...adminStyle} as={Link} to="/admin/members">Gestion des membres</MenuItem>
                                        <MenuItem {...adminStyle} as={Link} to="/register">Nouveau membre</MenuItem>
                                        <MenuItem {...adminStyle} as={Link} to="/admin/tarifs">Gestion des prix</MenuItem>
                                    </>
                                )}

                                {/* — MY ACCOUNT — */}
                                <MenuDivider borderColor="whiteAlpha.300" />
                                <Text px={3} py={1} fontSize="10px" color="whiteAlpha.500" textTransform="uppercase" letterSpacing="2px">
                                    My account
                                </Text>
                                {firstname ? (
                                    <>
                                        <MenuItem {...publicStyle} as={Link} to="/my-account">Mon profil</MenuItem>
                                        <MenuItem {...publicStyle} onClick={handleLogout}>Se déconnecter</MenuItem>
                                    </>
                                ) : (
                                    <>
                                        <MenuItem {...publicStyle} as={Link} to="/login">Connexion</MenuItem>
                                        <MenuItem {...publicStyle} as={Link} to="/register">Inscription</MenuItem>
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