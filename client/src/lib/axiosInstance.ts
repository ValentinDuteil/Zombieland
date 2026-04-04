// Axios instance configured with CSRF token support
// Token is stored in memory after the initial /api/auth/csrf call
// This approach works in cross-origin (production) unlike cookie-based CSRF

import axios from 'axios'
import { API_URL } from '@/config/api'

// In-memory CSRF token — set once on app load via setCsrfTokenMemory()
// Stored in memory instead of a cookie because cross-origin JS cannot read
// cookies from a different domain (front on Vercel, back on Render)
let csrfToken: string | null = null

// Called in main.tsx after fetching /api/auth/csrf
export function setCsrfTokenMemory(token: string) {
    csrfToken = token
}

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // sends httpOnly JWT cookie on every request
})

// Attach CSRF token from memory to every non-GET request
axiosInstance.interceptors.request.use((config) => {
    if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken
    }
    return config
})

export default axiosInstance