const parser = require("./parser.js");
const notifier = require("./notifier.js");

const task = parser(process.argv);

notifier(task);