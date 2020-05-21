const Delay = require("delay");
const Fetch = require("node-fetch");

module.exports = async function(req, res, asyncMsgBodySupplier, responseUrl) {
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

    try {
        const msg = await Promise.race([
            asyncMsgBodySupplier,
            Delay.reject(1000)
        ]);
        res.status(200).send(msg).end();
    } catch (_) {
        res.status(200).send({
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "_Loading..._"
                    }
                }
            ]
        }).end();

        const msg = await asyncMsgBodySupplier();
        const fetch = await Fetch(responseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: msg
        });
        return fetch;
    }
};