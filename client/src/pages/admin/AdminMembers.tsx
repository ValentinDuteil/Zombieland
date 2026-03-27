// Admin page to see the list of the members, filter them, edit and delete them

import { useEffect, useState } from "react"
import { Box, Button, Text, Input, Flex, Spinner } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import AdminTable from "@/components/AdminTable"
import AdminNavlinkMenu from "@/components/AdminNavlinkMenu"

import type { Member } from "@/types/Member"
import { formatDateForDisplay } from "@/utils/date"

import bgBouton from '../../assets/bg-bouton.png'
import bgImage from '../../assets/bg-image.png'

const AdminMembers = () => {
  // State for members, loading and error
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // State for filters and sorting
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState({ by: "lastname", direction: "asc" })
  // Navigate hook
  const navigate = useNavigate()

  // Fetch members from API
  const fetchMembers = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      credentials: "include"
    })

    if (!res.ok) {
      setError("Erreur lors de la récupération des membres")
      setLoading(false)
      return
    }
    const data: Member[] = await res.json()
    setMembers(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const filterTool = search.trim().toLowerCase()
  const filteredMembers = members
    .filter(m => m.firstname.trim().toLowerCase().includes(filterTool) ||
      m.lastname.trim().toLowerCase().includes(filterTool) ||
      m.email.trim().toLowerCase().includes(filterTool) ||
      (m.role === "ADMIN" ? "admin" : "membre").includes(filterTool) ||
      m.created_at.trim().toLowerCase().includes(filterTool))
    .sort((a, b) => {
      // If we sort by creation date
      if (sort.by === "created_at") {
        // We need to convert the date string to timestamps thanks to getTime() and then we sort by asc or desc
        return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * (sort.direction === "asc" ? 1 : -1)
      }
      // If we sort by role, we want admins first in asc and members first in desc
      if (sort.by === "role") {
        return a.role.localeCompare(b.role) * (sort.direction === "asc" ? 1 : -1)
      }
      // If we sort by email
      if (sort.by === "email") {
        return a.email.localeCompare(b.email) * (sort.direction === "asc" ? 1 : -1)
      }
      // If we sort by firstname
      if (sort.by === "firstname") {
        return a.firstname.localeCompare(b.firstname) * (sort.direction === "asc" ? 1 : -1)
      }
      // If not, we sort by lastname by default
      return a.lastname.localeCompare(b.lastname) * (sort.direction === "asc" ? 1 : -1)
    })

  const handleSortChange = (by: "lastname" | "firstname" | "email" | "role" | "created_at") => {
    if (sort.by === by) {
      setSort({ by, direction: sort.direction === "asc" ? "desc" : "asc" })
    } else {
      setSort({ by, direction: "asc" })
    }
  }

  const headerToField = {
    "Nom": "lastname",
    "Prénom": "firstname",
    "Email": "email",
    "Rôle": "role",
    "Créé le": "created_at"
  } as const // tells to TypeScript that the values are exactly these strings, not any string

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      backgroundImage={`url(${bgImage})`}
      bgSize="cover"
    >
      <Header />
      <Flex flex="1">
        {/*LEFT COLUMN*/}
        <Box
          display={{ base: 'none', lg: 'block' }}
          minWidth="240px"
          maxWidth="240px"
          borderRight="1px solid rgba(255,255,255,0.1)"
        >
          <AdminNavlinkMenu />
        </Box>
        {/*right COLUMN*/}
        <Box
          flex="1"
          p={3}
          pt="100px"
          pb="100px"
          maxW="1000px"
          mx="auto"
          w="100%">

          <Text
            fontWeight="bold"
            color="zombieland.white"
            mb={6}
            textAlign="center"
            fontFamily="heading"
            fontSize="54px">
            Gestion des membres
          </Text>

          {/* Create member button */}
                    <Flex justifyContent="center" mt={8} mb={6}>
                        <Button
                            bgImage={`url(${bgBouton})`}
                            bgSize="cover"
                            bgPosition="center"
                            color="zombieland.white"
                            border="none"
                            _hover={{
                                opacity: 0.85,
                                boxShadow: "0 8px 16px rgba(0,0,0,0.6), 0 0 30px rgba(250, 130, 52, 0.3)"
                            }}
                            fontFamily="heading"
                            fontSize="18px"
                            py={6}
                            px={12}
                            borderRadius="md"
                            letterSpacing="1px"
                            fontWeight="bold"
                            boxShadow="0 4px 15px rgba(250, 130, 52, 0.25)"
                            transition="all 0.3s ease"
                            onClick={() => navigate('/register')}
                        >
                            Créer un nouveau membre
                        </Button>
                    </Flex>

          {/* Searchbar */}
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un membre..."
            color="zombieland.white"
            borderColor="zombieland.primary"
            bg="rgba(0,0,0,0.3)"
            mb={6}
          />

          {/* Loading spinner */}
          {loading && (
            <Flex justify="center" mt={10}>
              <Spinner color="zombieland.primary" size="xl" />
            </Flex>
          )}

          {error && <Text color="red.400">{error}</Text>}

          {/* Members table */}
          {!loading && (
            <AdminTable
              data={filteredMembers}
              onHeaderClick={(header) => {
                const field = headerToField[header as keyof typeof headerToField]
                if (field) {
                  handleSortChange(field)
                }
              }}
              onRowClick={(m) => navigate(`/admin/members/${m.id_USER}`)}
              columns={[
                {
                  header: "Nom",
                  render: (m) => (
                    <Text
                      fontWeight="bold"
                      cursor="pointer"
                      _hover={{ color: "zombieland.cta1orange", textDecoration: "underline" }}
                    >
                      {m.lastname}
                    </Text>
                  )
                },
                {
                  header: "Prénom",
                  render: (m) => (
                    <Text>{m.firstname}</Text>)
                },
                {
                  header: "Email",
                  render: (m) => m.email
                },
                {
                  header: "Rôle",
                  render: (m) => m.role === "ADMIN" ? "Admin" : "Membre"
                },
                {
                  header: "Réservations",
                  render: (m) => m._count.reservations
                },
                {
                  header: "Créé le",
                  render: (m) => formatDateForDisplay(m.created_at)
                }
              ]} />
          )}
        </Box>
      </Flex>
      <Footer />
    </Box>
  )
}

export default AdminMembers