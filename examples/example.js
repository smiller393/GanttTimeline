var eventList = [
    {"startDate":new Date("Sun Dec 09 01:00:00 EST 2012"),"endDate":new Date("Sun Dec 09 01:45:00 EST 2012"),"taskName":"Main Stage","status":"4","toolTipHTML":"Band 1"},
    {"startDate":new Date("Sun Dec 09 02:00:00 EST 2012"),"endDate":new Date("Sun Dec 09 02:45:00 EST 2012"),"taskName":"Main Stage","status":"4","toolTipHTML":"Band 2"},
    {"startDate":new Date("Sun Dec 09 03:00:00 EST 2012"),"endDate":new Date("Sun Dec 09 03:45:00 EST 2012"),"taskName":"Main Stage","status":"4","toolTipHTML":"Band 3"},
    {"startDate":new Date("Sun Dec 09 01:00:00 EST 2012"),"endDate":new Date("Sun Dec 09 01:45:00 EST 2012"),"taskName":"Left Stage","status":"2","toolTipHTML":"Band 11"},
    {"startDate":new Date("Sun Dec 09 02:00:00 EST 2012"),"endDate":new Date("Sun Dec 09 02:45:00 EST 2012"),"taskName":"Left Stage","status":"2","toolTipHTML":"Band 22"},
    {"startDate":new Date("Sun Dec 09 03:00:00 EST 2012"),"endDate":new Date("Sun Dec 09 03:45:00 EST 2012"),"taskName":"Left Stage","status":"2","toolTipHTML":"Band 33"},
    {"startDate":new Date("Sun Dec 09 01:00:00 EST 2012"),"endDate":new Date("Sun Dec 09 01:45:00 EST 2012"),"taskName":"Underground Stage","status":"3","toolTipHTML":"Band 111"},
    {"startDate":new Date("Sun Dec 09 02:00:00 EST 2012"),"endDate":new Date("Sun Dec 09 02:45:00 EST 2012"),"taskName":"Underground Stage","status":"3","toolTipHTML":"Band 222"},
    {"startDate":new Date("Sun Dec 09 03:00:00 EST 2012"),"endDate":new Date("Sun Dec 09 03:45:00 EST 2012"),"taskName":"Underground Stage","status":"3","toolTipHTML":"Band 333"},

];

var ganttConfig = {
    eventSettings: {
        eventList: eventList,
        eventTypes:[ "Main Stage", "Left Stage", "Underground Stage" ],
        eventStyleClassList:[
        "blue-bar",
        "purple-bar",
        "red-bar",
        "green-bar",
        "orange-bar"],
        enableToolTips: true
    },
    sizing: {
        location:'GanttChart',
        margin:{
            top : 60,
            right : 40,
            bottom : 20,
            left : 120
        },
        height:"400",
        width:"700"
    },
    timeDomainSettings: {
        zoomLevels:["5:sec","15:sec","1:min","5:min","15:min","1:hr","3:hr","6:hr","1:day"],
        timeDomainStart:d3.time.day.offset(new Date(),-3),
        timeDomainEnd: d3.time.hour.offset(new Date(),+3),
        startingTimeFormat:"%H:%M",
        startingTimeDomainString:"1day",
        startingZoomLevel:8,
        timeDomainMode: "fixed"
    }
};

var GanttChart = d3.gantt(ganttConfig);
