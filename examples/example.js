var tasks = [
{"startDate":new Date("Sun Dec 09 02:35:45 EST 2012"),"endDate":new Date("Sun Dec 09 02:36:45 EST 2012"),"taskName":"Area 1","status":"RUNNING"},
    {"startDate":new Date("Sun Dec 09 02:36:55 EST 2012"),"endDate":new Date("Sun Dec 09 02:37:45 EST 2012"),"taskName":"Area 1","status":"RUNNING"},
    {"startDate":new Date("Sun Dec 09 02:37:55 EST 2012"),"endDate":new Date("Sun Dec 09 02:38:45 EST 2012"),"taskName":"Area 1","status":"RUNNING"},
    {"startDate":new Date("Sun Dec 09 02:38:55 EST 2012"),"endDate":new Date("Sun Dec 09 02:39:45 EST 2012"),"taskName":"Area 1","status":"RUNNING"},
    {"startDate":new Date("Sun Dec 09 02:39:55 EST 2012"),"endDate":new Date("Sun Dec 09 02:40:45 EST 2012"),"taskName":"Area 1","status":"RUNNING"},
    {"startDate":new Date("Sun Dec 09 02:40:55 EST 2012"),"endDate":new Date("Sun Dec 09 02:41:45 EST 2012"),"taskName":"Area 1","status":"RUNNING"},
    {"startDate":new Date("Sun Dec 09 02:41:55 EST 2012"),"endDate":new Date("Sun Dec 09 02:42:45 EST 2012"),"taskName":"Area 1","status":"RUNNING"},
    {"startDate":new Date("Sun Dec 09 02:47:55 EST 2012"),"endDate":new Date("Sun Dec 09 02:48:45 EST 2012"),"taskName":"Area 1","status":"FAILED"},
    {"startDate":new Date("Sun Dec 09 02:48:55 EST 2012"),"endDate":new Date("Sun Dec 09 02:49:45 EST 2012"),"taskName":"Area 1","status":"FAILED"},
    {"startDate":new Date("Sun Dec 09 02:49:55 EST 2012"),"endDate":new Date("Sun Dec 09 02:50:45 EST 2012"),"taskName":"Area 1","status":"FAILED"},
    {"startDate":new Date("Sun Dec 09 02:50:55 EST 2012"),"endDate":new Date("Sun Dec 09 02:51:45 EST 2012"),"taskName":"Area 1","status":"FAILED"}];

var taskStatus = {
    "SUCCEEDED" : "bar",
    "FAILED" : "bar-failed",
    "RUNNING" : "bar-running",
    "KILLED" : "bar-killed"
};

var taskNames = [ "Area 1", "Area 2", "Area 3", "Area 4", "Area 5" ];

tasks.sort(function(a, b) {
    return a.endDate - b.endDate;
});
var maxDate = tasks[tasks.length - 1].endDate;       // TODO remove this area and replace with functions??????
tasks.sort(function(a, b) {
    return a.startDate - b.startDate;
});
var minDate = tasks[0].startDate;

var format = "%H:%M";
var timeDomainString = "1day";

var gantt = d3.gantt().taskTypes(taskNames).taskStatus(taskStatus).tickFormat(format);

var margin = {
     top : 20,
     right : 40,
     bottom : 20,
     left : 80
};
gantt.margin(margin);

gantt.timeDomainMode("fixed");
changeTimeDomain(timeDomainString);

var currentViewBeginTime;
var currentViewEndTime;
currentViewBeginTime = d3.time.day.offset(getEndDate(), -1);
currentViewEndTime = getEndDate();

gantt(tasks);

function changeTimeDomain(timeDomainString) {
    this.timeDomainString = timeDomainString;
    switch (timeDomainString) {

        case "5sec":
            format = "%H:%M:%S";
            gantt.timeDomain([ d3.time.second.offset(getEndDate(), -5), getEndDate() ]);
            currentViewBeginTime  = d3.time.second.offset(getEndDate(), -5);
            currentViewEndTime = getEndDate();
            break;
        case "15sec":
            format = "%H:%M:%S";
            gantt.timeDomain([ d3.time.second.offset(getEndDate(), -15), getEndDate() ]);
            currentViewBeginTime  = d3.time.second.offset(getEndDate(), -15);
            currentViewEndTime = getEndDate();
            break;
        case "1min":
            format = "%H:%M:%S";
            gantt.timeDomain([ d3.time.minute.offset(getEndDate(), -1), getEndDate() ]);
            currentViewBeginTime  = d3.time.minute.offset(getEndDate(), -1);
            currentViewEndTime = getEndDate();
            break;
        case "5min":
            format = "%H:%M:%S";
            gantt.timeDomain([ d3.time.minute.offset(getEndDate(), -5), getEndDate() ]);
            currentViewBeginTime  = d3.time.minute.offset(getEndDate(), -5);
            currentViewEndTime = getEndDate();
            break;
        case "15min":
            format = "%H:%M:%S";
            gantt.timeDomain([ d3.time.minute.offset(getEndDate(), -15), getEndDate() ]);
            currentViewBeginTime  = d3.time.minute.offset(getEndDate(), -15);
            currentViewEndTime = getEndDate();
            break;
        case "1hr":
            format = "%H:%M:%S";
            gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -1), getEndDate() ]);
            currentViewBeginTime  = d3.time.hour.offset(getEndDate(), -1);
            currentViewEndTime = getEndDate();
            break;
        case "3hr":
            format = "%H:%M";
            gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -3), getEndDate() ]);
            currentViewBeginTime  = d3.time.hour.offset(getEndDate(), -3);
            currentViewEndTime = getEndDate();
            break;
        case "6hr":
            format = "%H:%M";
            gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -6), getEndDate() ]);
            currentViewBeginTime  = d3.time.hour.offset(getEndDate(), -6);
            currentViewEndTime = getEndDate();
            break;
        case "1day":
            format = "%H:%M";
            gantt.timeDomain([ d3.time.day.offset(getEndDate(), -1), getEndDate() ]);
            currentViewBeginTime  = d3.time.day.offset(getEndDate(), -1);
            currentViewEndTime = getEndDate();
            break;
        default:
            format = "%H:%M"

    }
    gantt.tickFormat(format);
    gantt.redraw(tasks);
}

function panView(direction){
    // gets the length in MS of 50% of the current view. This will be used to determine how far to pan in a single click
    var shiftTimeLength = ((this.currentViewEndTime - this.currentViewBeginTime) / 2);
    if(direction === "left"){
         shiftTimeLength = -shiftTimeLength;
    }
    // convert our shift length to Sec and offset our current view start/end times. Once shifted, update the current view to these new times
    var newStartTime =  d3.time.second.offset(currentViewBeginTime, (shiftTimeLength/1000));
    var newEndTime = d3.time.second.offset(currentViewEndTime, (shiftTimeLength/1000));
    gantt.timeDomain([ newStartTime , newEndTime ]);
    currentViewBeginTime = newStartTime;
    currentViewEndTime = newEndTime;
    gantt.redraw(tasks);

}

function getStartDate() {
    return this.minDate;
}

function getEndDate() {
    var lastEndDate = Date.now();
    if (tasks.length > 0) {
	    lastEndDate = tasks[tasks.length - 1].endDate;
    }
    return lastEndDate;
}

function addTask() {

    var lastEndDate = getEndDate();
    var taskStatusKeys = Object.keys(taskStatus);
    var taskStatusName = taskStatusKeys[Math.floor(Math.random() * taskStatusKeys.length)];
    var taskName = taskNames[Math.floor(Math.random() * taskNames.length)];

    newTaskStartDate = d3.time.minute.offset(lastEndDate, Math.ceil(Math.random()));
    newTaskEndDate = d3.time.second.offset(newTaskStartDate, (Math.ceil(Math.random() * 1000)) + 1);


    tasks.push({
	"startDate" : newTaskStartDate,
	"endDate" : newTaskEndDate,
	"taskName" : taskName,
	"status" : taskStatusName
    });

    changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
};

function removeTask() {
    tasks.pop();
    changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
};
