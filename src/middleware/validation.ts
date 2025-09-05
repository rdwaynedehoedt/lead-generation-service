import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Validation middleware for search prospects endpoint
 */
export const validateSearchParams = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { job_title, company, location, reveal_info } = req.body;

    // Check if at least one search parameter is provided
    if (!job_title && !company && !location) {
      return res.status(400).json({
        success: false,
        error: 'At least one search parameter is required',
        details: 'Please provide job_title, company, or location',
        timestamp: new Date().toISOString()
      });
    }

    // Validate parameter types and lengths
    const errors: string[] = [];

    if (job_title !== undefined) {
      if (Array.isArray(job_title)) {
        if (job_title.length === 0 || job_title.length > 5) {
          errors.push('job_title array must contain 1-5 items');
        }
        if (job_title.some(title => typeof title !== 'string' || title.length > 100)) {
          errors.push('job_title items must be strings with max 100 characters');
        }
      } else if (typeof job_title !== 'string' || job_title.length > 100) {
        errors.push('job_title must be a string with max 100 characters');
      }
    }

    if (company !== undefined) {
      if (Array.isArray(company)) {
        if (company.length === 0 || company.length > 5) {
          errors.push('company array must contain 1-5 items');
        }
        if (company.some(comp => typeof comp !== 'string' || comp.length > 100)) {
          errors.push('company items must be strings with max 100 characters');
        }
      } else if (typeof company !== 'string' || company.length > 100) {
        errors.push('company must be a string with max 100 characters');
      }
    }

    if (location !== undefined) {
      if (Array.isArray(location)) {
        if (location.length === 0 || location.length > 5) {
          errors.push('location array must contain 1-5 items');
        }
        if (location.some(loc => typeof loc !== 'string' || loc.length > 100)) {
          errors.push('location items must be strings with max 100 characters');
        }
      } else if (typeof location !== 'string' || location.length > 100) {
        errors.push('location must be a string with max 100 characters');
      }
    }

    if (reveal_info !== undefined && typeof reveal_info !== 'boolean') {
      errors.push('reveal_info must be a boolean');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors,
        timestamp: new Date().toISOString()
      });
    }

    next();
  } catch (error) {
    logger.error('Validation middleware error', error);
    res.status(500).json({
      success: false,
      error: 'Validation error',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Validation middleware for contact reveal endpoint
 */
export const validateContactReveal = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { linkedin_url, reveal_types } = req.body;

    const errors: string[] = [];

    // Validate LinkedIn URL
    if (!linkedin_url) {
      errors.push('linkedin_url is required');
    } else if (typeof linkedin_url !== 'string') {
      errors.push('linkedin_url must be a string');
    } else {
      const linkedinUrlPattern = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
      if (!linkedinUrlPattern.test(linkedin_url)) {
        errors.push('Invalid LinkedIn URL format. Expected: https://linkedin.com/in/username');
      }
    }

    // Validate reveal types
    if (reveal_types !== undefined) {
      if (!Array.isArray(reveal_types)) {
        errors.push('reveal_types must be an array');
      } else {
        const validTypes = ['email', 'phone'];
        const invalidTypes = reveal_types.filter(type => !validTypes.includes(type));
        if (invalidTypes.length > 0) {
          errors.push(`Invalid reveal types: ${invalidTypes.join(', ')}. Valid types: ${validTypes.join(', ')}`);
        }
        if (reveal_types.length === 0) {
          errors.push('reveal_types array cannot be empty');
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors,
        timestamp: new Date().toISOString()
      });
    }

    next();
  } catch (error) {
    logger.error('Contact reveal validation error', error);
    res.status(500).json({
      success: false,
      error: 'Validation error',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Validation middleware for email verification endpoint
 */
export const validateEmailVerification = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const errors: string[] = [];

    if (!email) {
      errors.push('email is required');
    } else if (typeof email !== 'string') {
      errors.push('email must be a string');
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        errors.push('Invalid email format');
      }
      if (email.length > 320) {
        errors.push('Email address too long (max 320 characters)');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors,
        timestamp: new Date().toISOString()
      });
    }

    next();
  } catch (error) {
    logger.error('Email verification validation error', error);
    res.status(500).json({
      success: false,
      error: 'Validation error',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Rate limiting validation - check if organization has exceeded limits
 */
export const validateRateLimit = (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.headers['x-organization-id'] as string || 'default-org';
    
    // Add organization ID to request for later use
    (req as any).organizationId = organizationId;

    // For now, just log the organization ID
    // In production, you'd check against your rate limiting service
    logger.info('Rate limit check', { organizationId, path: req.path });

    next();
  } catch (error) {
    logger.error('Rate limit validation error', error);
    res.status(500).json({
      success: false,
      error: 'Rate limit validation error',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * General request sanitization middleware
 */
export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Remove any potentially dangerous fields
    if (req.body) {
      // Remove common dangerous fields
      delete req.body.__proto__;
      delete req.body.constructor;
      delete req.body.prototype;
    }

    // Log request for debugging
    logger.debug('Request received', {
      method: req.method,
      path: req.path,
      organizationId: req.headers['x-organization-id'],
      bodyKeys: req.body ? Object.keys(req.body) : []
    });

    next();
  } catch (error) {
    logger.error('Request sanitization error', error);
    res.status(500).json({
      success: false,
      error: 'Request processing error',
      timestamp: new Date().toISOString()
    });
  }
};
