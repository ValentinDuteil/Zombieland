// To confirm the patch or deletion of the informations

import { useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Text } from '@chakra-ui/react'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
}

function LoginModal({ isOpen, onClose, onConfirm, title }: LoginModalProps) {

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('')

  const handleSubmit = async () => {
    //check if the checkbox or the password is empty, if so do not confirm
    if (!email || !password) {
      return
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }),
      credentials: 'include' //to get the cookie sent from the back, the browser is automatically dealing with
    })
    //only if response is ok the connection is allowed
    if (response.ok) {
      setMessage('Connexion confirmée !');
      setEmail('')
      setPassword('')
      setTimeout(() => { //giving the time to read the message before closing the modal
        onClose()
        onConfirm()
      }, 1500)
    } else {
      //otherwise displaying an error message
      setMessage('Une erreur est survenue, veuillez réessayer.')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.800" />
      <ModalContent
        bg="zombieland.bgsecondary"
        border="1px solid"
        borderColor="zombieland.primary"
      >
        <ModalHeader
          color="zombieland.white"
          fontFamily="heading"
          borderBottom="1px solid"
          borderColor="zombieland.secondary"
        >
          {title}
        </ModalHeader>

        <ModalBody py={5} display="flex" flexDirection="column" gap={3}>
          <Text color="zombieland.white">Email</Text>
          <Input
            type="email"
            placeholder="john.doe@horreur.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            bg="zombieland.secondary"
            color="zombieland.white"
            borderColor="zombieland.primary"
            _hover={{ borderColor: "zombieland.cta1orange" }}
            _focus={{ borderColor: "zombieland.cta1orange", boxShadow: "0 0 0 1px #B85F00" }}
            _placeholder={{ color: "gray.500" }}
          />
          <Text color="zombieland.white">Mot de passe</Text>
          <Input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            bg="zombieland.secondary"
            color="zombieland.white"
            borderColor="zombieland.primary"
            _hover={{ borderColor: "zombieland.cta1orange" }}
            _focus={{ borderColor: "zombieland.cta1orange", boxShadow: "0 0 0 1px #B85F00" }}
            _placeholder={{ color: "gray.500" }}
          />
          {message && (
            <Text
              color={message.includes('confirmée') ? "zombieland.successprimary" : "zombieland.warningprimary"}
              fontWeight="bold"
            >
              {message}
            </Text>
          )}
        </ModalBody>

        <ModalFooter
          gap={3}
          borderTop="1px solid"
          borderColor="zombieland.secondary"
        >
          <Button
            bg="zombieland.secondary"
            color="zombieland.white"
            border="1px solid"
            borderColor="zombieland.primary"
            _hover={{ bg: "zombieland.primary" }}
            onClick={onClose}
          >
            Retour
          </Button>
          <Button
            bg="zombieland.cta1orange"
            color="zombieland.white"
            _hover={{ bg: "zombieland.cta2orange" }}
            isDisabled={!email || !password}
            onClick={handleSubmit}
          >
            Rejoindre l'horreur
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default LoginModal