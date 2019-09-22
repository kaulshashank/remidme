

function parsingTime(taskArr) {
    let msec = 0;
    let timeUnit = taskArr.length - 1;
    let time = taskArr.length - 2;
    switch (timeUnit) {
        case 'hours':
            msec = time * 3600000;
            break;
        case 'minutes':
            msec = time * 60000;
            break;
        case 'seconds':
            msec = time * 1000;
            break;
    }
    return msec;
}

function parsingTask(taskArr) {
    let taskObj = {};

    let task = '';
    let time = 0;
    let type = '';
    let index1 = taskArr.findIndex(function(val) {
        return val === 'in' || val === 'after';
    });

    if(taskArr[index1 + 1] == 'every') {
        task = taskArr[index1 - 1];
        time = parsingTime(taskArr);
        type = 'interval';

        //for now
        setInterval(() => console.log(task), time);

    } else {
        task = taskArr[index1 - 1];
        time = parsingTime(taskArr);
        type = 'timeout'

        //for now
        setTimeout(() => console.log(task), time);

    }

    taskObj["task"] = task; 
    taskObj["time"] = time;
    taskObj["type"] = type;
    
    return taskObj;
}

module.exports = parsingTask;