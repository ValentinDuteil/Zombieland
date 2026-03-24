// Redirects to home if the user is not logged in or not an admin
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                credentials: 'include'
            })

            if (!response.ok) {
                // Not logged in → redirect to login
                navigate('/login')
                return
            }

            const data = await response.json()

            if (data.role !== 'ADMIN') {
                // Logged in but not admin → redirect to home
                navigate('/')
                return
            }

            // User is admin → allow access
            setIsAuthorized(true)
        }
        checkAdmin()
    }, [])

    // Render nothing while checking
    if (!isAuthorized) return null

    return <>{children}</>
}

export default AdminGuard