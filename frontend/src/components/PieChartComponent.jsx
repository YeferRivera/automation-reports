import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function PieChartComponent({ data }) {
  // Agregar por ciudad para simplificar
  const aggregatedData = data.reduce((acc, current) => {
    const existing = acc.find(item => item.ciudad === current.ciudad);
    if (existing) {
      existing.paginas += current.paginas;
    } else {
      acc.push({ ciudad: current.ciudad, paginas: current.paginas });
    }
    return acc;
  }, []);
  
  // Ordenar por cantidad de páginas
  const sortedData = aggregatedData.sort((a, b) => b.paginas - a.paginas);
  
  // Colores para el gráfico
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#6A0DAD'];
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={sortedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={130}
          fill="#8884d8"
          dataKey="paginas"
          nameKey="ciudad"
        >
          {sortedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => new Intl.NumberFormat('es-CO').format(value)} />
        <Legend layout="vertical" verticalAlign="middle" align="right" />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieChartComponent;