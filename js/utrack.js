'use strict';

/*
Put any interaction code here
 */

var activityDuration;
var energy = "energy";
var stress = "stress";
var happiness = "happiness";

window.addEventListener('load', function() {
    // You should wire up all of your event handling code here, as well as any
    // code that initiates calls to manipulate the DOM (as opposed to responding
    // to events)
    var activityStoreModel = new ActivityStoreModel();
    var graphModel = new GraphModel();
    graphModel.addListener(function(eventType, eventTime, eventData) {
    });
    var array = new Array();
    activityDuration = {};
    var dropdown = document.getElementById('activity_dropdown');
    _.each(dropdown, function(text) {
        activityDuration[text.value] = 0;
    })
    activityStoreModel.addListener(function(eventType, eventTime, activityData) {
        var lastSubmitted = document.getElementById("last_submitted");
        var currTime = new Date();

        // This method is taken from StackOverflow at:
        // http://stackoverflow.com/questions/3066586/get-string-in-yyyymmdd-format-from-js-date-object
        Date.prototype.yyyymmdd = function() {
           var yyyy = this.getFullYear().toString();
           var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
           var dd  = this.getDate().toString();
           return yyyy +"/"+ (mm[1]?mm:"0"+mm[0]) + "/" + (dd[1]?dd:"0"+dd[0]); // padding
          };

        lastSubmitted.innerHTML = "Last Data Entry was: " + currTime.yyyymmdd();
    });
    setupViewOnLoad(activityStoreModel);

    var submitButton = document.getElementById('input_submit_btn');
    submitButton.addEventListener('click', function() {
        submitInput(activityStoreModel);
    });
});

/**
 * This function can live outside the window load event handler, because it is
 * only called in response to a button click event
 */
function runCanvasDemo() {
    /*
    Useful references:
     http://www.w3schools.com/html/html5_canvas.asp
     http://www.w3schools.com/tags/ref_canvas.asp
     */
    var canvas = document.getElementById('canvas_demo');
    var context = canvas.getContext('2d');

    var width = canvas.width;
    var height = canvas.height;

    console.log("Painting on canvas at: " + new Date());
    console.log("Canvas size: " + width + "X" + height);

    context.fillStyle = 'grey';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'red';
    context.moveTo(0, 0);
    context.lineTo(width, height);
    context.stroke();
}

function showInputView() {
    var inputSection = document.getElementById("input_div");
    var analysisSection = document.getElementById("analysis_div");

    inputSection.style.display = 'block';
    analysisSection.style.display = 'none';

    var inputButton = document.getElementById("input_btn");
    inputButton.classList.add("active");

    var analysisButton = document.getElementById("analysis_btn");
    analysisButton.classList.remove("active");
}

function showAnalysisView(dataModel) {
    var inputSection = document.getElementById("input_div");
    var analysisSection = document.getElementById("analysis_div");

    inputSection.style.display = 'none';
    analysisSection.style.display = 'block';

    var tableButton = document.getElementById('table_btn');
    tableButton.click();

    document.getElementById("energy_check").checked = true;

    var inputButton = document.getElementById("input_btn");
    inputButton.classList.remove("active");

    var analysisButton = document.getElementById("analysis_btn");
    analysisButton.classList.add("active");
}

function submitInput(dataModel) {
    var activityType = document.getElementById("activity_dropdown").value;

    var healthMetricsDict = {energy:document.getElementById("energy_slider").value,
     stress:document.getElementById("stress_slider").value,
     happiness:document.getElementById("happiness_slider").value};

    var duration = parseInt(document.getElementById("minutes_duration").value);
    if (isNaN(duration) == true) {
        alert("You did not enter a valid time interval");
        return;
    }
    activityDuration[activityType] += duration;
    var dataPoint = new ActivityData(activityType, healthMetricsDict, duration);
    dataModel.addActivityDataPoint(dataPoint);
}
