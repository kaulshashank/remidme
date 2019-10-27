const axios = require("axios");

axios.defaults.baseURL = "http://localhost:3000/"

/**
 * Create a reminder
 * createReminder(taskObject) -> Promise<{ taskId }> 
 * 
 * This function should take a task object ({task, type, time}) and
 * return a Promise that 
 * 	on resolution: returns an object containing the taskId
 * 	on rejection: returns the error that caused the rejection
 */
const createReminder = function (notificationObject) {
	return axios.post("/reminder", notificationObject)
		.then(function (response) {
			return response.data.taskId;
		});
}

/**
 * Fetch all reminders
 * fetchReminders() -> Promise<Reminder Store>
 * 
 * This function that takes no parameters and returns a Promise that 
 * 	on resolution: Reminder Store
 * 	on rejection: returns the error that caused the rejection
 */
const fetchReminders = function () {
	return axios.get("/reminder")
		.then(function (response) {
			return response.data;
		});
}

/**
 * Delete a reminder
 * deleteReminder(taskId) -> Promise<void>
 * 
 * This function that takes no parameters and returns a Promise that 
 * 	on resolution: returns void if succesfully deleted. Should always reject if not able to delete.
 * 	on rejection: returns the error that caused the rejection
 */
const deleteReminder = function (UID) {
	return axios.delete(`/reminder?id=${UID}`)
		.then(function (response) {
			return response.data;
		})
		.catch(function(err) {
			console.log(`Unable to delete reminder: ${UID}`);
			console.log(`Please check if it exists using '--list' or '-l'`);
		})
}

module.exports = {
	createReminder,
	fetchReminders,
	deleteReminder
};