const express = require("express");
const apicache = require("apicache");

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
        const routeKey = `${_stop}_${_route}`;
        const route = Routes[routeKey];
        if (typeof route === "undefined") {
            res.status(400).send("stop / route undef").end();
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

        res.send({ blocks: [ msgBlock ] }).end();
    } catch (e) {
        console.error(e);
        res.status(500).send(e).end();
    }
}

app.get('/slack', async (req, res) => {
    const { text } = req.query;
    const [ stop, route ] = (text || []).split(" ");
    await getStopRouteInfo(req, res, stop, route);
});

app.get('/:stop/:route', cache('30 seconds'), async (req, res) => {
    const { stop, route } = req.params;
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