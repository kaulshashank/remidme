const notifier = require('node-notifier');

const notify = (notificationObject) => {
    notifier.notify(
        {
          title: 'Notification',
          message: notificationObject.task,
          //icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
          sound: true, // Only Notification Center or Windows Toasters
          wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait
        },
        function(err, response) {
          // Response is response from notification
        }
      );
}

module.exports = notify;