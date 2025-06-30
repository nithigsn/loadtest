import { TestConfiguration } from '@/components/TestConfiguration';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { ResponseTimeChart } from '@/components/ResponseTimeChart';
import { StatusCodeChart } from '@/components/StatusCodeChart';
import { TestHistory } from '@/components/TestHistory';
import { useTestRunner } from '@/hooks/useTestRunner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, BarChart3, History, Settings, Zap, Square, AlertCircle } from 'lucide-react';

function App() {
  const { activeTest, testHistory, isRunning, startTest, stopTest } = useTestRunner();

  return (
    <div className="min-h-screen w-full  bg-background">

      <div className="flex flex-col max-w-[80vw]">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">LoadTest Pro</h1>
                  <p className="text-sm text-muted-foreground">Advanced API Load Testing Platform</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Test Status Indicator */}
                {isRunning && activeTest && (
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="animate-pulse">
                      <Activity className="h-3 w-3 mr-1" />
                      Running
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {activeTest.totalRequests} / {activeTest.concurrentUsers * activeTest.requestsPerUser} requests
                    </span>
                  </div>
                )}

                {/* Stop Button */}
                {isRunning && (
                  <Button
                    variant="destructive"
                    onClick={stopTest}
                    className="flex items-center gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Stop Test
                  </Button>
                )}

                {/* Test Completed Indicator */}
                {!isRunning && activeTest && activeTest.status === 'completed' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Test Completed
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="config" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuration
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Results
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Charts
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="mt-6">
              <TestConfiguration onStartTest={startTest} isRunning={isRunning} />
            </TabsContent>

            <TabsContent value="results" className="mt-6">
              <ResultsDashboard testResult={activeTest} isRunning={isRunning} />
            </TabsContent>

            <TabsContent value="charts" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponseTimeChart testResult={activeTest} />
                <StatusCodeChart testResult={activeTest} />
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <TestHistory testHistory={testHistory} />
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>LoadTest Pro - Professional API Load Testing</div>
              <div className="flex items-center gap-4">
                <span>Built with React + TypeScript</span>
                <span>•</span>
                <span>Powered by Vite</span>
              </div>
            </div>
          </div>
        </footer>



      </div>
    </div>
  );
}

export default App;