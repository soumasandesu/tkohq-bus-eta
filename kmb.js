const Fetch = require("node-fetch");
const Moment = require("moment");

module.exports = function({
	route,
	bound,
	stop,
	stop_seq,
}) {
	const instant = (new Date()).valueOf();

	const url = `http://etav3.kmb.hk/?action=geteta&lang=tc&route=${route}&bound=${bound}&stop=${stop}&stop_seq=${stop_seq}&_=${instant}`;

	return Fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
		}
	})
		.then(res => res.json())
		// list of strDate("2020-05-12 16:28:17")
		.then(json => 
			json.response
				.map(eta => eta.ex)
				.map(strDate => 
					Moment.utc(strDate, "YYYY-MM-DD HH:mm:ss")
						.utcOffset(8)
						.subtract(8, "hours")
				)
		);
};