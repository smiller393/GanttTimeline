/**
 * @author Dimitry Kudrayvtsev
 * @version 2.1
 */

d3.gantt = function(inputConfig) {

	//var inputConfig = config;

	var eventList = [];

    var timeDomainStart;
    var timeDomainEnd;
    var timeDomainMode;
	var timeDomainString;

	var FIT_TIME_DOMAIN_MODE = "fit";
	var FIXED_TIME_DOMAIN_MODE = "fixed";

    var eventTypes;
    var eventStyleClasses = ["event"];
	var eventStyleCount;

    var height;
    var width;
	var margin;

	var minDate;
	var maxDate;

	var currentViewBeginTime = d3.time.day.offset(getEndDate(), -1);
	var currentViewEndTime = getEndDate();

    var tickFormat;

	//function initGantt(inputConfig){

		//var initGantt = function(config){
		if(inputConfig !== "null" && inputConfig !== "undefined") {
			eventList = inputConfig.eventSettings.eventList;
			eventTypes = inputConfig.eventSettings.eventTypes;
			eventStyleClasses = inputConfig.eventSettings.eventStyleClassList;
			eventStyleCount = eventStyleClasses.length;

			setMinMaxDate(eventList);

			margin = inputConfig.sizing.margin;
			height = inputConfig.sizing.height - margin.top - margin.bottom - 5;
			width = inputConfig.sizing.width - margin.right - margin.left - 5;

			timeDomainStart = d3.time.hour.offset(minDate, -1);
			timeDomainEnd =  d3.time.hour.offset(maxDate, +1);

			tickFormat = inputConfig.timeDomainSettings.startingTimeFormat;
			timeDomainString = inputConfig.startingTimeDomainString;
			timeDomainMode = inputConfig.timeDomainMode;

			var x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);

			var y = d3.scale.ordinal().domain(eventTypes).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);

			var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
				.tickSize(8).tickPadding(8);

			var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);


		}
	//};


	//}

//==========================================================================================================================
// Other
//--------------------------------------------------------------------------------------------------------------------------
	var keyFunction = function(d) {
		return d.startDate + d.taskName + d.endDate;
	};

	var rectTransform = function(d) {
		return "translate(" + x(d.startDate) + "," + y(d.taskName) + ")";
	};

	function setMinMaxDate(eventList){
		eventList.sort(function(a, b) { return a.endDate - b.endDate; });
		maxDate = eventList[eventList.length - 1].endDate;       // TODO remove this area and replace with functions??????
		eventList.sort(function(a, b) { return a.startDate - b.startDate; });
		minDate = eventList[0].startDate;
	}


//==========================================================================================================================
// Define sizing and axis
//--------------------------------------------------------------------------------------------------------------------------



	var initAxis = function() {
		x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);
		y = d3.scale.ordinal().domain(eventTypes).rangeRoundBands([ 0, (height) - margin.top - margin.bottom ],.2);
		xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
			.tickSize(8).tickPadding(8);

		yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);
	};


//==========================================================================================================================
// Sizing
//--------------------------------------------------------------------------------------------------------------------------



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


	gantt.margin = function(value) {
		if (!arguments.length)
			return margin;
		margin = value;
		return gantt;
	};


//--------------------------------------------------------------------------------------------------------------------------







	/**
	 * @param {string}
	 *                vale The value can be "fit" - the domain fits the data or
	 *                "fixed" - fixed domain.
	 */

	gantt.taskTypes = function(value) {
		if (!arguments.length)
			return eventTypes;
		eventTypes = value;
		return gantt;
	};

	gantt.eventStyles = function(value) {
		if (!arguments.length)
			return eventStyleClasses;
		eventStyleClasses = value;
		return gantt;
	};


	gantt.tickFormat = function(value) {
		if (!arguments.length)
			return tickFormat;
		tickFormat = value;
		return gantt;
	};


	function getEndDate() {
		var lastEndDate = Date.now();
		if (eventList.length > 0) {
			lastEndDate = eventList[eventList.length - 1].endDate;
		}
		return lastEndDate;
	}
//==========================================================================================================================
// Draw / ReDraw Code
//--------------------------------------------------------------------------------------------------------------------------

    function gantt(eventList) {
	
		initTimeDomain(eventList);
		initAxis();

		var svg = d3.select("body")
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
			 .data(eventList, keyFunction).enter()
			 .append("rect")
			 .attr("rx", 5)
			 .attr("ry", 5)
			 .attr("class", function(d){
				 var styleId = d.status%eventStyleCount;
				 if(eventStyleClasses[styleId] == null){ return "bar";}
				 return eventStyleClasses[styleId];
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

    
    gantt.redraw = function(eventList) {

		initTimeDomain(eventList);
		initAxis();
	
        var svg = d3.select("svg");

        var ganttChartGroup = svg.select(".gantt-chart");
        var rect = ganttChartGroup.selectAll("rect").data(eventList, keyFunction);
        
        rect.enter()
         .insert("rect",":first-child")
         .attr("rx", 5)
         .attr("ry", 5)
		 .attr("class", function(d){
			 if(eventStyleClasses[d.status%eventStyleCount] == null){ return "bar";}
			 return eventStyleClasses[d.status%eventStyleCount];
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

//=================================================================================================================
// Time Domain Code
//------------------------------------------------------------------------------------------------------------------
	gantt.timeDomainMode = function(value) {
		if (!arguments.length)
			return timeDomainMode;
		timeDomainMode = value;
		return gantt;
	};

	gantt.timeDomain = function(value) {
		if (!arguments.length)
			return [ timeDomainStart, timeDomainEnd ];
		timeDomainStart = +value[0], timeDomainEnd = +value[1];
		return gantt;
	};

	var initTimeDomain = function(eventList) {
		if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
			if (eventList === undefined || eventList.length < 1) {
				timeDomainStart = d3.time.day.offset(new Date(), -3);
				timeDomainEnd = d3.time.hour.offset(new Date(), +3);
				return;
			}
			eventList.sort(function(a, b) {
				return a.endDate - b.endDate;
			});
			timeDomainEnd = eventList[eventList.length - 1].endDate;

			eventList.sort(function(a, b) {
				return a.startDate - b.startDate;
			});
			timeDomainStart = eventList[0].startDate;
		}
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
		this.redraw(eventList);
	}

//------------------------------------------------------------------------------------------------------------------

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
		this.redraw(eventList);

	}

    return gantt(eventList);
};
