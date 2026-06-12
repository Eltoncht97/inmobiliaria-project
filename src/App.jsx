import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PropertyProvider } from './context/PropertyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import ScheduleVisit from './pages/ScheduleVisit';
import Favorites from './pages/Favorites';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import AddEditProperty from './pages/AddEditProperty';

function App() {
  return (
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
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/propiedad/agregar" element={<AddEditProperty />} />
              <Route path="/admin/propiedad/editar/:id" element={<AddEditProperty />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </Router>
    </PropertyProvider>
  );
}

export default App;
