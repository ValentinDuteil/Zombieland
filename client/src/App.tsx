// Entry point for application routes
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Import the register page
import Register from './pages/Register'
//Import the login page
import Login from './pages/Login'
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
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/my-account/reservations" element={<MyReservations />} />
        <Route path="/attractions" element={<AttractionsPage />} />
      </Routes>
    </BrowserRouter>
    );
};

export default App;