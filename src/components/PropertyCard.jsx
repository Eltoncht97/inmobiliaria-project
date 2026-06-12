import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';

export default function PropertyCard({ property }) {
  const { toggleFavorite, favorites, formatPrice } = useProperties();
  const navigate = useNavigate();

  const isFavorite = favorites.includes(property.id);

  const handleCardClick = () => {
    navigate(`/propiedad/${property.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const getStatusBadge = () => {
    switch (property.status) {
      case 'sale':
        return (
          <div className="absolute bottom-3 left-3 bg-nordic text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
            EN VENTA
          </div>
        );
      case 'rent':
        return (
          <div className="absolute bottom-3 left-3 bg-mosque text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
            EN ALQUILER
          </div>
        );
      case 'sold':
        return (
          <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
            VENDIDO
          </div>
        );
      case 'rented':
        return (
          <div className="absolute bottom-3 left-3 bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
            ALQUILADO
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <article 
      onClick={handleCardClick}
      className="bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col border border-gray-100 dark:border-white/5"
    >
      {/* Property Image & Badges */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          src={property.images && property.images[0] ? property.images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'; // fallback
          }}
        />
        
        {/* Favorite Button */}
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-black/50 rounded-full hover:bg-mosque hover:text-white transition-colors text-nordic shadow-sm z-10"
        >
          <span className="material-icons text-lg block">
            {isFavorite ? 'favorite' : 'favorite_border'}
          </span>
        </button>

        {/* Status Badge */}
        {getStatusBadge()}

        {/* Exclusive Badge */}
        {property.isExclusive && (
          <div className="absolute top-3 left-3 bg-white/95 text-mosque text-[10px] font-bold px-2 py-0.5 rounded shadow-sm tracking-wider uppercase">
            Exclusivo
          </div>
        )}
      </div>

      {/* Property Information */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Price */}
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-bold text-xl text-nordic dark:text-white">
            {formatPrice(property.priceUsd, property.status === 'rent')}
          </h3>
        </div>

        {/* Title */}
        <h4 className="text-nordic dark:text-gray-200 font-bold truncate mb-1 text-base group-hover:text-mosque transition-colors">
          {property.title}
        </h4>

        {/* Location */}
        <p className="text-nordic-muted/80 dark:text-gray-400 text-xs mb-4 flex items-center gap-1">
          <span className="material-icons text-sm text-mosque">place</span>
          {property.location}
        </p>

        {/* Features Footer */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/10 text-nordic-muted dark:text-gray-400">
          <div className="flex items-center gap-1 text-xs">
            <span className="material-icons text-sm text-mosque/80">king_bed</span> 
            <span>{property.beds} Hab</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="material-icons text-sm text-mosque/80">bathtub</span> 
            <span>{property.baths} Baños</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="material-icons text-sm text-mosque/80">square_foot</span> 
            <span>{property.area} m²</span>
          </div>
        </div>
      </div>
    </article>
  );
}
