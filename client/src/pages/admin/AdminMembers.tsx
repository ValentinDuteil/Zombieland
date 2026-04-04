// Admin page to see the list of the members, filter them, edit and delete them

import { useEffect, useState } from "react"
import { Box, Button, Text, Input, Flex, Spinner, Heading } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import AdminTable from "@/components/AdminTable"
import AdminNavlinkMenu from "@/components/AdminNavlinkMenu"

import type { Member } from "@/types/Member"
import { formatDateForDisplay } from "@/utils/date"

import bgImage from '../../assets/bg-bouton.webp'
import { API_URL } from "@/config/api"
import axiosInstance from "@/lib/axiosInstance"

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
    setLoading(true)
    try {
      const res = await axiosInstance.get<Member[]>(`${API_URL}/api/users`, {
        withCredentials: true
      })
      setMembers(res.data)
    } catch (error) {
      setError("Erreur lors de la récupération des membres")
    } finally {
      setLoading(false)
    }
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
      m.created_at.trim().toLowerCase().includes(filterTool) || m._count.reservations.toString().includes(filterTool))
    .sort((a, b) => {
      // If we sort by creation date
      if (sort.by === "created_at") {
        // We need to convert the date string to timestamps thanks to getTime() and then we sort by asc or desc
        return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * (sort.direction === "asc" ? 1 : -1)
      }
      // If we sort by number of reservations
      if (sort.by === "_count.reservations") {
        return (a._count.reservations - b._count.reservations) * (sort.direction === "asc" ? 1 : -1)
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

  const handleSortChange = (by: "lastname" | "firstname" | "email" | "role" | "_count.reservations" | "created_at") => {
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
    "Réservations": "_count.reservations",
    "Créé le": "created_at"
  } as const // tells to TypeScript that the values are exactly these strings, not any string

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgRepeat="no-repeat"
      bgAttachment="fixed"
      bgPosition="center top"
      w="100%"
      overflow="hidden"
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
          <Heading
                                  fontWeight="bold"
                                  color="zombieland.white"
                                  textAlign="left"
                                  fontFamily="body"
                                  fontSize="24px"
                                  mb={8}
                              >
                                  Admin / Members
                              </Heading>

          {/* Create member button */}
          <Flex justifyContent="center" mt={8} mb={6}>
            <Button
              bg="zombieland.cta1orange"
              color="zombieland.white"
              _hover={{ opacity: 0.85, boxShadow: "0 8px 16px rgba(0,0,0,0.6)" }}
              fontSize="18px"
              py={6}
              px={12}
              borderRadius="md"
              fontWeight="bold"
              fontFamily="heading"
              boxShadow="0 4px 15px rgba(0,0,0,0.4)"
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
            borderColor="zombieland.white"
            bg="rgba(0,0,0,0.3)"
            _placeholder={{ color: "zombieland.white" }}
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