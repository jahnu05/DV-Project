// Load CSV data
d3.csv("data.csv").then(function (data) {
  // Initialize counts object for heart attacks by age group
  var counts = {};
  var totalYes = 0;
  // Count number of "Yes" and "No" values for heart attacks for each age group
  data.forEach(function (d) {
    if (d.HadHeartAttack === "Yes") {
      totalYes++;
    }
    var ageGroup = d.AgeCategory;
    if (ageGroup in counts) {
      counts[ageGroup][d.HadHeartAttack]++;
    } else {
      counts[ageGroup] = {
        Yes: d.HadHeartAttack === "Yes" ? 1 : 0,
        No: d.HadHeartAttack === "No" ? 1 : 0,
      };
    }
  });

 
  // Prepare data for bar chart
  var barData = Object.keys(counts).map(function (ageGroup) {
    return {
      ageGroup: ageGroup,
      yes: counts[ageGroup].Yes,
      no: counts[ageGroup].No,
    };
  });

  // Sort data by age group
  barData.sort(function (a, b) {
    return a.ageGroup.localeCompare(b.ageGroup);
  });

  // Create SVG element for the chart
  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", 600)
    .attr("height", 400);
  // Define margins and dimensions for the chart
  var margin = { top: 20, right: 30, bottom: 60, left: 60 }; // Increased bottom margin for y-axis label
  var width = +svg.attr("width") - margin.left - margin.right;
  var height = +svg.attr("height") - margin.top - margin.bottom;
  // Define x and y scales for the chart
  var x = d3.scaleBand().range([0, width]).padding(0.1);
  var y = d3.scaleLinear().range([height, 0]);
  // Append a 'g' element for the chart content
  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // Set the domains for the x and y scales
  x.domain(
    barData.map(function (d) {
      return d.ageGroup;
    })
  );

  y.domain([
    0,
    d3.max(barData, function (d) {
      return Math.max(0, (d.yes / totalYes) * 100 + 5);
    }),
  ]);

  // y-axis with label
  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(5))
    .append("text") // Y-axis label
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "-6em")
    .attr("text-anchor", "end")
    .attr("font-size", "12px") //  font size for y-axis label
    .attr("fill", "black")
    .text("Percentage of People");
  // x-axis with rotated labels
  g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "middle") //  text alignment
    .attr("dx", "-.8em")
    .attr("dy", ".5em") // dy 
    .attr("transform", "rotate(-10)"); 
// Add chart title
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 40) + ")"
    )
    .style("text-anchor", "middle")
    .attr("font-size", "16px")
    .text("Age Group");
      // Add y-axis label
  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Percentage of People");

  // Define tooltip
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Add bars for "Age group's share of all heart disease cases" with interactivity
  g.selectAll(".yes-bar")
    .data(barData)
    .enter()
    .append("rect")
    .attr("class", "yes-bar")
    .attr("x", function (d) {
      return x(d.ageGroup);
    })
    .attr("y", height) // Starting point for the animation
    .attr("width", x.bandwidth() / 2)
    .attr("height", 0) // Starting point for the animation
    .style("fill", "#891652")
    .transition()
    .duration(1000)
    .attr("y", function (d) {
      return y((d.yes / totalYes) * 100);
    })
    .attr("height", function (d) {
      return height - y((d.yes / totalYes) * 100);
    });

  // Add bars for "Age group's heart disease Percentage" with interactivity
  g.selectAll(".no-bar")
    .data(barData)
    .enter()
    .append("rect")
    .attr("class", "no-bar")
    .attr("x", function (d) {
      return x(d.ageGroup) + x.bandwidth() / 2;
    })
    .attr("y", height) // Starting point for the animation
    .attr("width", x.bandwidth() / 2)
    .attr("height", 0) // Starting point for the animation
    .style("fill", "#EABE6C")
    .transition()
    .duration(1000)
    .attr("y", function (d) {
      return y((d.yes / (d.yes + d.no)) * 100);
    })
    .attr("height", function (d) {
      return height - y((d.yes / (d.yes + d.no)) * 100);
    });

  // Add interactivity and tooltip for "Age group's share of all heart disease cases" bars
  g.selectAll(".yes-bar")
    .on("mouseover", function (event, d) {
      var mouseX = event.pageX;
      var mouseY = event.pageY;
      tooltip.transition().duration(200).style("opacity", 0.9);

      tooltip
        .html("Percent of People: " + (d.yes / totalYes) * 100)
        .style("left", mouseX + 10 + "px") // Adjust tooltip position
        .style("top", mouseY - 28 + "px");

      d3.select(this).style("fill", "orange");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
      d3.select(this).style("fill", "#891652"); // Restore original color
    });
  // Create x-axis label
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 40) + ")"
    )
    .style("text-anchor", "middle")
    .text("Age Group");

  // Add interactivity and tooltip for "Age group's heart disease Percentage" bars
  g.selectAll(".no-bar")
    .on("mouseover", function (event, d) {
      var mouseX = event.pageX;
      var mouseY = event.pageY;
      tooltip.transition().duration(200).style("opacity", 0.9);

      tooltip
        .html("Percent of People: " + (d.yes / (d.yes + d.no)) * 100)
        .style("left", mouseX + 10 + "px") // Adjust tooltip position
        .style("top", mouseY - 28 + "px");

      d3.select(this).style("fill", "blue");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
      d3.select(this).style("fill", "#EABE6C"); // Restore original color
    });

  // Add legend for colors
  var legend = svg
    .append("g")
    .attr("transform", "translate(" + (width - 300) + "," + 20 + ")"); // Adjust position of legend

  legend
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "#891652");

  legend
    .append("text")
    .attr("x", 15)
    .attr("y", 10)
    .text("Age group's share of all heart disease cases");

  legend
    .append("rect")
    .attr("x", 0)
    .attr("y", 20)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "#EABE6C");

  legend
    .append("text")
    .attr("x", 15)
    .attr("y", 30)
    .text("Age group's heart disease Percentage");

  // Animation for y-axis
  g.selectAll(".axis").transition().duration(1000).attr("opacity", 1);
});
