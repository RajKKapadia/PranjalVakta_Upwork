// external packages
const express = require('express');

// Start the webapp
const webApp = express();

// Webapp settings
webApp.use(express.urlencoded({
    extended: true
}));
webApp.use(express.json());

// Server Port
const PORT = process.env.PORT || 5000;

// import all routes
const homeRoute = require('../routes/homeRoute');
const messageBirdRoute = require('../routes/messageBirdRoute');
const webhookRoute = require('../routes/webhookRoute');

// use routes
webApp.use(homeRoute.router);
webApp.use(messageBirdRoute.router);
webApp.use(webhookRoute.router);

// Start the server
webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});

module.exports = webApp;