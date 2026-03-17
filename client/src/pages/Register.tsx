// Login page - to be connected

//To be changed as an overlay/pop-up later for a better UX
//Waiting for a refacto with cookies httpOnly instead of localstorage
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Box, Button, Heading, Input, Text } from '@chakra-ui/react'

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
    <Box p={8}>
      <Heading mb={6}>Inscription</Heading>

      {/* Input Firstname */}
      <Input
        type="text"
        placeholder="Votre Nom"
        value={form.firstname}
        //using spread operator to update only one field but keeping what's left intact
        onChange={(e) => setForm({ ...form, firstname: e.target.value })}
      />

      {/* Input Lastname */}
      <Input
        type="text"
        placeholder="Votre Prénom"
        value={form.lastname}
        //using spread operator to update only one field but keeping what's left intact
        onChange={(e) => setForm({ ...form, lastname: e.target.value })}
      />

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

      {/* Input ConfirmPassword */}
      <Input
        type="password"
        placeholder="Confirmez votre Mot de Passe"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
      />

      <Button onClick={handleSubmit}>
        Rejoindre l'horreur
      </Button>
      {/* Pop on screen only and only if the message isn't empty */}
      {message && <Text mt={4}>{message}</Text>}
    </Box>)
}

export default Register