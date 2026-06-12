import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';

export default function AddEditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, addProperty, updateProperty } = useProperties();
  const isEditMode = !!id;

  // Form States
  const [title, setTitle] = useState('');
  const [priceUsd, setPriceUsd] = useState('');
  const [status, setStatus] = useState('sale');
  const [type, setType] = useState('apartment');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');
  const [beds, setBeds] = useState(3);
  const [baths, setBaths] = useState(2);
  const [parking, setParking] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState(['Jardín']);
  const [imageUrl, setImageUrl] = useState('');

  // Pre-selected premium image choices for convenience
  const defaultImages = [
    { label: 'Casa Moderna con Piscina (Exterior)', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Departamento Ejecutivo (Interior)', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Sala de Estar de Lujo', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Cocina de Mármol Premium', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Dormitorio Principal Amplio', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80' }
  ];

  // Available amenities list
  const amenitiesList = [
    'Piscina Privada',
    'Jardín',
    'Sistema Smart Home',
    'Aire Central',
    'Calefacción',
    'Área de BBQ',
    'Gimnasio Privado',
    'Seguridad 24/7',
    'Cargador Eléctrico',
    'Frente a Parque',
    'Balcón',
    'Cochera Doble'
  ];

  useEffect(() => {
    if (isEditMode) {
      const found = properties.find(p => p.id === id);
      if (found) {
        setTitle(found.title);
        setPriceUsd(found.priceUsd);
        setStatus(found.status);
        setType(found.type);
        setDescription(found.description);
        setLocation(found.location);
        setArea(found.area);
        setYearBuilt(found.yearBuilt || '');
        setBeds(found.beds);
        setBaths(found.baths);
        setParking(found.parking);
        setSelectedAmenities(found.amenities || []);
        setImageUrl(found.images && found.images[0] ? found.images[0] : '');
      } else {
        alert('Propiedad no encontrada para editar.');
        navigate('/admin');
      }
    }
  }, [id, isEditMode, properties, navigate]);

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities(prev => {
      if (prev.includes(amenity)) {
        return prev.filter(a => a !== amenity);
      } else {
        return [...prev, amenity];
      }
    });
  };

  const getTypeText = (typeVal) => {
    switch (typeVal) {
      case 'apartment': return 'Departamento';
      case 'house': return 'Casa';
      case 'villa': return 'Villa';
      case 'penthouse': return 'Penthouse';
      default: return 'Departamento';
    }
  };

  const getStatusText = (statusVal) => {
    switch (statusVal) {
      case 'sale': return 'En Venta';
      case 'rent': return 'En Alquiler';
      case 'sold': return 'Vendido';
      case 'rented': return 'Alquilado';
      default: return 'En Venta';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !priceUsd || !location || !area) {
      alert('Por favor complete los campos obligatorios (*).');
      return;
    }

    // Default agent mock details if creating new
    const defaultAgent = {
      name: "Alex Morgan",
      rating: "Agente Premium",
      phone: "+51 945 678 123",
      email: "amorgan@luxeestate.pe",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOGZK5Jq_Tqk2BeXWfDxdvC2hZTk8NkXNHZOtopr3wzo5wRJePwR6Et_adclI555nmrESUtcgsw4X_Ma93qr0_RpbhJZUwJoP9VlTB7WwH1rht3HXqwi_zi2VLEQKYYZaBo4jhEYrPpHFoX77JHQvI8E2FYvsCWf_zJATSQfBVzGa4e3uMQrTLGzBJZI0D3dpIcWbedg_0ArvWQZGCyPR8Xq5oTrWnb7D7Ge2geZrlnGgv7Fy_lu3486yJYbQ7Z2nt6HyEeUrDwrk"
    };

    const finalImage = imageUrl || defaultImages[0].url;

    const propertyPayload = {
      title,
      priceUsd: Number(priceUsd),
      status,
      statusText: getStatusText(status),
      type,
      typeText: getTypeText(type),
      description,
      location,
      district: location.split(',')[1]?.trim() || 'Lima',
      city: 'Lima',
      beds: Number(beds),
      baths: Number(baths),
      area: Number(area),
      parking: Number(parking),
      yearBuilt: yearBuilt ? Number(yearBuilt) : 2024,
      amenities: selectedAmenities,
      images: [finalImage, ...defaultImages.map(img => img.url).filter(url => url !== finalImage).slice(0, 2)],
      agent: isEditMode ? (properties.find(p => p.id === id)?.agent || defaultAgent) : defaultAgent
    };

    if (isEditMode) {
      updateProperty({
        ...propertyPayload,
        id
      });
      alert('¡Propiedad actualizada con éxito!');
    } else {
      addProperty(propertyPayload);
      alert('¡Propiedad creada con éxito!');
    }

    navigate('/admin');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Breadcrumb & Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 dark:border-white/10 pb-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 font-semibold font-sf-pro">
              <li><Link to="/admin" className="hover:text-mosque transition-colors">Modo Admin</Link></li>
              <li><span className="material-icons text-xs text-gray-400">chevron_right</span></li>
              <li aria-current="page" className="text-nordic dark:text-gray-300">
                {isEditMode ? 'Editar Propiedad' : 'Agregar Propiedad'}
              </li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-nordic dark:text-white tracking-tight mb-2">
              {isEditMode ? 'Modificar Propiedad' : 'Agregar Nueva Propiedad'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl font-semibold">
              Rellene los campos a continuación para configurar su anuncio inmobiliario. Los campos marcados con * son requeridos.
            </p>
          </div>
        </div>
      </header>

      {/* Main Form Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 columns) */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="bg-white dark:bg-[#162e2a] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-3 bg-gradient-to-r from-mosque/5 to-transparent">
              <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">info</span>
              </div>
              <h2 className="text-xl font-bold text-nordic dark:text-white">Información Básica</h2>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-nordic dark:text-gray-200 mb-1.5" htmlFor="prop-title">
                  Título del Anuncio *
                </label>
                <input 
                  type="text" 
                  id="prop-title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-white/5 text-nordic dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque focus:bg-white transition-all font-semibold"
                  placeholder="Ej. Hermoso departamento con vista al mar en Miraflores"
                />
              </div>

              {/* Price, Status, Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-nordic dark:text-gray-200 mb-1.5" htmlFor="prop-price">
                    Precio (USD $) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input 
                      type="number" 
                      id="prop-price"
                      required
                      value={priceUsd}
                      onChange={(e) => setPriceUsd(e.target.value)}
                      className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-white/5 text-nordic dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque focus:bg-white transition-all text-sm font-semibold"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-nordic dark:text-gray-200 mb-1.5" htmlFor="prop-status">
                    Estado de Operación
                  </label>
                  <select 
                    id="prop-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-white/5 text-nordic dark:text-white focus:ring-1 focus:ring-mosque focus:border-mosque focus:bg-white transition-all text-sm cursor-pointer"
                  >
                    <option value="sale">En Venta</option>
                    <option value="rent">En Alquiler</option>
                    <option value="sold">Vendido</option>
                    <option value="rented">Alquilado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-nordic dark:text-gray-200 mb-1.5" htmlFor="prop-type">
                    Tipo de Inmueble
                  </label>
                  <select 
                    id="prop-type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-white/5 text-nordic dark:text-white focus:ring-1 focus:ring-mosque focus:border-mosque focus:bg-white transition-all text-sm cursor-pointer"
                  >
                    <option value="apartment">Departamento</option>
                    <option value="house">Casa</option>
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Description */}
          <div className="bg-white dark:bg-[#162e2a] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-3 bg-gradient-to-r from-mosque/5 to-transparent">
              <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">description</span>
              </div>
              <h2 className="text-xl font-bold text-nordic dark:text-white">Descripción</h2>
            </div>
            <div className="p-8">
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-white/5 text-nordic dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque focus:bg-white transition-all text-sm leading-relaxed resize-y min-h-[180px]"
                placeholder="Escribe los detalles de la propiedad, características del vecindario y puntos fuertes de la venta..."
              ></textarea>
            </div>
          </div>

          {/* Section 3: Gallery & Images */}
          <div className="bg-white dark:bg-[#162e2a] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gradient-to-r from-mosque/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                  <span className="material-icons text-lg">image</span>
                </div>
                <h2 className="text-xl font-bold text-nordic dark:text-white">Galería de Imágenes</h2>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              
              {/* Select or type URL */}
              <div>
                <label className="block text-sm font-semibold text-nordic dark:text-gray-200 mb-1.5">
                  Elige una imagen predefinida de alta calidad:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {defaultImages.map((img, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setImageUrl(img.url)}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 aspect-[4/3] relative transition-all ${
                        imageUrl === img.url 
                          ? 'border-mosque ring-2 ring-mosque/30 scale-102 shadow' 
                          : 'border-transparent hover:border-gray-200 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] p-1 truncate text-center font-bold">
                        {img.label}
                      </div>
                    </div>
                  ))}
                </div>

                <label className="block text-sm font-semibold text-nordic dark:text-gray-200 mb-1.5" htmlFor="img-url">
                  O introduce una URL de imagen personalizada:
                </label>
                <input 
                  type="url"
                  id="img-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-white/5 text-nordic dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque focus:bg-white transition-all font-semibold"
                  placeholder="https://ejemplo.com/foto-inmueble.jpg"
                />
              </div>

              {/* Live Preview */}
              {imageUrl && (
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-gray-500 uppercase">Vista Previa de la Imagen Principal</span>
                  <div className="w-full max-w-sm aspect-[16/10] rounded-xl overflow-hidden shadow bg-slate-100 border border-gray-200">
                    <img src={imageUrl} alt="Vista previa" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6' }} />
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Right Column (4 columns) */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Section 4: Location */}
          <div className="bg-white dark:bg-[#162e2a] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3 bg-gradient-to-r from-mosque/5 to-transparent">
              <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">place</span>
              </div>
              <h2 className="text-lg font-bold text-nordic dark:text-white">Ubicación</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1" htmlFor="prop-location">
                  Dirección y Distrito *
                </label>
                <input 
                  type="text" 
                  id="prop-location"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-white/5 text-nordic dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque focus:bg-white transition-all text-xs font-semibold"
                  placeholder="Ej. Calle Recavarren 230, Miraflores"
                />
              </div>
              <div className="text-[10px] text-gray-400 leading-snug">
                <strong>Nota:</strong> Ingrese el formato de 'Dirección, Distrito' para que el sistema identifique correctamente el distrito de búsqueda.
              </div>
            </div>
          </div>

          {/* Section 5: Specifications & Amenities */}
          <div className="bg-white dark:bg-[#162e2a] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3 bg-gradient-to-r from-mosque/5 to-transparent">
              <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">straighten</span>
              </div>
              <h2 className="text-lg font-bold text-nordic dark:text-white">Especificaciones</h2>
            </div>
            
            <div className="p-6 space-y-6">
              
              {/* Area & Year */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1 block" htmlFor="prop-area">Área (m²) *</label>
                  <input 
                    type="number" 
                    id="prop-area"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-white/5 text-nordic dark:text-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm font-semibold"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1 block" htmlFor="prop-year">Año de Const.</label>
                  <input 
                    type="number" 
                    id="prop-year"
                    value={yearBuilt}
                    onChange={(e) => setYearBuilt(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-white/5 text-nordic dark:text-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm font-semibold"
                    placeholder="YYYY"
                  />
                </div>
              </div>

              <hr className="border-gray-100 dark:border-white/10"/>

              {/* Beds, Baths, Parkings counters */}
              <div className="space-y-4">
                
                {/* Beds */}
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-nordic dark:text-gray-200 flex items-center gap-1">
                    <span className="material-icons text-gray-400 text-base">bed</span> 
                    <span>Habitaciones</span>
                  </label>
                  <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-md overflow-hidden bg-white dark:bg-white/5 shadow-sm">
                    <button 
                      type="button" 
                      onClick={() => setBeds(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors border-r border-gray-100 dark:border-white/5"
                    >-</button>
                    <span className="w-10 text-center text-nordic dark:text-white text-xs font-bold">{beds}</span>
                    <button 
                      type="button" 
                      onClick={() => setBeds(prev => prev + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors border-l border-gray-100 dark:border-white/5"
                    >+</button>
                  </div>
                </div>

                {/* Baths */}
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-nordic dark:text-gray-200 flex items-center gap-1">
                    <span className="material-icons text-gray-400 text-base">shower</span> 
                    <span>Baños</span>
                  </label>
                  <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-md overflow-hidden bg-white dark:bg-white/5 shadow-sm">
                    <button 
                      type="button" 
                      onClick={() => setBaths(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors border-r border-gray-100 dark:border-white/5"
                    >-</button>
                    <span className="w-10 text-center text-nordic dark:text-white text-xs font-bold">{baths}</span>
                    <button 
                      type="button" 
                      onClick={() => setBaths(prev => prev + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors border-l border-gray-100 dark:border-white/5"
                    >+</button>
                  </div>
                </div>

                {/* Parking */}
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-nordic dark:text-gray-200 flex items-center gap-1">
                    <span className="material-icons text-gray-400 text-base">directions_car</span> 
                    <span>Estacionamiento</span>
                  </label>
                  <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-md overflow-hidden bg-white dark:bg-white/5 shadow-sm">
                    <button 
                      type="button" 
                      onClick={() => setParking(prev => Math.max(0, prev - 1))}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors border-r border-gray-100 dark:border-white/5"
                    >-</button>
                    <span className="w-10 text-center text-nordic dark:text-white text-xs font-bold">{parking}</span>
                    <button 
                      type="button" 
                      onClick={() => setParking(prev => prev + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors border-l border-gray-100 dark:border-white/5"
                    >+</button>
                  </div>
                </div>

              </div>

              <hr className="border-gray-100 dark:border-white/10"/>

              {/* Amenities checkboxes */}
              <div>
                <h3 className="text-xs font-bold text-nordic dark:text-white mb-3 uppercase tracking-wider text-gray-500">Amenidades</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                  {amenitiesList.map((amenity) => {
                    const isChecked = selectedAmenities.includes(amenity);
                    return (
                      <label key={amenity} className="flex items-center gap-2.5 cursor-pointer group text-xs">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque cursor-pointer"
                        />
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-nordic dark:group-hover:text-white transition-colors font-medium">
                          {amenity}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Action buttons (desktop bottom sticky sidebar) */}
          <div className="bg-white dark:bg-[#162e2a] p-4 rounded-xl border border-gray-100 dark:border-white/5 flex gap-3 shadow-sm">
            <Link 
              to="/admin" 
              className="flex-1 py-3 text-center rounded-lg border border-gray-300 text-nordic dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 font-semibold text-xs transition-colors"
            >
              Cancelar
            </Link>
            <button 
              type="submit"
              className="flex-1 py-3 bg-mosque hover:bg-primary-hover text-white rounded-lg font-bold text-xs shadow transition-colors cursor-pointer"
            >
              {isEditMode ? 'Guardar Cambios' : 'Crear Propiedad'}
            </button>
          </div>

        </div>

      </form>

    </main>
  );
}
