// Load CSV data
d3.csv("data.csv").then(function (data) {
  // Filter data for the specified state
  var stateData = data.filter(function (d) {
    return d.State === stateName && d.HadHeartAttack !== "Nan";
  });

  // Count number of individuals with different combinations of heart disease and diabetes
  var BothCount = stateData.filter(function (d) {
    return d.HadDiabetes === "Yes" && d.HadHeartAttack === "Yes";
  }).length;

  var OnlyDiabetes = stateData.filter(function (d) {
    return d.HadDiabetes === "Yes" && d.HadHeartAttack === "No";
  }).length;
  var OnlyHeartAttack = stateData.filter(function (d) {
    return d.HadDiabetes === "No" && d.HadHeartAttack === "Yes";
  }).length;
  var NoneCount = stateData.filter(function (d) {
    return d.HadDiabetes === "No" && d.HadHeartAttack === "No";
  }).length;

  var totalCount = BothCount + OnlyDiabetes + OnlyHeartAttack + NoneCount;

  // Prepare data for pie chart
  var pieData = [
    { label: "Only Diabetes", count: OnlyDiabetes },
    { label: "Only Heart Attack", count: OnlyHeartAttack },
    { label: "Both", count: BothCount },
    { label: "None", count: NoneCount },
  ];

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

  // Add title
  g.append("text")
    .attr("x", 0)
    .attr("y", -height / 2.5)
    .attr("text-anchor", "middle")
    .text("Correlation between Heart Disease and Diabetes")
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
      return getColor1(d.data.label);
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
      return getColor1(d.data.label);
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
    .text(stateName)
    .attr("dy", "0.35em");

  // Text displaying percentage between inner and outer circle
  var percentageText = g
    .append("text")
    .attr("class", "percentage-text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("font-size", "15px")
    .attr("fill", "gray")
    .attr("transform", "translate(0, 20)");

  // Initial text content for percentage
  percentageText.text("Percentage");

  // Function to define colors for each category
  function getColor1(category) {
    if (category === "Only Diabetes") return "#99C1B9";
    if (category === "Both") return "#F3D9DC";
    if (category === "Only Heart Attack") {
      return "#FF9633";
    }
    if (category === "None") {
      return "#7A5C61";
    }
  }
});
