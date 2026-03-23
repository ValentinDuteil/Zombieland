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
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <Text mb={4}>Email</Text>
          <Input
            type="email"
            placeholder="john.doe@horreur.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Text>Mot de passe</Text>
          <Input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Text>{message}</Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Retour</Button>
          <Button onClick={handleSubmit}>Rejoindre l'horreur</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default LoginModal