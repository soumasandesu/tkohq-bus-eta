const KMB = require("./kmb.js");
const NWFB = require("./nwfb.js");

module.exports = {
	"fs_298e": {
		stop: "fs",
	    stopName: "大赤沙消防局",
		route: "298e",
	    routeName: "298E",
		func: () => KMB({
	        route: "298E",
	        bound: "1",
	        stop: "CH31-S-0500-0",
	        stop_seq: "8",
	    }),
	},
    "fs_797m": {
    	stop: "fs",
	    stopName: "大赤沙消防局",
    	route: "797m",
	    routeName: "797M",
		func: () => NWFB({
	        route: "797M",
	        stop: "002921",
	    }),
	},
    "lp_290b": {
    	stop: "lp",
	    stopName: "日出康城領都",
    	route: "290b",
	    routeName: "290B",
		func: () => KMB({
	        route: "290B",
	        bound: "1",
	        stop: "WA21-N-0800-0",
	        stop_seq: "6",
	    }),
	},
	"lp_290x": {
		stop: "lp",
		stopName: "日出康城領都",
		route: "290x",
		routeName: "290X",
		func: () => KMB({
		    route: "290X",
		    bound: "1",
		    stop: "WA21-N-0800-0",
		    stop_seq: "3",
		}),
	},
	"lp_298e": {
		stop: "lp",
		stopName: "日出康城領都",
		route: "298e",
		routeName: "298E",
		func: () => KMB({
		    route: "298E",
		    bound: "1",
		    stop: "WA21-N-0800-0",
		    stop_seq: "15",
		}),
	},
	"lp_796x": {
		stop: "lp",
		stopName: "日出康城領都",
		route: "796x",
		routeName: "796X",
		func: () => NWFB({
		    route: "796X",
		    stop: "003329",
		}),
	},
	"lp_797m": {
		stop: "lp",
		stopName: "日出康城領都",
		route: "797m",
		routeName: "797M",
		func: () => NWFB({
		    route: "797M",
		    stop: "003329",
		}),
	},
};