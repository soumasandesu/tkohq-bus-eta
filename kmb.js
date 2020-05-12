const Fetch = require("node-fetch");
const Moment = require("moment");

module.exports = function({
	route,
	bound,
	stop,
	stop_seq,
}) {
	const instant = (new Date()).valueOf();

	const url = `https://cp1.gotowhere.ga/etav3.kmb.hk/?action=geteta&lang=tc&route=${route}&bound=${bound}&stop=${stop}&stop_seq=${stop_seq}&_=${instant}`;

	return Fetch(url, {
		method: "GET",
		headers: {
			"Dev-github": "soumasandesu",
			"Dev-tg": "souma_san_desu",
			"Dev-call-freq": "max=2/mins;cache-enabled",
			"Accep": "application/json",
			"Origin": "https://www.gotowhere.ga",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0",
			"Referer": "https://www.gotowhere.ga/",
		}
	})
		.then(res => res.json())
		// list of strDate("2020-05-12 16:28:17")
		.then(json => 
			json.response
				.map(eta => eta.ex)
				.map(strDate => 
					Moment(strDate, "YYYY-MM-DD HH:mm:ss")
						// .utcOffset(8)
						// .subtract(8, "hours")
				)
		);
};