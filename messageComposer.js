const Moment = require("moment");

module.exports = function({
	stop,
	items // [ { route, remain, exact }, ... ]
}) {
	if (!Array.isArray(items)) {
		return null;
	}

	let rowsStr;
	if (items.length === 0) {
		rowsStr = `${route}\t\t\t\t\t\t⏳ 未有班次 ⏳`;
	} else {
		rowsStr = items.map(({ route, remain, exact }) => `${route}\t\t\t\t\t\t${remain} 分鐘\t_(exact)_`).join("\n");
	}
	const textContent = `*${stop}*\n\n${rowsStr}`

	return ({
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": textContent
		}
	});

	// {blocks: [ {}, {}, ... ] }
};