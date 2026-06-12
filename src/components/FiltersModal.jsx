import React, { useState, useEffect } from 'react';
import { useProperties } from '../context/PropertyContext';

export default function FiltersModal({ isOpen, onClose, initialFilters, onApply }) {
  const { properties } = useProperties();
  const [filters, setFilters] = useState(initialFilters);

  // Sync state with props when modal opens
  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  if (!isOpen) return null;

  // Handler changes
  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBedroomsChange = (op) => {
    setFilters(prev => {
      const val = op === '+' ? prev.beds + 1 : Math.max(0, prev.beds - 1);
      return { ...prev, beds: val };
    });
  };

  const handleBathroomsChange = (op) => {
    setFilters(prev => {
      const val = op === '+' ? prev.baths + 1 : Math.max(0, prev.baths - 1);
      return { ...prev, baths: val };
    });
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => {
      const updated = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: updated };
    });
  };

  const handleClearAll = () => {
    setFilters({
      search: '',
      status: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      beds: 0,
      baths: 0,
      amenities: []
    });
  };

  // Filter computation for the match counter button
  const getFilteredCount = () => {
    return properties.filter(prop => {
      // Search Location / Title
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesSearch = 
          prop.title.toLowerCase().includes(query) ||
          prop.location.toLowerCase().includes(query) ||
          prop.district.toLowerCase().includes(query) ||
          prop.city.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      // Status
      if (filters.status && prop.status !== filters.status) return false;

      // Property Type
      if (filters.type && prop.type !== filters.type) return false;

      // Min Price
      if (filters.minPrice && prop.priceUsd < Number(filters.minPrice)) return false;

      // Max Price
      if (filters.maxPrice && prop.priceUsd > Number(filters.maxPrice)) return false;

      // Beds
      if (filters.beds > 0 && prop.beds < filters.beds) return false;

      // Baths
      if (filters.baths > 0 && prop.baths < filters.baths) return false;

      // Amenities
      if (filters.amenities.length > 0) {
        const matchesAllAmenities = filters.amenities.every(amenityName => 
          prop.amenities.some(am => am.toLowerCase().includes(amenityName.toLowerCase()))
        );
        if (!matchesAllAmenities) return false;
      }

      return true;
    }).length;
  };

  const handleApplyClick = () => {
    onApply(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-background-dark text-nordic dark:text-gray-100 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 border border-nordic/10 dark:border-white/5">
        
        {/* Header */}
        <header className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#162e2a] sticky top-0 z-30">
          <h2 className="text-2xl font-bold tracking-tight text-nordic dark:text-white">Filtros de Búsqueda</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-500 dark:text-gray-400"
          >
            <span className="material-icons">close</span>
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 hide-scroll">
          
          {/* Ubicación */}
          <section className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ubicación / Distrito</label>
            <div className="relative group">
              <span className="material-icons absolute left-4 top-3 text-gray-400 group-focus-within:text-mosque transition-colors">location_on</span>
              <input 
                type="text" 
                value={filters.search}
                onChange={(e) => handleInputChange('search', e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-nordic dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all"
                placeholder="Ej. Miraflores, San Isidro, La Molina..."
              />
            </div>
          </section>

          {/* Rango de Precios */}
          <section className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rango de Precio (USD $)</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-gray-200 dark:border-white/10">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">Mínimo</label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input 
                    type="number" 
                    value={filters.minPrice}
                    onChange={(e) => handleInputChange('minPrice', e.target.value)}
                    className="w-full bg-transparent border-0 p-0 text-nordic dark:text-white font-medium focus:ring-0 text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-gray-200 dark:border-white/10">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">Máximo</label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input 
                    type="number" 
                    value={filters.maxPrice}
                    onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                    className="w-full bg-transparent border-0 p-0 text-nordic dark:text-white font-medium focus:ring-0 text-sm"
                    placeholder="Sin límite"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Tipo de Propiedad y Operación */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tipo */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo de Propiedad</label>
              <select 
                value={filters.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg py-2.5 px-4 text-nordic dark:text-white focus:ring-1 focus:ring-mosque focus:border-mosque cursor-pointer text-sm"
              >
                <option value="">Todos los tipos</option>
                <option value="apartment">Departamento</option>
                <option value="house">Casa</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
              </select>
            </div>

            {/* Operación */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Operación</label>
              <select 
                value={filters.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg py-2.5 px-4 text-nordic dark:text-white focus:ring-1 focus:ring-mosque focus:border-mosque cursor-pointer text-sm"
              >
                <option value="">Cualquiera (Venta o Alquiler)</option>
                <option value="sale">En Venta</option>
                <option value="rent">En Alquiler</option>
              </select>
            </div>

          </section>

          {/* Habitaciones y Baños */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Beds */}
            <div className="flex justify-between items-center bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
              <span className="text-sm font-semibold text-nordic dark:text-gray-200">Habitaciones</span>
              <div className="flex items-center space-x-3">
                <button 
                  type="button"
                  onClick={() => handleBedroomsChange('-')}
                  className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 flex items-center justify-center text-nordic dark:text-white hover:text-mosque disabled:opacity-50"
                  disabled={filters.beds === 0}
                >
                  <span className="material-icons text-base">remove</span>
                </button>
                <span className="text-sm font-bold w-4 text-center">{filters.beds || 'Cual'}</span>
                <button 
                  type="button"
                  onClick={() => handleBedroomsChange('+')}
                  className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 flex items-center justify-center text-nordic dark:text-white hover:text-mosque"
                >
                  <span className="material-icons text-base">add</span>
                </button>
              </div>
            </div>

            {/* Baths */}
            <div className="flex justify-between items-center bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
              <span className="text-sm font-semibold text-nordic dark:text-gray-200">Baños</span>
              <div className="flex items-center space-x-3">
                <button 
                  type="button"
                  onClick={() => handleBathroomsChange('-')}
                  className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 flex items-center justify-center text-nordic dark:text-white hover:text-mosque disabled:opacity-50"
                  disabled={filters.baths === 0}
                >
                  <span className="material-icons text-base">remove</span>
                </button>
                <span className="text-sm font-bold w-4 text-center">{filters.baths || 'Cual'}</span>
                <button 
                  type="button"
                  onClick={() => handleBathroomsChange('+')}
                  className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 flex items-center justify-center text-nordic dark:text-white hover:text-mosque"
                >
                  <span className="material-icons text-base">add</span>
                </button>
              </div>
            </div>

          </section>

          {/* Amenidades */}
          <section className="space-y-4">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Comodidades y Amenidades</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: 'Piscina', icon: 'pool', label: 'Piscina' },
                { key: 'Jardín', icon: 'yard', label: 'Jardín' },
                { key: 'Smart Home', icon: 'home_iot', label: 'Smart Home' },
                { key: 'Parrilla', icon: 'outdoor_grill', label: 'BBQ / Parrilla' },
                { key: 'Gimnasio', icon: 'fitness_center', label: 'Gimnasio' },
                { key: 'Seguridad', icon: 'security', label: 'Seguridad 24/7' }
              ].map(item => {
                const isSelected = filters.amenities.includes(item.key);
                return (
                  <label key={item.key} className="cursor-pointer group relative block">
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => handleAmenityToggle(item.key)}
                    />
                    <div className={`h-full px-4 py-3 rounded-lg border text-sm flex items-center gap-2 transition-all ${
                      isSelected 
                        ? 'border-mosque bg-mosque/5 text-mosque dark:bg-mosque/20 dark:text-primary-light font-medium'
                        : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20'
                    }`}>
                      <span className="material-icons text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-mosque rounded-full"></span>
                    )}
                  </label>
                );
              })}
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="bg-white dark:bg-background-dark border-t border-gray-100 dark:border-white/5 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
          <button 
            type="button"
            onClick={handleClearAll}
            className="text-sm font-semibold text-gray-500 hover:text-nordic dark:hover:text-white transition-colors underline decoration-gray-300 underline-offset-4"
          >
            Limpiar filtros
          </button>
          
          <button 
            type="button"
            onClick={handleApplyClick}
            className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-mosque/20 hover:shadow-mosque/30 flex items-center gap-2 transform active:scale-95 transition-all text-sm"
          >
            <span>Mostrar {getFilteredCount()} Propiedades</span>
            <span className="material-icons text-sm">arrow_forward</span>
          </button>
        </footer>

      </div>
    </div>
  );
}
