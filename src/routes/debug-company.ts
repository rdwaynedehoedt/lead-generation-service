import express from 'express';
import axios from 'axios';

const router = express.Router();

/**
 * Debug version - direct API call to isolate the issue
 */
router.get('/', async (req, res) => {
  try {
    const { company } = req.query;
    
    console.log('🐛 DEBUG: Starting company search for:', company);
    
    // Direct API call (exactly like our working test)
    const response = await axios.get('https://api.contactout.com/v1/people/decision-makers', {
      params: {
        name: company,
        reveal_info: false
      },
      headers: {
        'authorization': 'basic',
        'token': process.env.CONTACTOUT_API_KEY || (() => {
          throw new Error('CONTACTOUT_API_KEY environment variable is required');
        })()
      }
    });
    
    console.log('🐛 DEBUG: Raw API response received');
    console.log('🐛 DEBUG: Status:', response.data.status_code);
    console.log('🐛 DEBUG: Has profiles:', !!response.data.profiles);
    console.log('🐛 DEBUG: Profiles count:', Object.keys(response.data.profiles || {}).length);
    
    // Simple conversion
    const profiles = response.data.profiles || {};
    const employees = Object.entries(profiles).map(([url, profile]: [string, any]) => ({
      name: profile.full_name,
      job_title: profile.title,
      linkedin_url: url
    }));
    
    console.log('🐛 DEBUG: Converted employees:', employees.length);
    
    res.json({
      success: true,
      debug: true,
      data: {
        company_name: company,
        total_found: Object.keys(profiles).length,
        employees: employees.slice(0, 5), // Return first 5 for testing
        raw_response: {
          status: response.data.status_code,
          total_results: response.data.metadata?.total_results,
          profiles_count: Object.keys(profiles).length
        }
      }
    });
    
  } catch (error: any) {
    console.error('🐛 DEBUG: Error occurred:', error.message);
    console.error('🐛 DEBUG: Error response:', error.response?.data);
    
    res.status(500).json({
      success: false,
      debug: true,
      error: error.message,
      details: error.response?.data
    });
  }
});

export default router;
