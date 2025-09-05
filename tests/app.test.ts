import request from 'supertest';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock the entire ContactOut service module before importing app
const mockContactOutService = {
  testApiConnection: jest.fn(),
  getUsageStats: jest.fn(),
  searchProspects: jest.fn(),
  close: jest.fn(),
  healthCheck: jest.fn()
};

// Set up default mock return values  
(mockContactOutService.testApiConnection as any).mockResolvedValue({
  success: true,
  data: {
    status: 'connected',
    api_version: 'v1'
  }
});

(mockContactOutService.getUsageStats as any).mockResolvedValue({
  success: true,
  data: {
    current_period: {
      searches: 100,
      enrichments: 50,
      limit: 1000
    }
  }
});

(mockContactOutService.searchProspects as any).mockResolvedValue({
  success: true,
  data: {
    results: [
      {
        id: 'person-1',
        name: 'John Doe',
        job_title: 'Software Engineer',
        company: 'Test Company'
      }
    ],
    metadata: { total_results: 1, page: 1 }
  }
});

(mockContactOutService.close as any).mockResolvedValue(undefined);
(mockContactOutService.healthCheck as any).mockResolvedValue({
  status: 'healthy',
  details: { connection: 'ok' }
});

// Mock the module
jest.mock('../src/services/contactOutService', () => ({
  default: mockContactOutService,
  getContactOutService: () => mockContactOutService,
  ContactOutService: jest.fn(() => mockContactOutService)
}));

// Mock logger to prevent console output during tests
jest.mock('../src/utils/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    http: jest.fn(),
  },
  morganStream: {
    write: jest.fn(),
  }
}));

import app from '../src/app';

describe('Lead Generation Service App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Check Endpoint', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('service', 'lead-generation-service');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('contactout');
    });
  });

  describe('API Test Endpoint', () => {
    it('should test ContactOut API connection', async () => {
      const response = await request(app)
        .get('/test-api')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('test_result');
      expect(mockContactOutService.testApiConnection).toHaveBeenCalled();
    });
  });

  describe('Usage Stats Endpoint', () => {
    it('should return ContactOut usage statistics', async () => {
      const response = await request(app)
        .get('/usage-stats')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('stats');
      expect(mockContactOutService.getUsageStats).toHaveBeenCalledWith();
    });

    it('should accept period parameter', async () => {
      const response = await request(app)
        .get('/usage-stats?period=2024-01')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('stats');
      expect(mockContactOutService.getUsageStats).toHaveBeenCalledWith('2024-01');
    });
  });

  describe('Prospect Search Endpoint', () => {
    it('should search for prospects', async () => {
      const searchParams = {
        job_title: ['Software Engineer'],
        company_size: ['11-50'],
        location: ['San Francisco'],
        reveal_info: false
      };

      const response = await request(app)
        .post('/search-prospects')
        .set('x-organization-id', 'test-org')
        .send(searchParams)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('results');
      expect(mockContactOutService.searchProspects).toHaveBeenCalledWith(searchParams, 'test-org');
    });

    it('should handle organization ID from headers', async () => {
      const searchParams = {
        job_title: ['Product Manager'],
        reveal_info: false
      };

      const response = await request(app)
        .post('/search-prospects')
        .set('x-organization-id', 'test-org-123')
        .send(searchParams)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(mockContactOutService.searchProspects).toHaveBeenCalledWith(searchParams, 'test-org-123');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
    });

    it('should handle missing organization ID', async () => {
      const searchParams = {
        job_title: ['Engineer'],
        reveal_info: false
      };

      const response = await request(app)
        .post('/search-prospects')
        .send(searchParams)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Organization ID is required');
    });

    it('should handle empty search parameters', async () => {
      const response = await request(app)
        .post('/search-prospects')
        .set('x-organization-id', 'test-org')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Search parameters are required');
    });

    it('should handle invalid JSON gracefully', async () => {
      // Express should handle invalid JSON and return 400
      await request(app)
        .post('/search-prospects')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });
  });

  describe('CORS and Security Headers', () => {
    it('should have CORS headers', async () => {
      const response = await request(app)
        .options('/health');

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should have security headers', async () => {
      const response = await request(app)
        .get('/health');

      // Helmet security headers
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-content-type-options');
    });
  });

  describe('Service Integration', () => {
    it('should handle service errors gracefully', async () => {
      // Mock service to throw error  
      (mockContactOutService.testApiConnection as any).mockRejectedValueOnce(new Error('Service error'));

      const response = await request(app)
        .get('/test-api')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should handle search service errors', async () => {
      // Mock search to fail
      (mockContactOutService.searchProspects as any).mockRejectedValueOnce(new Error('Search failed'));

      const searchParams = {
        job_title: ['Engineer'],
        reveal_info: false
      };

      const response = await request(app)
        .post('/search-prospects')
        .set('x-organization-id', 'test-org')
        .send(searchParams)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });
});