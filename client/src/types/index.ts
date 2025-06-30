export interface TestConfig {
  id: string;
  name: string;
  host: string;
  path: string;
  method: HttpMethod;
  protocol: 'http' | 'https';
  headers: Record<string, string>;
  body?: string;
  environment: Environment;
  concurrentUsers: number;
  totalRequests: number;
  duration: number;
  requestsPerUser?: number;
  createdAt: Date;
}

export interface TestResult {
  id: string;
  configId: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed';
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  throughput: number;
  statusCodes: Record<string, number>;
  responseTimeHistory: ResponseTimePoint[];
  errors: string[];
  concurrentUsers: number;
  requestsPerUser: number;
}

export interface ResponseTimePoint {
  timestamp: number;
  responseTime: number;
  status: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export type Environment = 'local' | 'development' | 'production';

export interface LoadTestStats {
  successRate: number;
  errorRate: number;
  failureRate: number;
  averageResponseTime: number;
  throughput: number;
  totalRequests: number;
  statusCodeBreakdown: Record<string, number>;
}