// Admin page to see the list of the members, filter them, edit and delete them
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Flex, Heading, Input, Text, Select } from '@chakra-ui/react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import AdminNavlinkMenu from '../../components/AdminNavlinkMenu'
import ConfirmModal from '@/components/ConfirmModal'
import bgImage from '../../assets/bg-image.png'
import bgBouton from '../../assets/bg-bouton.png'
import type { Member } from '@/types/Member'

const AdminMemberEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [member, setMember] = useState<Member | null>(null)
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '', role: 'MEMBER' })
  const [message, setMessage] = useState('')
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    const fetchMember = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}/profile`, {
        credentials: 'include'
      })
      const data = await res.json()
      setMember(data)
      setForm({ firstname: data.firstname, lastname: data.lastname, email: data.email, password: '', role: data.role })
    }
    fetchMember()
  }, [id])

  const handleUpdate = async (currentPassword: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        firstname: form.firstname || undefined,
        lastname: form.lastname || undefined,
        email: form.email || undefined,
        password: form.password || undefined,
        role: form.role,
        currentPassword
      })
    })
    if (res.ok) setMessage('Profil mis à jour !')
    else setMessage('Une erreur est survenue.')
  }

  const handleDelete = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    if (res.ok) navigate('/admin/members')
    else setMessage('Une erreur est survenue.')
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" backgroundImage={`url(${bgImage})`} bgSize="cover">
      <Header />
      <Flex flex="1">
        <Box minWidth="240px" maxWidth="240px" borderRight="1px solid rgba(255,255,255,0.1)">
          <AdminNavlinkMenu />
        </Box>
        <Box flex="1" p={3} pt="100px" pb="100px" maxW="600px" mx="auto" w="100%">
          <Heading color="zombieland.white" fontFamily="heading" fontSize="54px" textAlign="center" mb={8}>
            {member?.firstname} {member?.lastname}
          </Heading>

          <Text color="zombieland.white" mb={2}>Prénom</Text>
          <Input value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.target.value })} mb={4} color="zombieland.white" borderColor="zombieland.primary" bg="rgba(0,0,0,0.3)" />

          <Text color="zombieland.white" mb={2}>Nom</Text>
          <Input value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })} mb={4} color="zombieland.white" borderColor="zombieland.primary" bg="rgba(0,0,0,0.3)" />

          <Text color="zombieland.white" mb={2}>Email</Text>
          <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} mb={4} color="zombieland.white" borderColor="zombieland.primary" bg="rgba(0,0,0,0.3)" />

          <Text color="zombieland.white" mb={2}>Rôle</Text>
          <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} mb={4} color="zombieland.white" borderColor="zombieland.primary" bg="rgba(0,0,0,0.3)">
            <option value="MEMBER">Membre</option>
            <option value="ADMIN">Admin</option>
          </Select>

          <Text color="zombieland.white" mb={2}>Nouveau mot de passe</Text>
          <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} mb={6} color="zombieland.white" borderColor="zombieland.primary" bg="rgba(0,0,0,0.3)" />

          <Button onClick={() => setIsUpdateModalOpen(true)} w="100%" bgImage={`url(${bgBouton})`} color="zombieland.secondary" borderRadius="full" mb={4}>
            → Sauvegarder
          </Button>

          {message && <Text color="zombieland.white" textAlign="center" mt={2}>{message}</Text>}

          <Button onClick={() => setIsDeleteModalOpen(true)} w="100%" bg="red.500" color="white" _hover={{ bg: "red.600" }} borderRadius="full" mt={8}>
            → Supprimer le compte
          </Button>
        </Box>
      </Flex>
      <Footer />

      <ConfirmModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} onConfirm={(password) => handleUpdate(password)} title="Modifier le profil" message="Confirmez avec votre mot de passe admin." />
      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title="Supprimer le compte" message="Cette action est irréversible." />
    </Box>
  )
}

export default AdminMemberEdit