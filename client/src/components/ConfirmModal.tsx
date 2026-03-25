// To confirm the patch or deletion of the informations

import { useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Text } from '@chakra-ui/react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  //here giving the password to the parent component to check if the user is admin or not, 
  // if so allowing him to access the admin page
  //parents receiving this in : onConfirm={(password) => handleUpdate(password)}
  //then handleUpdate send it to the body of the PATCH request to check 
  // if the password is correct :
  //body: JSON.stringify ({
  //  firstname: ...,
  //  lastname: ...,
  //  password: ...,
  //  currentPassword: password  ← NEW FIELD =)
  //})
  onConfirm: (password: string) => void
  title: string
  message: string
}

function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) {

  const [isChecked, setIsChecked] = useState(false)
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    //check if the checkbox or the password is empty, if so do not confirm
    if (!isChecked || !password) {
      return
    }
    onConfirm(password)
    setIsChecked(false)
    setPassword('')
    onClose()
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

      <ModalBody py={5}>
        <Text mb={4} color="zombieland.white">{message}</Text>
        <Checkbox
          mb={4}
          color="zombieland.white"
          colorScheme="orange"
          isChecked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        >
          Je confirme mon choix
        </Checkbox>
        <Text color="zombieland.white" mb={2}>
          Veuillez saisir votre mot de passe pour confirmer :
        </Text>
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          bg="zombieland.secondary"
          color="zombieland.white"
          borderColor="zombieland.primary"
          _hover={{ borderColor: "zombieland.cta1orange" }}
          _focus={{ borderColor: "zombieland.cta1orange", boxShadow: "0 0 0 1px #B85F00" }}
          _placeholder={{ color: "gray.500" }}
        />
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
          Annuler
        </Button>
        <Button
          bg="zombieland.cta1orange"
          color="zombieland.white"
          _hover={{ bg: "zombieland.cta2orange" }}
          onClick={handleSubmit}
          isDisabled={!isChecked || !password}
        >
          Confirmer
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)
}
export default ConfirmModal