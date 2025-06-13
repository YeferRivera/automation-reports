import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { downloadReport } from '../api';

function Home() {
  const [previousProcesses, setPreviousProcesses] = useState([]);

  useEffect(() => {
    // Cargar procesos anteriores del localStorage al iniciar
    const savedProcesses = localStorage.getItem('printer-reports-processes');
    if (savedProcesses) {
      setPreviousProcesses(JSON.parse(savedProcesses));
    }
  }, []);

  const handleDownload = async (processId) => {
    await downloadReport(processId);
  };

  // Función para formatear la fecha y hora
  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6">
        Sistema de Reportes de Impresoras
      </h1>
      
      <p className="text-xl text-gray-700 mb-8">
        Analice el uso de impresoras por unidad de negocio, ubique tendencias y genere informes detallados.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center hover:shadow-lg transition-shadow">
          <svg className="w-16 h-16 text-indigo-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Procesar Archivos</h2>
          <p className="text-gray-600 mb-4 text-center">
            Cargue los archivos MAESTRO.CSV y factura_mes.xlsx para generar sus reportes.
          </p>
          <Link to="/process" className="mt-auto bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700">
            Cargar Archivos
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center hover:shadow-lg transition-shadow">
          <svg className="w-16 h-16 text-indigo-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Visualizar Dashboards</h2>
          <p className="text-gray-600 mb-4 text-center">
            Vea análisis gráficos después de procesar sus archivos para tomar mejores decisiones.
          </p>
          
          {previousProcesses.length > 0 ? (
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-2">Reportes recientes</h3>
              <div className="space-y-3">
                {previousProcesses.map((process) => (
                  <div key={process.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col mb-2">
                      <span className="font-medium text-left">{process.masterFile}</span>
                      <span className="text-sm text-gray-500 text-left">
                        {formatDateTime(process.timestamp)}
                      </span>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleDownload(process.id)}
                        className="text-green-600 hover:text-green-800 flex items-center text-sm p-1"
                        title="Descargar reporte Excel"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Excel
                      </button>
                      <Link 
                        to={`/analytics/${process.id}`} 
                        className="text-purple-600 hover:text-purple-800 flex items-center text-sm p-1"
                        title="Ver dashboard analítico"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Dashboard
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-auto text-gray-500 italic">
              Primero debe procesar archivos
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;