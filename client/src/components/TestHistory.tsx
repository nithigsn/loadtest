import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TestResult } from '@/types';
import { History, Download, Calendar, Clock } from 'lucide-react';

interface TestHistoryProps {
  testHistory: TestResult[];
}

export const TestHistory = ({ testHistory }: TestHistoryProps) => {
  const exportResults = (result: TestResult) => {
    const data = {
      id: result.id,
      startTime: result.startTime,
      endTime: result.endTime,
      status: result.status,
      totalRequests: result.totalRequests,
      successfulRequests: result.successfulRequests,
      failedRequests: result.failedRequests,
      averageResponseTime: result.averageResponseTime,
      throughput: result.throughput,
      statusCodes: result.statusCodes
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `load-test-${result.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (testHistory.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Test History
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No test history available yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Test History ({testHistory.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {testHistory.slice(0, 10).map((result) => (
            <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={result.status === 'completed' ? 'default' : result.status === 'failed' ? 'destructive' : 'secondary'}>
                    {result.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {result.totalRequests} requests
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {result.startTime.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {result.startTime.toLocaleTimeString()}
                  </div>
                  <div>
                    Success: {((result.successfulRequests / result.totalRequests) * 100).toFixed(1)}%
                  </div>
                  <div>
                    Avg: {result.averageResponseTime.toFixed(0)}ms
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportResults(result)}
                className="ml-4"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};