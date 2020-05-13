const express = require("express");
const apicache = require("apicache");

const SlackCheck = require("./slackCheck.js");
const Cached = require("./cached.js");
const Routes = require("./routes.js");
const MomentDiff = require("./momentDiff.js");
const MessageComposer = require("./messageComposer.js");

const app = express();
const cache = apicache.options({
    headers: {
        'cache-control': 'no-cache',
    },
}).middleware;

app.get('/', (req, res) => {
    res.json("ok");
});

// ===

const getStopRouteInfo = async function(req, res, _stop, _route) {
    try {
        const routeKey = `${_stop}_${_route}`.toLowerCase();
        const route = Routes[routeKey];
        if (typeof route === "undefined") {
            res.status(400).send({
                response_type: "client err",
                text: "❌ Bus stop with specified route unavailable.",
            }).end();
            return;
        }

        const { func, stopName, routeName } = route;
        const entries = await Cached(routeKey, func);

        const msgBlock = MessageComposer({
            stop: stopName, 
            routes: [
                {
                    route: routeName,
                    etaItems: entries.map(m => (
                        {
                            remain: MomentDiff(m),
                            exact: m,
                        }
                    )),
                },
            ],
        });

        res.status(200).send({ blocks: [ msgBlock ] }).end();
    } catch (e) {
        console.error(e);
        res.status(500).send({
            response_type: "server err",
            text: "Error: " + e.message,
            error: e,
        }).end();
    }
}

app.get('/slack', cache('30 seconds'), async (req, res) => {
    const { text, token: slackToken } = req.query;
	
	if (!SlackCheck(slackToken)) {
		res.status(403).send({
            response_type: "client err",
            text: "Forbidden",
        }).end();
		return;
	}

    const [ stop, route ] = (text || []).split(" ");
    await getStopRouteInfo(req, res, stop, route);
});

app.get('/:stop/:route', async (req, res) => {
    const { stop, route, d: debug } = req.params;
    if (debug !== "hello") { res.status(204).end(); }
    await getStopRouteInfo(req, res, stop, route);
});

// ===

app.get('*', (req, res) => {
    res.status(204).end();
});

app.listen(process.env.PORT || 3000, err => {
    if (err) throw err;
    console.log('Server is running...');
});