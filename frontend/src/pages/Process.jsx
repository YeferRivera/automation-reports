import FileUpload from '../components/FileUpload';

function Process() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Procesar Archivos</h1>
      <p className="text-gray-600 mb-8">
        Cargue los archivos maestro (MAESTRO_ENERO.CSV) y de factura (factura_mes.xlsx) para generar su reporte.
        El sistema procesará los archivos y le permitirá descargar el resultado o visualizar los datos en un dashboard.
      </p>
      
      <FileUpload />
    </div>
  );
}

export default Process;