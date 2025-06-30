import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Plus, X, Users, Target, Clock, Info } from 'lucide-react';
import { TestConfig, HttpMethod, Environment } from '@/types';

interface TestConfigurationProps {
  onStartTest: (config: TestConfig) => void;
  isRunning: boolean;
}

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

export const TestConfiguration = ({ onStartTest, isRunning }: TestConfigurationProps) => {
  const [config, setConfig] = useState<Partial<TestConfig>>({
    name: 'API Load Test',
    host: 'https://jsonplaceholder.typicode.com',
    path: '/posts',
    method: 'GET',
    protocol: 'https',
    headers: {},
    environment: 'development',
    concurrentUsers: 10,
    totalRequests: 100,
    duration: 30
  });

  const [newHeaderKey, setNewHeaderKey] = useState('');
  const [newHeaderValue, setNewHeaderValue] = useState('');
  const [requestsPerUser, setRequestsPerUser] = useState(10);

  // Calculate requests per user when total requests or concurrent users change
  useEffect(() => {
    if (config.totalRequests && config.concurrentUsers) {
      const calculated = Math.ceil(config.totalRequests / config.concurrentUsers);
      setRequestsPerUser(calculated);
    }
  }, [config.totalRequests, config.concurrentUsers]);

  const addHeader = () => {
    if (newHeaderKey && newHeaderValue) {
      setConfig(prev => ({
        ...prev,
        headers: { ...prev.headers, [newHeaderKey]: newHeaderValue }
      }));
      setNewHeaderKey('');
      setNewHeaderValue('');
    }
  };

  const removeHeader = (key: string) => {
    setConfig(prev => {
      const newHeaders = { ...prev.headers };
      delete newHeaders[key];
      return { ...prev, headers: newHeaders };
    });
  };

  const handleStartTest = () => {
    const fullConfig: TestConfig = {
      id: `config-${Date.now()}`,
      name: config.name || 'API Load Test',
      host: config.host || '',
      path: config.path || '',
      method: config.method || 'GET',
      protocol: config.protocol || 'https',
      headers: config.headers || {},
      body: config.body,
      environment: config.environment || 'development',
      concurrentUsers: config.concurrentUsers || 10,
      totalRequests: config.totalRequests || 100,
      duration: config.duration || 30,
      requestsPerUser: requestsPerUser,
      createdAt: new Date()
    };

    onStartTest(fullConfig);
  };

  const needsBody = config.method && ['POST', 'PUT', 'PATCH'].includes(config.method);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
            <Play className="h-4 w-4 text-white" />
          </div>
          Test Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="load">Load Settings</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test-name">Test Name</Label>
                <Input
                  id="test-name"
                  value={config.name}
                  onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter test name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="environment">Environment</Label>
                <Select value={config.environment} onValueChange={(value: Environment) => 
                  setConfig(prev => ({ ...prev, environment: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                value={config.host}
                onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
                placeholder="https://api.example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="path">Path</Label>
                <Input
                  id="path"
                  value={config.path}
                  onChange={(e) => setConfig(prev => ({ ...prev, path: e.target.value }))}
                  placeholder="/api/v1/users"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">HTTP Method</Label>
                <Select value={config.method} onValueChange={(value: HttpMethod) => 
                  setConfig(prev => ({ ...prev, method: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HTTP_METHODS.map(method => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                  <span>Protocol</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">HTTP</span>
                    <Switch
                      checked={config.protocol === 'https'}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({ ...prev, protocol: checked ? 'https' : 'http' }))
                      }
                    />
                    <span className="text-sm text-muted-foreground">HTTPS</span>
                  </div>
                </Label>
              </div>
            </div>

            {needsBody && (
              <div className="space-y-2">
                <Label htmlFor="body">Request Body</Label>
                <Textarea
                  id="body"
                  value={config.body || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, body: e.target.value }))}
                  placeholder='{"key": "value"}'
                  rows={4}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="load" className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Configure the load testing parameters. Total requests will be distributed across concurrent users.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="concurrent-users" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Concurrent Users
                  </Label>
                  <Input
                    id="concurrent-users"
                    type="number"
                    value={config.concurrentUsers}
                    onChange={(e) => setConfig(prev => ({ ...prev, concurrentUsers: parseInt(e.target.value) || 1 }))}
                    min="1"
                    max="10000"
                    placeholder="10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of simultaneous users making requests
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total-requests" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Total Requests
                  </Label>
                  <Input
                    id="total-requests"
                    type="number"
                    value={config.totalRequests}
                    onChange={(e) => setConfig(prev => ({ ...prev, totalRequests: parseInt(e.target.value) || 1 }))}
                    min="1"
                    max="1000000"
                    placeholder="100"
                  />
                  <p className="text-xs text-muted-foreground">
                    Total number of requests to send across all users
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Max Duration (seconds)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={config.duration}
                    onChange={(e) => setConfig(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                    min="1"
                    max="3600"
                    placeholder="30"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum test duration (test may complete earlier if all requests are sent)
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-3">Load Test Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Concurrent Users:</span>
                      <Badge variant="outline">{config.concurrentUsers || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Requests:</span>
                      <Badge variant="outline">{config.totalRequests || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Requests per User:</span>
                      <Badge variant="secondary">{requestsPerUser}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Duration:</span>
                      <Badge variant="outline">{config.duration || 0}s</Badge>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    Each of the {config.concurrentUsers || 0} users will send approximately {requestsPerUser} requests.
                    {requestsPerUser * (config.concurrentUsers || 0) !== (config.totalRequests || 0) && 
                      ` (Total: ${requestsPerUser * (config.concurrentUsers || 0)} requests)`
                    }
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="headers" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  placeholder="Header key (e.g., Authorization)"
                  value={newHeaderKey}
                  onChange={(e) => setNewHeaderKey(e.target.value)}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Header value (e.g., Bearer token123)"
                    value={newHeaderValue}
                    onChange={(e) => setNewHeaderValue(e.target.value)}
                  />
                  <Button onClick={addHeader} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {Object.entries(config.headers || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{key}</Badge>
                      <span className="text-sm font-mono">{value}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHeader(key)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {Object.keys(config.headers || {}).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No headers configured</p>
                    <p className="text-xs">Add headers like Authorization, Content-Type, etc.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Request Rate Control</Label>
                <p className="text-xs text-muted-foreground">
                  Requests will be distributed evenly across the test duration or sent as fast as possible.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Timeout Settings</Label>
                <p className="text-xs text-muted-foreground">
                  Default request timeout is 30 seconds. Failed requests will be retried once.
                </p>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Performance Note:</strong> High concurrent user counts (1000+) may impact browser performance. 
                Consider running tests with smaller batches for better stability.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        <Button 
          onClick={handleStartTest} 
          disabled={isRunning || !config.host || !config.path || !config.totalRequests || !config.concurrentUsers}
          className="w-full"
          size="lg"
        >
          {isRunning ? 'Test Running...' : `Start Load Test (${config.totalRequests || 0} requests, ${config.concurrentUsers || 0} users)`}
        </Button>
      </CardContent>
    </Card>
  );
};