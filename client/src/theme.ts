import { extendTheme } from "@chakra-ui/react";
//Configuration du theme Chakra pour pouvoir l'utiliser dans les composants
//penser à rester en version 2.10.9 de chakra pour éviter les problèmes de compatibilité car la v3 est moins stable et peut causer des bugs d'affichage
const theme = extendTheme({
    colors: {
        zombieland: {
            primary: "#476182",
            secondary: "#293036",
            cta1orange: "#B85F00",
            cta2orange: "#4E2A03",
            white: "#FAEBDC",
            bgprimary: "#525252",
            bgsecondary: "#3F3F3F",
            warningprimary: "#C9A841",
            warningsecondary: "#8C6E21",
            successprimary: "#8C7D26",
            successsecondary: "#3E4D28"
        }
    },
    fonts: {
        heading: "'creepster', sans-serif",
        body: "'oswald', sans-serif"
    },
    styles: {
        global: {
            body: {
                bg: "zombieland.bgprimary",
                color: "zombieland.white"
            }
        }
    }
});

export default theme;