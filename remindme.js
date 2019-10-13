const parser = require("./cli/parser.js");
const client = require("./cli/httpClient.js");

const userInput = parser(process.argv);

/**
 * Depending on `userInput` the functions below
 * should be called.
 */

// client.createReminder(userInput);

// client.fetchReminders();

// client.deleteReminder(taskId);