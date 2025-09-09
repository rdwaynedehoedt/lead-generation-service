import express from 'express';
import axios from 'axios';
import logger from '../utils/logger';

const router = express.Router();

/**
 * Get company employees by company name (NO CREDITS USED)
 * GET /api/company-employees?company=Microsoft
 */
router.get('/', async (req, res) => {
  try {
    const company = req.query.company as string;
    
    if (!company) {
      return res.status(400).json({
        success: false,
        error: 'Company parameter is required',
        example: '/api/company-employees?company=Microsoft'
      });
    }

    logger.info('Company employees search', { company });

    // Call ContactOut Decision Makers API (FREE)
    const apiKey = process.env.CONTACTOUT_API_KEY;
    if (!apiKey) {
      throw new Error('CONTACTOUT_API_KEY not configured');
    }

    const baseUrl = process.env.CONTACTOUT_BASE_URL || 'https://api.contactout.com';
    
    const response = await axios.get(`${baseUrl}/v1/people/decision-makers`, {
      params: { name: company, reveal_info: false },
      headers: {
        'authorization': 'basic',
        'token': apiKey
      }
    });

    const result = response.data;
    const profiles = result.profiles || {};
    const totalResults = result.metadata?.total_results || 0;

    // Convert profiles to array
    const profilesArray = Object.entries(profiles).map(([url, profile]: [string, any]) => ({
      ...profile,
      linkedin_url: url
    }));

    logger.info('Company employees retrieved', {
      company,
      totalResults,
      profilesReturned: profilesArray.length,
      creditsUsed: 0
    });

    // Format response without quality verification for speed
    const formattedEmployees = profilesArray.map((profile) => {
      return {
        name: profile.full_name,
        job_title: profile.title,
        headline: profile.headline,
        linkedin_url: profile.linkedin_url,
        location: profile.location,
        company: profile.company,
        created_at: new Date().toISOString()
      };
    });

    // No quality statistics - just basic metrics
    const basicStats = {
      total_employees: formattedEmployees.length,
      with_titles: formattedEmployees.filter((e: any) => e.job_title).length,
      with_locations: formattedEmployees.filter((e: any) => e.location).length
    };

    const responseData = {
      success: true,
      data: {
        company_name: company,
        total_results: totalResults,
        employees_returned: formattedEmployees.length,
        profiles: formattedEmployees,
        statistics: basicStats,
        credits_used: 0,
        api_endpoint: 'ContactOut Decision Makers API (FREE)',
        timestamp: new Date().toISOString()
      }
    };

    return res.json(responseData);

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    
    logger.error('Company employees search failed', {
      company: req.query.company,
      error: error.response?.data || error.message,
      statusCode: error.response?.status
    });

    // Handle rate limiting
    if (errorMessage === 'Too Many Attempts.' || error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded. Decision Makers API allows limited requests per minute.',
        rate_limit_hit: true,
        retry_after: 60,
        tip: 'Try searching for a different company or wait a minute.',
        credits_used: 0
      });
    }

    return res.status(500).json({
      success: false,
      error: errorMessage || 'Company employees search failed',
      credits_used: 0
    });
  }
});

export default router;