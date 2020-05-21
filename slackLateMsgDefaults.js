const Delay = require("delay");
const PromiseValue = require("promise-value");

module.exports = function(req, res, asyncMsgBodySupplier, responseUrl) {
    const defaultMsgSupplier = async () => {
        await Delay(1000);
        return {
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "_Loading..._"
                    }
                }
            ]
        };
    };

    return Promise.race([
        asyncMsgBodySupplier,
        Delay.reject(1000)
    ])
        .then(msg =>
            res.status(200).send(msg).end()
        )
        .catch(fallBackMsg => {
            res.status(200).send(fallBackMsg).end();

            return asyncMsgBodySupplier.then(msg => 
                Fetch(responseUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: msg
                })
            );
        })
};