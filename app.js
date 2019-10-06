const notifier = require('./notifier');

const notificationObject = {
    task: 'Remind me what to do',
    time: 5000,
    type: 'timeout',
}

notifier(notificationObject);