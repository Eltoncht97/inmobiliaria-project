import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currency, setCurrency, favorites } = useProperties();
  const { isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-nordic-dark/10 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div onClick={handleLogoClick} className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-nordic flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
              <span className="material-icons text-white text-lg">apartment</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-nordic dark:text-white">
              Luxe<span className="text-mosque">Estate</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/?status=sale" 
              className={`text-sm font-semibold transition-all px-1 py-1 ${
                location.search.includes('status=sale') 
                  ? 'text-mosque border-b-2 border-mosque' 
                  : 'text-nordic/70 hover:text-mosque hover:border-b-2 hover:border-nordic/20'
              }`}
            >
              Comprar
            </Link>
            <Link 
              to="/?status=rent" 
              className={`text-sm font-semibold transition-all px-1 py-1 ${
                location.search.includes('status=rent') 
                  ? 'text-mosque border-b-2 border-mosque' 
                  : 'text-nordic/70 hover:text-mosque hover:border-b-2 hover:border-nordic/20'
              }`}
            >
              Alquilar
            </Link>
            <Link 
              to="/contacto" 
              className={`text-sm font-semibold transition-all px-1 py-1 ${
                isActive('/contacto') 
                  ? 'text-mosque border-b-2 border-mosque' 
                  : 'text-nordic/70 hover:text-mosque hover:border-b-2 hover:border-nordic/20'
              }`}
            >
              Te Llamamos
            </Link>
            <Link 
              to="/favoritos" 
              className={`relative text-sm font-semibold transition-all px-1 py-1 ${
                isActive('/favoritos') 
                  ? 'text-mosque border-b-2 border-mosque' 
                  : 'text-nordic/70 hover:text-mosque hover:border-b-2 hover:border-nordic/20'
              }`}
            >
              Guardados
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-mosque text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {favorites.length}
                </span>
              )}
            </Link>
          </div>

          {/* Currency Toggles & Admin Mode */}
          <div className="flex items-center space-x-4">
            
            {/* Currency Selector (Soles S/. vs Dollars $) */}
            <div className="flex bg-white dark:bg-white/5 p-1 rounded-lg border border-nordic-dark/10 dark:border-white/10 shadow-sm text-xs font-semibold">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  currency === 'USD' 
                    ? 'bg-nordic text-white shadow-sm' 
                    : 'text-nordic/60 dark:text-gray-400 hover:text-nordic dark:hover:text-white'
                }`}
              >
                $ USD
              </button>
              <button
                onClick={() => setCurrency('PEN')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  currency === 'PEN' 
                    ? 'bg-nordic text-white shadow-sm' 
                    : 'text-nordic/60 dark:text-gray-400 hover:text-nordic dark:hover:text-white'
                }`}
              >
                S/. PEN
              </button>
            </div>

            {/* Admin Switcher */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-mosque text-white shadow-md'
                      : 'bg-white dark:bg-white/5 border border-nordic/10 text-nordic hover:border-mosque dark:hover:border-white/20 hover:text-mosque dark:text-white'
                  }`}
                >
                  <span className="material-icons text-base">dashboard</span>
                  <span>Panel Admin</span>
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  title="Cerrar sesión admin"
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-900/20 border border-red-200/60 dark:border-red-800/40 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
                >
                  <span className="material-icons text-base">logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-white/5 border border-nordic/10 text-nordic hover:border-mosque dark:hover:border-white/20 hover:text-mosque dark:text-white transition-all"
              >
                <span className="material-icons text-base">admin_panel_settings</span>
                <span>Modo Admin</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-nordic hover:text-mosque dark:text-gray-300 transition-colors"
            >
              <span className="material-icons">{isOpen ? 'close' : 'menu'}</span>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-nordic-dark/5 bg-background-light dark:bg-background-dark py-4 transition-all duration-300">
          <div className="px-4 space-y-2">
            <Link 
              onClick={() => setIsOpen(false)}
              to="/?status=sale" 
              className="block px-4 py-2.5 rounded-lg text-base font-semibold text-nordic hover:bg-mosque/10 hover:text-mosque"
            >
              Comprar
            </Link>
            <Link 
              onClick={() => setIsOpen(false)}
              to="/?status=rent" 
              className="block px-4 py-2.5 rounded-lg text-base font-semibold text-nordic hover:bg-mosque/10 hover:text-mosque"
            >
              Alquilar
            </Link>
            <Link 
              onClick={() => setIsOpen(false)}
              to="/contacto" 
              className="block px-4 py-2.5 rounded-lg text-base font-semibold text-nordic hover:bg-mosque/10 hover:text-mosque"
            >
              Te Llamamos
            </Link>
            <Link 
              onClick={() => setIsOpen(false)}
              to="/favoritos" 
              className="block px-4 py-2.5 rounded-lg text-base font-semibold text-nordic hover:bg-mosque/10 hover:text-mosque flex justify-between items-center"
            >
              <span>Guardados</span>
              {favorites.length > 0 && (
                <span className="bg-mosque text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {favorites.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
