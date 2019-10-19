const server = require("./service/httpServer.js");
const cron = require("./service/cron.js");
/**
 * Start the notifications service.
 */
Promise.all([server(), cron()])
	.then(function () {
		console.log("[service] RemindMe notifications service started.");
	})
	.catch(function (err) {
		console.error("[service] An error occured before the service could be started.");
		console.error(err);
	});