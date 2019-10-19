const { CronJob } = require("cron");

const store = require("./store.js");
const notify = require("./notifier.js");

/**
 * Memory store for jobs that are being run by the service.
 * Prevents the same job from being started more than once.
 */
const memoryStoreForIntervalReminders = {};

/**
 * Tick function for master cron job.
 * @description Reads store and issues pending one-time reminders or
 * starts child jobs for recurring reminds.
 * 
 */
function run() {
	const currentStore = store.readFromStore();

	for (uid in currentStore) {
		const reminder = currentStore[uid];
		switch (reminder.type) {
			case "timeout": {
				/**
				 * Check if any reminder has passed it's
				 * due date, trigger the notification
				 * accordingly and then delete it so
				 * it isn't accidentally sent twice.
				 */
				if (new Date(reminder.time).valueOf() <= new Date().valueOf()) {
					return notify(reminder)
						.then(() => {
							return store.deleteFromStore(uid);
						});
				}
				continue;
			}
			case "interval": {
				/**
				 * If reminder is already running as
				 * as a cron job then check if it might
				 * be issued for deletion by the user. If so then
				 * stop the job and delete from store.
				 * Otherwise, start the job for the reminder.
				 */
				if (!memoryStoreForIntervalReminders[uid]) {
					const cron = new CronJob({
						cronTime: reminder.time,
						onTick: function () {
							notify(reminder);
						}
					});
					memoryStoreForIntervalReminders[uid] = cron;
					return cron.start();

				} else if (memoryStoreForIntervalReminders[uid] && reminder.issuedForDelete) {

					const cron = memoryStoreForIntervalReminders[uid];
					cron.stop();
					return store.deleteFromStore(uid)
						.then(function () {
							delete memoryStoreForIntervalReminders[uid];
						});
				}
				continue;
			}
		}
	}
}

const CRON_CONFIGURATIONS = {
	cronTime: '* * * * * *',
	onTick: run,
	runOnInit: true
};

module.exports = async function () {
	const cron = new CronJob(CRON_CONFIGURATIONS);
	cron.start();
}
