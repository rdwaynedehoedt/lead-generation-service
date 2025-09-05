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
        timestamp: new Date().toISOString()
      });
    }

    // Validate LinkedIn URL format
    const linkedinUrlPattern = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    if (!linkedinUrlPattern.test(linkedin_url)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid LinkedIn URL format. Expected: https://linkedin.com/in/username',
        timestamp: new Date().toISOString()
      });
    }

    // Validate reveal types
    const validRevealTypes = ['email', 'phone'];
    const invalidTypes = reveal_types.filter((type: string) => !validRevealTypes.includes(type));
    
    if (invalidTypes.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Invalid reveal types: ${invalidTypes.join(', ')}. Valid types: ${validRevealTypes.join(', ')}`,
        timestamp: new Date().toISOString()
      });
    }

    logger.info('Contact reveal request', {
      organizationId,
      linkedin_url,
      reveal_types
    });

    // Use ContactOut enrichment to get contact details
    const enrichmentResult = await contactOutService.enrichContact({
      linkedin_url,
      reveal_email: reveal_types.includes('email'),
      reveal_phone: reveal_types.includes('phone')
    });

    // Calculate credits used based on reveal types
    let creditsUsed = 0;
    if (reveal_types.includes('email') && enrichmentResult.email) {
      creditsUsed += 1; // 1 credit per email reveal
    }
    if (reveal_types.includes('phone') && enrichmentResult.phone_number) {
      creditsUsed += 1; // 1 credit per phone reveal
    }

    logger.info('Contact reveal completed', {
      organizationId,
      linkedin_url,
      creditsUsed,
      emailRevealed: !!enrichmentResult.email,
      phoneRevealed: !!enrichmentResult.phone_number
    });

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        linkedin_url,
        contact_info: {
          name: enrichmentResult.name,
          email: reveal_types.includes('email') ? enrichmentResult.email : null,
          phone: reveal_types.includes('phone') ? enrichmentResult.phone_number : null,
          company: enrichmentResult.company,
          job_title: enrichmentResult.job_title,
          location: enrichmentResult.location
        },
        credits_used: creditsUsed,
        reveal_types_requested: reveal_types
      }
    });

  } catch (error) {
    logger.error('Contact reveal failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      body: req.body
    });

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Contact reveal failed',
      timestamp: new Date().toISOString()
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
        error: 'email is required',
        timestamp: new Date().toISOString()
      });
    }

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
        timestamp: new Date().toISOString()
      });
    }

    logger.info('Email verification request', {
      organizationId,
      email
    });

    // Use ContactOut email verification
    const verificationResult = await contactOutService.verifyEmail(email);

    logger.info('Email verification completed', {
      organizationId,
      email,
      isValid: verificationResult.is_valid,
      deliverable: verificationResult.deliverable
    });

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        email,
        is_valid: verificationResult.is_valid,
        deliverable: verificationResult.deliverable,
        verification_result: verificationResult.result,
        confidence: verificationResult.confidence || null
      }
    });

  } catch (error) {
    logger.error('Email verification failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      body: req.body
    });

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Email verification failed',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/contacts/credits
 * Get remaining contact reveal credits
 */
router.get('/credits', async (req, res) => {
  try {
    const organizationId = req.headers['x-organization-id'] as string || 'default-org';
    
    logger.info('Fetching contact credits', { organizationId });

    // Get usage stats from ContactOut
    const stats = await contactOutService.getUsageStats();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        organization_id: organizationId,
        email_credits: stats.credits?.email || 0,
        phone_credits: stats.credits?.phone || 0,
        search_credits: stats.credits?.search || 0,
        usage_today: {
          email_reveals: stats.usage_today?.email || 0,
          phone_reveals: stats.usage_today?.phone || 0,
          searches: stats.usage_today?.search || 0
        }
      }
    });

  } catch (error) {
    logger.error('Failed to fetch contact credits', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch credits',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
