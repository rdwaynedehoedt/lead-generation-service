import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import {
  ContactOutSearchParams,
  ContactOutSearchResponse,
  ContactOutEnrichResponse,
  ContactOutCompanyResponse,
  EmailVerificationResponse,
  ContactCheckerResponse,
  ContactOutUsageStats,
  ContactOutEndpoint,
  RateLimitConfig
} from '../types/contactout.types';
import { logger } from '../utils/logger';

export class ContactOutService {
  private apiKey: string;
  private baseUrl: string;
  private client: AxiosInstance;
  private redis: Redis;
  private rateLimiters: Map<string, RateLimiterRedis>;
  private rateLimitConfig: RateLimitConfig;

  constructor() {
    this.apiKey = process.env.CONTACTOUT_API_KEY || 'RrND5lE0qPjfjJd8r5tCWALs';
    this.baseUrl = process.env.CONTACTOUT_BASE_URL || 'https://api.contactout.com';
    
    if (!this.apiKey) {
      throw new Error('CONTACTOUT_API_KEY environment variable is required');
    }

    // Initialize Redis
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    
    // Rate limiting configuration
    this.rateLimitConfig = {
      people_search: parseInt(process.env.CONTACTOUT_RATE_LIMIT_SEARCH || '60'),
      contact_checker: parseInt(process.env.CONTACTOUT_RATE_LIMIT_CONTACT_CHECKER || '150'),
      other: parseInt(process.env.CONTACTOUT_RATE_LIMIT_OTHER || '1000')
    };

    // Initialize rate limiters
    this.rateLimiters = new Map();
    this.setupRateLimiters();

    // Initialize axios client
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': 'basic',
        'token': this.apiKey,
        'Content-Type': 'application/json',
        'User-Agent': 'Reachly-LeadGen/1.0.0'
      },
      timeout: 30000 // 30 second timeout
    });

    // Setup response interceptors
    this.setupInterceptors();

    logger.info('ContactOut service initialized', {
      baseUrl: this.baseUrl,
      rateLimits: this.rateLimitConfig
    });
  }

  private setupRateLimiters(): void {
    // People Search rate limiter (60 requests per minute)
    this.rateLimiters.set('people_search', new RateLimiterRedis({
      storeClient: this.redis,
      keyPrefix: 'contactout_rate_limit_search',
      points: this.rateLimitConfig.people_search,
      duration: 60, // Per 60 seconds
    }));

    // Contact Checker rate limiter (150 requests per minute)
    this.rateLimiters.set('contact_checker', new RateLimiterRedis({
      storeClient: this.redis,
      keyPrefix: 'contactout_rate_limit_checker',
      points: this.rateLimitConfig.contact_checker,
      duration: 60,
    }));

    // Other APIs rate limiter (1000 requests per minute)
    this.rateLimiters.set('other', new RateLimiterRedis({
      storeClient: this.redis,
      keyPrefix: 'contactout_rate_limit_other',
      points: this.rateLimitConfig.other,
      duration: 60,
    }));
  }

  private setupInterceptors(): void {
    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('ContactOut API request', {
          method: config.method,
          url: config.url,
          params: config.params
        });
        return config;
      },
      (error) => {
        logger.error('ContactOut API request error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        logger.debug('ContactOut API response', {
          status: response.status,
          url: response.config.url,
          dataSize: JSON.stringify(response.data).length
        });
        return response;
      },
      (error) => {
        logger.error('ContactOut API response error', {
          status: error.response?.status,
          message: error.response?.data?.message,
          url: error.config?.url
        });
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  private handleApiError(error: any): Error {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      
      switch (status) {
        case 400:
          return new Error(`Bad request: ${message}`);
        case 401:
          return new Error(`Authentication failed: Invalid API key`);
        case 403:
          return new Error(`Access forbidden: ${message}`);
        case 429:
          const retryAfter = error.response.headers['retry-after'];
          return new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
        default:
          return new Error(`API error (${status}): ${message}`);
      }
    }
    
    return new Error(`Network error: ${error.message}`);
  }

  private async checkRateLimit(endpoint: ContactOutEndpoint, organizationId: string): Promise<void> {
    let rateLimiterKey: string;
    
    if (endpoint === 'people/search') {
      rateLimiterKey = 'people_search';
    } else if (endpoint.includes('status')) {
      rateLimiterKey = 'contact_checker';
    } else {
      rateLimiterKey = 'other';
    }

    const rateLimiter = this.rateLimiters.get(rateLimiterKey);
    if (rateLimiter) {
      try {
        await rateLimiter.consume(organizationId);
      } catch (rateLimitError) {
        throw new Error(`Rate limit exceeded for ${endpoint}. Try again later.`);
      }
    }
  }

  private async getCachedResult<T>(cacheKey: string): Promise<T | null> {
    try {
      const cached = await this.redis.get(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      logger.warn('Cache read error', { cacheKey, error });
      return null;
    }
  }

  private async setCachedResult<T>(cacheKey: string, data: T, ttl: number): Promise<void> {
    try {
      await this.redis.setex(cacheKey, ttl, JSON.stringify(data));
    } catch (error) {
      logger.warn('Cache write error', { cacheKey, error });
    }
  }

  /**
   * Test the ContactOut API connectivity and permissions
   */
  async testApiConnection(): Promise<{
    success: boolean;
    message: string;
    apiKeyValid: boolean;
    endpoints: Record<string, boolean>;
  }> {
    const results = {
      success: false,
      message: '',
      apiKeyValid: false,
      endpoints: {} as Record<string, boolean>
    };

    try {
      // Test basic API access with usage stats
      const statsResponse = await this.client.get('/v1/stats');
      results.apiKeyValid = statsResponse.status === 200;
      results.endpoints['stats'] = true;

      // Test people search endpoint
      try {
        await this.client.post('/v1/people/search', {
          job_title: ['Software Engineer'],
          page: 1
        });
        results.endpoints['people_search'] = true;
      } catch (error) {
        results.endpoints['people_search'] = false;
        logger.warn('People search endpoint test failed', error);
      }

      // Test company enrichment
      try {
        await this.client.post('/v1/domain/enrich', {
          domains: ['example.com']
        });
        results.endpoints['domain_enrich'] = true;
      } catch (error) {
        results.endpoints['domain_enrich'] = false;
        logger.warn('Domain enrich endpoint test failed', error);
      }

      results.success = results.apiKeyValid;
      results.message = results.success ? 'API connection successful' : 'API connection failed';

    } catch (error) {
      results.message = `API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      logger.error('ContactOut API test failed', error);
    }

    return results;
  }

  /**
   * Search for prospects using ContactOut People Search API
   */
  async searchProspects(
    params: ContactOutSearchParams,
    organizationId: string
  ): Promise<ContactOutSearchResponse> {
    await this.checkRateLimit('people/search', organizationId);

    const cacheKey = `search:${JSON.stringify(params)}`;
    const cached = await this.getCachedResult<ContactOutSearchResponse>(cacheKey);
    
    if (cached) {
      logger.info('Returning cached search results', { cacheKey });
      return cached;
    }

    try {
      const response = await this.client.post('/v1/people/search', params);
      const result = response.data as ContactOutSearchResponse;

      // Cache results for 1 hour
      await this.setCachedResult(cacheKey, result, 3600);

      logger.info('Prospect search completed', {
        organizationId,
        totalResults: result.metadata?.total_results || 0,
        page: result.metadata?.page || 1
      });

      return result;
    } catch (error) {
      logger.error('Prospect search failed', { organizationId, params, error });
      throw error;
    }
  }

  /**
   * Enrich a LinkedIn profile
   */
  async enrichLinkedInProfile(
    profileUrl: string,
    organizationId: string,
    profileOnly = false
  ): Promise<ContactOutEnrichResponse> {
    await this.checkRateLimit('linkedin/enrich', organizationId);

    const cacheKey = `linkedin:${profileUrl}:${profileOnly}`;
    const cached = await this.getCachedResult<ContactOutEnrichResponse>(cacheKey);
    
    if (cached) {
      logger.info('Returning cached LinkedIn profile', { profileUrl });
      return cached;
    }

    try {
      const response = await this.client.get('/v1/linkedin/enrich', {
        params: {
          profile: profileUrl,
          profile_only: profileOnly
        }
      });

      const result = response.data as ContactOutEnrichResponse;

      // Cache for 24 hours
      await this.setCachedResult(cacheKey, result, 86400);

      logger.info('LinkedIn profile enriched', { organizationId, profileUrl });

      return result;
    } catch (error) {
      logger.error('LinkedIn enrichment failed', { organizationId, profileUrl, error });
      throw error;
    }
  }

  /**
   * Enrich profile by email
   */
  async enrichByEmail(
    email: string,
    organizationId: string,
    includeWorkEmail = false
  ): Promise<ContactOutEnrichResponse> {
    await this.checkRateLimit('email/enrich', organizationId);

    const cacheKey = `email:${email}:${includeWorkEmail}`;
    const cached = await this.getCachedResult<ContactOutEnrichResponse>(cacheKey);
    
    if (cached) {
      logger.info('Returning cached email profile', { email });
      return cached;
    }

    try {
      const params: any = { email };
      if (includeWorkEmail) {
        params.include = 'work_email';
      }

      const response = await this.client.get('/v1/email/enrich', { params });
      const result = response.data as ContactOutEnrichResponse;

      // Cache for 12 hours
      await this.setCachedResult(cacheKey, result, 43200);

      logger.info('Email profile enriched', { organizationId, email });

      return result;
    } catch (error) {
      logger.error('Email enrichment failed', { organizationId, email, error });
      throw error;
    }
  }

  /**
   * Get company information by domain
   */
  async getCompanyInfo(
    domains: string[],
    organizationId: string
  ): Promise<ContactOutCompanyResponse> {
    await this.checkRateLimit('domain/enrich', organizationId);

    const cacheKey = `company:${domains.join(',')}`;
    const cached = await this.getCachedResult<ContactOutCompanyResponse>(cacheKey);
    
    if (cached) {
      logger.info('Returning cached company info', { domains });
      return cached;
    }

    try {
      const response = await this.client.post('/v1/domain/enrich', { domains });
      const result = response.data as ContactOutCompanyResponse;

      // Cache company data for 7 days (it changes infrequently)
      await this.setCachedResult(cacheKey, result, 604800);

      logger.info('Company info retrieved', { organizationId, domains });

      return result;
    } catch (error) {
      logger.error('Company info retrieval failed', { organizationId, domains, error });
      throw error;
    }
  }

  /**
   * Verify email address
   */
  async verifyEmail(
    email: string,
    organizationId: string
  ): Promise<EmailVerificationResponse> {
    await this.checkRateLimit('email/verify', organizationId);

    const cacheKey = `verify:${email}`;
    const cached = await this.getCachedResult<EmailVerificationResponse>(cacheKey);
    
    if (cached) {
      logger.info('Returning cached email verification', { email });
      return cached;
    }

    try {
      const response = await this.client.get('/v1/email/verify', {
        params: { email }
      });

      const result = response.data as EmailVerificationResponse;

      // Cache verification results for 30 days
      await this.setCachedResult(cacheKey, result, 2592000);

      logger.info('Email verified', { organizationId, email, status: result.data.status });

      return result;
    } catch (error) {
      logger.error('Email verification failed', { organizationId, email, error });
      throw error;
    }
  }

  /**
   * Check contact availability (free check)
   */
  async checkContactAvailability(
    profileUrl: string,
    type: 'personal_email' | 'work_email' | 'phone' = 'personal_email'
  ): Promise<ContactCheckerResponse> {
    const endpoint = `people/linkedin/${type}_status` as ContactOutEndpoint;
    
    try {
      const response = await this.client.get(`/v1/${endpoint}`, {
        params: { profile: profileUrl }
      });

      return response.data as ContactCheckerResponse;
    } catch (error) {
      logger.error('Contact availability check failed', { profileUrl, type, error });
      throw error;
    }
  }

  /**
   * Get API usage statistics
   */
  async getUsageStats(period?: string): Promise<ContactOutUsageStats> {
    try {
      const params = period ? { period } : {};
      const response = await this.client.get('/v1/stats', { params });
      
      return response.data as ContactOutUsageStats;
    } catch (error) {
      logger.error('Usage stats retrieval failed', { period, error });
      throw error;
    }
  }

  /**
   * Health check for the service
   */
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: any }> {
    try {
      const stats = await this.getUsageStats();
      return {
        status: 'healthy',
        details: {
          apiConnected: true,
          remainingCredits: stats.usage.remaining || stats.usage.quota,
          rateLimitsActive: true
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          apiConnected: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  /**
   * Close connections
   */
  async close(): Promise<void> {
    await this.redis.quit();
    logger.info('ContactOut service connections closed');
  }
}

// Export a singleton instance (only in non-test environments)
let contactOutServiceInstance: ContactOutService;

export function getContactOutService(): ContactOutService {
  if (!contactOutServiceInstance) {
    contactOutServiceInstance = new ContactOutService();
  }
  return contactOutServiceInstance;
}

// Create a mock service for testing
const mockService = process.env.NODE_ENV === 'test' ? {
  testApiConnection: async () => ({ success: true, data: { status: 'connected' } }),
  getUsageStats: async () => ({ success: true, data: { searches: 0 } }),
  searchProspects: async () => ({ success: true, data: { results: [] } }),
  enrichByEmail: async () => ({ success: true, data: {} }),
  verifyEmail: async () => ({ success: true, data: { status: 'valid' } }),
  healthCheck: async () => ({ status: 'healthy' as const, details: {} }),
  close: async () => {},
} as unknown as ContactOutService : null;

export default process.env.NODE_ENV === 'test' 
  ? mockService!
  : getContactOutService();
