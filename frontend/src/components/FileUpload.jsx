import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadFiles, checkStatus, downloadReport } from '../api';

function FileUpload() {
  const [masterFile, setMasterFile] = useState(null);
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processId, setProcessId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!masterFile || !invoiceFile) {
      setError('Por favor seleccione ambos archivos');
      return;
    }
    
    setError('');
    setIsProcessing(true);
    setStatusMessage('Subiendo archivos...');
    
    try {
      // Subir archivos
      const uploadResponse = await uploadFiles(masterFile, invoiceFile);
      setProcessId(uploadResponse.process_id);
      setStatusMessage('Procesando archivos... Esto puede tomar unos minutos.');
      
      // Verificar estado cada 3 segundos
      const statusInterval = setInterval(async () => {
        const statusResponse = await checkStatus(uploadResponse.process_id);
        
        if (statusResponse.status === 'completed') {
          clearInterval(statusInterval);
          setStatusMessage('¡Procesamiento completado!');
          setIsProcessing(false);
        } else if (statusResponse.status === 'error') {
          clearInterval(statusInterval);
          setError(statusResponse.message);
          setIsProcessing(false);
        }
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Error al procesar los archivos');
      setIsProcessing(false);
    }
  };
  
  const handleDownload = async () => {
    if (processId) {
      await downloadReport(processId);
    }
  };
  
  const viewDashboard = () => {
    if (processId) {
      navigate(`/analytics/${processId}`);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Cargar Archivos</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Archivo Maestro (CSV)</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setMasterFile(e.target.files[0])}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={isProcessing}
          />
          <p className="text-sm text-gray-500 mt-1">Archivo MAESTRO_ENERO.CSV</p>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Archivo de Factura (Excel)</label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setInvoiceFile(e.target.files[0])}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={isProcessing}
          />
          <p className="text-sm text-gray-500 mt-1">Archivo factura_mes.xlsx</p>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:bg-indigo-300"
            disabled={isProcessing || !masterFile || !invoiceFile}
          >
            {isProcessing ? 'Procesando...' : 'Procesar Archivos'}
          </button>
        </div>
      </form>
      
      {statusMessage && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded">
          {statusMessage}
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {processId && !isProcessing && (
        <div className="mt-6 space-y-3">
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full"
          >
            Descargar Reporte
          </button>
          
          <button
            onClick={viewDashboard}
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 w-full"
          >
            Ver Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUpload;