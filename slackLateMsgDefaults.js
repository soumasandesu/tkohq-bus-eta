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

        console.log("on time, ret now")
        res.status(200).send(msg).end();
    } catch (_) {
        console.log(`too late, ret to ${responseUrl} later`);

        res.status(200)
            // .send({
            //     "blocks": [
            //         {
            //             "type": "section",
            //             "text": {
            //                 "type": "mrkdwn",
            //                 "text": "*查詢巴士到站時間*"
            //             }
            //         }
            //     ]
            // })
            .end();

        const msg = await asyncMsgBodySupplier();
        return Fetch(responseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(msg),
        })
            .then(res => res.text())
            .then(text => `ret to ${responseUrl} done, res = ${text}`);
    }
};