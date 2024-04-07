// Invoke 'strict' JavaScript mode
'use strict';

// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Load the 'express' module
const express = require('./middleware/express');

const config = require('./config/config');
const port = config.port || 3000;
// Create a new Express application instance
const app = express();

require('./middleware/routes')(app);

// Use the Express application instance to listen to the '3000' port
app.listen(port);

// Log the server status to the console
console.log('Server running at http://localhost:' + port);

// Use the module.exports property to expose our Express application instance for external usage
module.exports = app;