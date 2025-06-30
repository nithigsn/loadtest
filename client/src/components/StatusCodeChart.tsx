import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TestResult } from '@/types';
import { BarChart3 } from 'lucide-react';

interface StatusCodeChartProps {
  testResult: TestResult | null;
}

const STATUS_COLORS = {
  '200': '#10B981',
  '201': '#059669',
  '204': '#047857',
  '400': '#F59E0B',
  '401': '#EF4444',
  '403': '#DC2626',
  '404': '#B91C1C',
  '500': '#7C2D12',
  '502': '#991B1B',
  '503': '#7F1D1D',
};

export const StatusCodeChart = ({ testResult }: StatusCodeChartProps) => {
  if (!testResult || Object.keys(testResult.statusCodes).length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Status Code Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No status code data available yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = Object.entries(testResult.statusCodes).map(([code, count]) => ({
    name: `${code}`,
    value: count,
    color: STATUS_COLORS[code as keyof typeof STATUS_COLORS] || '#6B7280'
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Status Code Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, `Status ${name}`]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};