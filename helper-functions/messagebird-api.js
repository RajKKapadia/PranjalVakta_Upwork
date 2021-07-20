const sendMessage = (ACCESS_KEY, TO, FROM, MESSAGE) => {

    const messagebird = require('messagebird')(ACCESS_KEY);

    let params = {
        to: TO,
        from: FROM,
        type: 'text',
        content: {
            text: MESSAGE
        },
    };

    try {
        messagebird.conversations.send(params, (error, response) => {
            if (error) {
                console.log(`Error at sendMessage --> ${error}`);
            } else {
                console.log(response);
            }
        });
    } catch (error) {
        console.log(`Error at sendMessage --> ${error}`);
    }
};

module.exports = {
    sendMessage
};