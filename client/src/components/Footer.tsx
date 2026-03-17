// Footer component - footer navigation

import { Box, Flex, Text } from '@chakra-ui/react'
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa'

function Footer() {
    return (
        <Box
            bg="#2B2B2B"
            px={8}
            py={3}
        >
            <Flex justifyContent="space-between" alignItems="center">

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
                    <Text color="zombieland.white" cursor="pointer" mb={2} fontFamily="body">
                        FAQ - Mentions légales
                    </Text>
                    <Text color="zombieland.white" fontFamily="body">
                        © 2026 Zombieland. Tous droits réservés.
                    </Text>
                </Box>

            </Flex>
        </Box>
    )
}

export default Footer