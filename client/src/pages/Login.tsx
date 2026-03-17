// Login page - to be connected

//To be changed as an overlay/pop-up later for a better UX
//Waiting for a refacto with cookies httpOnly instead of localstorage
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Box, Button, Heading, Input, Text } from '@chakra-ui/react'

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
      body: JSON.stringify({ email: form.email, password: form.password })
    })
    //only if response is ok the connection is allowed
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      setMessage('Connexion confirmée !');
      navigate('/reservation');
    } else {
    //otherwise displaying an error message
      setMessage('Une erreur est survenue, veuillez réessayer.')
    }
  }

  return (
    <Box p={8}>
      <Heading mb={6}>Connexion</Heading>

      {/* Input Email */}
      <Input
        type="email"
        placeholder="Votre email"
        value={form.email}
        //using spread operator to update only one field but keeping what's left intact
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      {/* Input Password */} 
      <Input
        type="password"
        placeholder="Votre Mot de Passe"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <Button onClick={handleSubmit}>
        Rejoindre l'horreur
      </Button>
      {/* Pop on screen only and only if the message isn't empty */}
      {message && <Text mt={4}>{message}</Text>}
    </Box>)
}

export default Login