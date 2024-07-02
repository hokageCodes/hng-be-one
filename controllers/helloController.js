const axios = require('axios');
require("dotenv").config();

exports.sayHello = async (req, res) => {
  const visitorName = req.query.visitor_name;

  if (!visitorName) {
    return res.status(400).json({ msg: 'Visitor\'s name is required' });
  }

  let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (clientIp.includes(',')) {
    clientIp = clientIp.split(',')[0];
  }
  clientIp = clientIp.split(':')[0];
  console.log(clientIp)

  try {
    // Get location and weather information
    const locationResponse = await axios.get(`https://ipinfo.io/${clientIp}?token=${process.env.IP_TOKEN}`);
    const location = locationResponse.data.city;

    const weatherResponse = await axios.get(`https://api.weatherbit.io/v2.0/current?city=${location}&key=${process.env.KEY}`);
    const temperature = weatherResponse.data.data[0].temp;

    // Prepare response
    const response = {
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}.`
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request.');
  }
};