import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#484871', '#00ffff', '#1ecf1e'];

const Chart = ({ tasks }: { tasks: any[] }) => {
  const data = [
    { name: 'All', value: tasks.filter(t => t.status === 'todo').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'inProgress').length },
    { name: 'Done', value: tasks.filter(t => t.status === 'done').length },
  ];

  return (
    <ResponsiveContainer width="100%" height={320}>
        <PieChart>
            <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius="80%" fill="#8884d8" dataKey="value" label>
                {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Legend />
        </PieChart>
    </ResponsiveContainer>
  );
};

export default Chart;