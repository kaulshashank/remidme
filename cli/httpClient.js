const axios = require("axios");

// function(param) -> return value
/**
 *  Should create reminder
 * createReminder(taskObject) -> Promise<{ taskId }> 
 * 
 * This function should take a task object ({task, type, duration}) and
 * return a Promise that 
 * 	on resolution: returns an object containing the taskId
 * 	on rejection: returns the error that caused the rejection
 */
const createReminder = function () { }

/**
 *  Should fetch all reminders
 * fetchReminders() -> Promise<{reminders: Array<{id, task, type, duration}>}> 
 * 
 * This function that takes no parameters and returns a Promise that 
 * 	on resolution: returns an array containing objects of the form { id, task, type, duration}
 * 	on rejection: returns the error that caused the rejection
 */
const fetchReminders = function () { }

/**
 *  Should delete a reminder
 * deleteReminder(taskId) -> Promise<void>
 * 
 * This function that takes no parameters and returns a Promise that 
 * 	on resolution: returns void if succesfully deleted. Should always reject if not able to delete.
 * 	on rejection: returns the error that caused the rejection
 */
const deleteReminder = function () { }

module.exports = {
	createReminder,
	fetchReminders,
	deleteReminder
};