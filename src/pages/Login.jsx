import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simula pequeño delay para UX
    await new Promise(res => setTimeout(res, 500));

    const result = await login(username, password);

    if (result.success) {
      setIsLoading(false);
      navigate('/admin');
    } else {
      setError(result.error || 'Error de autenticación');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-light dark:bg-background-dark relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/30 rounded-full blur-3xl dark:bg-mosque/10"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-mosque/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-nordic/5 rounded-full blur-3xl"></div>
      </div>

      <main className="w-full max-w-md z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-nordic dark:bg-mosque rounded-xl mb-6 shadow-soft text-white relative">
            <span className="material-icons text-2xl">admin_panel_settings</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-mosque dark:bg-accent rounded-full border-2 border-background-light dark:border-background-dark"></span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-nordic dark:text-white mb-2">
            Acceso <span className="text-mosque">Administrativo</span>
          </h1>
          <p className="text-nordic/60 dark:text-gray-400 text-sm">
            Ingresá tus credenciales para continuar.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 dark:bg-[#152e2a]/80 rounded-2xl shadow-soft p-8 sm:p-10 border border-white/60 dark:border-mosque/20 backdrop-blur-sm">
          
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl px-4 py-3 animate-shake">
                <span className="material-icons text-red-500 text-xl flex-shrink-0">error_outline</span>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-username" className="block text-sm font-semibold text-nordic/80 dark:text-gray-300">
                Usuario
              </label>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-icons text-nordic/30 dark:text-gray-500 text-xl transition-colors group-focus-within:text-mosque">
                  person
                </span>
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nombre de usuario"
                  required
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-nordic/10 dark:border-white/10 bg-white dark:bg-[#1a3833] text-nordic dark:text-white placeholder-nordic/30 dark:placeholder-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-mosque/40 focus:border-mosque dark:focus:border-mosque transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-sm font-semibold text-nordic/80 dark:text-gray-300">
                Contraseña
              </label>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-icons text-nordic/30 dark:text-gray-500 text-xl transition-colors group-focus-within:text-mosque">
                  lock
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-nordic/10 dark:border-white/10 bg-white dark:bg-[#1a3833] text-nordic dark:text-white placeholder-nordic/30 dark:placeholder-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-mosque/40 focus:border-mosque dark:focus:border-mosque transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-nordic/30 dark:text-gray-500 hover:text-mosque dark:hover:text-mosque transition-colors"
                  tabIndex="-1"
                >
                  <span className="material-icons text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="relative w-full flex items-center justify-center gap-2 bg-nordic hover:bg-nordic/90 dark:bg-mosque dark:hover:bg-mosque/90 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-2 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-mosque/20 dark:bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              {isLoading ? (
                <>
                  <span className="material-icons animate-spin text-xl relative z-10">refresh</span>
                  <span className="relative z-10">Verificando...</span>
                </>
              ) : (
                <>
                  <span className="material-icons text-xl relative z-10">login</span>
                  <span className="relative z-10">Ingresar al Panel</span>
                </>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-nordic/5 dark:border-white/5 flex items-center justify-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-sm text-nordic/50 dark:text-gray-500 hover:text-mosque dark:hover:text-mosque transition-colors font-medium"
            >
              <span className="material-icons text-base">arrow_back</span>
              Volver al sitio principal
            </button>
          </div>

        </div>

        {/* Footer links */}
        <div className="mt-8 text-center">
          <nav className="flex justify-center gap-6 text-xs text-nordic/40 dark:text-gray-600">
            <a className="hover:text-nordic dark:hover:text-gray-300 transition-colors" href="#">Política de privacidad</a>
            <a className="hover:text-nordic dark:hover:text-gray-300 transition-colors" href="#">Términos de uso</a>
          </nav>
        </div>

      </main>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
}
