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

app.get('/:stop/:route', cache('30 seconds'), async (req, res) => {

    try {
        const routeKey = `${req.params.stop}_${req.params.route}`;
        const route = Routes[routeKey];
        if (typeof route === "undefined") {
            res.status(400).end();
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
    
});

// ===

app.get('*', (req, res) => {
    res.status(204).end();
});

app.listen(process.env.PORT || 3000, err => {
    if (err) throw err;
    console.log('Server is running...');
});