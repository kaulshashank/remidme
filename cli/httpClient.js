const axios = require("axios");

axios.defaults.baseURL = "http://localhost:3000/"

// function(param) -> return value
/**
 *  Should create reminder
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
		})
		.catch(function (err) {
			console.error("An error occured while creating your reminder.");
			return Promise.reject(err);
		});
}

/**
 *  Should fetch all reminders
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
		})
		.catch(function (err) {
			console.error("An error occured while fetching your reminders.");
			return Promise.reject(err);
		});
}

/**
 *  Should delete a reminder
 * deleteReminder(taskId) -> Promise<void>
 * 
 * This function that takes no parameters and returns a Promise that 
 * 	on resolution: returns void if succesfully deleted. Should always reject if not able to delete.
 * 	on rejection: returns the error that caused the rejection
 */
const deleteReminder = function () {
	return axios.delete("/reminder")
		.then(function (response) {
			return response.data;
		})
		.catch(function (err) {
			console.error("An error occured while deleting your reminder.");
			return Promise.reject(err);
		});
}

module.exports = {
	createReminder,
	fetchReminders,
	deleteReminder
};