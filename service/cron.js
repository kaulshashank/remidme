const { CronJob } = require("cron");

const store = require("./store.js");
const notify = require("./notifier.js");

const memoryStoreForIntervalReminders = {};

function run() {
	const currentStore = store.readFromStore();

	for (uid in currentStore) {
		const reminder = currentStore[uid];
		switch (reminder.type) {
			case "timeout": {
				if (new Date(reminder.duration).valueOf() <= new Date().valueOf())
					notify(reminder);
			}
			case "interval": {
				if (!memoryStoreForIntervalReminders[uid]) {
					memoryStoreForIntervalReminders[reminder.uid] = true;
					const cron = new CronJob({
						cronTime: reminder.duration,
						onTick: function () {
							notify(reminder);
						}
					});
					cron.start();
				}
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
	if (process.env.NODE_ENV !== "development") {
		const cron = new CronJob(CRON_CONFIGURATIONS);
		cron.start();
	}
}
