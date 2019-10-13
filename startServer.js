const server = require("./service/httpServer.js");

/**
 * Should start the notifications server
 */
server()
	.then(function () {
		console.log("[service] RemindMe notifications server started.");
	})
	.catch(function (err) {
		console.error("[service] An error occured before the server could be started.");
		console.error(err);
	});