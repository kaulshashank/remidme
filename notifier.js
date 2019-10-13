const notifier = require('node-notifier');

const reminderStore = {};

const generateUID = () => {
	return Math.floor(Math.random() * 1000);
};

const issueNotification = msg => {
	return new Promise((resolve, reject) => {
		if (!msg) {
			reject(new Error('No Notification Found!'));
		} else {
			notifier.notify(
				{
					title: 'Notification',
					message: msg,
					// icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
					sound: true, // Only Notification Center or Windows Toasters
					wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait
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
	return new Promise((resolve, reject) => {
		if (typeof notificationObject === 'undefined'
			|| Object.keys(notificationObject).length === 0) {
			reject(new Error('No Notification Object Found!'))
		} else {
			if (notificationObject.type == "interval") {
				const timeoutObject = setInterval(() => {
					issueNotification(notificationObject.task)
						.then(resolve)
						.catch(reject);
				}, notificationObject.time);

				reminderStore[generateUID()] = timeoutObject;

			} else if (notificationObject.type == "timeout") {
				//timeoutID will be used to clear notifications
				const timeoutObject = setTimeout(() => {
					issueNotification(notificationObject.task)
						.then(resolve)
						.catch(reject);
				}, notificationObject.time);

				reminderStore[generateUID()] = timeoutObject;
			} else {
				reject(new Error('Notification Type undefined!'));
			}
		}
	});
}

module.exports = notify;