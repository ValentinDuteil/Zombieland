import { VStack, Flex, Box } from "@chakra-ui/react"
// import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"

export default function AdminMenu() {
    // const navigate = useNavigate()
    // const [loading, setLoading] = useState(true)

    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             const res = await fetch("/api/auth/me", {
    //                 credentials: "include",
    //             })

    //             if (!res.ok) {
    //                 navigate("/login")
    //                 return
    //             }

    //             const user = await res.json()

    //             if (user.role !== "ADMIN") {
    //                 navigate("/")
    //                 return
    //             }

    //             setLoading(false)
    //         } catch (err) {
    //             navigate("/login")
    //         }
    //     }

    //     checkAuth()
    // }, [navigate])

    // if (loading) {
    //     return (
    //         <div style={{ padding: 40 }}>
    //             Vérification des accès…
    //         </div>
    //     )
    // }

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
            end
            px={3}
            py={2}
            borderRadius="md"
            _hover={{
                border: "2px solid",
                bg: "zombieland.cta1orange",
                cursor: "pointer",
            }}
            
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

