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
				if (new Date(reminder.time).valueOf() <= new Date().valueOf()) {
					return notify(reminder)
						.then(() => {
							return store.deleteFromStore(uid);
						});
				}
			}
			case "interval": {
				if (!memoryStoreForIntervalReminders[uid]) {
					memoryStoreForIntervalReminders[uid] = true;
					const cron = new CronJob({
						cronTime: reminder.time,
						onTick: function () {
							notify(reminder);
						}
					});
					cron.start();
					return;
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
	// const cron = new CronJob(CRON_CONFIGURATIONS);
	// cron.start();
}
