import { useState, useCallback, useRef } from 'react';
import { TestConfig, TestResult, ResponseTimePoint } from '@/types';

export const useTestRunner = () => {
  const [activeTest, setActiveTest] = useState<TestResult | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const testControllerRef = useRef<{ stop: () => void } | null>(null);

  const startTest = useCallback(async (config: TestConfig) => {
    const testId = `test-${Date.now()}`;
    const newTest: TestResult = {
      id: testId,
      configId: config.id,
      startTime: new Date(),
      status: 'running',
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      throughput: 0,
      statusCodes: {},
      responseTimeHistory: [],
      errors: [],
      concurrentUsers: config.concurrentUsers,
      requestsPerUser: config.requestsPerUser || Math.ceil(config.totalRequests / config.concurrentUsers)
    };

    setActiveTest(newTest);
    setIsRunning(true);

    try {
      // Create test controller for stopping the test
      const controller = await simulateLoadTest(config, newTest, setActiveTest);
      testControllerRef.current = controller;
      
      // Wait for test completion
      await controller.promise;
      
      const completedTest = { ...newTest, status: 'completed' as const, endTime: new Date() };
      setActiveTest(completedTest);
      setTestHistory(prev => [completedTest, ...prev]);
    } catch (error) {
      const failedTest = { ...newTest, status: 'failed' as const, endTime: new Date() };
      setActiveTest(failedTest);
      setTestHistory(prev => [failedTest, ...prev]);
    } finally {
      setIsRunning(false);
      testControllerRef.current = null;
    }
  }, []);

  const stopTest = useCallback(() => {
    if (testControllerRef.current) {
      // Stop the running test
      testControllerRef.current.stop();
    }
    
    if (activeTest && isRunning) {
      const stoppedTest = { 
        ...activeTest, 
        status: 'completed' as const, 
        endTime: new Date(),
        errors: [...(activeTest.errors || []), 'Test stopped by user']
      };
      setActiveTest(stoppedTest);
      setTestHistory(prev => [stoppedTest, ...prev]);
    }
    
    setIsRunning(false);
    testControllerRef.current = null;
  }, [activeTest, isRunning]);

  return {
    activeTest,
    testHistory,
    isRunning,
    startTest,
    stopTest
  };
};

// Enhanced simulation with stop capability
async function simulateLoadTest(
  config: TestConfig,
  testResult: TestResult,
  updateTest: (test: TestResult) => void
): Promise<{ promise: Promise<void>; stop: () => void }> {
  const duration = config.duration * 1000; // Convert to milliseconds
  const updateInterval = 500; // Update every 500ms for smoother progress
  const totalRequests = config.totalRequests;
  
  const startTime = Date.now();
  let completedRequests = 0;
  let successfulRequests = 0;
  let failedRequests = 0;
  const statusCodes: Record<string, number> = {};
  const responseTimeHistory: ResponseTimePoint[] = [];
  
  // Calculate how many requests to process per update interval
  const requestsPerInterval = Math.max(1, Math.floor(totalRequests / (duration / updateInterval)));
  
  let isStopped = false;
  let updateIntervalId: NodeJS.Timeout;

  const promise = new Promise<void>((resolve, reject) => {
    updateIntervalId = setInterval(() => {
      if (isStopped) {
        clearInterval(updateIntervalId);
        resolve();
        return;
      }

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Calculate how many requests should be completed by now
      const targetRequests = Math.min(
        Math.floor(progress * totalRequests),
        totalRequests
      );
      
      // Process new requests
      const newRequests = Math.min(targetRequests - completedRequests, requestsPerInterval);
      
      for (let i = 0; i < newRequests; i++) {
        if (isStopped) break;
        
        // Simulate realistic response times with some variation
        const baseResponseTime = 200 + Math.random() * 800; // 200-1000ms base
        const networkJitter = (Math.random() - 0.5) * 200; // ±100ms jitter
        const responseTime = Math.max(50, baseResponseTime + networkJitter);
        
        // Simulate success/failure rates (95% success rate)
        const isSuccess = Math.random() > 0.05;
        let statusCode: number;
        
        if (isSuccess) {
          // Success status codes
          statusCode = Math.random() > 0.1 ? 200 : (Math.random() > 0.5 ? 201 : 204);
          successfulRequests++;
        } else {
          // Error status codes
          const errorType = Math.random();
          if (errorType > 0.7) statusCode = 404;
          else if (errorType > 0.4) statusCode = 500;
          else if (errorType > 0.2) statusCode = 400;
          else statusCode = 503;
          failedRequests++;
        }
        
        statusCodes[statusCode.toString()] = (statusCodes[statusCode.toString()] || 0) + 1;
        responseTimeHistory.push({
          timestamp: Date.now(),
          responseTime,
          status: statusCode
        });
        
        completedRequests++;
      }

      // Calculate metrics
      const averageResponseTime = responseTimeHistory.length > 0
        ? responseTimeHistory.reduce((sum, point) => sum + point.responseTime, 0) / responseTimeHistory.length
        : 0;
      
      const throughput = completedRequests / (elapsed / 1000);

      const updatedTest = {
        ...testResult,
        totalRequests: completedRequests,
        successfulRequests,
        failedRequests,
        averageResponseTime,
        throughput,
        statusCodes: { ...statusCodes },
        responseTimeHistory: [...responseTimeHistory]
      };

      updateTest(updatedTest);

      // Stop when all requests are completed or duration is reached
      if (completedRequests >= totalRequests || progress >= 1) {
        clearInterval(updateIntervalId);
        resolve();
      }
    }, updateInterval);
  });

  const stop = () => {
    isStopped = true;
    if (updateIntervalId) {
      clearInterval(updateIntervalId);
    }
  };

  return { promise, stop };
}