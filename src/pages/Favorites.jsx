import React from 'react';
import { Link } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';

export default function Favorites() {
  const { favorites, properties } = useProperties();

  // Get favorite properties
  const favoritedProperties = properties.filter(prop => favorites.includes(prop.id));

  return (
    <main className="pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-grow">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-nordic dark:text-white tracking-tight mb-2">Tus Favoritos</h1>
          <p className="text-nordic/70 dark:text-gray-400">
            {favoritedProperties.length === 0 
              ? 'Aún no tienes propiedades guardadas.' 
              : `Tienes ${favoritedProperties.length} ${favoritedProperties.length === 1 ? 'propiedad guardada' : 'propiedades guardadas'} esperándote.`
            }
          </p>
        </div>
      </div>

      {/* Favorites Grid / Empty State */}
      {favoritedProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 animate-fade-in">
          {favoritedProperties.map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
          
          {/* Decorative Discover Card */}
          <div className="group bg-hint-green/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-2 border-dashed border-mosque/30 hover:border-mosque flex flex-col h-full items-center justify-center min-h-[350px] cursor-pointer text-center p-6">
            <div className="w-16 h-16 rounded-full bg-hint-green flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-icons text-mosque text-3xl">add</span>
            </div>
            <h3 className="text-xl font-bold text-nordic mb-2">Descubrir Más</h3>
            <p className="text-nordic/70 text-sm mb-6 max-w-[200px]">Encuentra más propiedades que se adapten a tu estilo de vida.</p>
            <Link 
              to="/" 
              className="px-6 py-2.5 rounded-lg bg-mosque text-white font-medium text-sm shadow-lg shadow-mosque/30 hover:shadow-mosque/50 hover:bg-primary-hover transition-all"
            >
              Explorar Catálogo
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10 max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 text-gray-300 dark:text-gray-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <span className="material-icons text-5xl">favorite_border</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-nordic dark:text-white">Tu lista está vacía</h3>
            <p className="text-sm text-nordic-muted dark:text-gray-400 max-w-sm mx-auto">
              Guarda tus propiedades preferidas haciendo clic en el icono del corazón en las tarjetas de propiedades.
            </p>
          </div>
          <Link 
            to="/" 
            className="inline-block px-6 py-3 bg-mosque hover:bg-primary-hover text-white font-semibold rounded-lg text-sm shadow-lg shadow-mosque/20 transition-all"
          >
            Explorar Propiedades
          </Link>
        </div>
      )}
    </main>
  );
}
