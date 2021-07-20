const express = require('express');
const router = express.Router();

// Handle handleWelcome
const handleWelcome = (req) => {

    let session = req.body.session;
    let fulfillmentText = JSON.parse(req.body.queryResult.fulfillmentText);
    let products_services = [];

    fulfillmentText.products_services.forEach(ps => {
        products_services.push(ps);
    })

    return {
        fulfillmentText: JSON.stringify(fulfillmentText),
        outputContexts: [
            {
                name: `${session}/contexts/session`,
                lifespanCount: 10,
                parameters: {
                    products_services: products_services
                }
            }
        ]
    };
};

// Handle handleServiceOption
const handleServiceOption = (req) => {

    let option = req.body.queryResult.parameters.option;

    let outputContexts = req.body.queryResult.outputContexts;

    let products_services;

    outputContexts.forEach(outputContext => {
        let session = outputContext.name;
        if (session.includes('/contexts/session')) {
            if (outputContext.hasOwnProperty('parameters')) {
                products_services = outputContext.parameters.products_services;
            }
        }
    });

    let ps = products_services[Number(option) - 1];

    return {
        fulfillmentText: JSON.stringify(
            {
                message: `Awesome! 😁 💯 We have received your interest in ${ps}. 👌. Someone from our sales team will contact you soon. Call us 📱 on 7033201989 now to speak regarding your requirements!`,
                products_services: [],
                logo: [],
                images: []
            }
        )
    };
};

router.post('/webhook', async (req, res) => {

    let action = req.body.queryResult.action;

    console.log('Webhook called.');
    console.log(`Action name --> ${action}`);
    console.log(`Session id --> ${req.body.session}`);

    let responseData = {};

    if (action === 'handleWelcome') {
        responseData = handleWelcome(req);
    } else if (action === 'handleServiceOption') {
        responseData = handleServiceOption(req);
    } else {
        responseData['fulfillmentText'] = `No action is set for the action ${action}`;
    }
    res.send(responseData);
});

module.exports = {
    router
};