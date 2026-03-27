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
import { Box, Button, Heading, Input, Text, Checkbox } from '@chakra-ui/react'

import ConfirmModal from '@/components/ConfirmModal.tsx';

import Header from '../components/Header'
import Footer from '../components/Footer'
import bgImage from '../assets/bg-image.png'
import bgBouton from '../assets/bg-bouton.png'
import { PageBackground } from '../components/PageBackground'

//We will need on this page : 
//  connected user informations (so we need his ID)
//  the inputs updated by the user
//  the user reservations
//  to navigate after CTA
//  a feedback message
function MyAccount() {
  //users informations, 
  //null by default before we fetch
  const [currentUser, setCurrentUser] = useState<{ id_USER: number, firstname: string, lastname: string } | null>(null)
  //what the user is writting in the inputs
  const [form, setForm] = useState({ firstname: '', lastname: '', password: '', confirmPassword: '' })
  //The reservations we want to display
  const [reservations, setReservations] = useState([])
  const navigate = useNavigate();
  const [message, setMessage] = useState('')
  const [confirmedDeletion, setConfirmedDeletion] = useState(false)
  // confirmed deletion stores whether the user has checked the deletion confirmation checkbox
  const [deleteMessage, setDeleteMessage] = useState('')
  // State to manage the open/close of the confirmation modal for deletion
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
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
      // Initialize form with current user data
      setForm({ firstname: data.firstname || '', lastname: data.lastname || '', password: '', confirmPassword: '' })
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


  const handleUpdate = async (currentPassword: string) => {
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
        password: form.password || undefined,
        currentPassword: currentPassword //sending the current password to check if the user is really the one who is updating the profile
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
      // if the account is deleted we send the user on the page register
      navigate('/register')
    } else {
      setDeleteMessage('Une erreur est survenue.')
    }
  }

  return (
    <PageBackground bgImage={bgImage}>
      <Header />

      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        px={8}
        py={10}
        minH="70vh"
      >
        <Heading
          mb={10}
          fontFamily="heading"
          fontSize="54px"
          textAlign="center"
          color="zombieland.white"
        >
          Bienvenue {currentUser?.firstname} {currentUser?.lastname} !
        </Heading>

        {/* Update form */}
        <Box
          w="100%"
          maxW="500px"
          mb={10}
          p={6}
          borderRadius="md"
          bg="rgba(0,0,0,0.3)"
          border="2px solid"
          borderColor="zombieland.primary"
          boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
          transition="all 0.3s ease"
          cursor="pointer"
          _hover={{
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            borderColor: "zombieland.cta1orange",
          }}
        >
          <Text color="zombieland.white" fontFamily="body" fontWeight="bold" fontSize="18px" mb={4} textAlign="center">
            Modifier mes informations
          </Text>
          <Text mb={2} color="zombieland.white" fontFamily="body" fontWeight="300">Prénom</Text>
          <Input
            placeholder="Ex: Jean"
            value={form.firstname}
            onChange={(e) => setForm({ ...form, firstname: e.target.value })}
            bg="rgba(0,0,0,0.3)"
            color="zombieland.white"
            borderColor="zombieland.primary"
            boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
            _placeholder={{ color: 'zombieland.white', opacity: 0.5 }}
            mb={4}
          />

          <Text mb={2} color="zombieland.white" fontFamily="body" fontWeight="300">Nom</Text>
          <Input
            placeholder="Ex: Dupont"
            value={form.lastname}
            onChange={(e) => setForm({ ...form, lastname: e.target.value })}
            bg="rgba(0,0,0,0.3)"
            color="zombieland.white"
            borderColor="zombieland.primary"
            boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
            _placeholder={{ color: 'zombieland.white', opacity: 0.5 }}
            mb={4}
          />

          <Text mb={2} color="zombieland.white" fontFamily="body" fontWeight="300">Nouveau mot de passe</Text>
          <Input
            type="password"
            placeholder="Nouveau mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            bg="rgba(0,0,0,0.3)"
            color="zombieland.white"
            borderColor="zombieland.primary"
            boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
            _placeholder={{ color: 'zombieland.white', opacity: 0.5 }}
            mb={4}
          />

          <Text mb={2} color="zombieland.white" fontFamily="body" fontWeight="300">Confirmer le mot de passe</Text>
          <Input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            bg="rgba(0,0,0,0.3)"
            color="zombieland.white"
            borderColor="zombieland.primary"
            boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
            _placeholder={{ color: 'zombieland.white', opacity: 0.5 }}
            mb={6}
          />

          <Button
            onClick={() => setIsUpdateModalOpen(true)}
            bgImage={`url(${bgBouton})`}
            bgSize="cover"
            bgPosition="center"
            color="zombieland.secondary"
            fontFamily="body"
            fontWeight="bold"
            fontSize="16px"
            py={5}
            px={4}
            borderRadius="full"
            letterSpacing="1px"
            textTransform="uppercase"
            boxShadow="inset 0 2px 8px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.5)"
            _hover={{ bg: "zombieland.cta2orange" }}
            w="100%"
          >
            → Sauvegarder
          </Button>

          {message && (
            <Text
              mt={4}
              textAlign="center"
              fontFamily="body"
              fontWeight="300"
              color={message.includes('jour') ? 'zombieland.white' : 'zombieland.warningprimary'}
            >
              {message}
            </Text>
          )}
        </Box>

        {/* Reservations preview */}
        <Box
          w="100%"
          maxW="500px"
          mb={6}
          p={6}
          borderRadius="md"
          bg="rgba(0,0,0,0.3)"
          border="2px solid"
          borderColor="zombieland.primary"
          boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
          transition="all 0.3s ease"
          cursor="pointer"
          _hover={{
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            borderColor: "zombieland.cta1orange",
          }}
        >
          <Text color="zombieland.white" fontFamily="body" fontWeight="bold" fontSize="18px" mb={4} textAlign="center">
            Mes prochaines réservations
          </Text>

          {reservations.filter((r: any) => r.status !== 'CANCELLED').length === 0 ? (
            <Text color="zombieland.white" fontFamily="body" fontWeight="300" textAlign="center">
              Vous n'avez pas encore de réservations.
            </Text>
          ) : (
            reservations
              .filter((r: any) => r.status !== 'CANCELLED')
              .slice(0, 3)
              .map((r: any) => (
                <Box
                  key={r.id_RESERVATION}
                  mb={4}
                  p={4}
                  borderRadius="md"
                  bg="rgba(0,0,0,0.3)"
                  borderLeft="3px solid"
                  borderColor="zombieland.primary"
                  boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
                >
                  <Text color="zombieland.white" fontFamily="body" fontWeight="300">
                    - Date : {new Date(r.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </Text>
                  <Text color="zombieland.white" fontFamily="body" fontWeight="300">
                    - Billets : {r.nb_tickets}
                  </Text>
                </Box>
              ))
          )}

          <Button
            onClick={() => navigate('/my-account/reservations')}
            bgImage={`url(${bgBouton})`}
            bgSize="cover"
            bgPosition="center"
            color="zombieland.secondary"
            fontFamily="body"
            fontWeight="bold"
            fontSize="16px"
            py={5}
            px={4}
            borderRadius="full"
            letterSpacing="1px"
            textTransform="uppercase"
            boxShadow="inset 0 2px 8px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.5)"
            _hover={{ bg: "zombieland.cta2orange" }}
            mt={4}
            w="100%"
          >
            → Voir toutes mes réservations
          </Button>
        </Box>

        {/* Danger zone */}
        <Box
          w="100%"
          maxW="500px"
          p={6}
          borderRadius="md"
          bg="rgba(0,0,0,0.3)"
          border="2px solid"
          borderColor="zombieland.warningprimary"
          boxShadow="inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
          transition="all 0.3s ease"
          cursor="pointer"
          _hover={{
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            borderColor: "zombieland.warningprimary",
          }}
        >
          <Text color="zombieland.warningprimary" fontFamily="body" fontWeight="bold" fontSize="18px" mb={2} textAlign="center">
            Zone dangereuse
          </Text>
          <Text color="zombieland.white" fontFamily="body" fontWeight="300" fontSize="14px" mb={4}>
            La suppression de votre compte est irréversible.
          </Text>

          <Checkbox
            mt={2}
            mb={4}
            isChecked={confirmedDeletion}
            onChange={(e) => setConfirmedDeletion(e.target.checked)}
            colorScheme="red"
          >
            <Text color="zombieland.white" fontFamily="body" fontWeight="300" fontSize="14px">
              Je comprends que la suppression de mon compte est définitive et irréversible
            </Text>
          </Checkbox>

          <Button
            onClick={() => setIsDeleteModalOpen(true)}
            isDisabled={!confirmedDeletion}
            bgImage={`url(${bgBouton})`}
            bgSize="cover"
            bgPosition="center"
            color="zombieland.secondary"
            fontFamily="body"
            fontWeight="bold"
            fontSize="16px"
            py={5}
            px={4}
            borderRadius="full"
            letterSpacing="1px"
            textTransform="uppercase"
            boxShadow="inset 0 2px 8px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.5)"
            _hover={{ bg: "zombieland.cta2orange" }}
            w="100%"
          >
            → Supprimer mon compte
          </Button>
          {deleteMessage && (
            <Text mt={4} textAlign="center" fontFamily="body" fontWeight="300" color="zombieland.warningprimary">
              {deleteMessage}
            </Text>
          )}
        </Box>
      </Box>

      <ConfirmModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onConfirm={(password) => handleUpdate(password)}
        title="Modifier mon profil"
        message="Es-tu sûr de vouloir modifier tes informations ?"
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer mon compte"
        message="Êtes-vous sûr de vouloir supprimer votre compte ?"
      />
      <Footer />
    </PageBackground>
  )
}

export default MyAccount