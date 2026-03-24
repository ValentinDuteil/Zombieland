// Entry point for application routes
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Import the register page
import Register from './pages/Register'
//Import the login page
import Login from './pages/Login'
//Import the account page
import MyAccount from './pages/MyAccount'
// Import the reservation page
import Reservation from './pages/Reservation'
// Import the my reservations page
import MyReservations from './pages/MyReservations'
// Import the attractions page
import AttractionsPage from "./pages/Attractions"
// Import the attractions detailpage
import AttractionDetailPage from './pages/AttractionDetailPage'
// Import the scroll to top component
import ScrollToTop from './components/ScrollToTop'
// Import the admin layout
import AdminNavlinkMenu from './components/AdminNavlinkMenu'
// Import the admin pages
// import AdminDashboard from './pages/admin/AdminDashboard'
// import AdminMembers from './pages/admin/AdminMembers'
// import AdminAttractions from './pages/admin/AdminAttractions'
// import AdminReservations from './pages/admin/AdminReservations'

import Faq from './pages/Faq'
import HomePage from './pages/HomePage'
import Contact from './pages/Contact'
import Plan from './pages/Plan'



const App = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />

            <Routes>
                <Route path="/admin" element={<AdminNavlinkMenu />}>
                    {/* <Route index element={<AdminDashboard />} />
                    <Route path="members" element={<AdminMembers />} />
                    <Route path="attractions" element={<AdminAttractions />} />
                    <Route path="reservations" element={<AdminReservations />} /> */}
                </Route>


                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/my-account" element={<MyAccount />} />
                <Route path="/reservation" element={<Reservation />} />
                <Route path="/my-account/reservations" element={<MyReservations />} />
                <Route path="/attractions" element={<AttractionsPage />} />
                <Route path="/attractions/:id" element={<AttractionDetailPage />} />
                <Route path='/faq' element={<Faq />} />
                <Route path='/' element={<HomePage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/plan" element={<Plan />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;