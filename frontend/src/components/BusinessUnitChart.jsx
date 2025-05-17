import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function BusinessUnitChart({ data }) {
  // Ordenar los datos por cantidad de páginas (descendente)
  const sortedData = [...data].sort((a, b) => b.paginas - a.paginas);
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={sortedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="unidad_negocio" 
          angle={-45} 
          textAnchor="end" 
          height={80} 
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip 
          formatter={(value) => new Intl.NumberFormat('es-CO').format(value)}
        />
        <Legend />
        <Bar dataKey="paginas" name="Páginas" fill="#8884d8" />
        <Bar dataKey="total_facturado" name="Facturado" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BusinessUnitChart;