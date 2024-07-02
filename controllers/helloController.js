const axios = require('axios');
require('dotenv').config();

exports.sayHello = async (req, res) => {
  const visitorName = req.query.visitor_name;

  if (!visitorName) {
    console.error("Visitor's name is required");
    return res.status(400).json({ msg: 'Visitor\'s name is required' });
  }

  // Get the client's IP address
  let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (clientIp.includes(',')) {
    clientIp = clientIp.split(',')[0];
  }
  clientIp = clientIp.split(':').pop();

  console.log(`Client IP: ${clientIp}`);

  try {
    // Get location information
    const locationResponse = await axios.get(`https://ipinfo.io/${clientIp}?token=${process.env.IP_TOKEN}`);
    console.log('Location response data:', locationResponse.data);

    const location = locationResponse.data.city || 'Unknown';
    if (location === 'Unknown') {
      console.error('Could not determine location for IP:', clientIp);
    }

    // Get weather information from OpenWeatherMap
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_KEY}&units=metric`);
    console.log('Weather response data:', weatherResponse.data);

    const temperature = weatherResponse.data.main.temp;

    // Prepare response
    const response = {
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}.`
    };

    res.json(response);
  } catch (error) {
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    res.status(500).send('An error occurred while processing your request.');
  }
};
