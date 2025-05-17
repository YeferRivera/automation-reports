import { useParams } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

function Analytics() {
  const { processId } = useParams();

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