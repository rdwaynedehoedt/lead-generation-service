import express from 'express';
import axios from 'axios';
import logger from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/**
 * Advanced People Search with ALL ContactOut filters
 * POST /api/advanced-people-search
 * 
 * Supports all ContactOut filtering options:
 * - Job titles, companies, locations, industries
 * - Skills, education, experience levels
 * - Company size, keywords, and more!
 */
router.post('/', async (req, res) => {
  try {
    const filters = req.body;
    
    logger.info('Advanced people search with filters', { 
      filters,
      hasJobTitle: !!filters.job_title,
      hasCompany: !!filters.company,
      hasLocation: !!filters.location,
      hasSkills: !!filters.skills
    });

    // Build ContactOut People Search request with parameter conflict resolution
    const searchParams = {
      page: filters.page || 1,
      reveal_info: false, // Keep it FREE for initial search
      ...filters
    };

    // Remove our custom parameters that aren't part of ContactOut API
    delete searchParams.enable_quality_verification;
    delete searchParams.sort_by_quality;

    // Handle ContactOut API parameter conflicts
    // Rule: match_experience cannot be used with company_filter, current_titles_only, or current_company_only
    if (searchParams.match_experience) {
      logger.info('Using match_experience, removing conflicting parameters', {
        match_experience: searchParams.match_experience,
        removingParams: ['company_filter', 'current_titles_only', 'current_company_only']
      });
      
      delete searchParams.company_filter;
      delete searchParams.current_titles_only;
      delete searchParams.current_company_only;
    }

    // Clean up empty arrays and null values
    Object.keys(searchParams).forEach(key => {
      const value = searchParams[key];
      if (Array.isArray(value) && value.length === 0) {
        delete searchParams[key];
      } else if (value === null || value === undefined || value === '') {
        delete searchParams[key];
      }
    });

    logger.info('Calling ContactOut People Search API', { 
      endpoint: 'POST /v1/people/search',
      creditsUsed: 0,
      filtersApplied: Object.keys(searchParams).length
    });

    // Validate API key
    const apiKey = process.env.CONTACTOUT_API_KEY;
    if (!apiKey) {
      throw new Error('CONTACTOUT_API_KEY environment variable is required');
    }

    const baseUrl = process.env.CONTACTOUT_BASE_URL || 'https://api.contactout.com';
    
    // Call ContactOut People Search API
    const response = await axios.post(`${baseUrl}/v1/people/search`, searchParams, {
      headers: {
        'authorization': 'basic',
        'token': apiKey,
        'Content-Type': 'application/json'
      }
    });

    const result = response.data;
    const profiles = result.profiles || {};
    const metadata = result.metadata || {};

    // Convert profiles object to array for easier processing
    const profilesArray = Object.entries(profiles).map(([url, profile]: [string, any]) => ({
      ...profile,
      linkedin_url: url
    }));

    logger.info('People search results retrieved', {
      totalResults: metadata.total_results,
      page: metadata.page,
      pageSize: metadata.page_size,
      profilesReturned: profilesArray.length,
      creditsUsed: 0
    });

    // No more quality verification - just return all profiles
    let processedProfiles = profilesArray;

    // Format final response
    const responseData = {
      success: true,
      data: {
        metadata: {
          total_results: metadata.total_results,
          page: metadata.page || 1,
          page_size: metadata.page_size || 25,
          total_pages: Math.ceil(metadata.total_results / (metadata.page_size || 25))
        },
        filters_applied: {
          job_title: filters.job_title || null,
          company: filters.company || null,
          location: filters.location || null,
          industry: filters.industry || null,
          skills: filters.skills || null,
          education: filters.education || null,
          years_of_experience: filters.years_of_experience || null,
          company_size: filters.company_size || null,
          keyword: filters.keyword || null
        },
        profiles: processedProfiles,
        credits_used: 0,
        api_info: {
          endpoint: 'ContactOut People Search API',
          documentation: 'Advanced filtering with 15+ criteria supported'
        }
      }
    };

    return res.json(responseData);

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    
    logger.error('Advanced people search failed', {
      filters: req.body,
      error: error.response?.data || error.message,
      statusCode: error.response?.status
    });

    // Handle rate limiting
    if (errorMessage === 'Too Many Attempts.' || error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded. ContactOut People Search API allows 60 requests/minute.',
        rate_limit_hit: true,
        retry_after: 60,
        tip: 'Space out your advanced searches or try simpler filters.',
        credits_used: 0
      });
    }

    return res.status(500).json({
      success: false,
      error: errorMessage || 'Advanced people search failed',
      credits_used: 0
    });
  }
});

/**
 * Get available filter options and examples
 * GET /api/advanced-people-search/filters
 */
router.get('/filters', (_req, res) => {
  const availableFilters = {
    success: true,
    data: {
      filters: {
        // Basic Information
        name: {
          type: "string",
          description: "Name of the person",
          example: "John Smith"
        },
        job_title: {
          type: "array",
          max_items: 50,
          description: "Array of job titles to search for",
          examples: ["CEO", "Vice President", "Software Engineer", "Marketing Manager"]
        },
        exclude_job_titles: {
          type: "array",
          description: "Job titles to exclude from results",
          examples: ["Intern", "Student", "Volunteer"]
        },
        current_titles_only: { 
          type: "boolean",
          default: true,
          description: "Search only current job titles (true) or include past titles (false)"
        },
        include_related_job_titles: {
          type: "boolean",
          default: false,
          description: "Include related/similar job titles in search"
        },

        // Company & Experience
        company: {
          type: "array",
          max_items: 50,
          description: "Array of company names",
          examples: ["Microsoft", "Google", "Apple", "Amazon"]
        },
        exclude_companies: {
          type: "array",
          description: "Companies to exclude from results",
          examples: ["Competitors Inc", "Old Company"]
        },
        company_filter: {
          type: "string",
          options: ["current", "past", "both"],
          default: "current",
          description: "Filter by current, past, or both company experiences"
        },
        current_company_only: {
          type: "boolean",
          default: true,
          description: "Return only profiles with current company matches"
        },
        match_experience: {
          type: "string",
          options: ["current", "past", "both"],
          default: "current",
          description: "Match job title and company in same experience period"
        },
        domain: {
          type: "array",
          max_items: 50,
          description: "Company domain names",
          examples: ["microsoft.com", "google.com"]
        },
        years_of_experience: {
          type: "array",
          description: "Years of experience ranges",
          examples: ["1_2", "3_5", "6_10", "10"]
        },
        years_in_current_role: {
          type: "array", 
          description: "Years in current role ranges",
          examples: ["1_2", "3_5", "6_10", "10"]
        },

        // Location & Industry
        location: {
          type: "array",
          max_items: 50,
          description: "Geographic locations",
          examples: ["New York", "San Francisco", "London", "Remote"]
        },
        industry: {
          type: "array",
          max_items: 50,
          description: "Industry sectors",
          examples: ["Computer Software", "Financial Services", "Healthcare", "Marketing"]
        },
        company_size: {
          type: "array",
          description: "Company size ranges by employee count",
          examples: ["1_10", "11_50", "51_200", "201_500", "501_1000", "1001_5000", "5001+"]
        },

        // Education & Skills
        education: {
          type: "array",
          max_items: 50,
          description: "Schools or degree types",
          examples: ["Harvard University", "Stanford", "MBA", "Computer Science"]
        },
        skills: {
          type: "array",
          max_items: 50,
          description: "Professional skills",
          examples: ["JavaScript", "Project Management", "Sales", "Marketing"]
        },

        // Search & Contact
        keyword: {
          type: "string",
          description: "Keyword to search across entire profile",
          example: "machine learning"
        },
        data_types: {
          type: "array",
          options: ["personal_email", "work_email", "phone"],
          description: "Required contact information types"
        },
        reveal_info: {
          type: "boolean",
          default: false,
          description: "Reveal contact information (consumes credits)"
        },

        // Pagination
        page: {
          type: "integer",
          default: 1,
          description: "Page number for pagination"
        },

        // Custom Enhancement Options
        enable_quality_verification: {
          type: "boolean",
          default: false,
          description: "Enable FREE quality scoring and verification"
        },
        sort_by_quality: {
          type: "boolean",
          default: false,
          description: "Sort results by quality score (requires quality verification)"
        }
      },
      examples: {
        tech_executives: {
          job_title: ["CEO", "CTO", "VP Engineering"],
          company: ["Microsoft", "Google", "Apple"],
          location: ["San Francisco", "Seattle", "New York"],
          skills: ["Leadership", "Strategy"],
          company_size: ["1001_5000", "5001+"],
          enable_quality_verification: true
        },
        marketing_professionals: {
          job_title: ["Marketing Manager", "Director of Marketing", "CMO"],
          industry: ["Computer Software", "E-commerce"],
          skills: ["Digital Marketing", "Content Marketing"],
          years_of_experience: ["3_5", "6_10"],
          location: ["Remote", "New York", "Los Angeles"],
          enable_quality_verification: true
        },
        startup_founders: {
          job_title: ["Founder", "CEO", "Co-Founder"],
          company_size: ["1_10", "11_50"],
          education: ["Stanford", "Harvard", "MIT"],
          keyword: "startup entrepreneur",
          enable_quality_verification: true,
          sort_by_quality: true
        }
      }
    }
  };

  res.json(availableFilters);
});

export default router;
