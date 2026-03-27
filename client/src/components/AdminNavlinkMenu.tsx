import { VStack, Flex, Box } from "@chakra-ui/react"
// import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"

export default function AdminMenu() {
    
    return (
        <Flex height="100%">
            {/* Sidebar */}
            <VStack
                width="300px"
                bg="gray.800"
                color="white"
                align="stretch"
                height="100%"
                spacing={8}
                p={4}


            >
                <SidebarLink to="/admin">Dashboard</SidebarLink>
                <SidebarLink to="/admin/attractions">Attractions</SidebarLink>
                <SidebarLink to="/admin/members">Membres</SidebarLink>
                <SidebarLink to="/admin/reservations">Réservations</SidebarLink>
            </VStack>


        </Flex>
    )
}

/* Composant réutilisable pour les liens */
function SidebarLink({ to, children }: { to: string, children: React.ReactNode }) {
    return (
        <Box
            as={NavLink}
            to={to}
            // Ensures the link is only active when the URL matches EXACTLY.
            // Without this, "/admin" is also considered active on "/admin/attractions".
            end
            px={3}
            py={2}
            borderRadius="md"
             // Hover style (normal behavior when the mouse is over the link)
            _hover={{
                border: "2px solid",
                bg: "zombieland.cta1orange",
                cursor: "pointer",
            }}
            // Style applied ONLY when the link is the active route
            _activeLink={{
                bg: "gray.700",
                fontWeight: "bold",
                border: "0.5px solid",
                borderColor: "zombieland.cta1orange",
            }}
        >
            {children}
        </Box>
    )
}

