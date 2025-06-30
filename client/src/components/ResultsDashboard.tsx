import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TestResult } from '@/types';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap,
  TrendingUp,
  AlertCircle,
  Users,
  Target
} from 'lucide-react';

interface ResultsDashboardProps {
  testResult: TestResult | null;
  isRunning: boolean;
}

export const ResultsDashboard = ({ testResult, isRunning }: ResultsDashboardProps) => {
  if (!testResult) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No test results yet. Start a load test to see results here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const successRate = testResult.totalRequests > 0 
    ? (testResult.successfulRequests / testResult.totalRequests) * 100 
    : 0;
  
  const errorRate = testResult.totalRequests > 0 
    ? (testResult.failedRequests / testResult.totalRequests) * 100 
    : 0;

  const completionRate = testResult.totalRequests > 0 
    ? (testResult.totalRequests / (testResult.concurrentUsers * testResult.requestsPerUser)) * 100
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity className="h-4 w-4 animate-pulse" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${getStatusColor(testResult.status)}`}>
                {getStatusIcon(testResult.status)}
              </div>
              Test Results
            </div>
            <Badge variant={testResult.status === 'running' ? 'default' : testResult.status === 'completed' ? 'secondary' : 'destructive'}>
              {testResult.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{testResult.concurrentUsers}</div>
              <div className="text-sm text-muted-foreground">Concurrent Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{testResult.requestsPerUser}</div>
              <div className="text-sm text-muted-foreground">Req/User</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{testResult.successfulRequests}</div>
              <div className="text-sm text-muted-foreground">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{testResult.failedRequests}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{testResult.totalRequests}</div>
              <div className="text-sm text-muted-foreground">Total Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{testResult.throughput.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Req/sec</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator for Running Tests */}
      {testResult.status === 'running' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Test Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Requests Completed</span>
                <span>{testResult.totalRequests} / {testResult.concurrentUsers * testResult.requestsPerUser}</span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {completionRate.toFixed(1)}% complete
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successRate.toFixed(1)}%</div>
            <Progress value={successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{errorRate.toFixed(1)}%</div>
            <Progress value={errorRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{testResult.averageResponseTime.toFixed(0)}ms</div>
            <div className="text-xs text-muted-foreground mt-1">
              {testResult.averageResponseTime < 500 ? 'Excellent' : 
               testResult.averageResponseTime < 1000 ? 'Good' : 
               testResult.averageResponseTime < 2000 ? 'Fair' : 'Poor'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{testResult.throughput.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground mt-1">requests/second</div>
          </CardContent>
        </Card>
      </div>

      {/* Load Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Load Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-lg font-semibold">{testResult.concurrentUsers}</div>
              <div className="text-sm text-muted-foreground">Concurrent Users</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-lg font-semibold">{testResult.requestsPerUser}</div>
              <div className="text-sm text-muted-foreground">Requests per User</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-lg font-semibold">{(testResult.totalRequests / testResult.concurrentUsers).toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Avg Req/User</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-lg font-semibold">{testResult.throughput.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Req/sec</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Codes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            HTTP Status Codes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(testResult.statusCodes).map(([code, count]) => (
              <div key={code} className="text-center p-3 bg-muted rounded-lg">
                <Badge 
                  variant={code.startsWith('2') ? 'default' : code.startsWith('4') ? 'secondary' : 'destructive'}
                  className="text-lg px-3 py-1 mb-2"
                >
                  {code}
                </Badge>
                <div className="text-sm text-muted-foreground">{count} requests</div>
                <div className="text-xs text-muted-foreground">
                  {((count / testResult.totalRequests) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};