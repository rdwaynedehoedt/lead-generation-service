const axios = require('axios');

async function debugAPICall() {
  try {
    console.log('Testing exact API call that our service should make...');
    
    // This is exactly what our service should be doing
    const response = await axios.get('https://api.contactout.com/v1/people/decision-makers', {
      params: {
        name: 'Microsoft',
        reveal_info: false
      },
      headers: {
        'authorization': 'basic',
        'token': process.env.CONTACTOUT_API_KEY || 'your_api_key_here'
      }
    });
    
    console.log('Raw API Response:');
    console.log('Status:', response.data.status_code);
    console.log('Total Results:', response.data.metadata?.total_results);
    console.log('Profiles Count:', Object.keys(response.data.profiles || {}).length);
    console.log('First Profile:', Object.values(response.data.profiles || {})[0]?.full_name);
    
    // Test our exact conversion logic
    const profiles = response.data.profiles || {};
    const converted = Object.entries(profiles).map(([url, profile]) => ({
      ...profile,
      linkedin_url: url
    }));
    
    console.log('\nAfter our conversion:');
    console.log('Converted Count:', converted.length);
    console.log('First Converted:', converted[0]?.full_name);
    
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
  }
}

debugAPICall();
