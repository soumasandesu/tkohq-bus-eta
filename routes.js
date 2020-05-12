const KMB = require("./kmb.js");
const NWFB = require("./nwfb.js");

module.exports = {
	"fs_298e": {
		func: () => KMB({
	        route: "298E",
	        bound: "1",
	        stop: "CH31-S-0500-0",
	        stop_seq: "8",
	    }),
	    stopName: "大赤沙消防局",
	    routeName: "298E",
	},
    "fs_797m": {
		func: () => NWFB({
	        route: "797M",
	        stop: "002921",
	    }),
	    stopName: "大赤沙消防局",
	    routeName: "797M",
	},
    "lp_290b": {
		func: () => KMB({
	        route: "290B",
	        bound: "1",
	        stop: "WA21-N-0800-0",
	        stop_seq: "6",
	    }),
	    stopName: "日出康城領都",
	    routeName: "290B",
	},
	"lp_290x": {
		func: () => KMB({
		    route: "290X",
		    bound: "1",
		    stop: "WA21-N-0800-0",
		    stop_seq: "3",
		}),
		stopName: "日出康城領都",
		routeName: "290X",
	},
	"lp_298e": {
		func: () => KMB({
		    route: "298E",
		    bound: "1",
		    stop: "WA21-N-0800-0",
		    stop_seq: "15",
		}),
		stopName: "日出康城領都",
		routeName: "298E",
	},
	"lp_796x": {
		func: () => NWFB({
		    route: "796X",
		    stop: "003329",
		}),
		stopName: "日出康城領都",
		routeName: "796X",
	},
	"lp_797m": {
		func: () => NWFB({
		    route: "797M",
		    stop: "003329",
		}),
		stopName: "日出康城領都",
		routeName: "797M",
	},
};