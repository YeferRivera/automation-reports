import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Función para subir los archivos
export const uploadFiles = async (masterFile, invoiceFile) => {
  const formData = new FormData();
  formData.append('master_file', masterFile);
  formData.append('invoice_file', invoiceFile);
  
  try {
    const response = await axios.post(`${API_URL}/files/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || 'Error al subir archivos';
    throw new Error(message);
  }
};

// Verificar estado del procesamiento
export const checkStatus = async (processId) => {
  try {
    const response = await axios.get(`${API_URL}/files/status/${processId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al verificar estado del proceso');
  }
};

// Descargar reporte generado
export const downloadReport = async (processId) => {
  try {
    window.open(`${API_URL}/files/download/${processId}`);
    return true;
  } catch (error) {
    throw new Error('Error al descargar reporte');
  }
};

// Obtener datos para dashboard
export const getDashboardData = async (processId) => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/data/${processId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || 'Error al obtener datos del dashboard';
    throw new Error(message);
  }
};

// Liberar recursos del proceso
export const cleanupProcess = async (processId) => {
  try {
    const response = await axios.get(`${API_URL}/files/cleanup/${processId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al liberar recursos');
  }
};