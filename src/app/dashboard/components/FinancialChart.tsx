"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

const data = [
  { month: "Jan", total: 45000 },
  { month: "Fev", total: 52000 },
  { month: "Mar", total: 48000 },
  { month: "Abr", total: 61000 },
  { month: "Mai", total: 55000 },
  { month: "Jun", total: 67000 },
];

export function FinancialChart() {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 'bold' }}
            dy={10}
          />
          <YAxis 
            hide 
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ 
              backgroundColor: '#0a0a0a', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              fontSize: '10px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}
            itemStyle={{ color: '#d97706' }}
            formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Faturamento']}
          />
          <Bar 
            dataKey="total" 
            radius={[6, 6, 0, 0]}
            barSize={32}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === data.length - 1 ? "#d97706" : "#374151"} 
                className="transition-all duration-500 hover:fill-brass-500"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
