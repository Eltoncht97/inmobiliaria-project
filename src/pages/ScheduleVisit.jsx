import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';

export default function ScheduleVisit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, formatPrice, addAppointment } = useProperties();
  const [property, setProperty] = useState(null);

  // Form State
  const [selectedDay, setSelectedDay] = useState(28); // Initial mocked day
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const found = properties.find(p => p.id === id);
    if (found) {
      setProperty(found);
    }
  }, [id, properties]);

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-nordic mb-2">Propiedad no encontrada</h2>
        <Link to="/" className="text-mosque underline">Volver al inicio</Link>
      </div>
    );
  }

  // Available days in June 2026 (mocked interactive list)
  const daysInMonth = [
    { day: 1, name: 'Lun', available: true },
    { day: 2, name: 'Mar', available: true },
    { day: 3, name: 'Mié', available: true },
    { day: 4, name: 'Jue', available: true },
    { day: 5, name: 'Vie', available: true },
    { day: 6, name: 'Sáb', available: true },
    { day: 7, name: 'Dom', available: false },
    { day: 8, name: 'Lun', available: true },
    { day: 9, name: 'Mar', available: true },
    { day: 10, name: 'Mié', available: true },
    { day: 11, name: 'Jue', available: true },
    { day: 12, name: 'Vie', available: true },
    { day: 13, name: 'Sáb', available: true },
    { day: 14, name: 'Dom', available: false },
    { day: 15, name: 'Lun', available: true },
    { day: 16, name: 'Mar', available: true },
    { day: 17, name: 'Mié', available: true },
    { day: 18, name: 'Jue', available: true },
    { day: 19, name: 'Vie', available: true },
    { day: 20, name: 'Sáb', available: true },
    { day: 21, name: 'Dom', available: false },
    { day: 22, name: 'Lun', available: true },
    { day: 23, name: 'Mar', available: true },
    { day: 24, name: 'Mié', available: true },
    { day: 25, name: 'Jue', available: true },
    { day: 26, name: 'Vie', available: true },
    { day: 27, name: 'Sáb', available: true },
    { day: 28, name: 'Dom', available: false },
    { day: 29, name: 'Lun', available: true },
    { day: 30, name: 'Mar', available: true }
  ];

  // Available times list
  const times = [
    { time: '09:00 AM', available: true },
    { time: '09:30 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '10:30 AM', available: true },
    { time: '11:30 AM', available: true },
    { time: '01:00 PM', available: false }, // Taken
    { time: '02:00 PM', available: true },
    { time: '03:30 PM', available: true }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!clientName || !clientPhone || !clientEmail) {
      alert('Por favor complete todos los datos de contacto requeridos.');
      return;
    }

    const appt = {
      propertyId: property.id,
      propertyTitle: property.title,
      propertyLocation: property.location,
      propertyImage: property.images && property.images[0] ? property.images[0] : '',
      date: `${selectedDay} de Junio, 2026`,
      time: selectedTime,
      clientName,
      clientPhone,
      clientEmail,
      message
    };

    addAppointment(appt);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center py-20 px-4">
        <div className="w-full max-w-md bg-white dark:bg-[#162e2a] rounded-xl shadow-2xl p-8 text-center border border-slate-100 dark:border-slate-800 space-y-6">
          <div className="w-20 h-20 bg-hint-green dark:bg-mosque/20 text-mosque dark:text-primary-light rounded-full flex items-center justify-center mx-auto shadow-md">
            <span className="material-icons text-5xl">check_circle</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-nordic dark:text-white">¡Visita Agendada!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tu cita para visitar <strong>{property.title}</strong> ha sido confirmada con éxito.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-lg text-left text-xs space-y-2 border border-gray-100 dark:border-white/5">
            <p className="text-gray-500 dark:text-gray-400"><strong className="text-nordic dark:text-white">Fecha:</strong> {selectedDay} de Junio, 2026</p>
            <p className="text-gray-500 dark:text-gray-400"><strong className="text-nordic dark:text-white">Hora:</strong> {selectedTime}</p>
            <p className="text-gray-500 dark:text-gray-400"><strong className="text-nordic dark:text-white">Cliente:</strong> {clientName}</p>
            <p className="text-gray-500 dark:text-gray-400"><strong className="text-nordic dark:text-white">Agente:</strong> {property.agent.name}</p>
          </div>
          <div className="flex gap-4">
            <Link 
              to="/" 
              className="flex-1 px-4 py-3 border border-nordic/10 hover:border-mosque rounded-lg text-sm font-semibold text-nordic dark:text-gray-300 hover:text-mosque transition-colors"
            >
              Ir al Inicio
            </Link>
            <button 
              onClick={() => navigate(`/propiedad/${property.id}`)}
              className="flex-1 px-4 py-3 bg-mosque hover:bg-primary-hover text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Volver al Detalle
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow flex flex-col items-center py-8 px-4 md:px-8">
      {/* Back Link */}
      <div className="w-full max-w-7xl mb-6">
        <Link to={`/propiedad/${property.id}`} className="flex items-center gap-2 group text-nordic/60 hover:text-mosque transition-colors w-fit">
          <span className="material-icons text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="font-semibold">Volver a los detalles de la propiedad</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl bg-white dark:bg-[#162e2a] rounded-xl shadow-2xl shadow-mosque/5 overflow-hidden flex flex-col md:flex-row border border-slate-100 dark:border-slate-800">
        
        {/* Left Side: Property details */}
        <div className="w-full md:w-5/12 bg-slate-50 dark:bg-[#112522] p-6 md:p-8 lg:p-10 flex flex-col gap-6 relative">
          <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-mosque/5 to-transparent pointer-events-none"></div>
          
          <div className="relative group overflow-hidden rounded-lg shadow-md aspect-[4/3] bg-gray-200">
            <img 
              alt={property.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src={property.images && property.images[0] ? property.images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'} 
            />
            <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase text-mosque">
              {property.status === 'rent' ? 'En Alquiler' : 'En Venta'}
            </div>
          </div>

          <div className="space-y-4 z-10">
            <div>
              <h2 className="text-2xl font-bold text-nordic dark:text-white leading-tight">{property.title}</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1 text-sm">
                <span className="material-icons text-base mt-0.5">location_on</span>
                <span>{property.location}</span>
              </p>
            </div>

            <div className="flex items-center justify-between py-4 border-y border-slate-200 dark:border-slate-700">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Precio</span>
                <span className="text-xl font-bold text-mosque dark:text-primary-light">
                  {formatPrice(property.priceUsd, property.status === 'rent')}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="flex flex-col items-center">
                  <span className="material-icons text-slate-400 text-base">bed</span>
                  <span className="text-[10px] font-semibold">{property.beds} Dorm</span>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                <div className="flex flex-col items-center">
                  <span className="material-icons text-slate-400 text-base">bathtub</span>
                  <span className="text-[10px] font-semibold">{property.baths} Baños</span>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                <div className="flex flex-col items-center">
                  <span className="material-icons text-slate-400 text-base">square_foot</span>
                  <span className="text-[10px] font-semibold">{property.area} m²</span>
                </div>
              </div>
            </div>

            {/* Agent Contact */}
            <div className="flex items-center gap-3 pt-2">
              <img 
                alt={property.agent.name} 
                className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm" 
                src={property.agent.image} 
              />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Organizado por</p>
                <p className="text-nordic dark:text-white font-bold text-sm">{property.agent.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Appointment form */}
        <form onSubmit={handleSubmit} className="w-full md:w-7/12 p-6 md:p-8 lg:p-10 flex flex-col justify-between space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-nordic dark:text-white mb-2">Agendar una Cita</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Elige una fecha y hora para realizar un recorrido guiado por la propiedad.</p>

            {/* Calendar Widget */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-nordic dark:text-white uppercase tracking-wider">Junio 2026</h3>
                <div className="flex gap-1">
                  <button type="button" className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors">
                    <span className="material-icons text-lg">chevron_left</span>
                  </button>
                  <button type="button" className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-nordic dark:text-white transition-colors">
                    <span className="material-icons text-lg">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* Grid Calendar */}
              <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center mb-4">
                <div className="text-xs font-semibold text-slate-400 py-1">Lun</div>
                <div className="text-xs font-semibold text-slate-400 py-1">Mar</div>
                <div className="text-xs font-semibold text-slate-400 py-1">Mié</div>
                <div className="text-xs font-semibold text-slate-400 py-1">Jue</div>
                <div className="text-xs font-semibold text-slate-400 py-1">Vie</div>
                <div className="text-xs font-semibold text-slate-400 py-1">Sáb</div>
                <div className="text-xs font-semibold text-slate-400 py-1">Dom</div>

                {/* June 2026 starts on Monday June 1st */}
                {daysInMonth.map((item) => {
                  const isSelected = selectedDay === item.day;
                  return (
                    <button
                      key={item.day}
                      type="button"
                      disabled={!item.available}
                      onClick={() => setSelectedDay(item.day)}
                      className={`text-sm py-2 rounded-lg transition-colors font-medium relative ${
                        !item.available 
                          ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                          : isSelected
                            ? 'bg-mosque text-white font-bold shadow-md shadow-mosque/20 scale-105'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      {item.day}
                      {isSelected && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-nordic dark:text-white uppercase tracking-wider mb-3">Horas Disponibles</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {times.map((item, index) => {
                  const isSelected = selectedTime === item.time;
                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={!item.available}
                      onClick={() => setSelectedTime(item.time)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all border text-center ${
                        !item.available 
                          ? 'border-gray-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40 line-through'
                          : isSelected
                            ? 'bg-mosque/10 border-mosque text-mosque dark:bg-mosque/20 dark:text-primary-light font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-mosque hover:text-mosque'
                      }`}
                    >
                      {item.time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Details */}
            <div className="mb-6 space-y-4">
              <h3 className="text-sm font-bold text-nordic dark:text-white uppercase tracking-wider">Tus Datos de Contacto</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor="name">Nombre Completo *</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#112522] rounded-lg text-nordic dark:text-white focus:ring-1 focus:ring-mosque focus:border-mosque focus:bg-white"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor="phone">Número de Celular *</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#112522] rounded-lg text-nordic dark:text-white focus:ring-1 focus:ring-mosque focus:border-mosque focus:bg-white"
                    placeholder="Ej. 987654321"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor="email">Correo Electrónico *</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#112522] rounded-lg text-nordic dark:text-white focus:ring-1 focus:ring-mosque focus:border-mosque focus:bg-white"
                  placeholder="Ej. juan.perez@email.com"
                />
              </div>
            </div>

            {/* Message Box */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-nordic dark:text-white uppercase tracking-wider mb-2" htmlFor="message">
                Mensaje para el agente <span className="text-slate-400 font-normal normal-case ml-1">(Opcional)</span>
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#112522] text-nordic dark:text-slate-200 placeholder:text-slate-400 focus:ring-1 focus:ring-mosque focus:border-mosque focus:bg-white resize-none text-sm"
                placeholder="¿Tienes alguna pregunta específica sobre la propiedad?"
                rows="3"
              ></textarea>
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-4">
            <button 
              type="button" 
              onClick={() => navigate(`/propiedad/${property.id}`)}
              className="text-slate-500 dark:text-slate-400 hover:text-nordic dark:hover:text-white font-semibold px-4 py-2 text-sm transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="bg-mosque hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-mosque/20 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Confirmar Visita</span>
              <span className="material-icons text-sm">arrow_forward</span>
            </button>
          </div>
        </form>

      </div>
    </main>
  );
}
