const express = require('express');
const Route = require('./routes/helloRoute');
const app = express();
require('dotenv').config();

app.use('/api', Route);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
