import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", pemasukan: 4000000, pengeluaran: 2400000 },
  { month: "Feb", pemasukan: 3000000, pengeluaran: 1398000 },
  { month: "Mar", pemasukan: 2000000, pengeluaran: 9800000 },
  { month: "Apr", pemasukan: 2780000, pengeluaran: 3908000 },
  { month: "Mei", pemasukan: 1890000, pengeluaran: 4800000 },
  { month: "Jun", pemasukan: 2390000, pengeluaran: 3800000 },
];

const ChartLine = () => {
  return (
    <div className="bg-gradient-card rounded-2xl shadow-card p-6 border border-border">
      <h3 className="text-xl font-bold text-foreground mb-6">
        Grafik Pemasukan & Pengeluaran
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.75rem",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="pemasukan"
            stroke="hsl(var(--success))"
            strokeWidth={3}
            name="Pemasukan"
          />
          <Line
            type="monotone"
            dataKey="pengeluaran"
            stroke="hsl(var(--destructive))"
            strokeWidth={3}
            name="Pengeluaran"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartLine;
