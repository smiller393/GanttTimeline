var eventList = [
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

var ganttConfig = {
    eventSettings: {
        eventList: eventList,
        eventTypes:[ "Area 1", "Area 2", "Area 3", "Area 4", "Area 5" ],
        eventStyleClassList:[
        "blue-bar",
        "purple-bar",
        "red-bar",
        "green-bar",
        "orange-bar"]
    },
    sizing: {
        margin:{
            top : 20,
            right : 40,
            bottom : 20,
            left : 150
        },
        height:"800",
        width:"1000"
    },
    timeDomainSettings: {
        timeDomainStart:d3.time.day.offset(new Date(),-3),
        timeDomainEnd: d3.time.hour.offset(new Date(),+3),
        startingTimeFormat:"%H:%M",
        startingTimeDomainString:"1day",
        timeDomainMode: "fixed"
    }
};

var myGantt = d3.gantt(ganttConfig)

//function addTask() {
//
//    var lastEndDate = getEndDate();
//    var taskStatusName = eventStyles[Math.floor(Math.random() * eventStyles.length)];
//    var taskName = taskNames[Math.floor(Math.random() * taskNames.length)];
//
//    newTaskStartDate = d3.time.minute.offset(lastEndDate, Math.ceil(Math.random()));
//    newTaskEndDate = d3.time.second.offset(newTaskStartDate, (Math.ceil(Math.random() * 1000)) + 1);
//
//
//    eventList.push({
//	"startDate" : newTaskStartDate,
//	"endDate" : newTaskEndDate,
//	"taskName" : taskName,
//	"status" : taskStatusName
//    });
//
//    gantt.changeTimeDomain(timeDomainString);
//    gantt.redraw(eventList);
//};
//
//function removeTask() {
//    eventList.pop();
//    gantt.changeTimeDomain(timeDomainString);
//    gantt.redraw(eventList);
//};
