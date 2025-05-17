import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Reportes de Impresoras
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-indigo-200">
            Inicio
          </Link>
          <Link to="/process" className="hover:text-indigo-200">
            Procesar Archivos
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;