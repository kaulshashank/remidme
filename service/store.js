/**
 * RemindMe Database
 * @description TODO
 */
const fs = require("fs");

class JSONStore {

	constructor() {
		this.path = process.env.REMINDME_STORE_LOC || "/default/to/be/decided/as/per/operating/system";
		if (!fs.existsSync(this.path)) fs.writeFileSync(this.path, JSON.stringify({}, null, 2));
	}

	/**
	 * generateUID
	 * @description Returns a unique id of the format:
	 * `RME-(1000-2000)-(2000-3000)-(3000-4000)`
	 */
	generateUID() {
		return "RME-"
			+ String(Math.floor(Math.random() * 1000) + 1000) // Between 1000-2000
			+ "-"
			+ String(Math.floor(Math.random() * 1000) + 2000) // Between 2000-3000
			+ "-"
			+ String(Math.floor(Math.random() * 1000) + 3000); // and so on...
	}

	/**
	 * writeToStore
	 * @description Updates the store with new values.
	 * @param {Object | undefined} notificationObject : Notification object created by parser
	 * @returns Promise
	 * 		on succesful creation (resolution): Returns UID of created reminder
	 * 		on errors (rejection): Returns the error (must be caught)
	 */
	writeToStore(notificationObject) {
		return new Promise((resolve, reject) => {
			if (typeof notificationObject === 'undefined'
				|| Object.keys(notificationObject).length === 0) {
				reject(new Error("[STORE] Invalid notification object."));
			}

			const currentStore = require(this.path);
			const newUID = this.generateUID();
			const updatedStore = Object.assign(currentStore, { [newUID]: notificationObject });

			fs.writeFile(this.path, JSON.stringify(updatedStore, null, 2), (err) => {
				if (err) {
					reject(err);
				}
				resolve(newUID);
			});
		});
	}

	/**
	 * readFromStore
	 * @description Fetches reminders from store.
	 * @param {string | undefined} uid : UID entered by user
	 * @returns If uid is specified it will return just the notification object 
	 * otherwise it will return the entire store.
	 */
	readFromStore(uid) {
		const allReminders = require(this.path);
		if (typeof uid === "string") {
			return allReminders[uid];
		} else {
			return allReminders;
		}
	}

	/**
	 * deleteFromStore
	 * @description Deletes reminders from store.
	 * @param {string | undefined} uid : UID entered by user
	 * @returns undefined | error
	 */
	deleteFromStore(uid) {
		return new Promise((resolve, reject) => {
			if (typeof uid === "string") {
				const currentStore = require(this.path);

				delete currentStore[uid];

				fs.writeFile(this.path, JSON.stringify(currentStore, null, 2), (err) => {
					if (err) {
						reject(err);
					}
					resolve();
				});
			} else {
				fs.writeFile(this.path, JSON.stringify({}, null, 2), (err) => {
					if (err) {
						reject(err);
					}
					resolve();
				});
			}
		});
	}
}

module.exports = new JSONStore();