import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';

export default function Contact() {
  const { addCallback } = useProperties();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState('Mañana (9:00 AM - 12:00 PM)');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !phone) {
      alert('Por favor complete su nombre y número telefónico.');
      return;
    }

    addCallback({
      name,
      phone,
      preferredTime,
      message
    });

    setIsSuccess(true);
    // Reset Form
    setName('');
    setPhone('');
    setPreferredTime('Mañana (9:00 AM - 12:00 PM)');
    setMessage('');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-bold text-mosque uppercase tracking-wider bg-mosque/10 px-3 py-1 rounded-full">
            Servicio de Llamada Gratuito
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-nordic dark:text-white leading-tight">
            ¿Quieres que te <span className="font-semibold text-mosque">llamemos</span>?
          </h1>
          <p className="text-nordic-muted dark:text-gray-400 max-w-lg mx-auto text-sm md:text-base">
            Déjanos tus datos de contacto y un asesor especializado de LuxeEstate se comunicará contigo en el horario que prefieras.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white dark:bg-[#162e2a] rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Info bar on the side */}
          <div className="md:col-span-4 bg-nordic text-white p-8 space-y-8 flex flex-col justify-between relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            
            <div className="space-y-6 z-10">
              <h3 className="text-xl font-bold tracking-tight">Contacto Directo</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Si prefieres comunicarte con nosotros de inmediato, puedes usar nuestras líneas telefónicas o correo electrónico oficiales.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3 text-xs">
                  <span className="material-icons text-mosque">call</span>
                  <div>
                    <p className="font-bold">Llámanos</p>
                    <p className="text-white/75 mt-0.5">+51 1 444 8888</p>
                    <p className="text-white/75">+51 987 654 321</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 text-xs">
                  <span className="material-icons text-mosque">email</span>
                  <div>
                    <p className="font-bold">Correo Electrónico</p>
                    <p className="text-white/75 mt-0.5">contacto@luxeestate.pe</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <span className="material-icons text-mosque">place</span>
                  <div>
                    <p className="font-bold">Oficina Principal</p>
                    <p className="text-white/75 mt-0.5">Av. Larco 770, Miraflores</p>
                    <p className="text-white/75">Lima, Perú</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-white/50 border-t border-white/10 pt-4 z-10 font-medium">
              Horario de atención: <br />
              Lunes a Sábado de 9:00 AM a 6:00 PM.
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-8 p-8 sm:p-10">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-8">
                <div className="w-16 h-16 bg-hint-green dark:bg-mosque/20 text-mosque dark:text-primary-light rounded-full flex items-center justify-center shadow-sm">
                  <span className="material-icons text-3xl">check_circle</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-nordic dark:text-white">¡Solicitud Recibida!</h3>
                  <p className="text-sm text-nordic-muted dark:text-gray-400 max-w-sm mx-auto">
                    Hemos registrado tu solicitud de llamada. Un asesor inmobiliario se pondrá en contacto contigo pronto.
                  </p>
                </div>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2.5 bg-mosque hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-nordic dark:text-white mb-1">Completa el Formulario</h3>
                  <p className="text-xs text-gray-400">Todos los campos marcados con * son requeridos.</p>
                </div>

                <div className="space-y-4">
                  
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1" htmlFor="client-name">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="client-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-sm px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#112522] rounded-lg text-nordic dark:text-white focus:ring-1 focus:ring-mosque focus:border-mosque focus:bg-white"
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1" htmlFor="client-phone">
                      Número de Teléfono/Celular *
                    </label>
                    <input
                      type="tel"
                      id="client-phone"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-sm px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#112522] rounded-lg text-nordic dark:text-white focus:ring-1 focus:ring-mosque focus:border-mosque focus:bg-white"
                      placeholder="Ej. 987654321"
                    />
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1" htmlFor="call-time">
                      Horario de Preferencia para la Llamada
                    </label>
                    <select
                      id="call-time"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full text-sm px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#112522] rounded-lg text-nordic dark:text-white focus:ring-1 focus:ring-mosque focus:border-mosque focus:bg-white cursor-pointer"
                    >
                      <option value="Mañana (9:00 AM - 12:00 PM)">Mañana (9:00 AM - 12:00 PM)</option>
                      <option value="Mediodía (12:00 PM - 2:00 PM)">Mediodía (12:00 PM - 2:00 PM)</option>
                      <option value="Tarde (2:00 PM - 6:00 PM)">Tarde (2:00 PM - 6:00 PM)</option>
                      <option value="Cualquier Horario">Cualquier Horario (Dentro del horario de oficina)</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1" htmlFor="call-msg">
                      Mensaje o Propiedad de Interés <span className="text-gray-400 font-normal">(Opcional)</span>
                    </label>
                    <textarea
                      id="call-msg"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#112522] text-nordic dark:text-slate-200 placeholder:text-slate-400 focus:ring-1 focus:ring-mosque focus:border-mosque focus:bg-white resize-none text-sm"
                      placeholder="Ej. Estoy interesado en el Penthouse Vista Azure / Quisiera comprar un departamento en Miraflores..."
                      rows="3"
                    ></textarea>
                  </div>

                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-mosque hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-mosque/20 hover:shadow-xl transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-icons text-base">phone_in_talk</span>
                  <span>Solicitar Llamada</span>
                </button>

              </form>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
