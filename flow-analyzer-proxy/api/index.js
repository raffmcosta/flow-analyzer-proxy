// Vercel Serverless Function
module.exports = async (req, res) => {
  console.log('🚀 Request received:', req.method, req.url);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key, anthropic-version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('✅ Preflight handled');
    return res.status(200).end();
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed',
      method: req.method,
      message: 'Use POST request'
    });
  }

  try {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      console.log('❌ Missing API key');
      return res.status(400).json({ error: 'Missing x-api-key header' });
    }

    console.log('📤 Forwarding to Anthropic API...');
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    
    console.log('✅ Anthropic response:', response.status);
    
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error('💥 Proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
