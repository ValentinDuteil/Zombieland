import { useState, useEffect } from "react";
import axios from "axios";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_URL } from "@/config/api";

interface Reservation {
    id_RESERVATION: number
    nb_tickets: number
    date: string
    total_amount: string
    status: string
    id_USER: number
    id_TICKET: number
}

const AdminReservations = () => {
    const [ reservations, setReservations] =useState<Reservation[]>([]);
    const [ loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('All');

    useEffect(() => {
        const axiosReservation = async () => {
         try {

             const response = await axios.get(`${API_URL}/api/reservations`, 
                {
                withCredentials: true,
                });
            setReservations(response)
            setLoading(false)
        } catch (error) {
            setError
        }
    };
        axiosReservation()
    }, []);
    const handleStatusChange = async () => {
        await axios.patch(`${API_URL}/api/reservations/:id}`, 
            {
                Body: { status : "CANCELLED"
                }
            },
            {
                withCredentials: true
            }
        )

    }
    const filteredReservations = reservations.filter(r => filterStatus === "ALL" || r.status === filterStatus)
    return(
        <></>
    );
};

export default AdminReservations