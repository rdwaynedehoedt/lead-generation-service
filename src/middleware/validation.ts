import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Validation middleware for search prospects endpoint
 */
export const validateSearchParams = (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      // Basic parameters
      name, job_title, company, location, industry,
      // Advanced job filters
      exclude_job_titles, current_titles_only, include_related_job_titles,
      // Experience and skills
      skills, education, years_of_experience, years_in_current_role,
      // Company filters  
      company_filter, exclude_companies, current_company_only, domain, company_size,
      // Advanced search
      keyword, match_experience,
      // Data preferences
      data_types, reveal_info,
      // Pagination
      page, page_size, limit
    } = req.body;

    // Check if at least one search parameter is provided
    const hasSearchParam = name || job_title || company || location || industry || 
                          skills || education || keyword || domain || company_size;
    
    if (!hasSearchParam) {
      return res.status(400).json({
        success: false,
        error: 'At least one search parameter is required',
        details: 'Please provide name, job_title, company, location, industry, skills, or other search criteria',
        timestamp: new Date().toISOString()
      });
    }

    // Validate parameter types and lengths
    const errors: string[] = [];

    // String parameters
    if (name !== undefined && (typeof name !== 'string' || name.length > 100)) {
      errors.push('name must be a string with max 100 characters');
    }

    if (keyword !== undefined && (typeof keyword !== 'string' || keyword.length > 200)) {
      errors.push('keyword must be a string with max 200 characters');
    }

    // String or string array parameters
    const validateStringOrArray = (param: any, paramName: string, maxItems = 10, maxLength = 100) => {
      if (param !== undefined) {
        if (Array.isArray(param)) {
          if (param.length === 0 || param.length > maxItems) {
            errors.push(`${paramName} array must contain 1-${maxItems} items`);
          }
          if (param.some(item => typeof item !== 'string' || item.length > maxLength)) {
            errors.push(`${paramName} items must be strings with max ${maxLength} characters`);
          }
        } else if (typeof param !== 'string' || param.length > maxLength) {
          errors.push(`${paramName} must be a string with max ${maxLength} characters`);
        }
      }
    };

    validateStringOrArray(job_title, 'job_title', 5, 100);
    validateStringOrArray(company, 'company', 5, 100);
    validateStringOrArray(location, 'location', 5, 100);
    validateStringOrArray(industry, 'industry', 5, 100);
    validateStringOrArray(education, 'education', 5, 100);
    validateStringOrArray(domain, 'domain', 5, 100);

    // String array parameters
    const validateStringArray = (param: any, paramName: string, maxItems = 10, maxLength = 100) => {
      if (param !== undefined) {
        if (!Array.isArray(param)) {
          errors.push(`${paramName} must be an array`);
        } else if (param.length > maxItems) {
          errors.push(`${paramName} array must contain max ${maxItems} items`);
        } else if (param.some(item => typeof item !== 'string' || item.length > maxLength)) {
          errors.push(`${paramName} items must be strings with max ${maxLength} characters`);
        }
      }
    };

    validateStringArray(exclude_job_titles, 'exclude_job_titles', 5, 100);
    validateStringArray(skills, 'skills', 10, 50);
    validateStringArray(exclude_companies, 'exclude_companies', 5, 100);

    // Experience range parameters
    const validateExperienceRange = (param: any, paramName: string) => {
      if (param !== undefined) {
        const validRanges = ['0_1', '1_2', '2_3', '3_5', '5_7', '7_10', '10+', '1_3', '3_6', '6_10'];
        if (Array.isArray(param)) {
          if (param.some(range => !validRanges.includes(range))) {
            errors.push(`${paramName} contains invalid range values`);
          }
        } else if (typeof param === 'string' && !validRanges.includes(param)) {
          errors.push(`${paramName} must be a valid experience range`);
        } else if (typeof param !== 'string') {
          errors.push(`${paramName} must be a string or string array`);
        }
      }
    };

    validateExperienceRange(years_of_experience, 'years_of_experience');
    validateExperienceRange(years_in_current_role, 'years_in_current_role');

    // Company size validation
    if (company_size !== undefined) {
      const validSizes = ['1_10', '11_50', '51_200', '201_500', '501_1000', '1001_5000', '5001_10000', '10001+'];
      if (Array.isArray(company_size)) {
        if (company_size.some(size => !validSizes.includes(size))) {
          errors.push('company_size contains invalid size values');
        }
      } else if (typeof company_size === 'string' && !validSizes.includes(company_size)) {
        errors.push('company_size must be a valid company size range');
      } else if (typeof company_size !== 'string') {
        errors.push('company_size must be a string or string array');
      }
    }

    // Enum parameters
    if (company_filter !== undefined && !['current', 'previous', 'both'].includes(company_filter)) {
      errors.push('company_filter must be "current", "previous", or "both"');
    }

    if (match_experience !== undefined && !['current', 'previous', 'both'].includes(match_experience)) {
      errors.push('match_experience must be "current", "previous", or "both"');
    }

    // Boolean parameters
    const booleanParams = { current_titles_only, include_related_job_titles, current_company_only, reveal_info };
    Object.entries(booleanParams).forEach(([key, value]) => {
      if (value !== undefined && typeof value !== 'boolean') {
        errors.push(`${key} must be a boolean`);
      }
    });

    // Data types validation
    if (data_types !== undefined) {
      const validTypes = ['personal_email', 'work_email', 'phone'];
      if (!Array.isArray(data_types)) {
        errors.push('data_types must be an array');
      } else if (data_types.some(type => !validTypes.includes(type))) {
        errors.push('data_types contains invalid values');
      }
    }

    // Pagination validation
    if (page !== undefined) {
      if (!Number.isInteger(page) || page < 1) {
        errors.push('page must be a positive integer');
      }
    }

    if (page_size !== undefined) {
      if (!Number.isInteger(page_size) || page_size < 1 || page_size > 100) {
        errors.push('page_size must be an integer between 1 and 100');
      }
    }

    if (limit !== undefined) {
      if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        errors.push('limit must be an integer between 1 and 100');
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

    // Set default page_size to 5 if not provided
    if (!req.body.page_size && !req.body.limit) {
      req.body.page_size = 5;
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

/**
 * Validation middleware for company domain parameter
 */
export const validateCompanyDomain = (req: Request, res: Response, next: NextFunction) => {
  try {
    const domain = req.params.domain;

    if (!domain) {
      return res.status(400).json({
        success: false,
        error: 'Company domain is required',
        timestamp: new Date().toISOString()
      });
    }

    // Basic domain format validation
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!domainRegex.test(domain)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid domain format',
        timestamp: new Date().toISOString()
      });
    }

    // Check domain length
    if (domain.length > 253) {
      return res.status(400).json({
        success: false,
        error: 'Domain name too long',
        timestamp: new Date().toISOString()
      });
    }

    next();
  } catch (error) {
    logger.error('Company domain validation error', error);
    res.status(500).json({
      success: false,
      error: 'Validation error',
      timestamp: new Date().toISOString()
    });
  }
};
