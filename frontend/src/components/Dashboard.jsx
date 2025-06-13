import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDashboardData } from '../api';
import PrinterStats from './PrinterStats';
import BusinessUnitChart from './BusinessUnitChart';
import PieChartComponent from './PieChartComponent';
import BarChartComponent from './BarChartComponent';

function Dashboard() {
  const { processId } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [processInfo, setProcessInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Obtener información del proceso del localStorage
    const savedProcesses = JSON.parse(localStorage.getItem('printer-reports-processes') || '[]');
    const currentProcess = savedProcesses.find(p => p.id === processId);
    setProcessInfo(currentProcess);
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData(processId);
        setDashboardData(data);
        setError('');
      } catch (err) {
        setError('Error al cargar datos del dashboard: ' + (err.message || ''));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [processId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
        No hay datos disponibles para mostrar.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {processInfo && (
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h3 className="font-semibold">Reporte generado:</h3>
              <p>{new Date(processInfo.timestamp).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">Archivos procesados:</h3>
              <p>Maestro: {processInfo.masterFile}</p>
              <p>Factura: {processInfo.invoiceFile}</p>
            </div>
          </div>
        </div>
      )}
      
      <PrinterStats stats={dashboardData.resumen_general} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Páginas por Unidad de Negocio</h3>
          <BusinessUnitChart data={dashboardData.totales_por_unidad} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Distribución por Ubicación</h3>
          <PieChartComponent data={dashboardData.distribucion_por_ubicacion} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Top 10 Impresoras</h3>
          <BarChartComponent 
            data={dashboardData.top_impresoras} 
            dataKey="paginas"
            nameKey="impresora"
            color="#8884d8"
          />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Top 10 Usuarios</h3>
          <BarChartComponent 
            data={dashboardData.top_usuarios} 
            dataKey="paginas"
            nameKey="usuario"
            color="#82ca9d"
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;