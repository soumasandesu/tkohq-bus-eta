const nwst = require("./nwst_datagov.js");

module.exports = function(params) {
	return nwst({
		company: "NWFB",
		...params
		/*
		route,
		stop
		*/
	});
};