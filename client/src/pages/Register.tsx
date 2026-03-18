// Register page - to be connected

//To be changed as an overlay/pop-up later for a better UX
//Waiting for a refacto with cookies httpOnly instead of localstorage
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Box, Button, Heading, Flex, Input, Text } from '@chakra-ui/react'
import bgImage from '../assets/bg-image.png'
import bgBouton from '../assets/bg-bouton.png'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Register() {
  //setting the changing of the inputs and the validation message as well
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {

    if (form.password === form.confirmPassword) {
      //fetching on the api with post methode
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname: form.firstname, lastname: form.lastname, email: form.email, password: form.password })
      })
      //only if response is ok the connection is allowed
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setMessage(' Bienvenu : compte créé !');
        navigate('/reservation');
      } else {
        //otherwise displaying an error message
        setMessage('Une erreur est survenue, veuillez réessayer.')
      }
    } else {
      setMessage('Les mots de passe ne correspondent pas.')
    }
  }

  return (
    <Box
      minH="100vh"
      bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgPosition="center"
      bgAttachment="fixed"
      display="flex"
      flexDirection="column"
      pt="80px" 
    >
      <Header />

      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="70vh"
      >
        <Box
          w="500px"
          p={10}
          borderRadius="md"
        >
          <Heading
            mb={8}
            textAlign="center"
            fontFamily="heading"
            fontSize="54px"
            color="zombieland.white"
          >
            Inscription
          </Heading>

          <Flex gap={4} mb={4}>
            <Box flex={1}>
              <Text mb={2} color="zombieland.white" fontWeight="300">Nom</Text>
              <Input
                type="text"
                placeholder="Doe"
                value={form.firstname}
                onChange={(e) => setForm({ ...form, firstname: e.target.value })}
                bg="rgba(0,0,0,0.3)"
                color="zombieland.white"
                borderColor="zombieland.primary"
                boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
                _placeholder={{ color: 'zombieland.white', opacity: 0.5 }}
              />
            </Box>
            <Box flex={1}>
              <Text mb={2} color="zombieland.white" fontWeight="300">Prénom</Text>
              <Input
                type="text"
                placeholder="John"
                value={form.lastname}
                onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                bg="rgba(0,0,0,0.3)"
                color="zombieland.white"
                borderColor="zombieland.primary"
                boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
                _placeholder={{ color: 'zombieland.white', opacity: 0.5 }}
              />
            </Box>
          </Flex>

          {/* Input Email */}
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

          {/* Input Password */}
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

          {/* Input ConfirmPassword */}
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
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems={{ base: 'center', lg: 'flex-end' }}
        px={10}
        pb={{ base: 28, lg: 6 }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Button
            onClick={handleSubmit}
            bgImage={`url(${bgBouton})`}
            color="zombieland.secondary"
            _hover={{ bg: "zombieland.cta2orange" }}
            fontFamily="body"
            fontSize="20px"
            py={6}
            px={3}
            borderRadius="full"
            letterSpacing="1px"
            fontWeight="bold"
            boxShadow="inset 0 2px 8px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.5)"
            textTransform="uppercase"
          >
            → REJOINDRE L'HORREUR
          </Button>

          {/* Pop on screen only and only if the message isn't empty */}
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
      </Box>

      <Footer />
    </Box>
  )
}

export default Register