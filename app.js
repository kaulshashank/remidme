function test(taskArr) {
    if(taskArr[2] == 'to' && (taskArr[4] == 'in' || taskArr[4] == 'after')) {
        let task =  taskArr[3];
        let time =  taskArr[5];
        let timeUnit = taskArr[6];

        switch (timeUnit) {
            case 'hours':
                callTimeout(task, time*3600000);
                break;
            case 'minutes':
                callTimeout(task, time*60000);
                break;
            case 'seconds':
                callTimeout(task, time*1000);
                break;
        }
    }
    if(taskArr[2] == 'to' && (taskArr[4] == 'in' || taskArr[4] == 'after') && taskArr[5] == 'every') {
        let task =  taskArr[3];
        let time =  taskArr[6];
        let timeUnit = taskArr[7];

        switch (timeUnit) {
            case 'hours':
                callInterval(task, time*3600000);
                break;
            case 'minutes':
                callInterval(task, time*60000);
                break;
            case 'seconds':
                callInterval(task, time*1000);
                break;
        }
    }
    else {
        console.log("error occured");
    }
}

function callTimeout(task, time) {
    setTimeout(() => console.log(task), time);
}

function callInterval(task, time) {
    setInterval(() => console.log(task), time);
}

test(process.argv);