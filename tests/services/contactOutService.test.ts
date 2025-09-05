import { jest, describe, it, expect, beforeAll, beforeEach, afterEach } from '@jest/globals';

// Mock all external dependencies BEFORE importing the service
jest.mock('axios');
jest.mock('ioredis');
jest.mock('rate-limiter-flexible');
jest.mock('../../src/utils/logger');

import { ContactOutService } from '../../src/services/contactOutService';
import axios from 'axios';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ContactOutService', () => {
  let contactOutService: ContactOutService;
  let mockAxiosInstance: any;

  beforeAll(() => {
    // Set up test environment variables
    process.env.CONTACTOUT_API_KEY = 'RrND5lE0qPjfjJd8r5tCWALs';
    process.env.CONTACTOUT_BASE_URL = 'https://api.contactout.com';
    process.env.REDIS_URL = 'redis://localhost:6379';
  });

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create comprehensive mock axios instance
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      },
      defaults: {
        headers: {}
      }
    };

    // Set default mock return values
    mockAxiosInstance.get.mockResolvedValue({ data: { success: true }, status: 200 });
    mockAxiosInstance.post.mockResolvedValue({ data: { success: true }, status: 200 });
    mockAxiosInstance.put.mockResolvedValue({ data: { success: true }, status: 200 });
    mockAxiosInstance.delete.mockResolvedValue({ data: { success: true }, status: 200 });

    // Mock axios.create to return our mock instance
    (mockedAxios.create as any) = jest.fn().mockReturnValue(mockAxiosInstance);

    // Create service instance
    contactOutService = new ContactOutService();
  });

  afterEach(async () => {
    // Clean up service
    try {
      if (contactOutService && typeof contactOutService.close === 'function') {
        await contactOutService.close();
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('Constructor', () => {
    it('should initialize with API key', () => {
      expect(contactOutService).toBeDefined();
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://api.contactout.com',
          headers: expect.objectContaining({
            'token': 'RrND5lE0qPjfjJd8r5tCWALs'
          })
        })
      );
    });

    it('should set up interceptors', () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('searchProspects', () => {
    it('should search for prospects successfully', async () => {
      const mockResponse = {
        data: {
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
            metadata: {
              total_results: 1,
              page: 1
            }
          }
        },
        status: 200
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const searchParams = {
        job_title: 'Software Engineer',
        company: 'Test Company',
        reveal_info: false
      };

      const result = await contactOutService.searchProspects(searchParams, 'test-org');

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/v1/people/search', searchParams);
    });

    it('should handle errors gracefully', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { error: 'Invalid parameters' }
        }
      };

      mockAxiosInstance.post.mockRejectedValue(errorResponse);

      const searchParams = {
        job_title: '',
        reveal_info: false
      };

      // The service catches errors and re-throws them, so it should still throw
      await expect(contactOutService.searchProspects(searchParams, 'test-org'))
        .rejects.toThrow();
    });
  });

  describe('testApiConnection', () => {
    it('should test connection successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { status: 'connected' }
        },
        status: 200
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await contactOutService.testApiConnection();

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('apiKeyValid', true);
      expect(result).toHaveProperty('endpoints');
      expect(result).toHaveProperty('message', 'API connection successful');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/stats');
    });

    it('should handle authentication errors', async () => {
      const authError = {
        response: {
          status: 401,
          data: { error: 'Authentication failed' }
        }
      };

      mockAxiosInstance.get.mockRejectedValue(authError);

      const result = await contactOutService.testApiConnection();
      
      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('apiKeyValid', false);
      expect(result).toHaveProperty('message');
    });
  });

  describe('getUsageStats', () => {
    it('should get usage stats', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            current_period: {
              searches: 100,
              limit: 1000
            }
          }
        },
        status: 200
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await contactOutService.getUsageStats();

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/stats', { params: {} });
    });

    it('should get usage stats for specific period', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { period: '2024-01', searches: 500 }
        },
        status: 200
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await contactOutService.getUsageStats('2024-01');

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/stats', {
        params: { period: '2024-01' }
      });
    });
  });

  describe('enrichByEmail', () => {
    it('should enrich contact by email', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            name: 'John Doe',
            emails: ['john@example.com']
          }
        },
        status: 200
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await contactOutService.enrichByEmail('john@example.com', 'test-org');

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/email/enrich', { 
        params: { email: 'john@example.com' } 
      });
    });
  });

  describe('verifyEmail', () => {
    it('should verify email', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            email: 'john@example.com',
            status: 'valid'
          }
        },
        status: 200
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await contactOutService.verifyEmail('john@example.com', 'test-org');

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/email/verify', {
        params: { email: 'john@example.com' }
      });
    });
  });

  describe('Service Lifecycle', () => {
    it('should close connections', async () => {
      // This should not throw since everything is mocked
      await expect(contactOutService.close()).resolves.not.toThrow();
    });
  });
});