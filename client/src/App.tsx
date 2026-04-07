// Entry point for application routes
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
// Components
import ScrollToTop from './components/ScrollToTop'
import AdminGuard from './components/AdminGuard'
// Public pages
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const AttractionsPage = lazy(() => import('./pages/Attractions'))
const AttractionDetailPage = lazy(() => import('./pages/AttractionDetail'))
const Faq = lazy(() => import('./pages/Faq'))
const Contact = lazy(() => import('./pages/Contact'))
const Plan = lazy(() => import('./pages/Plan'))
const MyAccount = lazy(() => import('./pages/MyAccount'))
const MyReservations = lazy(() => import('./pages/MyReservations'))
const Reservation = lazy(() => import('./pages/Reservation'))

// Admin pages
const AdminHomePage = lazy(() => import('./pages/admin/AdminHome'))
const AdminMembers = lazy(() => import('./pages/admin/AdminMembers'))
const AdminMemberEdit = lazy(() => import('./pages/admin/AdminMemberEdit'))
const AdminReservations = lazy(() => import('./pages/admin/AdminReservations'))
const AdminAttractions = lazy(() => import('./pages/admin/AdminAttractions'))
const AdminAttractionCreate = lazy(() => import('./pages/admin/AdminAttractionCreate'))
const AdminAttractionEdit = lazy(() => import('./pages/admin/AdminAttractionEdit'))
const AdminPrices = lazy(() => import('./pages/admin/AdminPrices'))

const App = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={null}>
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
                <Route path="/admin/tarifs" element={<AdminGuard><AdminPrices /></AdminGuard>} />
                <Route path="/admin/attractions" element={<AdminGuard><AdminAttractions /></AdminGuard>} />
                <Route path="/admin/attractions/create" element={<AdminGuard><AdminAttractionCreate /></AdminGuard>} />
                <Route path="/admin/attractions/:id/edit" element={<AdminGuard><AdminAttractionEdit /></AdminGuard>} />
                <Route path="/admin/reservations" element={<AdminGuard><AdminReservations /></AdminGuard>} />
                <Route path="/admin/members" element={<AdminGuard><AdminMembers /></AdminGuard>} />
                <Route path="/admin/members/:id" element={<AdminGuard><AdminMemberEdit /></AdminGuard>} />
                <Route path="/admin/members/:id/reservations" element={<AdminGuard><MyReservations /></AdminGuard>} />
            </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default App;