const Moment = require("moment");

module.exports = function(later, earlier = Moment()) {
	const diffMins = Moment.duration(later.diff(earlier)).asMinutes();
	return parseInt(Math.ceil(diffMins));
}