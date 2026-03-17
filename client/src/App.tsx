// Entry point for application routes
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Import the reservation page
import Reservation from './pages/Reservation'
// Import the my reservations page
import MyReservations from './pages/MyReservations'
// Import the attractions page
import AttractionsPage from "./pages/Attractions"

const App = () => {
    

    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
};

export default App;

