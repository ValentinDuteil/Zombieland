// Redirects to home if the user is not logged in or not an admin
import { API_URL } from '@/config/api'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface AdminGuardProps {
    children: React.ReactNode
}

function AdminGuard({ children }: AdminGuardProps) {
    const [isAuthorized, setIsAuthorized] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/auth/me`,

                    { withCredentials: true },
                );

                const data = response.data

                if (data.role !== 'ADMIN') {
                    // Logged in but not admin → redirect to home
                    navigate('/')
                    return
                }


                // User is admin → allow access
                setIsAuthorized(true)
            } catch (error) {
                    // Not logged in → redirect to login
                    navigate('/login')
                    return
            }
        };
        checkAdmin()
    }, [])

    // Render nothing while checking
    if (!isAuthorized) return null

    return <>{children}</>
}

export default AdminGuard