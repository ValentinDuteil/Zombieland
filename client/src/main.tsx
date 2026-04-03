import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axiosInstance, { setCsrfTokenMemory } from './lib/axiosInstance'

// Fetch CSRF token once on app load and store it in memory
// The token will be attached to every subsequent state-changing request
axiosInstance.get('/api/auth/csrf')
    .then(res => setCsrfTokenMemory(res.data.csrfToken))
    .catch(() => console.error('Failed to fetch CSRF token'))

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    </React.StrictMode>
)