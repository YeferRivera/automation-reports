import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function BarChartComponent({ data, dataKey, nameKey, color }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={nameKey} 
          angle={-45} 
          textAnchor="end" 
          height={80} 
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip 
          formatter={(value) => new Intl.NumberFormat('es-CO').format(value)}
        />
        <Bar dataKey={dataKey} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartComponent;