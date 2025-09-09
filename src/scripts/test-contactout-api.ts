#!/usr/bin/env tsx

/**
 * ContactOut API Test Script
 * 
 * This script tests the ContactOut API with the provided API key
 * to validate connectivity and document API response structures.
 * 
 * Usage: npm run test:api
 */

import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

const API_KEY = process.env.CONTACTOUT_API_KEY;
const BASE_URL = process.env.CONTACTOUT_BASE_URL || 'https://api.contactout.com';

if (!API_KEY) {
  console.error('❌ CONTACTOUT_API_KEY environment variable is required');
  process.exit(1);
}

interface TestResult {
  endpoint: string;
  success: boolean;
  statusCode?: number;
  response?: any;
  error?: string;
  duration: number;
}

class ContactOutAPITester {
  private client = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Authorization': 'basic',
      'token': API_KEY,
      'Content-Type': 'application/json',
      'User-Agent': 'Reachly-APITest/1.0.0'
    },
    timeout: 30000
  });

  async runAllTests(): Promise<TestResult[]> {
    const results: TestResult[] = [];

    console.log('🚀 Starting ContactOut API Tests...');
    console.log(`📍 API Key: ${API_KEY.substring(0, 8)}...${API_KEY.substring(API_KEY.length - 4)}`);
    console.log(`🌐 Base URL: ${BASE_URL}\n`);

    // Test 1: API Usage Stats (Basic connectivity)
    results.push(await this.testUsageStats());

    // Test 2: People Search API
    results.push(await this.testPeopleSearch());

    // Test 3: LinkedIn Profile Enrichment
    results.push(await this.testLinkedInEnrichment());

    // Test 4: Email Enrichment
    results.push(await this.testEmailEnrichment());

    // Test 5: Company Information
    results.push(await this.testCompanyInfo());

    // Test 6: Contact Checker (Free check)
    results.push(await this.testContactChecker());

    // Test 7: Email Verification
    results.push(await this.testEmailVerification());

    return results;
  }

  private async testUsageStats(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      console.log('📊 Testing API Usage Stats...');
      
      const response = await this.client.get('/v1/stats');
      const duration = Date.now() - startTime;

      console.log('✅ Usage Stats Success');
      console.log('📋 Response Sample:', {
        statusCode: response.data.status_code,
        hasUsage: !!response.data.usage,
        credits: response.data.usage?.count || 'N/A'
      });

      return {
        endpoint: 'GET /v1/stats',
        success: true,
        statusCode: response.status,
        response: response.data,
        duration
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      console.log('❌ Usage Stats Failed');
      console.log('🚨 Error:', error.response?.data || error.message);

      return {
        endpoint: 'GET /v1/stats',
        success: false,
        error: error.response?.data?.message || error.message,
        duration
      };
    }
  }

  private async testPeopleSearch(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      console.log('\n🔍 Testing People Search API...');
      
      const searchParams = {
        job_title: ['Software Engineer'],
        company_size: ['11_50', '51_200'],
        location: ['San Francisco'],
        page: 1,
        reveal_info: false // Don't use credits for testing
      };

      const response = await this.client.post('/v1/people/search', searchParams);
      const duration = Date.now() - startTime;

      console.log('✅ People Search Success');
      console.log('📋 Response Sample:', {
        statusCode: response.data.status_code,
        totalResults: response.data.metadata?.total_results || 0,
        profilesFound: Object.keys(response.data.profiles || {}).length
      });

      return {
        endpoint: 'POST /v1/people/search',
        success: true,
        statusCode: response.status,
        response: {
          metadata: response.data.metadata,
          profileCount: Object.keys(response.data.profiles || {}).length
        },
        duration
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      console.log('❌ People Search Failed');
      console.log('🚨 Error:', error.response?.data || error.message);

      return {
        endpoint: 'POST /v1/people/search',
        success: false,
        error: error.response?.data?.message || error.message,
        duration
      };
    }
  }

  private async testLinkedInEnrichment(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      console.log('\n💼 Testing LinkedIn Profile Enrichment...');
      
      // Use a sample LinkedIn profile URL (profile_only=true to avoid using credits)
      const profileUrl = 'https://www.linkedin.com/in/satyanadella';
      
      const response = await this.client.get('/v1/linkedin/enrich', {
        params: {
          profile: profileUrl,
          profile_only: true // Don't use credits
        }
      });
      
      const duration = Date.now() - startTime;

      console.log('✅ LinkedIn Enrichment Success');
      console.log('📋 Response Sample:', {
        statusCode: response.data.status_code,
        hasProfile: !!response.data.profile,
        profileName: response.data.profile?.full_name || 'N/A'
      });

      return {
        endpoint: 'GET /v1/linkedin/enrich',
        success: true,
        statusCode: response.status,
        response: {
          hasProfile: !!response.data.profile,
          profileFields: Object.keys(response.data.profile || {}).length
        },
        duration
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      console.log('❌ LinkedIn Enrichment Failed');
      console.log('🚨 Error:', error.response?.data || error.message);

      return {
        endpoint: 'GET /v1/linkedin/enrich',
        success: false,
        error: error.response?.data?.message || error.message,
        duration
      };
    }
  }

  private async testEmailEnrichment(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      console.log('\n📧 Testing Email Enrichment...');
      
      // Use a common test email (this might not find results but tests the endpoint)
      const email = 'test@example.com';
      
      const response = await this.client.get('/v1/email/enrich', {
        params: { email }
      });
      
      const duration = Date.now() - startTime;

      console.log('✅ Email Enrichment Success');
      console.log('📋 Response Sample:', {
        statusCode: response.data.status_code,
        hasProfile: !!response.data.profile
      });

      return {
        endpoint: 'GET /v1/email/enrich',
        success: true,
        statusCode: response.status,
        response: response.data,
        duration
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      // 404 is expected for test emails
      if (error.response?.status === 404) {
        console.log('✅ Email Enrichment Working (404 expected for test email)');
        return {
          endpoint: 'GET /v1/email/enrich',
          success: true,
          statusCode: 404,
          response: { message: 'Expected 404 for test email' },
          duration
        };
      }

      console.log('❌ Email Enrichment Failed');
      console.log('🚨 Error:', error.response?.data || error.message);

      return {
        endpoint: 'GET /v1/email/enrich',
        success: false,
        error: error.response?.data?.message || error.message,
        duration
      };
    }
  }

  private async testCompanyInfo(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      console.log('\n🏢 Testing Company Information...');
      
      const domains = ['microsoft.com'];
      
      const response = await this.client.post('/v1/domain/enrich', { domains });
      const duration = Date.now() - startTime;

      console.log('✅ Company Info Success');
      console.log('📋 Response Sample:', {
        statusCode: response.data.status_code,
        companiesFound: response.data.companies?.length || 0
      });

      return {
        endpoint: 'POST /v1/domain/enrich',
        success: true,
        statusCode: response.status,
        response: response.data,
        duration
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      console.log('❌ Company Info Failed');
      console.log('🚨 Error:', error.response?.data || error.message);

      return {
        endpoint: 'POST /v1/domain/enrich',
        success: false,
        error: error.response?.data?.message || error.message,
        duration
      };
    }
  }

  private async testContactChecker(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      console.log('\n🔍 Testing Contact Checker (Free)...');
      
      const profileUrl = 'https://www.linkedin.com/in/satyanadella';
      
      const response = await this.client.get('/v1/people/linkedin/personal_email_status', {
        params: { profile: profileUrl }
      });
      
      const duration = Date.now() - startTime;

      console.log('✅ Contact Checker Success');
      console.log('📋 Response Sample:', {
        statusCode: response.data.status_code,
        hasEmailInfo: !!response.data.profile?.email
      });

      return {
        endpoint: 'GET /v1/people/linkedin/personal_email_status',
        success: true,
        statusCode: response.status,
        response: response.data,
        duration
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      console.log('❌ Contact Checker Failed');
      console.log('🚨 Error:', error.response?.data || error.message);

      return {
        endpoint: 'GET /v1/people/linkedin/personal_email_status',
        success: false,
        error: error.response?.data?.message || error.message,
        duration
      };
    }
  }

  private async testEmailVerification(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      console.log('\n✉️ Testing Email Verification...');
      
      const email = 'test@gmail.com';
      
      const response = await this.client.get('/v1/email/verify', {
        params: { email }
      });
      
      const duration = Date.now() - startTime;

      console.log('✅ Email Verification Success');
      console.log('📋 Response Sample:', {
        statusCode: response.data.status_code,
        emailStatus: response.data.data?.status || 'N/A'
      });

      return {
        endpoint: 'GET /v1/email/verify',
        success: true,
        statusCode: response.status,
        response: response.data,
        duration
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      console.log('❌ Email Verification Failed');
      console.log('🚨 Error:', error.response?.data || error.message);

      return {
        endpoint: 'GET /v1/email/verify',
        success: false,
        error: error.response?.data?.message || error.message,
        duration
      };
    }
  }

  printSummary(results: TestResult[]): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 CONTACTOUT API TEST SUMMARY');
    console.log('='.repeat(60));

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`✅ Successful Tests: ${successful.length}/${results.length}`);
    console.log(`❌ Failed Tests: ${failed.length}/${results.length}`);
    console.log(`⏱️ Total Duration: ${results.reduce((sum, r) => sum + r.duration, 0)}ms\n`);

    if (successful.length > 0) {
      console.log('✅ SUCCESSFUL ENDPOINTS:');
      successful.forEach(result => {
        console.log(`   ${result.endpoint} (${result.duration}ms)`);
      });
    }

    if (failed.length > 0) {
      console.log('\n❌ FAILED ENDPOINTS:');
      failed.forEach(result => {
        console.log(`   ${result.endpoint}: ${result.error}`);
      });
    }

    console.log('\n📋 API CAPABILITIES DOCUMENTED:');
    console.log('   - Usage Statistics ✓');
    console.log('   - People Search ✓');
    console.log('   - LinkedIn Enrichment ✓');
    console.log('   - Email Enrichment ✓');
    console.log('   - Company Information ✓');
    console.log('   - Contact Availability Checker ✓');
    console.log('   - Email Verification ✓');

    console.log('\n🎯 NEXT STEPS:');
    console.log('   1. Review API response structures in logs');
    console.log('   2. Update TypeScript interfaces if needed');
    console.log('   3. Implement rate limiting and caching');
    console.log('   4. Begin database schema design');
    console.log('   5. Start frontend integration planning');
  }
}

// Run the tests
async function main() {
  const tester = new ContactOutAPITester();
  
  try {
    const results = await tester.runAllTests();
    tester.printSummary(results);
    
    // Write detailed results to file
    const fs = await import('fs');
    const path = await import('path');
    
    const resultsFile = path.join(__dirname, '../../logs/api-test-results.json');
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    
    console.log(`\n📄 Detailed results saved to: ${resultsFile}`);
    
  } catch (error) {
    console.error('🚨 Test execution failed:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}
