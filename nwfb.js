const nwst = require("./nwst.js");

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