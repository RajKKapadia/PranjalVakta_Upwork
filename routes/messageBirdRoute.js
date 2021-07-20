const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const DIALOGFLOW_API = require('../helper-functions/dialogflow-api');
const MESSAGEBIRD_API = require('../helper-functions/messagebird-api');

router.post('/messagebird', async (req, res) => {

    let messageBody = req.body;

    if (messageBody.message.direction === 'sent') {
        console.log('Sent message came.');
        res.sendStatus(200);
    } else {
        console.log('A new message came.');
        console.log(`Message --> ${messageBody.message.content.text}`);
        console.log(`Sender id --> ${messageBody.message.from}`);

        // Your API
        let config = {
            method: 'post',
            url: process.env.CURL,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(messageBody)
        };

        let response, CREDENTIALS;

        try {
            response = await axios(config);
            CREDENTIALS = response.data.result;
        } catch (error) {
            console.log(`Error at Credential API --> ${error}`);
        }

        let intentData, data;

        try {
            intentData = await DIALOGFLOW_API.detectIntent(
                'en',
                messageBody.message.content.text,
                messageBody.message.from,
                // CREDENTIALS
                JSON.parse(process.env.CREDENTIALS)
            );

            data = JSON.parse(intentData.text);

        } catch (error) {
            console.log(`Error at detect intent --> ${error}`);
        }

        try {
            MESSAGEBIRD_API.sendMessage(
                // response.data.messagebird_access_key,
                process.env.MBAPI_KEY,
                messageBody.message.from,
                // messageBody.message.messagebird_messagebird_channel_id,
                process.env.MBCHANNEL_ID,
                data.message
            );
        } catch (error) {
            console.log(`Error at send message --> ${error}`);
        }

        // Your API
        let secondConfig = {
            method: 'post',
            url: process.env.CRMURL,
            headers: {
                'Content-Type': 'application/json'
            },
            data: messageBody
        };

        try {
            await axios(secondConfig);
        } catch (error) {
            console.log(`Error at CRM API.`);
        }
        
        res.sendStatus(200);
    }
});

module.exports = {
    router
};