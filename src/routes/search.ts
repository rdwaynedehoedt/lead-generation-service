import express from 'express';
import { logger } from '../utils/logger';
import contactOutService from '../services/contactOutService';

const router = express.Router();

/**
 * POST /api/search/prospects
 * Advanced prospect search using ContactOut API with comprehensive filters
 */
router.post('/prospects', async (req, res) => {
  try {
    const organizationId = req.headers['x-organization-id'] as string || 'default-org';

    // Extract all search parameters from validated request body
    const searchParams = {
      // Basic parameters
      ...(req.body.name && { name: req.body.name }),
      ...(req.body.job_title && { job_title: req.body.job_title }),
      ...(req.body.company && { company: req.body.company }),
      ...(req.body.location && { location: req.body.location }),
      ...(req.body.industry && { industry: req.body.industry }),
      
      // Advanced job filters
      ...(req.body.exclude_job_titles && { exclude_job_titles: req.body.exclude_job_titles }),
      ...(req.body.current_titles_only !== undefined && { current_titles_only: req.body.current_titles_only }),
      ...(req.body.include_related_job_titles !== undefined && { include_related_job_titles: req.body.include_related_job_titles }),
      
      // Experience and skills
      ...(req.body.skills && { skills: req.body.skills }),
      ...(req.body.education && { education: req.body.education }),
      ...(req.body.years_of_experience && { years_of_experience: req.body.years_of_experience }),
      ...(req.body.years_in_current_role && { years_in_current_role: req.body.years_in_current_role }),
      
      // Company filters
      ...(req.body.company_filter && { company_filter: req.body.company_filter }),
      ...(req.body.exclude_companies && { exclude_companies: req.body.exclude_companies }),
      ...(req.body.current_company_only !== undefined && { current_company_only: req.body.current_company_only }),
      ...(req.body.domain && { domain: req.body.domain }),
      ...(req.body.company_size && { company_size: req.body.company_size }),
      
      // Advanced search
      ...(req.body.keyword && { keyword: req.body.keyword }),
      ...(req.body.match_experience && { match_experience: req.body.match_experience }),
      
      // Data preferences
      ...(req.body.data_types && { data_types: req.body.data_types }),
      ...(req.body.reveal_info !== undefined && { reveal_info: req.body.reveal_info }),
      
      // Pagination (defaulted to 5 in validation)
      page: req.body.page || 1,
      page_size: req.body.page_size || req.body.limit || 5
    };

    logger.info('Advanced prospect search request', {
      organizationId,
      searchParams: {
        ...searchParams,
        // Log non-sensitive summary
        hasName: !!searchParams.name,
        hasJobTitle: !!searchParams.job_title,
        hasCompany: !!searchParams.company,
        hasLocation: !!searchParams.location,
        filterCount: Object.keys(searchParams).length
      }
    });

    // Execute search with ContactOut
    const results = await contactOutService.searchProspects(searchParams, organizationId);

    // Log successful search
    logger.info('Advanced prospect search completed', {
      organizationId,
      totalResults: results.metadata?.total_results || 0,
      returnedResults: Array.isArray(results.profiles) 
        ? results.profiles.length 
        : Object.keys(results.profiles || {}).length,
      page: results.metadata?.page || 1,
      pageSize: results.metadata?.page_size || 5
    });

    // Process profiles data based on format
    let profilesArray: any[] = [];
    if (results.profiles) {
      if (Array.isArray(results.profiles)) {
        profilesArray = results.profiles;
      } else {
        // Convert object format to array
        profilesArray = Object.entries(results.profiles).map(([url, profile]) => ({
          ...profile,
          linkedin_url: url
        }));
      }
    }

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        prospects: profilesArray,
        metadata: {
          total_results: results.metadata?.total_results || 0,
          page: results.metadata?.page || 1,
          page_size: results.metadata?.page_size || 5,
          total_pages: Math.ceil((results.metadata?.total_results || 0) / (results.metadata?.page_size || 5))
        },
        search_params: searchParams,
        applied_filters: Object.keys(searchParams).filter(key => 
          !['page', 'page_size'].includes(key) && searchParams[key as keyof typeof searchParams] !== undefined
        )
      }
    });

  } catch (error) {
    logger.error('Advanced prospect search failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      organizationId: req.headers['x-organization-id'],
      searchParamCount: Object.keys(req.body).length
    });

    // Handle specific ContactOut errors
    let errorMessage = 'Search failed';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('Rate limit exceeded')) {
        statusCode = 429;
        errorMessage = 'Search rate limit exceeded. Please try again later.';
      } else if (error.message.includes('Authentication failed')) {
        statusCode = 401;
        errorMessage = 'API authentication failed. Please check configuration.';
      } else if (error.message.includes('Bad request')) {
        statusCode = 400;
        errorMessage = 'Invalid search parameters provided.';
      } else {
        errorMessage = error.message;
      }
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
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
        remaining: stats.usage?.remaining || {},
        count: stats.usage?.count || 0,
        quota: stats.usage?.quota || 0
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
