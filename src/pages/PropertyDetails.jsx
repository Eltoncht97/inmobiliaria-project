import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, formatPrice, toggleFavorite, favorites } = useProperties();
  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const found = properties.find(p => p.id === id);
    if (found) {
      setProperty(found);
      setActiveImage(found.images && found.images[0] ? found.images[0] : '');
    }
  }, [id, properties]);

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="material-icons text-5xl text-gray-300 mb-4 block">search_off</span>
        <h2 className="text-2xl font-bold text-nordic mb-2">Propiedad no encontrada</h2>
        <p className="text-gray-500 mb-6">La propiedad que estás buscando no existe o fue eliminada.</p>
        <Link to="/" className="px-6 py-3 bg-mosque text-white font-medium rounded-lg hover:bg-mosque/90 transition-colors">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const isFavorite = favorites.includes(property.id);

  // Mortgage calculation helper
  const getMortgageEstimate = () => {
    // 20% down payment
    const loanAmount = property.priceUsd * 0.8;
    // Simple mock mortgage calculation: 30 years at 6% annual interest
    const annualInterestRate = 0.06;
    const monthlyInterestRate = annualInterestRate / 12;
    const numberOfPayments = 30 * 12;
    
    const monthlyPayment = 
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    return Math.round(monthlyPayment);
  };

  const getStatusLabel = () => {
    switch (property.status) {
      case 'sale': return 'En Venta';
      case 'rent': return 'En Alquiler';
      case 'sold': return 'Vendido';
      case 'rented': return 'Alquilado';
      default: return '';
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <div className="mb-6">
        <Link to="/" className="flex items-center gap-1.5 text-nordic/60 hover:text-mosque font-medium transition-colors w-fit">
          <span className="material-icons text-lg">arrow_back</span>
          <span>Volver al listado</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Gallery / Images (8 columns) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm bg-gray-100 group">
            <img 
              alt={property.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102" 
              src={activeImage || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'} 
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6';
              }}
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-mosque text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                {getStatusLabel()}
              </span>
              {property.isExclusive && (
                <span className="bg-white/90 backdrop-blur text-nordic text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                  Exclusivo
                </span>
              )}
            </div>
            
            {/* Heart Favorite Trigger */}
            <button 
              onClick={() => toggleFavorite(property.id)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center text-nordic hover:bg-mosque hover:text-white transition-all shadow-md z-10"
            >
              <span className="material-icons text-xl">
                {isFavorite ? 'favorite' : 'favorite_border'}
              </span>
            </button>
          </div>

          {/* Thumbnails */}
          {property.images && property.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
              {property.images.map((img, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`flex-none w-36 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer transition-all snap-start ${
                    activeImage === img 
                      ? 'ring-2 ring-mosque ring-offset-2 ring-offset-clear-day' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img alt={`${property.title} thumbnail ${index}`} className="w-full h-full object-cover" src={img} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Info (4 columns) */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-28 space-y-6">
            
            {/* Pricing & Location Card */}
            <div className="bg-white dark:bg-[#162e2a] p-6 rounded-xl shadow-sm border border-mosque/5">
              <div className="mb-4">
                <span className="text-xs uppercase tracking-wider text-nordic-muted font-bold block mb-1">Precio</span>
                <h1 className="text-4xl font-display font-light text-nordic dark:text-white mb-2 font-semibold">
                  {formatPrice(property.priceUsd, property.status === 'rent')}
                </h1>
                <p className="text-nordic/70 dark:text-gray-300 font-medium flex items-start gap-1 text-sm leading-snug">
                  <span className="material-icons text-mosque text-sm mt-0.5">location_on</span>
                  <span>{property.location}</span>
                </p>
              </div>
              
              <div className="h-px bg-slate-100 dark:bg-white/10 my-6"></div>
              
              {/* Agent card */}
              <div className="flex items-center gap-4 mb-6">
                <img 
                  alt={property.agent.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" 
                  src={property.agent.image} 
                />
                <div>
                  <h3 className="font-bold text-nordic dark:text-white text-base">{property.agent.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-mosque dark:text-primary-light font-medium">
                    <span className="material-icons text-[14px]">star</span>
                    <span>{property.agent.rating}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {property.status !== 'sold' && property.status !== 'rented' && (
                  <button 
                    onClick={() => navigate(`/propiedad/${property.id}/reservar`)}
                    className="w-full bg-mosque hover:bg-primary-hover text-white py-4 px-6 rounded-lg font-semibold transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span className="material-icons text-xl group-hover:scale-110 transition-transform">calendar_today</span>
                    <span>Agendar Visita</span>
                  </button>
                )}
                <Link 
                  to="/contacto"
                  className="w-full bg-transparent border border-nordic/10 hover:border-mosque dark:border-white/10 dark:hover:border-white text-nordic/80 hover:text-mosque dark:text-gray-300 dark:hover:text-white py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-icons text-xl">mail_outline</span>
                  <span>Contactar Agente</span>
                </Link>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white dark:bg-[#162e2a] p-2 rounded-xl shadow-sm border border-mosque/5">
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 dark:bg-white/5">
                <img 
                  alt="Mapa de ubicación" 
                  className="w-full h-full object-cover opacity-80 dark:opacity-40" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAam7l6Iva-Ueed4N1BxrVb5SqFJUVl9pnGf_zDG5JYhZmJCe3hLYttkVA-Jg46VljNevhZK7LCxoMpRmKjS0pT1uk0x_WAT5FFVpphw6yGYjroXFGybUkSYCymind4Z7fzrdob5j_VR4DfhQL6Lej-gMQZCuLjZrOjYt0KN97oLy0gZVOIyV1o7woH1F8aOvLzpKUPzcof0KmZdYl7I1uq25G31zdQYTwnQCXvWAQ0Snu1uEKYLQZg4uV4OsqzeOtSu_KCt36ytmw" 
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 bg-mosque rounded-full border-4 border-white shadow-lg animate-bounce flex items-center justify-center">
                    <span className="material-icons text-white text-sm">home</span>
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded shadow-sm text-nordic">
                  Lima, Perú
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Features Content (8 columns bottom row) */}
        <div className="lg:col-span-8 lg:row-start-2 -mt-8 space-y-8">
          
          {/* Specifications Box */}
          <div className="bg-white dark:bg-[#162e2a] p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-bold mb-6 text-nordic dark:text-white">Características de la Propiedad</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 dark:bg-white/5 rounded-lg border border-mosque/10 dark:border-white/10 text-center">
                <span className="material-icons text-mosque text-2xl mb-2">square_foot</span>
                <span className="text-xl font-bold text-nordic dark:text-white">{property.area}</span>
                <span className="text-[10px] uppercase tracking-wider text-nordic/50 dark:text-gray-400 font-semibold mt-1">Metros Cuadrados</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 dark:bg-white/5 rounded-lg border border-mosque/10 dark:border-white/10 text-center">
                <span className="material-icons text-mosque text-2xl mb-2">bed</span>
                <span className="text-xl font-bold text-nordic dark:text-white">{property.beds}</span>
                <span className="text-[10px] uppercase tracking-wider text-nordic/50 dark:text-gray-400 font-semibold mt-1">Habitaciones</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 dark:bg-white/5 rounded-lg border border-mosque/10 dark:border-white/10 text-center">
                <span className="material-icons text-mosque text-2xl mb-2">shower</span>
                <span className="text-xl font-bold text-nordic dark:text-white">{property.baths}</span>
                <span className="text-[10px] uppercase tracking-wider text-nordic/50 dark:text-gray-400 font-semibold mt-1">Baños</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 dark:bg-white/5 rounded-lg border border-mosque/10 dark:border-white/10 text-center">
                <span className="material-icons text-mosque text-2xl mb-2">directions_car</span>
                <span className="text-xl font-bold text-nordic dark:text-white">{property.parking}</span>
                <span className="text-[10px] uppercase tracking-wider text-nordic/50 dark:text-gray-400 font-semibold mt-1">Estacionamientos</span>
              </div>
            </div>
          </div>

          {/* Description Box */}
          <div className="bg-white dark:bg-[#162e2a] p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-bold mb-4 text-nordic dark:text-white">Descripción de la Propiedad</h2>
            <div className="text-nordic/70 dark:text-gray-300 leading-relaxed space-y-4 text-sm md:text-base">
              <p>{property.description}</p>
            </div>
            {property.yearBuilt && (
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10 text-xs text-nordic-muted dark:text-gray-400 font-semibold">
                Año de Construcción: {property.yearBuilt}
              </div>
            )}
          </div>

          {/* Amenities Box */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white dark:bg-[#162e2a] p-8 rounded-xl shadow-sm border border-mosque/5">
              <h2 className="text-lg font-bold mb-6 text-nordic dark:text-white">Comodidades y Servicios</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 text-nordic/70 dark:text-gray-300 text-sm md:text-base">
                    <span className="material-icons text-mosque/60 text-base">check_circle</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mortgage Calculator Box */}
          <div className="bg-mosque/5 dark:bg-[#162e2a]/50 p-6 rounded-xl border border-mosque/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white dark:bg-[#162e2a] rounded-full text-mosque shadow-sm flex items-center justify-center">
                <span className="material-icons text-2xl">calculate</span>
              </div>
              <div>
                <h3 className="font-bold text-nordic dark:text-white text-base">Pago Mensual Estimado</h3>
                <p className="text-sm text-nordic-muted dark:text-gray-400 mt-1">
                  Cuota desde <strong className="text-mosque dark:text-primary-light">{formatPrice(getMortgageEstimate())}/mes</strong> con 20% de cuota inicial a 30 años (6% interés).
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
