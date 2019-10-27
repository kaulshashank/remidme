/**
 * RemindMe Notifier Module
 * @description Issues notifications to operating systems.
 */
const notifier = require('node-notifier');

const issueNotification = msg => {
	return new Promise((resolve, reject) => {
		if (!msg) {
			reject(new Error('No Notification Found!'));
		} else {
			notifier.notify(
				{
					title: 'You have a reminder!',
					message: msg,
					sound: true
				},
				(err, response) => {
					// Response is response from notification
					if (err) {
						reject(err);
					} else {
						resolve(response);
					}
				}
			);
		}
	});
}

const notify = notificationObject => {
	if (typeof notificationObject === 'undefined'
		|| Object.keys(notificationObject).length === 0) {
		Promise.reject(new Error('No Notification Object Found!'))
	} else {
		return issueNotification(notificationObject.task);
	}
}

module.exports = notify;