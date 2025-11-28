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

interface ChartData {
  month: string;
  pemasukan: number;
  pengeluaran: number;
}

interface ChartLineProps {
  data: ChartData[];
}

const ChartLine = ({ data }: ChartLineProps) => {
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
