import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Box, Button, Heading, Flex, Input, Text } from '@chakra-ui/react'
import barbed from '../assets/barbed-bg.webp'
import bgBouton from '../assets/bg-bouton.webp'
import bgImage from '../assets/bg-image.webp'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AdminMenu from '../components/AdminNavlinkMenu'
import { PageBackground } from '../components/PageBackground'
import { API_URL } from '@/config/api'
import axiosInstance from '@/lib/axiosInstance'
import { isAxiosError } from 'axios'

function Register() {
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '', confirmPassword: '' })
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentUser, setCurrentUser] = useState<{ role: string } | null>(null)

  // Fetch current user on mount — same pattern as MyReservations
  useEffect(() => {
    axiosInstance.get(`${API_URL}/api/auth/me`, { withCredentials: true })
      .then(res => setCurrentUser(res.data))
      .catch(() => setCurrentUser(null)) // not logged in → public layout
  }, [])

  const isAdmin = currentUser?.role === 'ADMIN'

  const handleSubmit = async () => {
    if (form.password === form.confirmPassword) {
      try {
        await axiosInstance.post(`${API_URL}/api/auth/register`,
          { firstname: form.firstname, lastname: form.lastname, email: form.email, password: form.password },
          { withCredentials: true }
        )
        setMessage('Bienvenue : compte créé !')
        if (isAdmin) {
          navigate('/admin/members')
        } else {
          navigate('/reservation')
        }
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.data.details) {
            const newErrors: Record<string, string> = {}
            error.response?.data.details.forEach((d: { champ: string, message: string }) => {
              newErrors[d.champ] = d.message
            })
            setErrors(newErrors)
          } else {
            setMessage(error.response?.data.message || 'Une erreur est survenue.')
          }
        } else {
          setMessage('Une erreur est survenue.')
        }
      }
    } else {
      setErrors({ confirmPassword: 'Les mots de passe ne correspondent pas.' })
    }
  }

  // Form content — shared between admin and public layouts
  const formContent = (
    <Box w="100%" maxW="500px" p={10} borderRadius="md">
      <Heading
        mb={8}
        textAlign="center"
        fontFamily="heading"
        fontSize={{ base: "36px", md: "54px" }}
        color="zombieland.white"
      >
        {isAdmin ? "Créer un membre" : "Inscription"}
      </Heading>

      <Flex gap={4} mb={4}>
        <Box flex={1}>
          <Text mb={2} color="zombieland.white" fontWeight="300">Nom</Text>
          <Input
            type="text"
            placeholder="Doe"
            value={form.lastname}
            onChange={(e) => setForm({ ...form, lastname: e.target.value })}
            bg="rgba(0,0,0,0.3)"
            color="zombieland.white"
            borderColor="zombieland.primary"
            boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
            _placeholder={{ color: 'zombieland.white', opacity: 0.5 }}
          />
          {errors.lastname && <Text color="zombieland.warningprimary" fontSize="sm">{errors.lastname}</Text>}
        </Box>
        <Box flex={1}>
          <Text mb={2} color="zombieland.white" fontWeight="300">Prénom</Text>
          <Input
            type="text"
            placeholder="John"
            value={form.firstname}
            onChange={(e) => setForm({ ...form, firstname: e.target.value })}
            bg="rgba(0,0,0,0.3)"
            color="zombieland.white"
            borderColor="zombieland.primary"
            boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
            _placeholder={{ color: 'zombieland.white', opacity: 0.5 }}
          />
          {errors.firstname && <Text color="zombieland.warningprimary" fontSize="sm">{errors.firstname}</Text>}
        </Box>
      </Flex>

      <Text mb={2} color="zombieland.white" fontWeight="300">Email</Text>
      <Input
        type="email"
        placeholder="Votre email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        bg="rgba(0,0,0,0.3)"
        color="zombieland.white"
        borderColor="zombieland.primary"
        boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
        _placeholder={{ color: 'zombieland.white', opacity: 0.5 }}
        mb={4}
      />
      {errors.email && <Text color="zombieland.warningprimary" fontSize="sm">{errors.email}</Text>}

      <Text mb={2} color="zombieland.white" fontWeight="300">Mot de passe</Text>
      <Input
        type="password"
        placeholder="Votre mot de passe"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        bg="rgba(0,0,0,0.3)"
        color="zombieland.white"
        borderColor="zombieland.primary"
        boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
        _placeholder={{ color: 'zombieland.white', opacity: 0.5 }}
        mb={4}
      />
      {errors.password && <Text color="zombieland.warningprimary" fontSize="sm">{errors.password}</Text>}

      <Text mb={2} color="zombieland.white" fontWeight="300">Confirmer le mot de passe</Text>
      <Input
        type="password"
        placeholder="Confirmez votre mot de passe"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        bg="rgba(0,0,0,0.3)"
        color="zombieland.white"
        borderColor="zombieland.primary"
        boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
        _placeholder={{ color: 'zombieland.white', opacity: 0.5 }}
        mb={6}
      />
      {errors.confirmPassword && <Text color="zombieland.warningprimary" fontSize="sm">{errors.confirmPassword}</Text>}

      <Button
        onClick={handleSubmit}
        bgImage={`url(${bgBouton})`}
        color="zombieland.secondary"
        _hover={{ bg: "zombieland.cta2orange", color: "zombieland.white" }}
        fontFamily="body"
        fontSize="20px"
        py={6}
        px={3}
        w="100%"
        borderRadius="full"
        letterSpacing="1px"
        fontWeight="bold"
        boxShadow="inset 0 2px 8px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.5)"
        textTransform="uppercase"
        aria-label="S'inscrire à Zombieland"
      >
        {isAdmin ? "→ CRÉER LE COMPTE" : "→ REJOINDRE L'HORREUR"}
      </Button>

      {message && (
        <Text
          mt={4}
          textAlign="center"
          fontFamily="body"
          fontWeight="300"
          color={message.includes('créé') ? 'zombieland.white' : 'zombieland.warningprimary'}
        >
          {message}
        </Text>
      )}
    </Box>
  )

  // Admin layout — with sidebar
  if (isAdmin) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        bgImage={`url(${barbed})`}
        bgSize="cover"
        bgRepeat="no-repeat"
        bgAttachment="fixed"
        bgPosition="center top"
        w="100%"
        overflowX="hidden"
        overflowY="auto"
      >
        <Header />
        <Flex flex="1">
          {/* LEFT COLUMN — sidebar */}
          <Box
            width={{ base: "0px", lg: "250px" }}
            minWidth={{ base: "0px", lg: "250px" }}
            overflow="hidden"
            transition="width 0.3s ease, min-width 0.3s ease"
            borderRight="1px solid rgba(255,255,255,0.1)"
          >
            <AdminMenu />
          </Box>
          {/* RIGHT COLUMN — content */}
          <Box
            flex="1"
            minWidth="0"
            px={{ base: 4, md: 10 }}
            pt="60px"
            pb="100px"
            display="flex"
            justifyContent="center"
          >
            {formContent}
          </Box>
        </Flex>
        <Footer />
      </Box>
    )
  }

  // Public layout
  return (
    <PageBackground bgImage={bgImage}>
      <Header />
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="70vh"
        w="100%"
        px={{ base: 4, md: 0 }}
      >
        {formContent}
      </Box>
      <Footer />
    </PageBackground>
  )
}

export default Register