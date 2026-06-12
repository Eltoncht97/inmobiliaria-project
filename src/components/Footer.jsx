import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#152e2a] border-t border-slate-200 dark:border-primary/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm text-nordic/50 dark:text-gray-400">
          © {new Date().getFullYear()} LuxeEstate Perú. Todos los derechos reservados.
        </div>
        <div className="flex gap-6">
          <a className="text-nordic/40 hover:text-mosque dark:text-gray-400 dark:hover:text-white transition-colors text-sm" href="#">
            Políticas de Privacidad
          </a>
          <a className="text-nordic/40 hover:text-mosque dark:text-gray-400 dark:hover:text-white transition-colors text-sm" href="#">
            Términos de Servicio
          </a>
          <a className="text-nordic/40 hover:text-mosque dark:text-gray-400 dark:hover:text-white transition-colors text-sm" href="#">
            Soporte
          </a>
        </div>
      </div>
    </footer>
  );
}
