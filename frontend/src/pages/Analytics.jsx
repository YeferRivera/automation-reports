import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';

function Analytics() {
  const { processId } = useParams();
  const [processExists, setProcessExists] = useState(true);

  useEffect(() => {
    // Verificar si el proceso existe en localStorage
    const savedProcesses = JSON.parse(localStorage.getItem('printer-reports-processes') || '[]');
    const processFound = savedProcesses.some(p => p.id === processId);
    setProcessExists(processFound);
  }, [processId]);

  if (!processExists) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard no disponible</h1>
        <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700 mb-6">
          <p>El reporte que intenta visualizar no está disponible o ya expiró.</p>
          <p className="mt-2">Por favor, procese nuevamente los archivos para generar un nuevo reporte.</p>
        </div>
        <div className="flex justify-center">
          <Link to="/process" className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700">
            Ir a procesar archivos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Analítico</h1>
      <p className="text-gray-600 mb-8">
        Visualización de los datos procesados. Vea tendencias, compare uso por unidades de negocio
        y analice el rendimiento de las impresoras.
      </p>
      
      <Dashboard />
    </div>
  );
}

export default Analytics;