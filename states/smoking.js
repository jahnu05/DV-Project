// Load CSV data
d3.csv("data.csv").then(function (data) {
  // Filter data for the specified state and those who had a heart attack
  var stateData = data.filter(function (d) {
    return (
      d.State === stateName &&
      d.HadHeartAttack === "Yes" &&
      d.SmokerStatus !== "Nan"
    );
  });

  // Count number of individuals with different smoker statuses
  var smokerCounts = {};
  stateData.forEach(function (d) {
    var smokerStatus = d.SmokerStatus;
    if (smokerStatus in smokerCounts) {
      smokerCounts[smokerStatus]++;
    } else {
      smokerCounts[smokerStatus] = 1;
    }
  });

  // Prepare data for pie chart
  var pieData = Object.keys(smokerCounts).map(function (key) {
    return { label: key, count: smokerCounts[key] };
  });

  // Setup SVG
  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", 600)
    .attr("height", 300);

  var width = +svg.attr("width");
  var height = +svg.attr("height");
  var radius = Math.min(width, height) / 2;

  var g = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // Draw legend
  var legend = g
    .selectAll(".legend")
    .data(pieData)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    });

  // Define tooltip
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Setup pie chart layout
  var pie = d3
    .pie()
    .value(function (d) {
      return d.count;
    })
    .sort(null);

  var arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(radius - 50);

  // Draw slices
  var arcs = g
    .selectAll(".arc")
    .data(pie(pieData))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", function (d) {
      return getSmokerColor(d.data.label);
    })
    .on("mouseover", function (event, d) {
      var percentage = (d.data.count / stateData.length) * 100;
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(d.data.label + ": " + percentage.toFixed(2) + "%")
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
      d3.select(this)
        .transition()
        .duration(100)
        .attr(
          "d",
          d3
            .arc()
            .innerRadius(0)
            .outerRadius(radius - 30)
        );

      // Update percentage text in the middle
      percentageText.text(percentage.toFixed(2) + "%");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
      d3.select(this).transition().duration(100).attr("d", arc);

      // Reset percentage text
      percentageText.text("Percentage");
    });
  // Add a heading
  svg
    .append("text")
    .attr("x", 300)
    .attr("y", 35)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .text("Heart Disease Prevalence by Smoker Status");

  // Add rectangles or circles with colors next to the text labels
  arcs
    .append("rect")
    .attr("x", radius + 10)
    .attr("y", function (d, i) {
      return i * 20;
    })
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function (d) {
      return getSmokerColor(d.data.label);
    });

  // Add text labels for smoker statuses
  arcs
    .append("text")
    .attr("transform", function (d, i) {
      return "translate(" + (radius + 25) + "," + (i * 20 + 9) + ")"; // Adjust positioning to center text vertically
    })
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .text(function (d) {
      // Rename labels for pie chart categories in legend
      switch (d.data.label) {
        case "Former smoker":
          return "Former Smoker";
        case "Never smoked":
          return "Never Smoked";
        case "Current smoker - now smokes every day":
          return "Every day smoker";
        case "Current smoker - now smokes some days":
          return "Sometimes smoker";
        default:
          return d.data.label;
      }
    });

  // Add a white circle around the state name
  g.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 40)
    .style("fill", "white")
    .style("stroke", "black")
    .style("stroke-width", 2);

  // Inner circle with state name
  g.append("text")
    .attr("text-anchor", "middle")
    .attr("font-size", "15px")
    .text(stateName)
    .attr("dy", "0.35em");

  // Text displaying percentage between inner and outer circle
  var percentageText = g
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .text("Percentage")
    .attr("font-size", "10px")
    .attr("fill", "gray")
    .attr("transform", "translate(0, 20)");
});

// Function to define colors for each smoker status
function getSmokerColor(smokerStatus) {
  switch (smokerStatus) {
    case "Former smoker":
      return "purple";
    case "Never smoked":
      return "green";
    case "Current smoker - now smokes every day":
      return "red";
    case "Current smoker - now smokes some days":
      return "orange";
    default:
      return "gray";
  }
}
