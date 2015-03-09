/**
 * @author Shane Miller
 */

d3.gantt = function(inputConfig) {

	//var inputConfig = config;

	var eventList = [];

	var timeDomainMode;
	var timeDomainString;

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
	gantt.getCurrentViewCenterTime = function() {
		var centerTime = d3.time.second.offset(currentViewBeginTime,(((currentViewEndTime - currentViewBeginTime) / 2) / 1000));
		return (centerTime);
	};

	var zoomLevels;
	var currentZoomLevel;

	var tickFormat;

	if (inputConfig !== "null" && inputConfig !== "undefined") {
		eventList = inputConfig.eventSettings.eventList;
		eventTypes = inputConfig.eventSettings.eventTypes;
		eventStyleClasses = inputConfig.eventSettings.eventStyleClassList;
		eventStyleCount = eventStyleClasses.length;

		setMinMaxDate(eventList);

		margin = inputConfig.sizing.margin;
		height = inputConfig.sizing.height - margin.top - margin.bottom - 5;
		width = inputConfig.sizing.width - margin.right - margin.left - 5;
		if(inputConfig.eventSettings.eventTypes.length > 9){
			height = inputConfig.eventSettings.eventTypes.length * 40;
		}

		currentViewBeginTime = d3.time.hour.offset(minDate, -1);
		currentViewEndTime = d3.time.hour.offset(maxDate, +1);

		currentZoomLevel = ganttConfig.timeDomainSettings.startingZoomLevel;

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
		maxDate = eventList[eventList.length - 1].endDate;
		eventList.sort(function (a, b) {
			return a.startDate - b.startDate;
		});
		minDate = eventList[0].startDate;
	}

	var tooltipdiv = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	var drawControls = function(){
		d3.select('#'+ganttConfig.sizing.location).append('div')
			.attr('id',ganttConfig.sizing.location+'-Controls')
			.attr("style","margin-left:"+width/2+"px; width:400px;");
		d3.select('#'+ganttConfig.sizing.location+'-Controls')
			//.append("button")
			.append('i')
			.attr('class','fa fa-arrow-left fa-3x nav')
			.attr('style','margin-left:20px; border: 2px solid; border-radius: 10px; padding:3px 5px 3px 5px')
			.attr('onclick',ganttConfig.sizing.location + ".panView('left',.30)");
		d3.select('#'+ganttConfig.sizing.location+'-Controls')
			.append('i')
			.attr('class','fa fa-arrow-right fa-3x')
			.attr('style','margin-left:20px; border: 2px solid; border-radius: 10px; padding:3px 5px 3px 5px')
			.attr('onclick',ganttConfig.sizing.location + ".panView('right',.30)");
		d3.select('#'+ganttConfig.sizing.location+'-Controls')
			.append('i')
			.attr('class','fa fa-search-plus fa-3x')
			.attr('style','margin-left:20px; border: 2px solid; border-radius: 10px; padding:3px 5px 3px 5px')
			.attr('onclick',ganttConfig.sizing.location + ".zoomInOut('in')");
		d3.select('#'+ganttConfig.sizing.location+'-Controls')
			.append('i')
			.attr('class','fa fa-search-minus fa-3x')
			.attr('style','margin-left:20px; border: 2px solid; border-radius: 10px; padding:3px 5px 3px 5px')
			.attr('onclick',ganttConfig.sizing.location + ".zoomInOut('out')");
	};


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
		drawControls();
		initAxis();

		var svg = d3.select("#" + inputConfig.sizing.location)
			.append("svg")
			.attr("class", "chart")
			.attr("id",inputConfig.sizing.location+"-ChartId")
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
						.style("opacity", .9);
					tooltipdiv.html(d.toolTipHTML)
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY - 28) + "px");
				}
			})
			.on("mouseout", function (d) {
				tooltipdiv.transition()
					.duration(500)
					.style("opacity", 0);
			})
			.on("click", function(d){

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
	gantt.zoomInOut = function (inOrOut) {
		if (inOrOut === "in") {
			if (currentZoomLevel === 0) {
				alert("can't zoom in anymore")
			} else {
				currentZoomLevel--;
			}
		} else if (inOrOut === "out") {
			if (currentZoomLevel === (zoomLevels.length - 1)) {
				alert("Can't zoom out anymore");
			} else {
				currentZoomLevel++;
			}
		} else {
			alert("Error: Not sure if you're trying to zoom in or out. Check zoom function call");
		}
		this.setCustomZoom(currentZoomLevel);
	};

	gantt.setCustomZoom = function(zoomLevel) {
		currentZoomLevel = zoomLevel;
		var currentCenterTime = this.getCurrentViewCenterTime();
		currentViewBeginTime = d3.time.second.offset(currentCenterTime, -this.convertZoomLevelToOffsetSeconds());
		currentViewEndTime = d3.time.second.offset(currentCenterTime, this.convertZoomLevelToOffsetSeconds());
		//gantt.timeDomain([currentViewBeginTime, currentViewEndTime]);
		this.tickFormat(this.determineTimeFormat(zoomLevels[currentZoomLevel].split(":")[1]));
		this.redraw(eventList);
	};

	gantt.convertZoomLevelToOffsetSeconds = function(){
		var zoomLevelString = zoomLevels[currentZoomLevel];
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


	gantt.determineTimeFormat = function (scale) {
		switch (scale) {
			case "day":
				return "%H:%M";
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
//------------------------------------------------------------------------------------------------------------------

	gantt.panView = function(direction,percentMove){
		// gets the length in MS of X% of the current view. This will be used to determine how far to pan at a time
		var shiftTimeLength = ((currentViewEndTime - currentViewBeginTime) * percentMove);
		if(direction === "left"){
			shiftTimeLength = -shiftTimeLength;
		}
		// convert our shift length to Sec and offset our current view start/end times. Once shifted, update the current view to these new times
		var newStartTime =  d3.time.second.offset(currentViewBeginTime, (shiftTimeLength/1000));
		var newEndTime = d3.time.second.offset(currentViewEndTime, (shiftTimeLength/1000));
		//this.timeDomain([ newStartTime , newEndTime ]);
		currentViewBeginTime = newStartTime;
		currentViewEndTime = newEndTime;
		this.redraw(eventList);

	}

	return gantt(eventList);
};
