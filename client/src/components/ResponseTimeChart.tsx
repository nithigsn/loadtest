import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TestResult } from '@/types';
import { TrendingUp } from 'lucide-react';

interface ResponseTimeChartProps {
  testResult: TestResult | null;
}

export const ResponseTimeChart = ({ testResult }: ResponseTimeChartProps) => {
  if (!testResult || testResult.responseTimeHistory.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Response Time Over Time
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No response time data available yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sample data points for better visualization
  const chartData = testResult.responseTimeHistory
    .filter((_, index) => index % 5 === 0) // Show every 5th point
    .slice(-50) // Show last 50 points
    .map((point, index) => ({
      time: index,
      responseTime: Math.round(point.responseTime),
      status: point.status
    }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Response Time Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value) => [`${value}ms`, 'Response Time']}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="responseTime" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};