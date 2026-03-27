// Login page - to be connected

//To be changed as an overlay/pop-up later for a better UX
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Box, Button, Heading, Input, Text } from '@chakra-ui/react'
import bgImage from '../assets/bg-image.png'
import bgBouton from '../assets/bg-bouton.png'
import Header from '../components/Header'
import Footer from '../components/Footer'


function Login() {
  //setting the changing of the inputs and the validation message as well
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    //fetching on the api with post methode
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password }),
      credentials: 'include' //to get the cookie sent from the back, the browser is automatically dealing with
    })
    //only if response is ok the connection is allowed
    if (response.ok) {
      setMessage('Connexion confirmée !');
      navigate('/reservation');
    } else {
      //otherwise displaying an error message getting from the back if possible, otherwise a default one
      const errorData = await response.json()
      setMessage(errorData.message || 'Email ou mot de passe invalide.')
    }
  }

  return (

    <Box
      minH="100vh"
      bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgPosition="center"
      bgAttachment={{ base: "scroll", lg: "fixed" }}
      display="flex"
      flexDirection="column"

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
            Connexion
          </Heading>

          {/* Input Email */}
          <Text mb={2} color="zombieland.white" fontWeight="300">Email</Text>
          <Input
            type="email"
            placeholder="Votre email"
            value={form.email}
            _placeholder={{ color: 'zombieland.white', opacity: 0.5 }}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            bg="rgba(0,0,0,0.3)"
            color="zombieland.white"
            borderColor="zombieland.primary"
            boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
            mb={4}
          />

          {/* Input Password */}
          <Text mb={2} color="zombieland.white" fontWeight="300">Mot de passe</Text>
          <Input
            type="password"
            placeholder="Votre mot de passe"
            value={form.password}
            _placeholder={{ color: 'zombieland.white', opacity: 0.5 }}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            bg="rgba(0,0,0,0.3)"
            color="zombieland.white"
            borderColor="zombieland.primary"
            boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
            mb={6}
          />

          {/* Go create an account */}
          <Text fontSize="sm" color="gray.400" textAlign="center" mt={2}>
            Pas de compte ?{" "}
            <Link to="/register">
              <Text as="span" color="zombieland.cta1orange" cursor="pointer" _hover={{ textDecoration: "underline" }}>
                Inscrivez-vous !
              </Text>
            </Link>
          </Text>
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
              color={message.includes('confirmée') ? 'zombieland.white' : 'zombieland.warningprimary'}
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

export default Login