const ApiCache = require("apicache");
const Express = require("express");
const Fetch = require("node-fetch");

const Cached = require("./cached.js");
const GroupBy = require("./groupBy.js");
const HelpDoc = require("./help.json");
const MessageComposer = require("./messageComposer.js");
const MomentDiff = require("./momentDiff.js");
const Routes = require("./routes.js");
const SlackCheck = require("./slackCheck.js");
const SlackLateMsgDefaults = require("./slackLateMsgDefaults.js");

const app = Express();
const cache = ApiCache.options({
    headers: {
        'cache-control': 'no-cache',
    },
}).middleware;

app.get('/', (req, res) => {
    res.json("ok");
});

// ===

const getStopRouteInfo = async function(_stop, _route) {
    const allRoutesInStop = Object.values(Routes)
        .filter(({ stop, route }) => 
            (_stop === "*" || stop === _stop.toLowerCase())
            && (_route === "" || route === _route.toLowerCase())
        );

    if (allRoutesInStop.length === 0) {
        res.send({
            response_type: "ephemeral",
            text: "❌ 路線-巴士站 配搭不可用",
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

    return { blocks: msgBlocks };
};

const getStopRouteInfoAndRespond = async function(req, res, _stop, _route) {
    try {
        const stopRouteInfoMsg = await getStopRouteInfo(_stop, _route);

        res.send(stopRouteInfoMsg).end();
    } catch (e) {
        console.error(e);
        res.status(500).send({
            response_type: "ephemeral",
            text: "Error: " + e.message,
            error: e,
        }).end();
    }
}

app.get('/slack', cache('30 seconds'), async (req, res) => {
    console.debug("Slack called: ", JSON.stringify(req.query));

    const { text = "", token: slackToken, response_url: responseUrl } = req.query;
	
	if (!SlackCheck(slackToken)) {
		res.status(403).send({
            response_type: "ephemeral",
            text: "Forbidden",
        }).end();
		return;
	}

    const [ stop = "", route = "" ] = text.split(" ");
	if (stop.length === 0 && route.length === 0) {
		res.status(200).send(HelpDoc).end();
		return;
	}

    SlackLateMsgDefaults(req, res, () => getStopRouteInfo(stop, route));
});

app.get('/:stop/:route', async (req, res) => {
    const { d: debug } = req.query;
    if (debug !== "hello") {
        res.status(204).end();
        return;
    }

    const { stop, route } = req.params;
    await getStopRouteInfoAndRespond(req, res, stop, route);
});

app.get('/:stop/', async (req, res) => {
    const { d: debug } = req.query;
    if (debug !== "hello") {
        res.status(204).end();
        return;
    }

    const { stop } = req.params;
    await getStopRouteInfoAndRespond(req, res, stop, undefined);
});

// ===

app.get('*', (req, res) => {
    res.status(204).end();
});

app.listen(process.env.PORT || 3000, err => {
    if (err) throw err;
    console.log('Server is running...');
});