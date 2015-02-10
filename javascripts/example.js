var tasks = [
{"startDate":new Date("Sun Dec 09 02:35:45 EST 2012"),"endDate":new Date("Sun Dec 09 04:36:45 EST 2012"),"taskName":"Area 1","status":"1"},
    {"startDate":new Date("Sun Dec 09 04:36:55 EST 2012"),"endDate":new Date("Sun Dec 09 06:37:45 EST 2012"),"taskName":"Area 1","status":"2"},
    {"startDate":new Date("Sun Dec 09 06:37:55 EST 2012"),"endDate":new Date("Sun Dec 09 09:38:45 EST 2012"),"taskName":"Area 1","status":"3"},
    {"startDate":new Date("Sun Dec 09 09:38:55 EST 2012"),"endDate":new Date("Sun Dec 09 12:39:45 EST 2012"),"taskName":"Area 1","status":"4"},
    {"startDate":new Date("Sun Dec 09 12:39:55 EST 2012"),"endDate":new Date("Sun Dec 09 14:40:45 EST 2012"),"taskName":"Area 1","status":"5"},
    {"startDate":new Date("Sun Dec 09 14:40:55 EST 2012"),"endDate":new Date("Sun Dec 09 18:41:45 EST 2012"),"taskName":"Area 1","status":"6"},

    {"startDate":new Date("Sun Dec 09 18:47:55 EST 2012"),"endDate":new Date("Sun Dec 09 18:48:45 EST 2012"),"taskName":"Area 2","status":"1"},
    {"startDate":new Date("Sun Dec 09 18:48:55 EST 2012"),"endDate":new Date("Sun Dec 09 18:49:45 EST 2012"),"taskName":"Area 2","status":"2"},
    {"startDate":new Date("Sun Dec 09 18:49:55 EST 2012"),"endDate":new Date("Sun Dec 09 18:50:45 EST 2012"),"taskName":"Area 2","status":"3"},
    {"startDate":new Date("Sun Dec 09 18:50:55 EST 2012"),"endDate":new Date("Sun Dec 09 18:51:45 EST 2012"),"taskName":"Area 2","status":"4"},

    {"startDate":new Date("Sun Dec 09 01:47:55 EST 2012"),"endDate":new Date("Sun Dec 09 02:48:45 EST 2012"),"taskName":"Area 3","status":"1"},
    {"startDate":new Date("Sun Dec 09 04:48:55 EST 2012"),"endDate":new Date("Sun Dec 09 05:20:45 EST 2012"),"taskName":"Area 3","status":"2"},
    {"startDate":new Date("Sun Dec 09 09:49:55 EST 2012"),"endDate":new Date("Sun Dec 09 10:50:45 EST 2012"),"taskName":"Area 3","status":"3"},];

var eventStyles = [
    "blue-bar",
    "purple-bar",
    "red-bar",
    "green-bar",
    "orange-bar"
];

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

var gantt = d3.gantt().taskTypes(taskNames).eventStyles(eventStyles).tickFormat(format);

var margin = {
     top : 20,
     right : 40,
     bottom : 20,
     left : 40
};
gantt.margin(margin);

gantt.timeDomainMode("fixed");
gantt.changeTimeDomain(timeDomainString);

gantt(tasks);


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
    var taskStatusName = eventStyles[Math.floor(Math.random() * eventStyles.length)];
    var taskName = taskNames[Math.floor(Math.random() * taskNames.length)];

    newTaskStartDate = d3.time.minute.offset(lastEndDate, Math.ceil(Math.random()));
    newTaskEndDate = d3.time.second.offset(newTaskStartDate, (Math.ceil(Math.random() * 1000)) + 1);


    tasks.push({
	"startDate" : newTaskStartDate,
	"endDate" : newTaskEndDate,
	"taskName" : taskName,
	"status" : taskStatusName
    });

    gantt.changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
};

function removeTask() {
    tasks.pop();
    gantt.changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
};
