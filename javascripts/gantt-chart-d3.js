/**
 * @author Dimitry Kudrayvtsev
 * @version 2.1
 */

d3.gantt = function() {
    var FIT_TIME_DOMAIN_MODE = "fit";
    var FIXED_TIME_DOMAIN_MODE = "fixed";
    
    var margin = {
		top : 20,
		right : 40,
		bottom : 20,
		left : 150
    };
    var timeDomainStart = d3.time.day.offset(new Date(),-3);
    var timeDomainEnd = d3.time.hour.offset(new Date(),+3);
    var timeDomainMode = FIT_TIME_DOMAIN_MODE;// fixed or fit
    var taskTypes = [];
    var eventStyles = [];
	var eventStyleCount = function(){
		return eventStyles.length;
	}
    var height = 400 - margin.top - margin.bottom-5;
    var width = 700 - margin.right - margin.left-5;

	var currentViewBeginTime;
	var currentViewEndTime;
	currentViewBeginTime = d3.time.day.offset(getEndDate(), -1);
	currentViewEndTime = getEndDate();

    var tickFormat = "%H:%M";

    var keyFunction = function(d) {
		return d.startDate + d.taskName + d.endDate;
    };

    var rectTransform = function(d) {
		return "translate(" + x(d.startDate) + "," + y(d.taskName) + ")";
    };

    var x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);

    var y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);
    
    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
	    .tickSize(8).tickPadding(8);

    var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

    var initTimeDomain = function(tasks) {
		if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
			if (tasks === undefined || tasks.length < 1) {
			timeDomainStart = d3.time.day.offset(new Date(), -3);
			timeDomainEnd = d3.time.hour.offset(new Date(), +3);
			return;
			}
			tasks.sort(function(a, b) {
			return a.endDate - b.endDate;
			});
			timeDomainEnd = tasks[tasks.length - 1].endDate;
			tasks.sort(function(a, b) {
			return a.startDate - b.startDate;
			});
			timeDomainStart = tasks[0].startDate;
		}
    };

    var initAxis = function() {
		x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);
		y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([ 0, (height) - margin.top - margin.bottom ],.2);
		xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
			.tickSize(8).tickPadding(8);

		yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);
    };
    
    function gantt(tasks) {
	
		initTimeDomain(tasks);
		initAxis();

		var svg = d3.select("#gantt")
			.append("svg")
			.attr("class", "chart")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("class", "gantt-chart")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

		svg.selectAll(".chart")
			 .data(tasks, keyFunction).enter()
			 .append("rect")
			 .attr("rx", 5)
				 .attr("ry", 5)
			 .attr("class", function(d){
				 var theEventCount = eventStyleCount();
				 var styleId = d.status%theEventCount;
				 if(eventStyles[styleId] == null){ return "bar";}
				 return eventStyles[styleId];
				 })
			 .attr("y", 0)
			 .attr("transform", rectTransform)
			 .attr("height", function(d) { return y.rangeBand(); })
			 .attr("width", function(d) {
				 return (x(d.endDate) - x(d.startDate));
			  });

		 svg.append("g")
			 .attr("class", "x axis")
			 .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
			 .transition()
			 .call(xAxis);

		 svg.append("g").attr("class", "y axis").transition().call(yAxis);

		 return gantt;
    };

    
    gantt.redraw = function(tasks) {

		initTimeDomain(tasks);
		initAxis();
	
        var svg = d3.select("svg");

        var ganttChartGroup = svg.select(".gantt-chart");
        var rect = ganttChartGroup.selectAll("rect").data(tasks, keyFunction);
        
        rect.enter()
         .insert("rect",":first-child")
         .attr("rx", 5)
         .attr("ry", 5)
		 .attr("class", function(d){
			 if(eventStyles[d.status%eventStyleCount] == null){ return "bar";}
			 return eventStyles[d.status%eventStyleCount];
			 })
		 .transition()
		 .attr("y", 0)
		 .attr("transform", rectTransform)
		 .attr("height", function(d) { return y.rangeBand(); })
		 .attr("width", function(d) {
			 return (x(d.endDate) - x(d.startDate));
			 });

			rect.transition()
			  .attr("transform", rectTransform)
		 .attr("height", function(d) { return y.rangeBand(); })
		 .attr("width", function(d) {
			 return (x(d.endDate) - x(d.startDate));
			 });

		rect.exit().remove();

		svg.select(".x").transition().call(xAxis);
		svg.select(".y").transition().call(yAxis);

		return gantt;
    };

    gantt.margin = function(value) {
		if (!arguments.length)
			return margin;
		margin = value;
		return gantt;
    };

    gantt.timeDomain = function(value) {
		if (!arguments.length)
			return [ timeDomainStart, timeDomainEnd ];
		timeDomainStart = +value[0], timeDomainEnd = +value[1];
		return gantt;
    };

    /**
     * @param {string}
     *                vale The value can be "fit" - the domain fits the data or
     *                "fixed" - fixed domain.
     */
    gantt.timeDomainMode = function(value) {
		if (!arguments.length)
			return timeDomainMode;
			timeDomainMode = value;
			return gantt;
    };

    gantt.taskTypes = function(value) {
		if (!arguments.length)
			return taskTypes;
		taskTypes = value;
		return gantt;
    };
    
    gantt.eventStyles = function(value) {
		if (!arguments.length)
			return eventStyles;
		eventStyles = value;
		return gantt;
    };

    gantt.width = function(value) {
		if (!arguments.length)
			return width;
		width = +value;
		return gantt;
    };

    gantt.height = function(value) {
		if (!arguments.length)
			return height;
		height = +value;
		return gantt;
    };

    gantt.tickFormat = function(value) {
		if (!arguments.length)
			return tickFormat;
		tickFormat = value;
		return gantt;
    };

	 gantt.changeTimeDomain = function(timeDomainString) {
		this.timeDomainString = timeDomainString;
		switch (timeDomainString) {

			case "5sec":
				format = "%H:%M:%S";
				gantt.timeDomain([ d3.time.second.offset(getEndDate(), -5), getEndDate() ]);
				this.currentViewBeginTime  = d3.time.second.offset(getEndDate(), -5);
				this.currentViewEndTime = getEndDate();
				break;
			case "15sec":
				format = "%H:%M:%S";
				gantt.timeDomain([ d3.time.second.offset(getEndDate(), -15), getEndDate() ]);
				this.currentViewBeginTime  = d3.time.second.offset(getEndDate(), -15);
				this.currentViewEndTime = getEndDate();
				break;
			case "1min":
				format = "%H:%M:%S";
				gantt.timeDomain([ d3.time.minute.offset(getEndDate(), -1), getEndDate() ]);
				this.currentViewBeginTime  = d3.time.minute.offset(getEndDate(), -1);
				this.currentViewEndTime = getEndDate();
				break;
			case "5min":
				format = "%H:%M:%S";
				gantt.timeDomain([ d3.time.minute.offset(getEndDate(), -5), getEndDate() ]);
				this.currentViewBeginTime  = d3.time.minute.offset(getEndDate(), -5);
				this.currentViewEndTime = getEndDate();
				break;
			case "15min":
				format = "%H:%M:%S";
				gantt.timeDomain([ d3.time.minute.offset(getEndDate(), -15), getEndDate() ]);
				this.currentViewBeginTime  = d3.time.minute.offset(getEndDate(), -15);
				this.currentViewEndTime = getEndDate();
				break;
			case "1hr":
				format = "%H:%M:%S";
				gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -1), getEndDate() ]);
				this.currentViewBeginTime  = d3.time.hour.offset(getEndDate(), -1);
				this.currentViewEndTime = getEndDate();
				break;
			case "3hr":
				format = "%H:%M";
				gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -3), getEndDate() ]);
				this.currentViewBeginTime  = d3.time.hour.offset(getEndDate(), -3);
				this.currentViewEndTime = getEndDate();
				break;
			case "6hr":
				format = "%H:%M";
				gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -6), getEndDate() ]);
				this.currentViewBeginTime  = d3.time.hour.offset(getEndDate(), -6);
				this.currentViewEndTime = getEndDate();
				break;
			case "1day":
				format = "%H:%M";
				gantt.timeDomain([ d3.time.day.offset(getEndDate(), -1), getEndDate() ]);
				this.currentViewBeginTime  = d3.time.day.offset(getEndDate(), -1);
				this.currentViewEndTime = getEndDate();
				break;
			default:
				format = "%H:%M"

		}
		this.tickFormat(format);
		this.redraw(tasks);
	}

	gantt.panView = function(direction){
		// gets the length in MS of 50% of the current view. This will be used to determine how far to pan in a single click
		var shiftTimeLength = ((this.currentViewEndTime - this.currentViewBeginTime) / 2);
		if(direction === "left"){
			shiftTimeLength = -shiftTimeLength;
		}
		// convert our shift length to Sec and offset our current view start/end times. Once shifted, update the current view to these new times
		var newStartTime =  d3.time.second.offset(this.currentViewBeginTime, (shiftTimeLength/1000));
		var newEndTime = d3.time.second.offset(this.currentViewEndTime, (shiftTimeLength/1000));
		this.timeDomain([ newStartTime , newEndTime ]);
		this.currentViewBeginTime = newStartTime;
		this.currentViewEndTime = newEndTime;
		this.redraw(tasks);

	}

	//function panView(){
	//	return 0;
	//}

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
    
    return gantt;
};
