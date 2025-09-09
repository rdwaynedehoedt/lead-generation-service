import axios from 'axios';
import logger from '../utils/logger';

interface QualityScore {
  overall_score: number;
  profile_completeness: number;
  contact_availability: number;
  company_verification: number;
  freshness_indicators: number;
  confidence_level: 'high' | 'medium' | 'low';
  flags: string[];
  cost_recommended: boolean;
}

interface ContactAvailability {
  personal_email: boolean;
  work_email: boolean;
  work_email_status?: string;
  phone: boolean;
}

export class QualityVerificationService {
  private apiKey: string;
  private client: any;

  constructor() {
    this.apiKey = process.env.CONTACTOUT_API_KEY;
    
    if (!this.apiKey) {
      throw new Error('CONTACTOUT_API_KEY environment variable is required');
    }
    
    this.client = axios.create({
      baseURL: process.env.CONTACTOUT_BASE_URL || 'https://api.contactout.com',
      headers: {
        'authorization': 'basic',
        'token': this.apiKey
      },
      timeout: 10000
    });
  }

  /**
   * Use FREE contact checker APIs to verify contact availability
   * Rate limit: 150 requests per minute (FREE!)
   */
  async checkContactAvailability(linkedinUrl: string): Promise<ContactAvailability> {
    try {
      logger.info('Checking contact availability (FREE)', { linkedinUrl });

      // Check personal email availability (FREE)
      const personalEmailCheck = await this.client.get('/v1/people/linkedin/personal_email_status', {
        params: { profile: linkedinUrl }
      });

      // Check work email availability (FREE)  
      const workEmailCheck = await this.client.get('/v1/people/linkedin/work_email_status', {
        params: { profile: linkedinUrl }
      });

      // Check phone availability (FREE)
      const phoneCheck = await this.client.get('/v1/people/linkedin/phone_status', {
        params: { profile: linkedinUrl }
      });

      const availability: ContactAvailability = {
        personal_email: personalEmailCheck.data.profile?.email || false,
        work_email: workEmailCheck.data.profile?.email || false,
        work_email_status: workEmailCheck.data.profile?.email_status,
        phone: phoneCheck.data.profile?.phone || false
      };

      logger.info('Contact availability checked (FREE)', {
        linkedinUrl,
        availability,
        creditsUsed: 0
      });

      return availability;

    } catch (error) {
      logger.error('Contact availability check failed', { linkedinUrl, error });
      
      // Return conservative estimate on error
      return {
        personal_email: false,
        work_email: false,
        phone: false
      };
    }
  }

  /**
   * Calculate quality score using ContactOut's BUILT-IN validation instead of custom algorithm
   * This is more accurate because ContactOut knows their own data quality best!
   */
  calculateQualityScore(profile: any, contactAvailability: ContactAvailability): QualityScore {
    const flags: string[] = [];
    
    // STEP 1: Use ContactOut's built-in confidence level if available
    let confidence: 'high' | 'medium' | 'low' = 'medium';
    let baseScore = 50; // Default medium score
    
    // ContactOut's confidence level (from their API responses)
    if (profile.confidenceLevel) {
      switch (profile.confidenceLevel.toLowerCase()) {
        case 'high':
          confidence = 'high';
          baseScore = 85;
          break;
        case 'medium':
          confidence = 'medium';
          baseScore = 65;
          break;
        case 'low':
          confidence = 'low';
          baseScore = 35;
          break;
      }
      logger.info('Using ContactOut confidence level', { 
        linkedinUrl: profile.linkedin_url,
        contactOutConfidence: profile.confidenceLevel,
        assignedScore: baseScore
      });
    }

    // STEP 2: Boost score for VERIFIED work emails (ContactOut's verification!)
    let emailBonus = 0;
    if (contactAvailability.work_email_status === 'Verified') {
      emailBonus = 15; // Major boost for ContactOut-verified emails
      logger.info('ContactOut verified work email found', { 
        linkedinUrl: profile.linkedin_url,
        bonus: emailBonus
      });
    } else if (contactAvailability.work_email) {
      emailBonus = 5; // Small boost for unverified work email
    }

    // STEP 3: Minor adjustments based on contact availability
    let contactBonus = 0;
    if (contactAvailability.personal_email) contactBonus += 3;
    if (contactAvailability.phone) contactBonus += 2;

    // STEP 4: Check for obvious red flags
    if (!profile.full_name || profile.full_name.length < 3) {
      flags.push('incomplete_name');
      baseScore -= 10;
    }

    if (!profile.title) {
      flags.push('no_job_title');
      baseScore -= 5;
    }

    if (!contactAvailability.work_email && !contactAvailability.personal_email) {
      flags.push('no_contact_info');
      baseScore -= 15;
    }

    // Calculate final score
    const finalScore = Math.min(100, Math.max(0, baseScore + emailBonus + contactBonus));

    // Determine cost recommendation (prioritize ContactOut's verification)
    const costRecommended = contactAvailability.work_email_status === 'Verified' || 
                           (finalScore >= 70 && contactAvailability.work_email);

    // Override confidence based on final score if needed
    if (finalScore >= 80) confidence = 'high';
    else if (finalScore >= 60) confidence = 'medium';
    else confidence = 'low';

    logger.info('Quality score calculated using ContactOut validation', {
      linkedinUrl: profile.linkedin_url,
      contactOutConfidence: profile.confidenceLevel,
      verifiedWorkEmail: contactAvailability.work_email_status === 'Verified',
      finalScore,
      confidence,
      costRecommended,
      flags
    });

    return {
      overall_score: Math.round(finalScore),
      profile_completeness: baseScore, // ContactOut's base confidence
      contact_availability: emailBonus + contactBonus, // Contact verification bonus
      company_verification: 0, // Not used in new approach
      freshness_indicators: 0, // Not used in new approach  
      confidence_level: confidence,
      flags,
      cost_recommended: costRecommended
    };
  }

  /**
   * Verify multiple profiles efficiently using batch processing
   */
  async verifyProfiles(profiles: any[]): Promise<Array<{ profile: any; quality: QualityScore; contact_availability: ContactAvailability }>> {
    const results = [];
    const batchSize = 5; // Respect rate limits
    
    logger.info('Starting profile verification batch', { 
      totalProfiles: profiles.length,
      batchSize,
      estimatedTime: `${Math.ceil(profiles.length / batchSize)} seconds`
    });

    for (let i = 0; i < profiles.length; i += batchSize) {
      const batch = profiles.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (profile) => {
        const contactAvailability = await this.checkContactAvailability(profile.linkedin_url);
        const quality = this.calculateQualityScore(profile, contactAvailability);
        
        return {
          profile,
          quality,
          contact_availability: contactAvailability
        };
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add small delay between batches to respect rate limits
      if (i + batchSize < profiles.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Sort by quality score (highest first)
    results.sort((a, b) => b.quality.overall_score - a.quality.overall_score);

    logger.info('Profile verification completed', {
      totalVerified: results.length,
      highQuality: results.filter(r => r.quality.confidence_level === 'high').length,
      mediumQuality: results.filter(r => r.quality.confidence_level === 'medium').length,
      lowQuality: results.filter(r => r.quality.confidence_level === 'low').length,
      costRecommended: results.filter(r => r.quality.cost_recommended).length,
      creditsUsed: 0 // All verification was FREE!
    });

    return results;
  }
}

// Export singleton instance
let qualityVerificationService: QualityVerificationService;

export function getQualityVerificationService(): QualityVerificationService {
  if (!qualityVerificationService) {
    qualityVerificationService = new QualityVerificationService();
  }
  return qualityVerificationService;
}
