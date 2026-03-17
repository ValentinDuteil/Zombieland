
import { useEffect, useState } from "react";
import type { Attraction } from "@types";
import AttractionsPage from "./pages/Attractions";
// Entry point for application routes
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Import the reservation page
import Reservation from './pages/Reservation'
// Import the my reservations page
import MyReservations from './pages/MyReservations'

const App = () => {
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/attractions");
                if (!res.ok) throw new Error("Erreur récupération attractions");
                const data: Attraction[] = await res.json();
                setAttractions(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchAttractions();
    }, []);
console.log("Attractions:", attractions);
    return (
        <Routes>
            <Route
                path="/attractions"
                element={
                    attractions.length > 0
                        ? <AttractionsPage attractions={attractions} />
                        : <p>Loading...</p>
                }
            />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/my-account/reservations" element={<MyReservations />} />
        </Routes>
    );
};

export default App;

