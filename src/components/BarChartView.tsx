import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface ChartDatum {
  label: string;
  value: number;
}

interface BarChartViewProps {
  data: ChartDatum[];
  /** true のとき Y 軸を 0–1 に固定 */
  normalized?: boolean;
}

export const BarChartView: React.FC<BarChartViewProps> = ({
  data,
  normalized,
}) => (
  <div className="w-full h-[400px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12 }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis domain={normalized ? [0, 1] : ['auto', 'auto']} />
        <Tooltip />
        <Bar dataKey="value" fill="currentColor" className="text-blue-500" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

