const notifier = require('node-notifier');

const notify = (msg) => {
    return new Promise((resolve, reject) => {
        if(!msg) {
            reject(new Error('No Notification Found!'));
        } else {
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
                    if(err) {
                        reject(err);
                    } else {
                        resolve(response);
                    }
                }
            );
        }
    });
}

const decideType = (notificationObject) => {
    return new Promise((resolve, reject) => {
        if(!notificationObject) {
            reject(new Error('No Notification Object Found!'))
        } else {
            if(notificationObject.type == "interval") {
                setInterval(() => { 
                    notify(notificationObject.task)
                        .then((response) => {
                            resolve(response);
                        })
                        .catch((err) => {
                            reject(err);
                        }); 
                }, notificationObject.time);
            } else if(notificationObject.type == "timeout")  {
                //timeoutID will be used to clear notifications
                const timeoutID = setTimeout(() => { 
                    notify(notificationObject.task)
                        .then((response) => {
                            resolve(response);
                        })
                        .catch((err) => {
                            reject(err);
                        }); 
                }, notificationObject.time);
            } else {
                reject(new Error('Notification Type undefined!'));
            }   
        }
    });
}

module.exports = decideType;