const Fetch = require("node-fetch");
const Moment = require("moment");

module.exports = function({
	company, // CTB, NWFB
	route,
	stop
}) {
	const instant = (new Date()).valueOf();

	const url = `https://rt.data.gov.hk/v1/transport/citybus-nwfb/eta/${company}/${stop}/${route}?_=${instant}`;

	return Fetch(url, {
		method: "GET",
		headers: {
			"Accep": "application/json",
		}
	})
		.then(res => res.json())
		.then(json => json.data.map(d => d.eta).map(strDate => Moment(strDate).utcOffset(8)));
		// list of strDate("2020-05-15T12:09:00+08:00")
};