// Admin page to create a new attraction : visual card with editable fields
import { useState, useRef } from "react"
import { Box, Text, Button, Input, Select, Flex, Image } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { FaCamera } from "react-icons/fa"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import bgImage from '../../assets/labodashboard.png'
import bgBouton from '../../assets/bg-bouton.webp'
import Card from '../../assets/Card.webp'
import ConfirmModal from "../../components/ConfirmModal"
import defaultImage from "../../assets/quarantaine.webp"
import { API_URL } from "@/config/api"
import axios from "axios"
import { isAxiosError } from "axios"


const categoryColors: Record<string, string> = {
    LOW: "green",
    MEDIUM: "orange",
    HIGH: "red",
}

const AdminAttractionCreate = () => {
    const navigate = useNavigate()
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Form fields state — all empty by default
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [minHeight, setMinHeight] = useState<number | "">('')
    const [duration, setDuration] = useState<number | "">('')
    const [capacity, setCapacity] = useState<number | "">('')
    const [intensity, setIntensity] = useState<"LOW" | "MEDIUM" | "HIGH">("LOW")
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    // Handle image preview when a file is selected
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        setPreviewImage(url)
        setError(null)  // ← reset image error when a new file is selected
    }

    const handleSubmit = async (password: string) => {
        let errorMessage = "Erreur lors de la création de l'attraction"
        try {
            // Create the attraction first
            const res = await axios.post(`${API_URL}/api/attractions`,
                {
                    name,
                    description,
                    min_height: minHeight,
                    duration: duration,
                    capacity: capacity,
                    intensity,
                    password
                },
                {
                    withCredentials: true,
                });

            const data = res.data

            // If an image was selected, upload it after creation
            if (fileInputRef.current?.files?.[0]) {
                const formData = new FormData()
                formData.append('image', fileInputRef.current.files[0])

                errorMessage = "Attraction créée mais erreur lors de l'upload de l'image"

                await axios.patch(`${API_URL}/api/attractions/${data.id_ATTRACTION}/image`,
                    formData
                    , {
                        withCredentials: true,
                        headers: { 'Content-Type': 'multipart/form-data' }
                    })
            }
            // Redirect to admin attractions page after success
            setTimeout(() => navigate('/admin/attractions'), 1500)
        } catch (err) {
            if (isAxiosError(err)) {
                if (err.response?.data.details) {
                    // Zod field errors
                    const newErrors: Record<string, string> = {}
                    err.response?.data.details.forEach((d: { champ: string, message: string }) => {
                        newErrors[d.champ] = d.message
                    })
                    setErrors(newErrors)
                } else {
                    // Generic back error
                    setError(err.response?.data.message || errorMessage)
                }
            } else {
                // Network or unexpected error
                setError(errorMessage)
            }
        }
    }

    // Shared input style matching the card theme
    const inputStyle = {
        bg: "rgba(0,0,0,0.4)",
        border: "1px solid",
        borderColor: "whiteAlpha.400",
        color: "white",
        size: "sm" as const,
        borderRadius: "md",
        _hover: { borderColor: "zombieland.cta1orange" },
        _focus: { borderColor: "zombieland.cta1orange", boxShadow: "none" }
    }

    return (
        <Box
            minH="100vh"
            bgImage={`url(${bgImage})`}
            bgSize="cover"
            bgRepeat="no-repeat"
            bgAttachment="fixed"
            bgPosition="center top"
            display="flex"
            flexDirection="column"
            w="100%"
            overflow="hidden"
        >
            <Header />

            <Box
                flex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="70vh"
                py="100px"
            >


                <Box w="600px" p={10} borderRadius="md">

                    {/* Name input */}
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nom de l'attraction"
                        fontSize="4xl"
                        fontWeight="bold"
                        fontFamily="heading"
                        mb={6}
                        bg="transparent"
                        border="none"
                        borderBottom="2px solid"
                        borderColor="zombieland.primary"
                        color="zombieland.white"
                        borderRadius="none"
                        _hover={{ borderColor: "zombieland.cta1orange" }}
                        _focus={{ borderColor: "zombieland.cta1orange", boxShadow: "none" }}
                        _placeholder={{ color: "whiteAlpha.500" }}
                        textAlign="center"
                    />
                    {errors['name'] && <Text color="zombieland.warningprimary" fontSize="sm">{errors['name']}</Text>}

                    <Box
                        borderRadius="lg"
                        overflow="visible"
                        boxShadow="0 0 15px rgba(0,0,0,0.5)"
                        bgImage={`url(${Card})`}
                        bgSize="cover"
                        bgPosition="center"
                        color="white"
                        display="flex"
                        flexDirection="column"
                    >
                        {/* Image zone - clickable to upload */}
                        <Box
                            width="100%"
                            height="300px"
                            overflow="visible"
                            display="flex"
                            justifyContent="center"
                            mt={8}
                            position="relative"
                            cursor="pointer"
                            onClick={() => fileInputRef.current?.click()}
                            _hover={{ opacity: 0.8 }}
                        >
                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                            {/* {errors[image] &&<Text color="zombieland.warningprimary" fontSize="sm">{errors[image]}</Text>} */}
                            <Select
                                position="absolute"
                                top="-12px"
                                left="8px"
                                w="110px"
                                size="xs"
                                bg={`${categoryColors[intensity]}.500`}
                                color="white"
                                border="none"
                                borderRadius="md"
                                zIndex={2}
                                value={intensity}
                                onChange={(e) => setIntensity(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
                                _focus={{ boxShadow: "none" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <option value="LOW" style={{ background: "#1a1a1a" }}>PEUR ACCEPTABLE</option>
                                <option value="MEDIUM" style={{ background: "#1a1a1a" }}>PEUR SURVIVABLE</option>
                                <option value="HIGH" style={{ background: "#1a1a1a" }}>PEUR MORTELLE</option>
                            </Select>

                            {/* Camera icon overlay */}
                            <Box
                                position="absolute"
                                top="50%"
                                left="50%"
                                transform="translate(-50%, -50%)"
                                bg="rgba(0,0,0,0.5)"
                                borderRadius="full"
                                p={4}
                                zIndex={2}
                                color="white"
                                fontSize="2xl"
                            >
                                <FaCamera />
                            </Box>

                            <Image
                                width="90%"
                                height="100%"
                                objectFit="cover"
                                borderRadius="md"
                                src={previewImage || defaultImage}
                                opacity={previewImage ? 1 : 0.3}
                            />
                        </Box>

                        <Box p={6} display="flex" flexDirection="column" flex="1" gap={3} alignItems="center" w="100%">

                            {/* Description */}
                            <Input
                                {...inputStyle}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description"
                                w="80%"
                                textAlign="center"
                            />
                            {errors['description'] && <Text color="zombieland.warningprimary" fontSize="sm">{errors['description']}</Text>}
                            {/* Duration */}
                            <Flex alignItems="center" justifyContent="center" gap={2} w="80%">
                                <Text fontSize="sm" whiteSpace="nowrap">Durée :</Text>
                                <Input {...inputStyle} type="number" value={duration} onChange={(e) => setDuration(e.target.value === "" ? "" : parseInt(e.target.value))} />
                                <Text fontSize="sm" color="whiteAlpha.700">min</Text>
                            </Flex>
                                {errors['duration'] && <Text color="zombieland.warningprimary" fontSize="sm">{errors['duration']}</Text>}

                            {/* Capacity */}
                            <Flex alignItems="center" justifyContent="center" gap={2} w="80%">
                                <Text fontSize="sm" whiteSpace="nowrap">Capacité :</Text>
                                <Input {...inputStyle} type="number" value={capacity} onChange={(e) => setCapacity(e.target.value === "" ? "" : parseInt(e.target.value))} />
                                <Text fontSize="sm" color="whiteAlpha.700">personnes</Text>
                            </Flex>
                                {errors['capacity'] && <Text color="zombieland.warningprimary" fontSize="sm">{errors['capacity']}</Text>}

                            {/* Min height */}
                            <Flex alignItems="center" justifyContent="center" gap={2} w="80%">
                                <Text fontSize="sm" whiteSpace="nowrap">Taille requise :</Text>
                                <Input {...inputStyle} type="number" value={minHeight} onChange={(e) => setMinHeight(e.target.value === "" ? "" : parseInt(e.target.value))} />
                                <Text fontSize="sm" color="whiteAlpha.700">cm</Text>
                            </Flex>
                                {errors['min_height'] && <Text color="zombieland.warningprimary" fontSize="sm">{errors['min_height']}</Text>}
                            {error && <Text color="zombieland.warningprimary">{error}</Text>}
                            {/* Create button */}
                            <Button
                                bgImage={`url(${bgBouton})`}
                                color="zombieland.secondary"
                                _hover={{ opacity: 0.8 }}
                                fontFamily="body"
                                fontSize="20px"
                                py={6}
                                px={3}
                                borderRadius="full"
                                letterSpacing="1px"
                                fontWeight="bold"
                                boxShadow="inset 0 2px 8px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.5)"
                                textTransform="uppercase"
                                mt={2}
                                w={{ base: "100%", md: "90%", lg: "80%" }}
                                onClick={() => {
                                    if (!previewImage) {
                                        setError("Veuillez sélectionner une image")
                                        return
                                    }
                                    setIsConfirmOpen(true)
                                }}
                            >
                                Créer l'attraction
                            </Button>
                        </Box>
                    </Box>

                    {/* Cancel button */}
                    <Button
                        mt={4}
                        border="2px solid"
                        borderColor="zombieland.primary"
                        color="zombieland.white"
                        bg="transparent"
                        _hover={{ borderColor: "zombieland.cta1orange", color: "zombieland.cta1orange" }}
                        onClick={() => navigate('/admin/attractions')}
                    >
                        ← Annuler
                    </Button>
                </Box>
            </Box>

            {/* Confirm modal with password before creating */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="Créer l'attraction"
                message="Veuillez confirmer la création de cette attraction."
                onConfirm={(password) => {
                    handleSubmit(password)
                    setIsConfirmOpen(false)
                }}
            />

            <Footer />
        </Box>
    )
}

export default AdminAttractionCreate