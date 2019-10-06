const notifier = require('node-notifier');

const notify = (msg) => {
    notifier.notify(
        {
          title: 'Notification',
          message: msg,
          //icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
          sound: true, // Only Notification Center or Windows Toasters
          wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait
        },
        (err, response) => {
          // Response is response from notification
        }
      );
}

const decideType = (notificationObject) => {
    if(notificationObject.type == "interval") {
        setInterval(() => { 
            notify(notificationObject.task) 
        }, notificationObject.time);
    } else if(notificationObject.type == "timeout")  {
        const timeoutID = setTimeout(() => { 
            notify(notificationObject.task) 
        }, notificationObject.time);
        console.log(timeoutID);
    } else {
        //do nothing
    }    
}

module.exports = decideType;