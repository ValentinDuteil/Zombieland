// Admin page to edit an attraction : visual card with editable fields
import { useEffect, useState, useRef } from "react"
import { Box, Text, Button, Input, Select, Spinner, Flex, Image } from "@chakra-ui/react"
import { useNavigate, useParams } from "react-router-dom"
import { FaCamera } from "react-icons/fa"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import bgImage from '../../assets/bg-image.webp'
import bgBouton from '../../assets/bg-bouton.webp'
import Card from '../../assets/Card.webp'
import ConfirmModal from "../../components/ConfirmModal"
import type { AttractionWithCategories } from "@types"
import img1 from "../../assets/quarantaine.webp"
import img2 from "../../assets/ridebiomasse.webp"
import img3 from "../../assets/marche.webp"
import img4 from "../../assets/grand8.webp"
import img5 from "../../assets/fossecadavres.webp"
import img6 from "../../assets/centrerecherche.webp"
import { API_URL } from "@/config/api"
import axios from "axios"

// Map attraction id to local image
const attractionImages: Record<number, string> = {
    1: img1, 2: img2, 3: img3, 4: img4, 5: img5, 6: img6
}

const categoryColors: Record<string, string> = {
    LOW: "green",
    MEDIUM: "orange",
    HIGH: "red",
}

const AdminAttractionEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [dbImage, setDbImage] = useState<string | null>(null)


    // Form fields state
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [minHeight, setMinHeight] = useState<number | "">("")
    const [duration, setDuration] = useState<number | "">("")
    const [capacity, setCapacity] = useState<number | "">("")
    const [intensity, setIntensity] = useState<"LOW" | "MEDIUM" | "HIGH">("LOW")
    const [attractionId, setAttractionId] = useState<number>(0)
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    // Fetch the attraction to pre-fill the form
    useEffect(() => {
        const fetchAttraction = async () => {
            setLoading(true)
            try {
                const res = await axios.get<AttractionWithCategories>(`${API_URL}/api/attractions/${id}`)


                setName(res.data.name)
                setDescription(res.data.description ?? "")
                setMinHeight(res.data.min_height ?? "")
                setDuration(res.data.duration ?? "")
                setCapacity(res.data.capacity ?? "")
                setIntensity(res.data.intensity)
                setDbImage(res.data.image ?? null)
                setAttractionId(res.data.id_ATTRACTION)

            } catch (error) {
                setError("Erreur lors de la récupération de l'attraction")
            } finally {
                setLoading(false)

            }
        }
        fetchAttraction()
    }, [id])

    // Handle image preview when a file is selected
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        setPreviewImage(url)
    }

    const handleSubmit = async (password: string) => {
        let errorMessage = "Erreur lors de l'upload de l'image"
        try {

            // If a new image was selected, upload it first
            if (fileInputRef.current?.files?.[0]) {
                const formData = new FormData()
                formData.append('image', fileInputRef.current.files[0])

                await axios.patch(`${API_URL}/api/attractions/${id}/image`, formData,
                    {

                        withCredentials: true,
                        headers: { 'Content-Type': 'multipart/form-data' }
                    })


            }
            errorMessage = "Erreur lors de la modification de l'attraction"
            // Then update the other fields
            await axios.patch(`${API_URL}/api/attractions/${id}`,
                {
                    name,
                    description,
                    min_height: minHeight === "" ? undefined : minHeight,
                    duration: duration === "" ? undefined : duration,
                    capacity: capacity === "" ? undefined : capacity,
                    intensity,
                    password
                },
                {

                    withCredentials: true,
                    
                })



            setTimeout(() => navigate('/admin/attractions'), 1500)
        } catch (error) {
            setError(errorMessage)
            // premier if
            // if (!imageRes.ok) {
            //         setError("Erreur lors de l'upload de l'image")
            //         return
            //     }

            //deuxieme if
            // if (!res.ok) {
            //     setError("Erreur lors de la modification de l'attraction")
            //     return
            // }
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
                {loading && <Spinner color="zombieland.primary" size="xl" />}
                {error && <Text color="red.400">{error}</Text>}

                {!loading && (
                    <Box w="600px" p={10} borderRadius="md">

                        {/* Editable name as heading */}
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            textAlign="center"
                        />

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

                                {/* Editable intensity select */}
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

                                {/* Camera icon overlay in the center */}
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
                                    src={previewImage || (dbImage ? `${import.meta.env.VITE_API_URL}${dbImage}` : attractionImages[attractionId]) || img1}
                                />
                            </Box>

                            <Box p={6} display="flex" flexDirection="column" flex="1" gap={3} alignItems="center" w="100%">

                                <Input
                                    {...inputStyle}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Description"
                                    w="80%"
                                    textAlign="center"
                                />

                                <Flex alignItems="center" justifyContent="center" gap={2} w="80%">
                                    <Text fontSize="sm" whiteSpace="nowrap">Durée :</Text>
                                    <Input {...inputStyle} type="number" value={duration} onChange={(e) => setDuration(e.target.value === "" ? "" : parseInt(e.target.value))} placeholder="Durée (min)" />
                                    <Text fontSize="sm" color="whiteAlpha.700">min</Text>
                                </Flex>

                                <Flex alignItems="center" justifyContent="center" gap={2} w="80%">
                                    <Text fontSize="sm" whiteSpace="nowrap">Capacité :</Text>
                                    <Input {...inputStyle} type="number" value={capacity} onChange={(e) => setCapacity(e.target.value === "" ? "" : parseInt(e.target.value))} placeholder="Capacité" />
                                    <Text fontSize="sm" color="whiteAlpha.700">personnes</Text>
                                </Flex>

                                <Flex alignItems="center" justifyContent="center" gap={2} w="80%">
                                    <Text fontSize="sm" whiteSpace="nowrap">Taille requise :</Text>
                                    <Input {...inputStyle} type="number" value={minHeight} onChange={(e) => setMinHeight(e.target.value === "" ? "" : parseInt(e.target.value))} placeholder="Taille min. (cm)" />
                                    <Text fontSize="sm" color="whiteAlpha.700">cm</Text>
                                </Flex>

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
                                    w="80%"
                                    onClick={() => setIsConfirmOpen(true)}
                                >
                                    Enregistrer
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
                )}

            </Box>

            {/* Confirm modal with password before saving */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="Confirmer les modifications"
                message="Veuillez confirmer les modifications de cette attraction."
                onConfirm={(password) => {
                    handleSubmit(password)
                    setIsConfirmOpen(false)
                }}
            />

            <Footer />
        </Box>
    )
}

export default AdminAttractionEdit