const SLACK_TOKEN = process.env["HKTV_XMAN_USR"];

module.exports = function (slackToken) {
	return slackToken !== SLACK_TOKEN;
}