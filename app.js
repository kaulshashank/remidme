const parser = require("./parser.js");

const task = parser(process.argv);

console.log(task);