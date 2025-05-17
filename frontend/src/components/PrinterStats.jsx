function PrinterStats({ stats }) {
  const formatNumber = (num) => {
    return num.toLocaleString('es-CO');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">Total Páginas</h3>
        <p className="text-2xl font-bold text-indigo-600">{formatNumber(stats.total_paginas)}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">Total Facturado</h3>
        <p className="text-2xl font-bold text-green-600">{formatNumber(stats.total_facturado)}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">Impresoras</h3>
        <p className="text-2xl font-bold text-blue-600">{stats.total_impresoras}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">Usuarios</h3>
        <p className="text-2xl font-bold text-purple-600">{stats.total_usuarios}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">Unidades de Negocio</h3>
        <p className="text-2xl font-bold text-amber-600">{stats.total_unidades}</p>
      </div>
    </div>
  );
}

export default PrinterStats;