const notifier = require('./notifier');

const notificationObject = {
    task: 'drink water',
    time: 2000,
    type: 'timeout',
}

notifier(notificationObject);