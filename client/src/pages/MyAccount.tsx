// MyAccount page - user's profile which can be update or deleted

// ⚠️ DETTE TECHNIQUE - Sécurité formulaire profil
// Actuellement : confirmation du nouveau mot de passe uniquement côté front
// À implémenter :
//   1. Champ "mot de passe actuel" pour valider toute modification
//   2. Vérification Argon2 côté back avant d'appliquer les changements
//   3. Pop-up de confirmation avec saisie du mot de passe actuel
//   4. Séparer la logique "modifier infos" et "modifier mot de passe"

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Box, Button, Input, Text } from '@chakra-ui/react'

import Header from '../components/Header'
import Footer from '../components/Footer'

//We will need on this page : 
//  connected user informations (so we need his ID)
//  the inputs updated by the user
//  the user reservations
//  to navigate after CTA
//  a feedback message
function MyAccount() {
  //users informations, 
  //null by default before we fetch
  const [currentUser, setCurrentUser] = useState<{ id_USER: number } | null>(null)
  //what the user is writting in the inputs
  const [form, ] = useState({ firstname: '', lastname: '', password: '', confirmPassword: '' })
  //The reservations we want to display
  const [reservations, setReservations] = useState([])
  const navigate = useNavigate();
  const [_, setMessage] = useState('')

  //What we want only once "on mount" thanks to "[]" at the end of the useEffect
  //Can countain 2 fetches
  useEffect(() => {

    const fetchUser = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        credentials: 'include' //to get the cookie sent from the back, the browser is automatically dealing with
      })
      // Convert the response to JSON => { id_USER, firstname, lastname, email, role... }
      const data = await response.json()
      setCurrentUser(data)
    }

    const fetchReservations = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/me`, {
        credentials: 'include' //to get the cookie sent from the back, the browser is automatically dealing with
      })
      // Convert the response to JSON
      const data = await response.json()
      setReservations(data)
    }

    //Using functions
    fetchUser()
    fetchReservations()
  }, [])


  const handleUpdate = async () => {
    //1.checking if the user wants to change his password
    //only if he's updating it, we compare the password and the confirmpassword inputs
    //and send an error IF it doesn't match
    if (form.password && form.password !== form.confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.')
      return
    }

    //fetching on the api with patch methode
    //geting the informations of the connected user via currentUser on mount
    //We are using currentUser?.id_USER (got on mount via /api/auth/me)
    //to build the URL of the PATCH route
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${currentUser?.id_USER}/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        //undefined if empty, Prisma doesn't update it
        //thanks to "UserSchema.partial()" used in updateProfile
        //partial() turns the fields as "optionnal"
        //so, if they're undefined, Prisma ignore them
        firstname: form.firstname || undefined,
        lastname: form.lastname || undefined,
        password: form.password || undefined
      }),
      credentials: 'include' //to get the cookie sent from the back, the browser is automatically dealing with
    })

    //only if response is ok we update
    //otherwise displaying an error message
    if (response.ok) {
      setMessage(' Votre profile a été mis à jour !');
    } else {
      setMessage('Une erreur est survenue, veuillez réessayer.')
    }
  }

  const handleDelete = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${currentUser?.id_USER}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (response.ok) {
      // if the account is deleted we send the user on the HomePage
      navigate('/')
    } else {
      setMessage('Une erreur est survenue.')
    }
  }

  return (
    <Box>
      <Header />

      <Input />
      <Input />
      <Input />
      <Input />

      <Button
        onClick={handleUpdate}
      >
        Modifier mes informations
      </Button>
      <Button
        onClick={handleDelete}
      >
        ⚠️☠️ Supprimer mon profile ☠️⚠️
      </Button>

      {reservations.length === 0 ? (
        <Box>
          <Text>Vous n'avez pas de réservations plannifiées.</Text>
          <Text>👻</Text>
        </Box>
      ) : (
        //Slice(0, 3) limit to 3 tickets and gives the preview 
        reservations.slice(0, 3).map((r: any) => (
          <Box key={r.id_RESERVATION}>
            <Text>Date : {new Date(r.date).toLocaleDateString('fr-FR')}</Text>
            <Text>Billets : {r.nb_tickets}</Text>
          </Box>
        ))
      )}

      <Button
        onClick={() => navigate('/my-account/reservations')}
      >
        Voir l'historique de mes réservations
      </Button>

      <Footer />
    </Box>

  )
}

export default MyAccount