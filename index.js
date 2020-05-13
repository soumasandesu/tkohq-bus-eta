const express = require("express");
const apicache = require("apicache");

const SlackCheck = require("./slackCheck.js");
const Cached = require("./cached.js");
const Routes = require("./routes.js");
const MomentDiff = require("./momentDiff.js");
const GroupBy = require("./groupBy.js");
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
        const allRoutesInStop = Object.values(Routes)
            .filter(({ stop, route }) => 
                stop === _stop.toLowerCase()
                && (typeof _route === "undefined" || route === _route.toLowerCase())
            );

        if (allRoutesInStop.length === 0) {
            res.status(400).send({
                response_type: "client err",
                text: "❌ Bus stop with specified route unavailable.",
            }).end();
            return;
        }

        const routes = await Promise.all(allRoutesInStop
            .map(async ({ func, stop, route, stopName, routeName }) => ({
                stop: stopName,
                route: routeName,
                etaItems: (await Cached(`${stop}_${route}`, func)).map(m => (
                    {
                        remain: MomentDiff(m),
                        exact: m,
                    }
                )),
            })));

        const msgBlocks = Object.entries(GroupBy(routes, "stop")).map(([stop, routes]) => MessageComposer({ stop, routes }));

        res.send({ blocks: msgBlocks }).end();
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
    console.debug("Slack called: ", JSON.stringify(req.query, null, 2));

    const { text, token: slackToken, } = req.query;
	
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
    const { d: debug } = req.query;
    if (debug !== "hello") {
        res.status(204).end();
        return;
    }

    const { stop, route } = req.params;
    await getStopRouteInfo(req, res, stop, route);
});

app.get('/:stop/', async (req, res) => {
    const { d: debug } = req.query;
    if (debug !== "hello") {
        res.status(204).end();
        return;
    }

    const { stop } = req.params;
    await getStopRouteInfo(req, res, stop, undefined);
});

// ===

app.get('*', (req, res) => {
    res.status(204).end();
});

app.listen(process.env.PORT || 3000, err => {
    if (err) throw err;
    console.log('Server is running...');
});