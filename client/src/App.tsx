// Entry point for application routes
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Import the reservation page
import Reservation from './pages/Reservation'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/reservation" element={<Reservation />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App