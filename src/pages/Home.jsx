import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';
import FiltersModal from '../components/FiltersModal';

export default function Home() {
  const { properties } = useProperties();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Initialize filters from search params or defaults
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '', // sale, rent
    type: searchParams.get('type') || '', // villa, house, apartment, penthouse
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    beds: Number(searchParams.get('beds')) || 0,
    baths: Number(searchParams.get('baths')) || 0,
    amenities: searchParams.get('amenities') ? searchParams.get('amenities').split(',') : []
  });

  // Sync state if URL search parameters change (e.g. clicking Comprar/Alquilar in Navbar)
  useEffect(() => {
    const statusParam = searchParams.get('status') || '';
    setFilters(prev => ({
      ...prev,
      status: statusParam,
      // Reset search if status changes or keep it
      search: searchParams.get('search') || prev.search
    }));
  }, [searchParams]);

  // Update URL search parameters when filters change
  const applyFiltersToUrl = (newFilters) => {
    const params = {};
    if (newFilters.search) params.search = newFilters.search;
    if (newFilters.status) params.status = newFilters.status;
    if (newFilters.type) params.type = newFilters.type;
    if (newFilters.minPrice) params.minPrice = newFilters.minPrice;
    if (newFilters.maxPrice) params.maxPrice = newFilters.maxPrice;
    if (newFilters.beds > 0) params.beds = newFilters.beds;
    if (newFilters.baths > 0) params.baths = newFilters.baths;
    if (newFilters.amenities.length > 0) params.amenities = newFilters.amenities.join(',');
    
    setSearchParams(params);
    setFilters(newFilters);
  };

  // Handle Search Input from main search bar
  const handleMainSearch = (e) => {
    e.preventDefault();
    applyFiltersToUrl(filters);
  };

  // Filter Categories chips
  const handleTypeChipClick = (type) => {
    const updatedFilters = { ...filters, type };
    applyFiltersToUrl(updatedFilters);
  };

  // Handle Tab changes in the listings section (Todos / Comprar / Alquilar)
  const handleStatusTabClick = (status) => {
    const updatedFilters = { ...filters, status };
    applyFiltersToUrl(updatedFilters);
  };

  // Process filtering
  const filteredProperties = properties.filter(prop => {
    // 1. Search (Title, Location, District, City)
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const matchesSearch = 
        prop.title.toLowerCase().includes(query) ||
        prop.location.toLowerCase().includes(query) ||
        prop.district.toLowerCase().includes(query) ||
        prop.city.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // 2. Status (sale vs rent)
    if (filters.status && prop.status !== filters.status) return false;

    // 3. Type
    if (filters.type && prop.type !== filters.type) return false;

    // 4. Price range (USD)
    if (filters.minPrice && prop.priceUsd < Number(filters.minPrice)) return false;
    if (filters.maxPrice && prop.priceUsd > Number(filters.maxPrice)) return false;

    // 5. Rooms
    if (filters.beds > 0 && prop.beds < filters.beds) return false;
    if (filters.baths > 0 && prop.baths < filters.baths) return false;

    // 6. Amenities
    if (filters.amenities.length > 0) {
      const matchesAllAmenities = filters.amenities.every(amenityName => 
        prop.amenities.some(am => am.toLowerCase().includes(amenityName.toLowerCase()))
      );
      if (!matchesAllAmenities) return false;
    }

    return true;
  });

  // Featured properties
  const featuredProperties = properties.filter(p => p.isFeatured).slice(0, 2);

  // Pagination limit
  const [visibleCount, setVisibleCount] = useState(8);
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      
      {/* Hero Search Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic dark:text-white leading-tight">
            Encuentra tu <span className="relative inline-block">
              <span className="relative z-10 font-semibold text-mosque dark:text-primary-light">santuario</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
            </span>.
          </h1>

          {/* Search Form */}
          <form onSubmit={handleMainSearch} className="relative group max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">search</span>
            </div>
            <input 
              type="text"
              value={filters.search}
              onChange={(e) => handleInputChangeDirect('search', e.target.value)}
              className="block w-full pl-12 pr-32 py-4 rounded-xl border-none bg-white dark:bg-white/5 text-nordic dark:text-white shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white dark:focus:bg-white/10 transition-all text-lg"
              placeholder="Buscar por distrito, ciudad o dirección..."
            />
            <button 
              type="submit"
              className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20"
            >
              Buscar
            </button>
          </form>

          {/* Quick Category Chips */}
          <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
            <button 
              onClick={() => handleTypeChipClick('')}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                !filters.type 
                  ? 'bg-nordic text-white shadow-lg shadow-nordic-dark/10' 
                  : 'bg-white dark:bg-white/5 border border-nordic-dark/5 text-nordic-muted hover:text-nordic hover:bg-mosque/5 dark:hover:bg-white/10'
              }`}
            >
              Todos
            </button>
            {[
              { key: 'house', label: 'Casas' },
              { key: 'apartment', label: 'Departamentos' },
              { key: 'villa', label: 'Villas' },
              { key: 'penthouse', label: 'Penthouses' }
            ].map(chip => (
              <button 
                key={chip.key}
                onClick={() => handleTypeChipClick(chip.key)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filters.type === chip.key 
                    ? 'bg-nordic text-white shadow-lg shadow-nordic-dark/10' 
                    : 'bg-white dark:bg-white/5 border border-nordic-dark/5 text-nordic-muted hover:text-nordic hover:bg-mosque/5 dark:hover:bg-white/10'
                }`}
              >
                {chip.label}
              </button>
            ))}

            <div className="w-px h-6 bg-nordic-dark/10 mx-2"></div>
            
            <button 
              type="button"
              onClick={() => setIsFiltersOpen(true)}
              className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic dark:text-white font-semibold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors border border-nordic/10 dark:border-white/10"
            >
              <span className="material-icons text-base">tune</span> Filtros
            </button>
          </div>
        </div>
      </section>

      {/* Featured Collections Section */}
      {!filters.search && !filters.type && !filters.status && (
        <section className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-nordic dark:text-white">Colecciones Destacadas</h2>
              <p className="text-nordic-muted mt-1 text-sm">Propiedades exclusivas seleccionadas para el ojo exigente.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProperties.map(prop => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </section>
      )}

      {/* Main Listings Section */}
      <section id="listings">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-nordic dark:text-white">Novedades en el Mercado</h2>
            <p className="text-nordic-muted mt-1 text-sm">Nuevas oportunidades inmobiliarias agregadas esta semana.</p>
          </div>
          
          {/* Status Tabs */}
          <div className="flex bg-white dark:bg-white/5 p-1 rounded-lg border border-gray-100 dark:border-white/5 self-start">
            <button 
              onClick={() => handleStatusTabClick('')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                !filters.status 
                  ? 'bg-nordic text-white shadow-sm' 
                  : 'text-nordic-muted hover:text-nordic dark:hover:text-white'
              }`}
            >
              Todos
            </button>
            <button 
              onClick={() => handleStatusTabClick('sale')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filters.status === 'sale' 
                  ? 'bg-nordic text-white shadow-sm' 
                  : 'text-nordic-muted hover:text-nordic dark:hover:text-white'
              }`}
            >
              Comprar
            </button>
            <button 
              onClick={() => handleStatusTabClick('rent')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filters.status === 'rent' 
                  ? 'bg-nordic text-white shadow-sm' 
                  : 'text-nordic-muted hover:text-nordic dark:hover:text-white'
              }`}
            >
              Alquilar
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.slice(0, visibleCount).map(prop => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
            <span className="material-icons text-5xl text-gray-300 dark:text-gray-600 mb-4 block">search_off</span>
            <h3 className="text-lg font-bold text-nordic dark:text-white mb-1">No se encontraron propiedades</h3>
            <p className="text-sm text-nordic-muted max-w-sm mx-auto">Prueba limpiando los filtros o realizando otra búsqueda.</p>
            <button
              onClick={handleClearAll}
              className="mt-4 px-4 py-2 bg-mosque text-white text-xs font-semibold rounded-lg hover:bg-mosque/90 transition-colors"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}

        {/* Load More Button */}
        {filteredProperties.length > visibleCount && (
          <div className="mt-12 text-center">
            <button 
              onClick={handleLoadMore}
              className="px-8 py-3 bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 hover:border-mosque hover:text-mosque text-nordic dark:text-white font-semibold rounded-lg transition-all hover:shadow-md"
            >
              Cargar más propiedades
            </button>
          </div>
        )}
      </section>

      {/* Filters Modal */}
      <FiltersModal 
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        initialFilters={filters}
        onApply={applyFiltersToUrl}
      />

    </main>
  );

  // Helper inside Component to update field directly in state before form submit
  function handleInputChangeDirect(field, value) {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }
}
