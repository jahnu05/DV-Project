// Load CSV data
d3.csv("data.csv").then(function (data) {
  // Filter data for those who had a heart attack and specify state
  var stateData = data.filter(function (d) {
    return d.HadHeartAttack === "Yes" && d.GeneralHealth !== "Nan";
  });

  // Count number of individuals with different general health statuses
  var healthCounts = {};
  stateData.forEach(function (d) {
    var healthStatus = d.GeneralHealth;
    if (healthStatus in healthCounts) {
      healthCounts[healthStatus]++;
    } else {
      healthCounts[healthStatus] = 1;
    }
  });

  // Prepare data for pie chart
  var pieData = Object.keys(healthCounts).map(function (key) {
    return { label: key, count: healthCounts[key] };
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
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); // Adjust translate for proper alignment

  // Add title
  g.append("text")
    .attr("x", -width + 625)
    .attr("y", -height + 180)
    .attr("text-anchor", "middle")
    .text("Heart Disease Prevalence by General Health")
    .attr("font-size", "18px")
    .attr("fill", "black");

  // Draw legend
  var legend = g
    .selectAll(".legend")
    .data(pieData)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    }); // Adjust spacing

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
      return getColor(d.data.label);
    })
    .on("mouseover", function (event, d) {
      var percentage = (d.data.count / stateData.length) * 100;
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(d.data.label + ": " + percentage.toFixed(2) + "%")
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");

      // Update the percentage text inside the middle circle
      g.select(".percentage-text").text(percentage.toFixed(2) + "%");

      d3.select(this)
        .transition()
        .duration(100)
        .attr(
          "d",
          d3
            .arc()
            .innerRadius(0)
            .outerRadius(radius - 30) // Adjust outer radius on mouseover
        );
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
      d3.select(this).transition().duration(100).attr("d", arc);
    });

  // Add a white circle around the state name
  g.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 40)
    .style("fill", "white")
    .style("stroke", "black")
    .style("stroke-width", 2);

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
      return getColor(d.data.label);
    });

  // Add text labels for health statuses
  arcs
    .append("text")
    .attr("transform", function (d, i) {
      return "translate(" + (radius + 25) + "," + (i * 20 + 9) + ")"; // Adjust positioning to center text vertically
    })
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .text(function (d) {
      return d.data.label;
    });

  // Inner circle with state name
  g.append("text")
    .attr("text-anchor", "middle")
    .attr("font-size", "15px")
    .text("US")
    .attr("dy", "0.35em");

  // Text displaying percentage between inner and outer circle
  g.append("text")
    .attr("class", "percentage-text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .text("Percentage")
    .attr("font-size", "10px")
    .attr("fill", "gray")
    .attr("transform", "translate(0, 20)");
});

// Function to define colors for each health status
function getColor(healthStatus) {
  switch (healthStatus) {
    case "Excellent":
      return "green";
    case "Very good":
      return "blue";
    case "Good":
      return "#F4E869";
    case "Fair":
      return "orange";
    case "Poor":
      return "red";
    default:
      return "gray";
  }
}
