// Admin page to see the list of the members, filter them, edit and delete them
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Flex, Heading, Input, Text, Select } from '@chakra-ui/react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import AdminNavlinkMenu from '../../components/AdminNavlinkMenu'
import ConfirmModal from '@/components/ConfirmModal'
import bgImage from '../../assets/bg-image.webp'
import bgBouton from '../../assets/bg-bouton.webp'
import type { Member } from '@/types/Member'
import { API_URL } from '@/config/api'
import axios from 'axios'

const AdminMemberEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [member, setMember] = useState<Member | null>(null)
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '', role: 'MEMBER' })
  const [message, setMessage] = useState('')
  const [reservations, setReservations] = useState<any[]>([])
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/${id}/profile`, {
          withCredentials: true
        })

        setMember(res.data)
        setForm({ firstname: res.data.firstname, lastname: res.data.lastname, email: res.data.email, password: '', role: res.data.role })

      } catch (error) {
        setMessage("Erreur lors de la récupération du membre")
      }
    }
    fetchMember()
  }, [id])

  const handleUpdate = async (currentPassword: string) => {
    try {
      await axios.patch(`${API_URL}/api/users/${id}/profile`,
        {
          firstname: form.firstname || undefined,
          lastname: form.lastname || undefined,
          email: form.email || undefined,
          password: form.password || undefined,
          role: form.role,
          currentPassword
        },
        {
          withCredentials: true,

        })
      setMessage('Profil mis à jour !')

    } catch (error) {
      setMessage('Une erreur est survenue.')

    }
  }

  const handleDelete = async () => {
    try {

      await axios.delete(`${API_URL}/api/users/${id}`, {

        withCredentials: true
      })
      navigate('/admin/members')
    } catch (error) {
      setMessage('Une erreur est survenue.')

    }
  }

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
      overflow="hidden">

      <Header />

      <Flex flex="1">

        {/* LEFT */}
        <Box minWidth="240px"
          maxWidth="240px"
          borderRight="1px solid rgba(255,255,255,0.1)">
          <AdminNavlinkMenu />
        </Box>

        {/* RIGHT */}
        <Box flex="1"
          p={3}
          pt="100px"
          pb="100px"
          maxW="600px"
          mx="auto"
          w="100%">

          <Heading
            color="zombieland.white"
            fontFamily="heading"
            fontSize="54px"
            textAlign="center"
            mb={8}>
            {member?.firstname} {member?.lastname}
          </Heading>

          <Text
            color="zombieland.white"
            mb={2}>
            Prénom
          </Text>
          <Input
            value={form.firstname}
            onChange={(e) =>
              setForm({ ...form, firstname: e.target.value })
            }
            mb={4} color="zombieland.white"
            borderColor="zombieland.primary"
            bg="rgba(0,0,0,0.3)"
          />

          <Text
            color="zombieland.white"
            mb={2}>
            Nom
          </Text>
          <Input
            value={form.lastname}
            onChange={(e) =>
              setForm({ ...form, lastname: e.target.value })
            }
            mb={4}
            color="zombieland.white"
            borderColor="zombieland.primary"
            bg="rgba(0,0,0,0.3)"
          />

          <Text
            color="zombieland.white"
            mb={2}>
            Email
          </Text>
          <Input
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            } mb={4}
            color="zombieland.white"
            borderColor="zombieland.primary"
            bg="rgba(0,0,0,0.3)"
          />

          <Text
            color="zombieland.white"
            mb={2}>
            Rôle
          </Text>
          <Select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
            mb={4}
            color="zombieland.white"
            borderColor="zombieland.primary"
            bg="rgba(0,0,0,0.3)">
            <option value="MEMBER">Membre</option>
            <option value="ADMIN">Admin</option>
          </Select>

          <Text
            color="zombieland.white"
            mb={2}>
            Nouveau mot de passe
          </Text>
          <Input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            } mb={6}
            color="zombieland.white"
            borderColor="zombieland.primary"
            bg="rgba(0,0,0,0.3)"
          />

          <Button
            onClick={() =>
              setIsUpdateModalOpen(true)
            }
            w="100%"
            bgImage={`url(${bgBouton})`}
            color="zombieland.secondary"
            borderRadius="full"
            mb={4}>
            → Sauvegarder
          </Button>

          {message &&
            <Text
              color="zombieland.white"
              textAlign="center"
              mt={2}>
              {message}
            </Text>}

          <Box
            w="100%"
            mb={6}
            p={6}
            borderRadius="md"
            bg="rgba(0,0,0,0.3)"
            border="2px solid"
            borderColor="zombieland.primary">

            <Text
              color="zombieland.white"
              fontWeight="bold"
              fontSize="18px"
              mb={4}
              textAlign="center">
              Dernières réservations du membre
            </Text>

            {reservations.filter((r: any) => r.status !== 'CANCELLED').length === 0 ? (
              <Text color="zombieland.white" textAlign="center">Aucune réservation active.</Text>
            ) : (
              reservations
                .filter((r: any) => r.status !== 'CANCELLED')
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 3) // Keep only the 3 most recent reservations
                .map((r: any) => (
                  <Box
                    key={r.id_RESERVATION}
                    mb={4} p={4}
                    borderRadius="md"
                    bg="rgba(0,0,0,0.3)"
                    borderLeft="3px solid"
                    borderColor="zombieland.primary">
                    <Text
                      color="zombieland.white">
                      - Date : {new Date(r.date).toLocaleDateString('fr-FR')}
                    </Text>
                    <Text
                      color="zombieland.white">
                      - Billets : {r.nb_tickets}
                    </Text>
                  </Box>
                ))
            )}

            <Button
              onClick={() =>
                navigate(`/admin/members/${id}/reservations`)
              }
              mt={4}
              w="100%"
              bgImage={`url(${bgBouton})`}
              color="zombieland.secondary"
              borderRadius="full">
              → Voir tout l'historique
            </Button>

          </Box>
          <Button
            onClick={() =>
              setIsDeleteModalOpen(true)}
            w="100%"
            bg="red.500"
            color="white"
            _hover={{ bg: "red.600" }}
            borderRadius="full"
            mt={8}>
            → Supprimer le compte
          </Button>
        </Box>

      </Flex>

      <Footer />

      <ConfirmModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onConfirm={(password) => handleUpdate(password)}
        title="Modifier le profil"
        message="Confirmez avec votre mot de passe admin." />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer le compte"
        message="Cette action est irréversible." />
    </Box>
  )
}

export default AdminMemberEdit