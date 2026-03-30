// Entry point for application routes
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Pages
import Register from './pages/Register'
import Login from './pages/Login'
import MyAccount from './pages/MyAccount'
import Reservation from './pages/Reservation'
import MyReservations from './pages/MyReservations'
import AttractionsPage from "./pages/Attractions"
import AttractionDetailPage from './pages/AttractionDetail'
import Faq from './pages/Faq'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Plan from './pages/Plan'
// Admin pages
import AdminHomePage from './pages/admin/AdminHome'
import AdminMembers from './pages/admin/AdminMembers'
import AdminMemberEdit from './pages/admin/AdminMemberEdit'
import AdminReservations from './pages/admin/AdminReservations'
import AdminAttractions from "./pages/admin/AdminAttractions"
import AdminAttractionCreate from './pages/admin/AdminAttractionCreate'
import AdminAttractionEdit from './pages/admin/AdminAttractionEdit'
// Components
import ScrollToTop from './components/ScrollToTop'
import AdminGuard from './components/AdminGuard'

const App = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/attractions" element={<AttractionsPage />} />
                <Route path="/attractions/:id" element={<AttractionDetailPage />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/plan" element={<Plan />} />
                {/* Member routes */}
                <Route path="/my-account" element={<MyAccount />} />
                <Route path="/my-account/reservations" element={<MyReservations />} />
                <Route path="/reservation" element={<Reservation />} />
                {/* Admin routes */}
                <Route path="/admin" element={<AdminGuard><AdminHomePage /></AdminGuard>} />
                <Route path="/admin/attractions" element={<AdminGuard><AdminAttractions /></AdminGuard>} />
                <Route path="/admin/attractions/create" element={<AdminGuard><AdminAttractionCreate /></AdminGuard>} />
                <Route path="/admin/attractions/:id/edit" element={<AdminGuard><AdminAttractionEdit /></AdminGuard>} />
                <Route path="/admin/reservations" element={<AdminGuard><AdminReservations /></AdminGuard>} />
                <Route path="/admin/members" element={<AdminGuard><AdminMembers /></AdminGuard>} />
                <Route path="/admin/members/:id" element={<AdminGuard><AdminMemberEdit /></AdminGuard>} />
                <Route path="/admin/members/:id/reservations" element={<AdminGuard><MyReservations /></AdminGuard>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;