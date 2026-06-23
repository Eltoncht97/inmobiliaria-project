import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PropertyProvider } from './context/PropertyContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import ScheduleVisit from './pages/ScheduleVisit';
import Favorites from './pages/Favorites';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import AddEditProperty from './pages/AddEditProperty';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-nordic dark:text-white transition-colors duration-300">
            <Navbar />
            
            <div className="flex-grow">
              <Routes>
                {/* User Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/propiedad/:id" element={<PropertyDetails />} />
                <Route path="/propiedad/:id/reservar" element={<ScheduleVisit />} />
                <Route path="/favoritos" element={<Favorites />} />
                <Route path="/contacto" element={<Contact />} />
                
                {/* Auth */}
                <Route path="/admin/login" element={<Login />} />

                {/* Admin Routes (Protected) */}
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/propiedad/agregar" element={<ProtectedRoute><AddEditProperty /></ProtectedRoute>} />
                <Route path="/admin/propiedad/editar/:id" element={<ProtectedRoute><AddEditProperty /></ProtectedRoute>} />
              </Routes>
            </div>

            <Footer />
          </div>
        </Router>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;
