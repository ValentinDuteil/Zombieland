// Modal component to display an informational message
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text } from "@chakra-ui/react"

interface InfoModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    message: string
    titleColor?: string // white default
}

function InfoModal({ isOpen, onClose, title, message, titleColor = "zombieland.white" }: InfoModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="none">
            <ModalOverlay bg="blackAlpha.800" />
            <ModalContent
                bg="zombieland.bgsecondary"
                border="1px solid"
                borderColor="zombieland.primary"
            >
                <ModalHeader
                    color={titleColor}
                    fontFamily="heading"
                    borderBottom="1px solid"
                    borderColor="zombieland.secondary"
                >
                    {title}
                </ModalHeader>
                <ModalBody py={5}>
                    <Text color="zombieland.white">{message}</Text>
                </ModalBody>
                <ModalFooter
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
                        Fermer
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default InfoModal