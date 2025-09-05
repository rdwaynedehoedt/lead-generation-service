import express from 'express';
import { logger } from '../utils/logger';
import contactOutService from '../services/contactOutService';

const router = express.Router();

/**
 * POST /api/search/prospects
 * Search for prospects using ContactOut API
 */
router.post('/prospects', async (req, res) => {
  try {
    const { job_title, company, location, reveal_info = false } = req.body;
    const organizationId = req.headers['x-organization-id'] as string || 'default-org';

    // Validate required parameters
    if (!job_title && !company && !location) {
      return res.status(400).json({
        success: false,
        error: 'At least one search parameter (job_title, company, or location) is required',
        timestamp: new Date().toISOString()
      });
    }

    logger.info('Prospect search request', {
      organizationId,
      job_title,
      company,
      location,
      reveal_info
    });

    // Prepare search parameters for ContactOut
    const searchParams: any = {};
    
    if (job_title) {
      searchParams.job_title = Array.isArray(job_title) ? job_title : [job_title];
    }
    
    if (company) {
      searchParams.company = Array.isArray(company) ? company : [company];
    }
    
    if (location) {
      searchParams.location = Array.isArray(location) ? location : [location];
    }

    // Add reveal options if requested
    if (reveal_info) {
      searchParams.get_all = true; // Get full contact information
    }

    // Execute search
    const results = await contactOutService.searchProspects(searchParams, organizationId);

    // Log successful search
    logger.info('Prospect search completed', {
      organizationId,
      resultsCount: results.data?.length || 0,
      creditsUsed: results.credits_used
    });

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        prospects: results.data || [],
        total_found: results.total || 0,
        credits_used: results.credits_used || 0,
        search_params: searchParams,
        reveal_info_included: reveal_info
      }
    });

  } catch (error) {
    logger.error('Prospect search failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      body: req.body
    });

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Search failed',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/search/stats
 * Get search statistics and remaining credits
 */
router.get('/stats', async (req, res) => {
  try {
    const organizationId = req.headers['x-organization-id'] as string || 'default-org';
    
    logger.info('Fetching search stats', { organizationId });

    // Get usage stats from ContactOut
    const stats = await contactOutService.getUsageStats();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        organization_id: organizationId,
        credits: stats.credits || {},
        usage_today: stats.usage_today || {},
        quota_limits: stats.quota_limits || {}
      }
    });

  } catch (error) {
    logger.error('Failed to fetch search stats', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch stats',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
