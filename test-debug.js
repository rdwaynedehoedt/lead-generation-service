// Quick debug test
const axios = require('axios');

async function testOurAPI() {
  try {
    console.log('Testing our endpoint...');
    const response = await axios.get('http://localhost:5001/api/company-employees?company=Microsoft');
    console.log('Our API Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

async function testContactOutDirect() {
  try {
    console.log('\nTesting ContactOut directly...');
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
    console.log('ContactOut Response:', {
      status: response.data.status_code,
      total: response.data.metadata?.total_results,
      profiles: Object.keys(response.data.profiles || {}).length
    });
  } catch (error) {
    console.error('ContactOut Error:', error.response?.data || error.message);
  }
}

testOurAPI();
testContactOutDirect();
