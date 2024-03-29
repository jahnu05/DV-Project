// Load CSV data
d3.csv("data.csv").then(function (data) {
    // Initialize counts object for heart attacks by age group and COVID positive cases
    var counts = {};
    var totalHeartAttack = 0;
    var totalCovid = 0;

    // Count number of heart attacks and COVID positive cases for each age group
    data.forEach(function (d) {
        var ageGroup = d.AgeCategory;
        if (ageGroup in counts) {
            counts[ageGroup].total++;
            if (d.HadHeartAttack === "Yes") totalHeartAttack++;
            if (d.CovidPos === "Yes") counts[ageGroup].covid++;
        } else {
            counts[ageGroup] = {
                total: 1,
                covid: d.CovidPos === "Yes" ? 1 : 0,
            };
            if (d.HadHeartAttack === "Yes") totalHeartAttack++;
        }
        if (d.CovidPos === "Yes") totalCovid++;
    });

    // Prepare data for bar chart
    var barData = Object.keys(counts).map(function (ageGroup) {
        return {
            ageGroup: ageGroup,
            percentage: (counts[ageGroup].covid / counts[ageGroup].total) * 100,
        };
    });

    // Sort data by age group
    barData.sort(function (a, b) {
        return a.ageGroup.localeCompare(b.ageGroup);
    });

    // Create bar chart
    var svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", 600) // Increased width for better spacing
        .attr("height", 400); // Increased height for legend and labels

    var margin = {
        top: 20,
        right: 30,
        bottom: 60,
        left: 60
    }; // Increased bottom margin for y-axis label
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;

    var g = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add title
    g.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top + 13)
        .attr("text-anchor", "middle")
        .text("Percentage of heart disease patients tested COVID positive")
        .style("font-weight", "bold")
        .attr("font-size", "18px")
        .attr("fill", "black");

    var x = d3.scaleBand().range([0, width]).padding(0.1);
    var y = d3.scaleLinear().range([height, 0]);

    x.domain(
        barData.map(function (d) {
            return d.ageGroup;
        })
    );
    y.domain([0, d3.max(barData, function (d) {
        return d.percentage;
    })]);

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "middle") // Adjust text alignment
        .attr("dx", "-.8em")
        .attr("dy", ".20em") // Increased dy for better alignment
        .attr("transform", "rotate(-10)"); // Rotate labels for better fit
    svg
        .append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 40) + ")")
        .style("text-anchor", "middle")
        .attr("font-size", "16px")
        .text("Age Group");

    // Define tooltip
    var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Add bars with interactivity
    g.selectAll(".bar")
        .data(barData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.ageGroup);
        })
        .attr("y", height) // Start from bottom
        .attr("width", x.bandwidth())
        .attr("height", 0) // Start with zero height
        .style("fill", "steelblue")
        .transition() // Add transition for animation
        .duration(1000) // Set duration of animation
        .delay(function (d, i) {
            return i * 100; // Add delay for each bar
        })
        .attr("y", function (d) {
            return y(d.percentage);
        })
        .attr("height", function (d) {
            return height - y(d.percentage);
        });

    // Mouseover and mouseout events
    g.selectAll(".bar")
        .on("mouseover", function (event, d) {
            var mouseX = event.pageX;
            var mouseY = event.pageY;
            tooltip.transition().duration(200).style("opacity", 0.9);

            tooltip
                .html("Percentage of COVID positive: " + d.percentage.toFixed(2) + "%")
                .style("left", mouseX + 10 + "px") // Adjust tooltip position
                .style("top", mouseY - 28 + "px");

            d3.select(this).style("fill", "orange");
        })
        .on("mouseout", function (d) {
            tooltip.transition().duration(500).style("opacity", 0);
            d3.select(this).style("fill", "steelblue"); // Restore original color
        });

    // Y-axis label
    g.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "2em") // Increased dy for better spacing
        .style("text-anchor", "middle")
        .text("Percentage of COVID Positive Cases")
        .style("font-size", "12px"); // Decrease font size for better fit

    // Y-axis ticks
    g.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(5));
});
