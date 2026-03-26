// Footer component - footer navigation

import { Box, Flex, Text, Image } from '@chakra-ui/react'
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa'
import parkImage from '../assets/zombieland.png'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <Box bg="#2B2B2B" px={8} py={6}>

            {/* Desktop version */}
            <Flex
                justifyContent="space-between"
                alignItems="center"
                display={{ base: 'none', lg: 'flex' }}
            >
                {/* Social media on the left */}
                <Box>
                    <Text color="zombieland.white" fontWeight="bold" mb={3} fontFamily="body">
                        Suivez-nous sur les réseaux sociaux
                    </Text>
                    <Flex gap={4}>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">
                            <FaFacebook color="#FAEBDC" size={24} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">
                            <FaInstagram color="#FAEBDC" size={24} />
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noreferrer">
                            <FaTiktok color="#FAEBDC" size={24} />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer">
                            <FaYoutube color="#FAEBDC" size={24} />
                        </a>
                    </Flex>
                </Box>

                {/* Opening hours in the center */}
                <Box textAlign="center">
                    <Text color="zombieland.white" fontWeight="bold" mb={2} fontFamily="body">
                        Horaires d'ouverture du parc
                    </Text>
                    <Text color="zombieland.white" fontFamily="body">Du lundi au vendredi : 10h - 21h</Text>
                    <Text color="zombieland.white" fontFamily="body">Le week-end : 10h - 23h</Text>
                </Box>

                {/* Legal mentions on the right */}
                <Box textAlign="right">
                    <Link to="/faq">
                        <Text color="zombieland.white" cursor="pointer" mb={2} fontFamily="body">
                            FAQ - Mentions légales
                        </Text>
                    </Link>
                    <Text color="zombieland.white" fontFamily="body">
                        © 2026 Zombieland. Tous droits réservés.
                    </Text>
                </Box>
            </Flex>

            {/* Mobile version */}
            <Flex
                flexDirection="column"
                alignItems="center"
                gap={6}
                display={{ base: 'flex', lg: 'none' }}
            >
                {/* Social media */}
                <Box textAlign="center">
                    <Text color="zombieland.white" fontWeight="bold" mb={3} fontFamily="body">
                        Suivez-nous sur les réseaux sociaux
                    </Text>
                    <Flex gap={4} justifyContent="center">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">
                            <FaFacebook color="#FAEBDC" size={24} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">
                            <FaInstagram color="#FAEBDC" size={24} />
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noreferrer">
                            <FaTiktok color="#FAEBDC" size={24} />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer">
                            <FaYoutube color="#FAEBDC" size={24} />
                        </a>
                    </Flex>
                </Box>

                {/* Navigation links */}
                <Flex gap={6} justifyContent="center" flexWrap="wrap">
                    <Link to="/"><Text color="zombieland.white" cursor="pointer" fontFamily="body">Accueil</Text></Link>
                    <Link to="/attractions"><Text color="zombieland.white" cursor="pointer" fontFamily="body">Attractions</Text></Link>
                    <Link to="/plan"><Text color="zombieland.white" cursor="pointer" fontFamily="body">Plan</Text></Link>
                    <Link to="/contact"><Text color="zombieland.white" cursor="pointer" fontFamily="body">Contact</Text></Link>
                </Flex>

                {/* Opening hours */}
                <Box textAlign="center">
                    <Text color="zombieland.white" fontWeight="bold" mb={2} fontFamily="body">
                        Horaires d'ouverture du parc
                    </Text>
                    <Text color="zombieland.white" fontFamily="body">Du lundi au vendredi : 10h - 21h</Text>
                    <Text color="zombieland.white" fontFamily="body">Le week-end : 10h - 23h</Text>
                </Box>

                {/* Park image */}
                <Image
                    src={parkImage}
                    alt="Zombieland"
                    borderRadius="md"
                    w="100%"
                    maxW="350px"
                />

                {/* Legal mentions */}
                <Link to="/faq">
                    <Text color="zombieland.white" cursor="pointer" fontFamily="body">FAQ - Mentions légales</Text>
                </Link>
                <Text color="zombieland.white" fontFamily="body" textAlign="center">
                    © 2026 Zombieland. Tous droits réservés.
                </Text>
            </Flex>

        </Box>
    )
}

export default Footer