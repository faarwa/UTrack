'use strict';

// Put your view code here (e.g., the graph renderering code)

function setupViewOnLoad(dataModel) {

    // Add event listeners for all the buttons
    var inputButton = document.getElementById('input_btn');
    inputButton.addEventListener('click', function() {
        showInputView();
    });

    var analysisButton = document.getElementById('analysis_btn');
    analysisButton.addEventListener('click', function() {
        showAnalysisView(dataModel);
    });

    var scatterplotButton = document.getElementById('scatterplot_btn');
    scatterplotButton.addEventListener('click', function() {
        loadScatterplot(dataModel);
    });

    var tableButton = document.getElementById('table_btn');
    tableButton.addEventListener('click', function() {
        // Load information for the table that has duration of minutes
        var dropdown = document.getElementById("activity_dropdown");
        var fields = [];

        for (var i = 0; i < dropdown.length; i++) {
            var field = dropdown[i].value;
            fields.push(field);
        }

        loadTable('data-table', fields, activityDuration);
    });

    var canvas = document.getElementById("plot_canvas");
    var context = canvas.getContext("2d");

    // Add event listeners for all the health level sliders
    document.getElementById("energy_check").addEventListener('change', function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        loadScatterplot(dataModel);
    })

    document.getElementById("stress_check").addEventListener('change', function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        loadScatterplot(dataModel);
    })

    document.getElementById("happiness_check").addEventListener('change', function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        loadScatterplot(dataModel);
    })

    // Set the min/max and selected default for all the health level sliders
    var energySpan = document.getElementById('energy_span');
    var energySlider = document.getElementById('energy_slider');

    energySlider.min = 1;
    energySlider.max = 5;
    energySlider.value = 1;
    energySlider.addEventListener('input', function() {
        energySpan.innerText = energySlider.value;
    });

    var stressSpan = document.getElementById('stress_span');
    var stressSlider = document.getElementById('stress_slider');

    stressSlider.min = 1;
    stressSlider.max = 5;
    stressSlider.value = 1;
    stressSlider.addEventListener('input', function() {
        stressSpan.innerText = stressSlider.value;
    });

    var happinessSpan = document.getElementById('happiness_span');
    var happinessSlider = document.getElementById('happiness_slider');

    happinessSlider.min = 1;
    happinessSlider.max = 5;
    happinessSlider.value = 1;
    happinessSlider.addEventListener('input', function() {
        happinessSpan.innerText = happinessSlider.value;
    });

    // Select the input div by default
    inputButton.click();
}

// Code to load the table and edit the table DOM in place
function loadTable(tableId, fields, data) {
    var tableButton = document.getElementById("table_btn");
    tableButton.classList.add("active");

    var graphButton = document.getElementById("scatterplot_btn");
    graphButton.classList.remove("active");

    var rows = '';
    for (var i = 0; i < fields.length; i++) {
        var row = '<tr>';
        var duration = data[fields[i]];
        row += '<td>' + fields[i]+'' + '</td>';
        row += '<td>' + duration+'</td>';
        rows += row + '</tr>';
    }

    document.getElementById(tableId).innerHTML = rows;
    document.getElementById("table").style.display = 'block';
    document.getElementById('scatterplot').style.display = 'none';
}

// Code to render the scatterplot
function loadScatterplot(dataModel) {
    // Set appropriate active state for buttons
    var tableButton = document.getElementById("table_btn");
    tableButton.classList.remove("active");

    var graphButton = document.getElementById("scatterplot_btn");
    graphButton.classList.add("active");
    
    document.getElementById('table').style.display = 'none';
    document.getElementById('scatterplot').style.display = 'block';

    // Get access to canvas element and set the width and height
    var canvas = document.getElementById("plot_canvas");
    canvas.width = 800;
    canvas.height = 300;
    canvas.style.width = 800;
    canvas.style.height = 300;
    var context = canvas.getContext("2d");
    var dropdown = document.getElementById("activity_dropdown");

    // Set some offset and interval constants
    var offsetX = 60;
    var offsetY = 40;

    var min = 1;
    var max = 6;
    var intervalY = canvas.height/max;
    var intervalX = canvas.width/dropdown.length+1;

    // Populate the y axis data points (health levels from 1-5)
    context.font = "10px Arial";
    context.fillText("1", offsetX-10, canvas.height-intervalY-offsetY);
    context.fillText("2", offsetX-10, canvas.height-intervalY*2-offsetY);
    context.fillText("3", offsetX-10, canvas.height-intervalY*3-offsetY);
    context.fillText("4", offsetX-10, canvas.height-intervalY*4-offsetY);
    context.fillText("5", offsetX-10, canvas.height-intervalY*5-offsetY);

    // Create the two lines that make up the grid
    context.moveTo(offsetX, 0);
    context.lineTo(offsetX, canvas.height-offsetY);

    context.moveTo(offsetX, canvas.height-offsetY);
    context.lineTo(canvas.width+offsetX, canvas.height-offsetY);

    context.strokeStyle = "#000";
    context.stroke();

    // Get variables that check which options from the legend are checked
    var padding = 8;

    var energyChecked = document.getElementById("energy_check").checked;
    var stressChecked = document.getElementById("stress_check").checked;
    var happinessChecked = document.getElementById("happiness_check").checked;

    var dropdown = document.getElementById("activity_dropdown");

    // Populate the x axis data points
    for (var i = 0; i < dropdown.length; i++) {
        var activity = dropdown[i].value;
        context.textAlign = "right";
        context.textBaseline = "top";
        context.fillText(activity, intervalX*(i+1)-padding, canvas.height-offsetY);
    }

    // Put in the axis labels
    context.font = "15px Arial";
    context.textAlign = "center";
    context.textBaseline = "top";
    context.fillText("Activity", canvas.width/2, canvas.height-offsetY+15);

    context.textAlign = "right";
    context.fillText("Level", offsetX-12, canvas.height/2-offsetY);

    // For each activity
    for (var i = 0; i < dropdown.length; i++) {
        var activity = dropdown[i].value;

        var energyNum = [];
        var stressNum = [];
        var happinessNum = [];

        // Get the values for each health category for an activity
        var healthDicts = dataModel.getHealthDictsForActivity(activity);
        _.each(healthDicts, function(healthDict) {

            for (var key in healthDict) {
                if (key == energy) {
                    energyNum.push(healthDict[key]);
                } else if (key == stress) {
                    stressNum.push(healthDict[key]);
                } else {
                    happinessNum.push(healthDict[key]);
                }
            }
        })

        // Depending on which categories are checked, draw the points on the graph for those activities
        if (energyChecked) {
            drawActivityWithArray(energyNum, i, 'green');
        }

        if (stressChecked) {
            drawActivityWithArray(stressNum, i, 'blue');
        } 

        if (happinessChecked) {
            drawActivityWithArray(happinessNum, i, 'red');
        }

    }
}

// This function draws the data points on the scatterplot 
function drawActivityWithArray(array, index, color) {
    var canvas = document.getElementById("plot_canvas");
    var context = canvas.getContext("2d");
    var dropdown = document.getElementById("activity_dropdown");

    var min = 1;
    var max = 6;
    var intervalY = canvas.height/max;
    var intervalX = canvas.width/dropdown.length;

    var one = 0;
    var two = 0;
    var three = 0;
    var four = 0;
    var five = 0;

    var offsetX = 60;
    var offsetY = 40;

    var padding = 8;

    // Iterate through the array and see how many of each level there are
    _.each(array, function(num) {
        if (num == 1) {
            one++;
        } else if (num == 2) {
            two++;
        } else if (num == 3) {
            three++;
        } else if (num == 4) {
            four++;
        } else {
            five++;
        }

        // Determine the position of the data point
        var x = (index+1)*intervalX;
        var y;

        // For each health level, add the data point
        // Size of data point depends on how many times it's occurred
        for (var j = 1; j <= 5; j++) {
            y = j*intervalY;
            var radius;
            var constant = 3;
            var maxR = 10;

            if (j == 1) {
                radius = Math.min(one*constant, maxR);
            } else if (j == 2) {
                radius = Math.min(two*constant, maxR);
            } else if (j == 3) {
                radius = Math.min(three*constant, maxR);
            } else if (j == 4) {
                radius = Math.min(four*constant, maxR);
            } else {
                radius = Math.min(five*constant, maxR);
            }

            // Draw the circle
            context.beginPath();
            context.arc(x-padding-15, canvas.height-y-offsetY, radius, 0, 2 * Math.PI, false);
            context.fillStyle = color;
            context.fill();
        }

    })
}