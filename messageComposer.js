const Moment = require("moment");

module.exports = function({
	stop,
	routes // [ { route, remain, exact }, ... ]
}) {
	if (!Array.isArray(routes) || routes.length === 0) {
		return null;
	}

	const allLines = routes.flatMap(({ route, etaItems }) => {
		if (typeof route === "undefined") {
			return null;
		}

		if (!Array.isArray(etaItems) || etaItems.length === 0) {
			return [
				({
					arrivalTime: Moment().add(1, "year"),
					text: `${route}\t\t\t\t\t\t⏳ 未有班次 ⏳`,
				})
			];
		}
		return etaItems.map(({ remain, exact }) => ({
			arrivalTime: exact,
			text: `${route}\t\t\t\t\t\t${remain} 分鐘\t_(${Moment(exact).format("HH:mm")})_`,
		}));
	})
		.filter(e => e)
		.sort((a, b) => new Moment(a.arrivalTime).format('YYYYMMDD') - new Moment(b.arrivalTime).format('YYYYMMDD'))
		.map(({ text }) => text)
		.join("\n");
	const textContent = `*${stop}*\n\n${allLines}`

	return ({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": textContent
		}
	});

	// {blocks: [ {}, {}, ... ] }
};