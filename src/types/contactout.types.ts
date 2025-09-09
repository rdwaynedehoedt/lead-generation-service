// ContactOut API Types and Interfaces
// Based on ContactOut API documentation

export interface ContactOutSearchParams {
  // Basic search parameters
  name?: string;
  job_title?: string | string[];
  company?: string | string[];
  location?: string | string[];
  industry?: string | string[];
  
  // Advanced job title filters
  exclude_job_titles?: string[];
  current_titles_only?: boolean;
  include_related_job_titles?: boolean;
  
  // Experience and skills
  skills?: string[];
  education?: string | string[];
  years_of_experience?: string | string[];  // e.g., "6_10", "10+"
  years_in_current_role?: string | string[];  // e.g., "1_3", "5+"
  
  // Company filters
  company_filter?: 'current' | 'previous' | 'both';
  exclude_companies?: string[];
  current_company_only?: boolean;
  domain?: string | string[];
  company_size?: string | string[];  // e.g., "1_10", "11_50", "51_200", "201_500", "501_1000", "1001_5000", "5001_10000", "10001+"
  
  // Advanced search
  keyword?: string;
  match_experience?: 'current' | 'previous' | 'both';
  
  // Data type preferences
  data_types?: ('personal_email' | 'work_email' | 'phone')[];
  reveal_info?: boolean;
  
  // Pagination and limits
  page?: number;
  page_size?: number;  // ContactOut uses page_size, not limit
  limit?: number;      // Keep for backward compatibility
  offset?: number;
  
  // Legacy parameters (deprecated but kept for compatibility)
  revenue?: string;
  technologies?: string[];
  keywords?: string[];
}

export interface ContactOutCompany {
  name: string;
  url?: string;
  linkedin_company_id?: number;
  domain: string;
  email_domain: string;
  overview?: string;
  type?: string;
  size?: number;
  country?: string;
  revenue?: number;
  founded_at?: number;
  industry?: string;
  headquarter?: string;
  website?: string;
  logo_url?: string;
  specialties?: string[];
  locations?: string[] | CompanyLocation[];
}

export interface CompanyLocation {
  city: string;
  line1?: string;
  line2?: string;
  state?: string;
  country: string;
  postalCode?: string;
  description?: string;
}

export interface ContactOutContact {
  // Profile identifiers
  id?: string;
  url?: string;
  li_vanity?: string;
  
  // Contact information
  email?: string[];
  work_email?: string[];
  personal_email?: string[];
  phone?: string[];
  
  // Personal information
  full_name: string;
  first_name?: string;
  last_name?: string;
  headline?: string;
  
  // Professional information
  title?: string;
  industry?: string;
  company: ContactOutCompany;
  location?: string;
  country?: string;
  
  // Profile details
  summary?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  certifications?: Certification[];
  publications?: Publication[];
  projects?: Project[];
  
  // Social profiles
  github?: string[];
  twitter?: string[];
  linkedin_url?: string;
  
  // Metadata
  followers?: number;
  profile_picture_url?: string;
  updated_at?: string;
  confidence_score?: number;
  
  // Contact availability (for search results)
  contact_availability?: {
    personal_email?: boolean;
    work_email?: boolean;
    phone?: boolean;
  };
  
  // Contact info (when reveal_info=true)
  contact_info?: {
    emails?: string[];
    personal_emails?: string[];
    work_emails?: string[];
    work_email_status?: Record<string, string>;
    phones?: string[];
  };
}

export interface Experience {
  start_date?: string;
  end_date?: string;
  start_date_year?: number;
  start_date_month?: number;
  end_date_year?: number;
  end_date_month?: number;
  title: string;
  summary?: string;
  locality?: string;
  company_name: string;
  linkedin_url?: string;
  is_current?: boolean;
}

export interface Education {
  field_of_study?: string;
  description?: string;
  start_date_year?: string | number;
  end_date_year?: string | number;
  degree?: string;
  school_name: string;
}

export interface Certification {
  name: string;
  authority?: string;
  license?: string;
  start_date_year?: number;
  start_date_month?: number;
  end_date_year?: number;
  end_date_month?: number;
}

export interface Publication {
  url?: string;
  title: string;
  description?: string;
  publisher?: string;
  authors?: string[];
  published_on_year?: number;
  published_on_month?: number;
  published_on_day?: number;
}

export interface Project {
  title: string;
  description?: string;
  start_date_year?: number;
  start_date_month?: number;
  end_date_year?: number;
  end_date_month?: number;
}

export interface ContactOutSearchResponse {
  status_code: number;
  metadata?: {
    page: number;
    page_size: number;
    total_results: number;
  };
  profiles?: Record<string, ContactOutContact> | ContactOutContact[];
}

export interface ContactOutEnrichResponse {
  status_code: number;
  profile?: ContactOutContact | ContactOutContact[];
}

export interface ContactOutCompanyResponse {
  status_code: number;
  companies?: Array<Record<string, ContactOutCompany>>;
}

export interface ContactOutBulkJobResponse {
  status: 'QUEUED' | 'SENT' | 'PROCESSING';
  job_id: string;
}

export interface ContactOutBulkResultResponse {
  data: {
    uuid: string;
    status: 'QUEUED' | 'SENT' | 'PROCESSING' | 'DONE';
    result?: Record<string, {
      emails?: string[];
      personal_emails?: string[];
      work_emails?: string[];
      phones?: string[];
    }>;
  };
}

export interface EmailVerificationResponse {
  status_code: number;
  data: {
    status: 'valid' | 'invalid' | 'accept_all' | 'disposable' | 'unknown';
  };
}

export interface ContactCheckerResponse {
  status_code: number;
  profile: {
    email?: boolean;
    phone?: boolean;
    email_status?: 'Verified' | 'Unverified' | null;
  };
}

export interface ContactOutUsageStats {
  status_code: number;
  period: {
    start: string;
    end: string;
  };
  usage: {
    count: number;
    quota: number;
    remaining?: number;
    over_quota?: number;
    phone_count: number;
    phone_quota: number;
    phone_remaining?: number;
    phone_over_quota?: number;
    search_count: number;
    search_quota: number;
    search_remaining?: number;
    search_over_quota?: number;
  };
}

// Error types
export interface ContactOutError {
  status_code: number;
  message: string;
  error?: string;
}

// API endpoint types
export type ContactOutEndpoint = 
  | 'linkedin/enrich'
  | 'email/enrich'
  | 'people/enrich'
  | 'people/linkedin'
  | 'people/search'
  | 'people/decision-makers'
  | 'domain/enrich'
  | 'company/search'
  | 'email/verify'
  | 'stats';

// Rate limiting configuration
export interface RateLimitConfig {
  people_search: number;        // 60 requests per minute
  contact_checker: number;      // 150 requests per minute
  other: number;               // 1000 requests per minute
}
