var eventList = [
    {"startDate":new Date("Sun Dec 09 01:00:00 EST 2012"),"endDate":new Date("Sun Dec 09 01:45:00 EST 2012"),"taskName":"Main Stage","status":"1","toolTipHTML":"<h2>Band 1</h2>"},
    {"startDate":new Date("Sun Dec 09 02:00:00 EST 2012"),"endDate":new Date("Sun Dec 09 02:45:00 EST 2012"),"taskName":"Main Stage","status":"1","toolTipHTML":"<h2>Band 2</h2>"},
    {"startDate":new Date("Sun Dec 09 03:00:00 EST 2012"),"endDate":new Date("Sun Dec 09 03:45:00 EST 2012"),"taskName":"Main Stage","status":"1","toolTipHTML":"<h2>Band 3</h2>"},
    {"startDate":new Date("Sun Dec 09 01:00:00 EST 2012"),"endDate":new Date("Sun Dec 09 01:45:00 EST 2012"),"taskName":"Left Stage","status":"2","toolTipHTML":"<h2>Band 11</h2>"},
    {"startDate":new Date("Sun Dec 09 02:00:00 EST 2012"),"endDate":new Date("Sun Dec 09 02:45:00 EST 2012"),"taskName":"Left Stage","status":"2","toolTipHTML":"<h2>Band 22</h2>"},
    {"startDate":new Date("Sun Dec 09 03:00:00 EST 2012"),"endDate":new Date("Sun Dec 09 03:45:00 EST 2012"),"taskName":"Left Stage","status":"2","toolTipHTML":"<h2>Band 33</h2>"},
    {"startDate":new Date("Sun Dec 09 01:00:00 EST 2012"),"endDate":new Date("Sun Dec 09 01:45:00 EST 2012"),"taskName":"Underground Stage","status":"3","toolTipHTML":"<h2>Band 111</h2>"},
    {"startDate":new Date("Sun Dec 09 02:00:00 EST 2012"),"endDate":new Date("Sun Dec 09 02:45:00 EST 2012"),"taskName":"Underground Stage","status":"3","toolTipHTML":"<h2>Band 222</h2>"},
    {"startDate":new Date("Sun Dec 09 03:00:00 EST 2012"),"endDate":new Date("Sun Dec 09 03:45:00 EST 2012"),"taskName":"Underground Stage","status":"3","toolTipHTML":"<h2>Band 333</h2>"},

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
            top : 20,
            right : 40,
            bottom : 20,
            left : 150
        },
        height:"300",
        width:"1200"
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
