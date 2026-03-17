import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/*enveloppe l'application dans le ChakraProvider pour que le thème soit accessible dans tous les composants de l'application*/}
    <ChakraProvider theme={theme}>
        <App />
    </ChakraProvider>
  </React.StrictMode>
);