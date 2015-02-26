

var ganttConfig = {
    eventSettings: {
        eventList: [],
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

var myGantt;
d3.json("http://10.10.18.163:8081/ChartDataCHMList/2015-01-01/2015-01-02/POL2200", function(error, json) {
    if (error) {return console.warn(error);}
    ganttConfig.eventSettings.eventTypes = json;
    d3.json("http://10.10.18.163:8081/ChartData/2015-01-01/2015-01-02/POL2200", function (error2, json2) {
        if (error2)
            return console.warn(error2);
        ganttConfig.eventSettings.eventList = json2;
        myGantt = d3.gantt(ganttConfig);
    });
});



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
