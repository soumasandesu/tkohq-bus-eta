const SLACK_TOKEN = process.env["SLACK_TOKEN"];

module.exports = function (slackToken) {
	return slackToken === SLACK_TOKEN;
}