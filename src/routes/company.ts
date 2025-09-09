import express from 'express';
import { logger } from '../utils/logger';
import contactOutService from '../services/contactOutService';
import { validateCompanyDomain } from '../middleware/validation';

const router = express.Router();

/**
 * GET /api/company/:domain - Get company information (FREE - no credits used)
 * This endpoint provides comprehensive company data without consuming ContactOut credits
 */
router.get('/:domain', validateCompanyDomain, async (req, res, next) => {
  try {
    const domain = req.params.domain;
    const organizationId = req.headers['x-organization-id'] as string || 'default-org';

    logger.info('Company information request', {
      organizationId,
      domain
    });

    // Get company information (FREE from ContactOut)
    const companyInfo = await contactOutService.getCompanyInfo(domain, organizationId);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        company: companyInfo,
        credits_used: 0, // Company info is free
        source: 'contactout'
      }
    });

  } catch (error) {
    logger.error('Company information request failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      domain: req.params.domain,
      organizationId: req.headers['x-organization-id']
    });

    next(error);
  }
});

/**
 * GET /api/company/:domain/decision-makers - Get decision makers for a company
 * This endpoint finds key contacts at the specified company
 */
router.get('/:domain/decision-makers', validateCompanyDomain, async (req, res, next) => {
  try {
    const domain = req.params.domain;
    const organizationId = req.headers['x-organization-id'] as string || 'default-org';
    const revealInfo = req.query.reveal_info === 'true';

    logger.info('Decision makers request', {
      organizationId,
      domain,
      revealInfo
    });

    // Get decision makers for the company
    const decisionMakers = await contactOutService.getDecisionMakers({
      domain,
      reveal_info: revealInfo
    }, organizationId);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        decision_makers: decisionMakers,
        company_domain: domain,
        total_found: Array.isArray(decisionMakers) ? decisionMakers.length : 0,
        credits_used: revealInfo ? decisionMakers?.length || 0 : 0
      }
    });

  } catch (error) {
    logger.error('Decision makers request failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      domain: req.params.domain,
      organizationId: req.headers['x-organization-id']
    });

    next(error);
  }
});

/**
 * POST /api/company/enrich-prospect - Enrich individual prospect
 * This endpoint enhances a single prospect with additional ContactOut data
 */
router.post('/enrich-prospect', async (req, res, next) => {
  try {
    const { linkedin_url, prospect_id, enrich_types } = req.body;
    const organizationId = req.headers['x-organization-id'] as string || 'default-org';

    // Validate required fields
    if (!linkedin_url && !prospect_id) {
      return res.status(400).json({
        success: false,
        error: 'Either linkedin_url or prospect_id is required',
        timestamp: new Date().toISOString()
      });
    }

    logger.info('Prospect enrichment request', {
      organizationId,
      linkedin_url: linkedin_url ? 'provided' : 'not provided',
      prospect_id,
      enrich_types
    });

    // Enrich the prospect with ContactOut data
    const enrichmentResult = await contactOutService.enrichProspect({
      linkedin_url,
      prospect_id,
      enrich_types: enrich_types || ['profile', 'contact', 'company'],
      organization_id: organizationId
    });

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        enriched_prospect: enrichmentResult.prospect,
        enrichment_summary: {
          fields_updated: enrichmentResult.fields_updated,
          new_data_found: enrichmentResult.new_data_found,
          confidence_score: enrichmentResult.confidence_score
        },
        credits_used: enrichmentResult.credits_used
      }
    });

  } catch (error) {
    logger.error('Prospect enrichment failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      organizationId: req.headers['x-organization-id'],
      body: req.body
    });

    next(error);
  }
});

/**
 * POST /api/company/bulk-enrich - Bulk enrich multiple prospects
 * This endpoint processes multiple prospects for enrichment efficiently
 */
router.post('/bulk-enrich', async (req, res, next) => {
  try {
    const { prospect_ids, linkedin_urls, enrich_types } = req.body;
    const organizationId = req.headers['x-organization-id'] as string || 'default-org';

    // Validate input
    if ((!prospect_ids || prospect_ids.length === 0) && (!linkedin_urls || linkedin_urls.length === 0)) {
      return res.status(400).json({
        success: false,
        error: 'Either prospect_ids or linkedin_urls array is required',
        timestamp: new Date().toISOString()
      });
    }

    const totalProspects = (prospect_ids?.length || 0) + (linkedin_urls?.length || 0);
    if (totalProspects > 100) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 100 prospects can be enriched per request',
        timestamp: new Date().toISOString()
      });
    }

    logger.info('Bulk prospect enrichment request', {
      organizationId,
      prospect_count: totalProspects,
      enrich_types
    });

    // Process bulk enrichment
    const bulkResult = await contactOutService.bulkEnrichProspects({
      prospect_ids,
      linkedin_urls,
      enrich_types: enrich_types || ['profile', 'contact'],
      organization_id: organizationId
    });

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        job_id: bulkResult.job_id,
        status: bulkResult.status,
        prospects_queued: totalProspects,
        estimated_completion: bulkResult.estimated_completion,
        credits_estimated: bulkResult.estimated_credits
      }
    });

  } catch (error) {
    logger.error('Bulk prospect enrichment failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      organizationId: req.headers['x-organization-id'],
      body: req.body
    });

    next(error);
  }
});

/**
 * GET /api/company/bulk-job/:jobId - Check bulk enrichment job status
 */
router.get('/bulk-job/:jobId', async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const organizationId = req.headers['x-organization-id'] as string || 'default-org';

    const jobStatus = await contactOutService.getBulkEnrichmentStatus(jobId, organizationId);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: jobStatus
    });

  } catch (error) {
    logger.error('Bulk job status check failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      jobId: req.params.jobId,
      organizationId: req.headers['x-organization-id']
    });

    next(error);
  }
});

export default router;
