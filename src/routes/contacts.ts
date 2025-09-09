import express from 'express';
import { logger } from '../utils/logger';
import contactOutService from '../services/contactOutService';

const router = express.Router();

/**
 * POST /api/contacts/reveal
 * Reveal contact information (email/phone) for specific prospects
 */
router.post('/reveal', async (req, res) => {
  try {
    const { linkedin_url, reveal_types = ['email'] } = req.body;
    const organizationId = req.headers['x-organization-id'] as string || 'default-org';

    // Validate required parameters
    if (!linkedin_url) {
      return res.status(400).json({
        success: false,
        error: 'linkedin_url is required',
        example: {
          linkedin_url: 'https://linkedin.com/in/johndoe',
          reveal_types: ['email', 'phone']
        }
      });
    }

    logger.info('Contact reveal request', {
      organizationId,
      linkedin_url,
      reveal_types
    });

    // Use ContactOut enrichment to get contact details
    const enrichmentResult = await contactOutService.enrichLinkedInProfile(
      linkedin_url,
      organizationId,
      false
    );

    const profile = enrichmentResult.profile || {} as any;

    // Format response
    const contactInfo = {
      name: profile.full_name,
      job_title: profile.title,
      company: profile.company?.name,
      location: profile.location,
      linkedin_url,
      emails: profile.email || [],
      phones: profile.phone || [],
      reveal_success: !!(profile.email?.length || profile.phone?.length),
      credits_used: 1
    };

    return res.json({
      success: true,
      data: contactInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    const errorMessage = error.message || 'Contact reveal failed';
    
    logger.error('Contact reveal failed', {
      linkedin_url: req.body.linkedin_url,
      error: errorMessage
    });

    // Handle rate limiting
    if (errorMessage.includes('Rate limit') || error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        retry_after: 60
      });
    }

    return res.status(500).json({
      success: false,
      error: errorMessage,
      credits_used: 0
    });
  }
});

/**
 * POST /api/contacts/verify-email
 * Verify if an email address is valid and deliverable
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { email } = req.body;
    const organizationId = req.headers['x-organization-id'] as string || 'default-org';

    // Validate required parameters
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'email is required'
      });
    }

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    logger.info('Email verification request', { organizationId, email });

    const verificationResult = await contactOutService.verifyEmail(email, organizationId);

    const responseData = {
      success: true,
      data: {
        email,
        isValid: verificationResult.data?.status === 'valid',
        status: verificationResult.data?.status || 'unknown',
        verification_result: verificationResult.data,
        verified_at: new Date().toISOString()
      }
    };

    return res.json(responseData);

  } catch (error: any) {
    logger.error('Email verification failed', {
      email: req.body.email,
      error: error.message
    });

    return res.status(500).json({
      success: false,
      error: error.message || 'Email verification failed'
    });
  }
});

/**
 * GET /api/contacts/credits
 * Get current ContactOut credit usage and remaining credits
 */
router.get('/credits', async (_req, res) => {
  try {
    logger.info('Credits check request');
    
    const stats = await contactOutService.getUsageStats();

    const creditsData = {
      success: true,
      data: {
        email_credits: stats.usage?.remaining || 0,
        phone_credits: stats.usage?.phone_remaining || 0,
        search_credits: stats.usage?.search_remaining || 0,
        usage_today: {
          email_reveals: stats.usage?.count || 0,
          phone_reveals: stats.usage?.phone_count || 0,
          searches: stats.usage?.search_count || 0
        },
        timestamp: new Date().toISOString()
      }
    };

    return res.json(creditsData);

  } catch (error: any) {
    logger.error('Credits check failed', { error: error.message });
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Credits check failed'
    });
  }
});

export default router;