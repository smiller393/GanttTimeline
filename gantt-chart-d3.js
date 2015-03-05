/**
 * @author Dimitry Kudrayvtsev
 * @version 2.1
 */

d3.gantt = function(inputConfig) {

	//var inputConfig = config;

	var eventList = [];

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

	var minDate = new Date();
	var maxDate = new Date();

	var currentViewBeginTime;// = d3.time.day.offset(getEndDate(), -1);
	var currentViewEndTime;//= getEndDate();
	this.getCurrentViewCenterTime = function() {
		return (d3.time.second.offset(
			this.currentViewBeginTime,
			(((this.currentViewEndTime - this.currentViewBeginTime) / 2) / 1000)));
	};

	 var zoomLevels;


	var tickFormat;

	//function initGantt(inputConfig){

	//var initGantt = function(config){
	if (inputConfig !== "null" && inputConfig !== "undefined") {
		eventList = inputConfig.eventSettings.eventList;
		eventTypes = inputConfig.eventSettings.eventTypes;
		eventStyleClasses = inputConfig.eventSettings.eventStyleClassList;
		eventStyleCount = eventStyleClasses.length;

		setMinMaxDate(eventList);

		margin = inputConfig.sizing.margin;
		height = inputConfig.sizing.height - margin.top - margin.bottom - 5;
		width = inputConfig.sizing.width - margin.right - margin.left - 5;

		currentViewBeginTime = d3.time.hour.offset(minDate, -1);
		currentViewEndTime = d3.time.hour.offset(maxDate, +1);

		zoomLevels = ganttConfig.timeDomainSettings.zoomLevels;

		tickFormat = inputConfig.timeDomainSettings.startingTimeFormat;
		timeDomainString = inputConfig.startingTimeDomainString;
		timeDomainMode = inputConfig.timeDomainMode;

		var x = d3.time.scale().domain([currentViewBeginTime, currentViewEndTime]).range([0, width]).clamp(true);

		var y = d3.scale.ordinal().domain(eventTypes).rangeRoundBands([0, height - margin.top - margin.bottom], .1);

		var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
			.tickSize(8).tickPadding(8);

		var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);


	}

//==========================================================================================================================
// Other
//--------------------------------------------------------------------------------------------------------------------------
	var keyFunction = function (d) {
		return d.startDate + d.taskName + d.endDate;
	};

	var rectTransform = function (d) {
		return "translate(" + x(d.startDate) + "," + y(d.taskName) + ")";
	};

	function setMinMaxDate(eventList) {
		eventList.sort(function (a, b) {
			return a.endDate - b.endDate;
		});
		maxDate = eventList[eventList.length - 1].endDate;       // TODO remove this area and replace with functions??????
		eventList.sort(function (a, b) {
			return a.startDate - b.startDate;
		});
		minDate = eventList[0].startDate;
	}

	var tooltipdiv = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);


//==========================================================================================================================
// Define sizing and axis
//--------------------------------------------------------------------------------------------------------------------------


	var initAxis = function () {
		x = d3.time.scale().domain([currentViewBeginTime, currentViewEndTime]).range([0, width]).clamp(true);
		y = d3.scale.ordinal().domain(eventTypes).rangeRoundBands([0, (height) - margin.top - margin.bottom], .2);
		xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
			.tickSize(8).tickPadding(8);

		yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);
	};


//==========================================================================================================================
// Sizing
//--------------------------------------------------------------------------------------------------------------------------


	gantt.width = function (value) {
		if (!arguments.length)
			return width;
		width = +value;
		return gantt;
	};

	gantt.height = function (value) {
		if (!arguments.length)
			return height;
		height = +value;
		return gantt;
	};


	gantt.margin = function (value) {
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

	gantt.taskTypes = function (value) {
		if (!arguments.length)
			return eventTypes;
		eventTypes = value;
		return gantt;
	};

	gantt.eventStyles = function (value) {
		if (!arguments.length)
			return eventStyleClasses;
		eventStyleClasses = value;
		return gantt;
	};


	gantt.tickFormat = function (value) {
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

		initZoom(eventList);
		initAxis();

		var svg = d3.select("#" + inputConfig.sizing.location)
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
			.attr("class", function (d) {
				var styleId = d.status % eventStyleCount;
				if (eventStyleClasses[styleId] == null) {
					return "bar";
				}
				return eventStyleClasses[styleId];
			})
			.attr("y", 0)
			.attr("transform", rectTransform)
			.attr("height", function (d) {
				return y.rangeBand();
			})
			.attr("width", function (d) {
				return (x(d.endDate) - x(d.startDate));
			})
			.on("mouseover", function (d) {
				if (ganttConfig.eventSettings.enableToolTips && d.toolTipHTML != "") {
					tooltipdiv.transition()
						.duration(200)
						.style("opacity", .9)
					tooltipdiv.html(d.toolTipHTML)
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY - 28) + "px");
				}
			})
			.on("mouseout", function (d) {
				tooltipdiv.transition()
					.duration(500)
					.style("opacity", 0);
			});

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
			.transition()
			.call(xAxis);

		svg.append("g").attr("class", "y axis").transition().call(yAxis);

		return gantt;
	};


	gantt.redraw = function (eventList) {

		initZoom(eventList);
		initAxis();

		var svg = d3.select("svg");

		var ganttChartGroup = svg.select(".gantt-chart");
		var rect = ganttChartGroup.selectAll("rect").data(eventList, keyFunction);

		rect.enter()
			.insert("rect", ":first-child")
			.attr("rx", 5)
			.attr("ry", 5)
			.attr("class", function (d) {
				if (eventStyleClasses[d.status % eventStyleCount] == null) {
					return "bar";
				}
				return eventStyleClasses[d.status % eventStyleCount];
			})
			.transition()
			.attr("y", 0)
			.attr("transform", rectTransform)
			.attr("height", function (d) {
				return y.rangeBand();
			})
			.attr("width", function (d) {
				return (x(d.endDate) - x(d.startDate));
			});

		rect.transition()
			.attr("transform", rectTransform)
			.attr("height", function (d) {
				return y.rangeBand();
			})
			.attr("width", function (d) {
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
	gantt.timeDomainMode = function (value) {
		if (!arguments.length)
			return timeDomainMode;
		timeDomainMode = value;
		return gantt;
	};

	gantt.timeDomain = function (value) {
		if (!arguments.length)
			return [currentViewBeginTime, currentViewEndTime];
		currentViewBeginTime = +value[0], currentViewEndTime = +value[1];
		return gantt;
	};

	var initZoom = function (eventList) {
		if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
			if (eventList === undefined || eventList.length < 1) {
				currentViewBeginTime = d3.time.day.offset(new Date(), -3);
				currentViewEndTime = d3.time.hour.offset(new Date(), +3);
				return;
			}
			eventList.sort(function (a, b) {
				return a.endDate - b.endDate;
			});
			currentViewEndTime = eventList[eventList.length - 1].endDate;

			eventList.sort(function (a, b) {
				return a.startDate - b.startDate;
			});
			currentViewBeginTime = eventList[0].startDate;
		}
	};

	this.currentZoomLevel = ganttConfig.timeDomainSettings.startingZoomLevel;

	this.zoomInOut = function (inOrOut) {
		if (inOrOut === "in") {
			if (this.currentZoomLevel === 0) {
				alert("can't zoom in anymore")
			} else {
				this.currentZoomLevel--;
			}
		} else if (inOrOut === "out") {
			if (this.currentZoomLevel === (this.zoomLevels.length - 1)) {
				alert("Can't zoom out anymore");
			} else {
				this.currentZoomLevel++;
			}
		} else {
			alert("Error: Not sure if you're trying to zoom in or out. Check zoom function call");
		}
		this.setCustomZoom(this.currentZoomLevel);
	};

	this.setCustomZoom = function(zoomLevel) {
		this.currentZoomLevel = zoomLevel;
		var currentCenterTime = this.getCurrentViewCenterTime();
		currentViewBeginTime = d3.time.second.offset(currentCenterTime, -this.convertZoomLevelToOffsetSeconds());
		currentViewEndTime = d3.time.second.offset(currentCenterTime, this.convertZoomLevelToOffsetSeconds());
		gantt.timeDomain([currentViewBeginTime, currentViewEndTime]);
		this.tickFormat(this.determineTimeFormat(zoomLevels[this.currentZoomLevel].split(":")[1]));
		this.redraw(eventList);
	};

	this.convertZoomLevelToOffsetSeconds = function(){
		var zoomLevelString = ganttConfig.timeDomainSettings.zoomLevels[this.currentZoomLevel];
		var rangeNumber = zoomLevelString.split(":")[0];
		var rangeScale = zoomLevelString.split(":")[1];
		var secondsResult;
		switch (rangeScale) {
			case "day":
				secondsResult = rangeNumber * 86400;
				break;
			case "hr":
				secondsResult = rangeNumber * 3600;
				break;
			case "min":
				secondsResult = rangeNumber * 60;
				break;
			case "sec":
				secondsResult = rangeNumber;
				break;
			default:
				secondsResult = 86400;
		}
		return Math.round(secondsResult/2);
	};


	this.determineTimeFormat = function (scale) {
		switch (scale) {
			case "day":
				return "%H";
				break;
			case "hr":
				return "%H:%M";
				break;
			case "min":
				return "%H:%M:%S";
				break;
			case "sec":
				return "%H:%M:%S";
				break;
			default:
				return "%H:%M";
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
	};

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
