import express from 'express';
import axios from 'axios';
import logger from '../utils/logger';
import { getQualityVerificationService } from '../services/qualityVerificationService';

const router = express.Router();
const qualityService = getQualityVerificationService();

/**
 * Get company employees by company name (NO CREDITS USED)
 * GET /api/company-employees?company=Microsoft
 */
router.get('/', async (req, res) => {
  try {
    const { company } = req.query;
    
    // Validation
    if (!company || typeof company !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Company name is required'
      });
    }

    logger.info('Fetching company employees with QUALITY VERIFICATION', { company });

    // Step 1: Get basic profiles (NO CREDITS USED!)
    const response = await axios.get('https://api.contactout.com/v1/people/decision-makers', {
      params: {
        name: company,
        reveal_info: false  // NO CREDITS USED!
      },
      headers: {
        'authorization': 'basic',
        'token': process.env.CONTACTOUT_API_KEY || (() => {
          throw new Error('CONTACTOUT_API_KEY environment variable is required');
        })()
      }
    });

    const profiles = response.data.profiles || {};
    const totalResults = response.data.metadata?.total_results || 0;
    
    // Convert to array format for processing
    const profilesArray = Object.entries(profiles).map(([url, profile]: [string, any]) => ({
      ...profile,
      linkedin_url: url
    }));

    logger.info('Basic profiles retrieved', { 
      company, 
      totalResults,
      profilesReturned: profilesArray.length,
      creditsUsed: 0
    });

    // Step 2: Quality verification using FREE contact checkers
    const verifiedProfiles = await qualityService.verifyProfiles(profilesArray);
    
    // Step 3: Format response with quality indicators
    const formattedEmployees = verifiedProfiles.map((verified) => {
      const profile = verified.profile;
      const quality = verified.quality;
      const contactAvailability = verified.contact_availability;

      return {
        name: profile.full_name,
        job_title: profile.title,
        headline: profile.headline,
        linkedin_url: profile.linkedin_url,
        location: profile.location,
        company: {
          name: profile.company?.name,
          domain: profile.company?.domain,
          size: profile.company?.size,
          industry: profile.company?.industry,
          revenue: profile.company?.revenue
        },
        
        // Enhanced contact availability (from FREE checkers)
        contact_availability: {
          personal_email: contactAvailability.personal_email,
          work_email: contactAvailability.work_email,
          work_email_verified: contactAvailability.work_email_status === 'Verified',
          phone: contactAvailability.phone
        },
        
        // Quality score and indicators
        quality_score: {
          overall_score: quality.overall_score,
          confidence_level: quality.confidence_level,
          completeness: quality.profile_completeness,
          contact_score: quality.contact_availability,
          company_verification: quality.company_verification,
          freshness: quality.freshness_indicators,
          flags: quality.flags,
          cost_recommended: quality.cost_recommended
        },
        
        profile_picture: profile.profile_picture_url,
        
        // Add verification timestamp
        verified_at: new Date().toISOString()
      };
    });

    // Calculate quality distribution for analytics
    const qualityStats = {
      high_quality: formattedEmployees.filter(e => e.quality_score.confidence_level === 'high').length,
      medium_quality: formattedEmployees.filter(e => e.quality_score.confidence_level === 'medium').length,
      low_quality: formattedEmployees.filter(e => e.quality_score.confidence_level === 'low').length,
      cost_recommended: formattedEmployees.filter(e => e.quality_score.cost_recommended).length,
      verified_emails: formattedEmployees.filter(e => e.contact_availability.work_email_verified).length
    };

    logger.info('Quality verification completed', { 
      company,
      ...qualityStats,
      creditsUsed: 0,
      estimatedSavings: `${qualityStats.low_quality * 2} credits saved by not revealing low-quality contacts`
    });

    return res.json({
      success: true,
      data: {
        company_name: company,
        total_employees_found: totalResults,
        employees_returned: formattedEmployees.length,
        employees: formattedEmployees,
        
        // Quality analytics
        quality_distribution: qualityStats,
        
        // Cost information
        credits_used: 0, // All verification was FREE!
        estimated_savings: `${qualityStats.low_quality * 2} credits saved`,
        cost_recommended_count: qualityStats.cost_recommended,
        
        // Verification info
        verification_method: 'FREE contact checkers + quality scoring',
        verified_at: new Date().toISOString()
      }
    });

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    
    logger.error('Company employees search failed', { 
      company: req.query.company, 
      error: error.response?.data || error.message,
      statusCode: error.response?.status
    });

    // Handle rate limiting specifically
    if (errorMessage === 'Too Many Attempts.' || error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded. Please wait 1-2 minutes before trying again.',
        rate_limit_hit: true,
        retry_after: 120, // seconds
        credits_used: 0,
        tip: 'ContactOut allows 60 searches per minute. Try spacing out your requests.'
      });
    }

    return res.status(500).json({
      success: false,
      error: errorMessage || 'Failed to fetch company employees',
      credits_used: 0
    });
  }
});

export default router;
