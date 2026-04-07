import type { ButtonProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import bgBouton from '../assets/bg-bouton.webp';
import bgAnnuler from '../assets/bg-bouton-annuler.webp';

interface ZButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const ZButton = ({ children, ...props }: ZButtonProps) => {
  return (
    <Button
      // Styles de base fixes (Uniformité)
      bgImage={`url(${bgBouton})`}
      bgSize="cover"
      bgPosition="center"
      color="zombieland.secondary"
      fontSize={{ base: "13px", sm: "14px", md: "16px" }}
      py={6}
      px={{ base: 6, sm: 8, md: 12 }}
      borderRadius="full"
      fontWeight="bold"
      fontFamily="body"
      textTransform="uppercase"
      boxShadow="inset 0 2px 8px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.5)"
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"

      // États
      _hover={{
        bg: "zombieland.cta2orange",
        color: "zombieland.white",
        transform: "translateY(-2px)",
        boxShadow: "inset 0 2px 8px rgba(255,255,255,0.2), 0 8px 20px rgba(0,0,0,0.6)",
        ...props._hover, // Permet d'étendre le hover si besoin
      }}

      // Layout par défaut (Peut être écrasé par les props)
      mt={4}
      w={{ base: "90%", sm: "60%", md: "auto" }}
      minW={{ md: "250px" }}
      maxW="100%"

      // On propage toutes les autres props de Chakra (onClick, type, isLoading, etc.)
      {...props}
    >
      {children}
    </Button>
  );
};

export const CancelButton = ({ children, ...props }: ZButtonProps) => {
  return (
    <Button
      size="sm"
      bgImage={`url(${bgAnnuler})`}
      bgSize="cover"
      bgPosition="center"
      color="zombieland.white"
      fontFamily="body"
      fontWeight="bold"
      border="2px solid"
      borderColor="zombieland.primary"
      borderRadius="md"
      px={6}

      mt={8}
      _hover={{
        opacity: 0.8,
        borderColor: "zombieland.cta1orange",
        bg: "rgba(0,0,0,0.8)",
        ...props._hover,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};