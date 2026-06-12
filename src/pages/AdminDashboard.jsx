import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';

export default function AdminDashboard() {
  const { properties, deleteProperty, appointments, callbacks, formatPrice } = useProperties();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('properties'); // properties, appointments, callbacks

  // Compute stats
  const totalListings = properties.length;
  const activeListings = properties.filter(p => p.status === 'sale' || p.status === 'rent').length;
  const soldOrRented = properties.filter(p => p.status === 'sold' || p.status === 'rented').length;

  const handleDelete = (id, title) => {
    if (window.confirm(`¿Está seguro de que desea eliminar la propiedad "${title}"?`)) {
      deleteProperty(id);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'sale':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-hint-green text-primary border border-primary/10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5"></span>
            En Venta (Activo)
          </span>
        );
      case 'rent':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-mosque/10 text-mosque border border-mosque/20">
            <span className="w-1.5 h-1.5 rounded-full bg-mosque mr-1.5"></span>
            En Alquiler (Activo)
          </span>
        );
      case 'sold':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
            Vendido
          </span>
        );
      case 'rented':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span>
            Alquilado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-nordic dark:text-white tracking-tight">Panel de Administración</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gestiona tu cartera de propiedades y revisa las consultas de tus clientes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/propiedad/agregar')}
            className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md shadow-primary/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
          >
            <span className="material-icons text-base font-bold">add</span> 
            <span>Agregar Propiedad</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#162e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Propiedades</p>
            <p className="text-2xl font-bold text-nordic dark:text-white mt-1">{totalListings}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary dark:text-primary-light">
            <span className="material-icons">apartment</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#162e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Listados Activos</p>
            <p className="text-2xl font-bold text-nordic dark:text-white mt-1">{activeListings}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-hint-green flex items-center justify-center text-primary">
            <span className="material-icons">check_circle</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#162e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Cerrados (Vendidos/Alquilados)</p>
            <p className="text-2xl font-bold text-nordic dark:text-white mt-1">{soldOrRented}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <span className="material-icons">sell</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-gray-200 dark:border-white/10 mb-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('properties')}
          className={`pb-4 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'properties'
              ? 'border-mosque text-mosque dark:text-primary-light'
              : 'border-transparent text-gray-500 hover:text-nordic dark:hover:text-white hover:border-gray-300'
          }`}
        >
          <span className="material-icons text-base">villa</span>
          <span>Propiedades ({properties.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-4 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'appointments'
              ? 'border-mosque text-mosque dark:text-primary-light'
              : 'border-transparent text-gray-500 hover:text-nordic dark:hover:text-white hover:border-gray-300'
          }`}
        >
          <span className="material-icons text-base">calendar_today</span>
          <span>Citas Reservadas ({appointments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('callbacks')}
          className={`pb-4 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'callbacks'
              ? 'border-mosque text-mosque dark:text-primary-light'
              : 'border-transparent text-gray-500 hover:text-nordic dark:hover:text-white hover:border-gray-300'
          }`}
        >
          <span className="material-icons text-base">phone_in_talk</span>
          <span>Solicitudes de Llamada ({callbacks.length})</span>
        </button>
      </div>

      {/* Tab 1: Properties CRUD */}
      {activeTab === 'properties' && (
        <div className="bg-white dark:bg-[#162e2a] rounded-xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
          
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <div className="col-span-6">Detalles de la Propiedad</div>
            <div className="col-span-2">Precio USD</div>
            <div className="col-span-2">Estado</div>
            <div className="col-span-2 text-right">Acciones</div>
          </div>

          {/* Properties List */}
          {properties.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {properties.map(prop => (
                <div key={prop.id} className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors items-center">
                  
                  {/* Image & Main Info */}
                  <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                    <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                      <img 
                        alt={prop.title} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        src={prop.images && prop.images[0] ? prop.images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'} 
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 
                        onClick={() => navigate(`/propiedad/${prop.id}`)}
                        className="text-base font-bold text-nordic dark:text-white hover:text-mosque dark:hover:text-primary-light transition-colors cursor-pointer truncate"
                      >
                        {prop.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{prop.location}</p>
                      
                      {/* Features mini bar */}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                        <span className="flex items-center gap-0.5"><span className="material-icons text-[14px]">bed</span> {prop.beds} Dorm</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="flex items-center gap-0.5"><span className="material-icons text-[14px]">bathtub</span> {prop.baths} Baños</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>{prop.area} m²</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-6 md:col-span-2">
                    <div className="text-base font-bold text-nordic dark:text-gray-200">
                      {formatPrice(prop.priceUsd, prop.status === 'rent')}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">Precio base en dólares</p>
                  </div>

                  {/* Status */}
                  <div className="col-span-6 md:col-span-2">
                    {getStatusBadge(prop.status)}
                  </div>

                  {/* Actions */}
                  <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
                    <button 
                      onClick={() => navigate(`/admin/propiedad/editar/${prop.id}`)}
                      className="p-2 rounded-lg text-gray-400 hover:text-mosque hover:bg-mosque/10 transition-all cursor-pointer"
                      title="Editar Propiedad"
                    >
                      <span className="material-icons text-xl">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(prop.id, prop.title)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                      title="Eliminar Propiedad"
                    >
                      <span className="material-icons text-xl">delete_outline</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="font-medium">No hay propiedades registradas.</p>
              <button 
                onClick={() => navigate('/admin/propiedad/agregar')}
                className="mt-3 text-xs bg-mosque text-white px-4 py-2 rounded"
              >
                Agregar mi primera propiedad
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Booked Visits */}
      {activeTab === 'appointments' && (
        <div className="bg-white dark:bg-[#162e2a] rounded-xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
          {appointments.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {appointments.map((appt) => (
                <div key={appt.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                  
                  {/* Property Image & Details */}
                  <div className="flex gap-4 items-start">
                    <div className="h-16 w-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img alt={appt.propertyTitle} className="w-full h-full object-cover" src={appt.propertyImage} />
                    </div>
                    <div>
                      <h4 
                        onClick={() => navigate(`/propiedad/${appt.propertyId}`)}
                        className="font-bold text-nordic dark:text-white hover:text-mosque cursor-pointer text-sm md:text-base"
                      >
                        {appt.propertyTitle}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5 leading-snug">{appt.propertyLocation}</p>
                      
                      {/* Customer Details */}
                      <div className="mt-3 space-y-1 text-xs">
                        <p><strong className="text-nordic dark:text-gray-200">Cliente:</strong> {appt.clientName}</p>
                        <p><strong className="text-nordic dark:text-gray-200">Celular:</strong> {appt.clientPhone} | <strong className="text-nordic dark:text-gray-200">Correo:</strong> {appt.clientEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Visit Time Schedule */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 text-right bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5 md:border-0 md:p-0 md:bg-transparent">
                    <div>
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-mosque dark:text-primary-light">
                        <span className="material-icons text-base">calendar_today</span>
                        <span>{appt.date}</span>
                      </span>
                      <p className="text-xs text-gray-500 font-bold mt-1">Hora: {appt.time}</p>
                    </div>
                    {appt.message && (
                      <div className="text-left mt-2 text-xs text-gray-500 bg-white dark:bg-white/5 p-2.5 rounded border border-gray-100 dark:border-white/5 max-w-sm">
                        <span className="font-semibold block text-[10px] uppercase text-gray-400 mb-0.5">Mensaje:</span>
                        "{appt.message}"
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <span className="material-icons text-4xl mb-2 text-gray-300 block">event_busy</span>
              <p className="text-sm">No tienes visitas programadas por el momento.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Callback Requests */}
      {activeTab === 'callbacks' && (
        <div className="bg-white dark:bg-[#162e2a] rounded-xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
          {callbacks.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {callbacks.map((cb) => (
                <div key={cb.id} className="p-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    
                    {/* Customer Contact */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-mosque/10 flex items-center justify-center text-mosque">
                          <span className="material-icons text-sm">person</span>
                        </div>
                        <h4 className="font-bold text-nordic dark:text-white text-base">{cb.name}</h4>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 ml-10">
                        <p className="flex items-center gap-1 font-semibold">
                          <span className="material-icons text-sm text-mosque">phone</span> 
                          <span>Llamar al: <strong className="text-nordic dark:text-white text-sm">{cb.phone}</strong></span>
                        </p>
                        <p className="flex items-center gap-1 font-semibold">
                          <span className="material-icons text-sm text-mosque">schedule</span>
                          <span>Horario de contacto: <strong className="text-nordic dark:text-white">{cb.preferredTime}</strong></span>
                        </p>
                      </div>
                    </div>

                    {/* Meta timestamp */}
                    <div className="text-right text-[10px] text-gray-400 font-semibold uppercase">
                      Solicitado: {new Date(cb.createdAt).toLocaleDateString('es-PE')}
                    </div>
                  </div>

                  {cb.message && (
                    <div className="mt-4 ml-10 bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/5 text-xs text-gray-500 leading-relaxed max-w-2xl">
                      <strong className="block text-[9px] uppercase text-gray-400 mb-1">Nota del Cliente:</strong>
                      "{cb.message}"
                    </div>
                  )}

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <span className="material-icons text-4xl mb-2 text-gray-300 block">phone_disabled</span>
              <p className="text-sm">No hay solicitudes de llamadas en bandeja.</p>
            </div>
          )}
        </div>
      )}

    </main>
  );
}
