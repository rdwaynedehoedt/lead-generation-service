import dotenv from 'dotenv';
import { jest, beforeEach } from '@jest/globals';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set essential test environment variables
process.env.NODE_ENV = 'test';
process.env.CONTACTOUT_API_KEY = 'test_api_key_123';
process.env.CONTACTOUT_BASE_URL = 'https://api.contactout.com';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.LOG_LEVEL = 'error';
process.env.PORT = '5001';
process.env.CORS_ORIGIN = 'http://localhost:3000';

// Create mock Redis instance
const mockRedisInstance = {
  get: jest.fn(() => Promise.resolve(null)),
  set: jest.fn(() => Promise.resolve('OK')),
  setex: jest.fn(() => Promise.resolve('OK')),
  del: jest.fn(() => Promise.resolve(1)),
  quit: jest.fn(() => Promise.resolve('OK')),
  on: jest.fn(),
  connect: jest.fn(() => Promise.resolve()),
  ping: jest.fn(() => Promise.resolve('PONG')),
};

// Mock Redis module
jest.mock('ioredis', () => jest.fn(() => mockRedisInstance));

// Create mock rate limiter
const mockRateLimiter = {
  consume: jest.fn(() => Promise.resolve()),
  get: jest.fn(() => Promise.resolve({ remainingPoints: 100 })),
};

// Mock rate limiter module  
jest.mock('rate-limiter-flexible', () => ({
  RateLimiterRedis: jest.fn(() => mockRateLimiter),
}));

// Mock winston logger
jest.mock('winston', () => ({
  createLogger: jest.fn(() => ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    http: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    clear: jest.fn(),
    log: jest.fn(),
  })),
  transports: {
    Console: jest.fn(() => ({})),
    File: jest.fn(() => ({})),
  },
  format: {
    combine: jest.fn(() => jest.fn()),
    timestamp: jest.fn(() => jest.fn()),
    colorize: jest.fn(() => jest.fn()),
    printf: jest.fn(() => jest.fn()),
    json: jest.fn(() => jest.fn()),
    simple: jest.fn(() => jest.fn()),
  },
  addColors: jest.fn(),
}));

// Mock morgan
jest.mock('morgan', () => {
  const mockMorgan = jest.fn(() => (_req: any, _res: any, next: any) => next());
  return Object.assign(mockMorgan, {
    compile: jest.fn(),
    token: jest.fn(),
  });
});

// Global test setup function
beforeEach(() => {
  jest.clearAllMocks();
});