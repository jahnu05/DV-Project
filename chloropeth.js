// Load GeoJSON file
d3.json("us-states.json").then(function (us) {
  // Create SVG element
  var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  // Define projection
  var projection = d3
    .geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale(1000);

  // Define path generator
  var path = d3.geoPath().projection(projection);

  // Mapping between state codes and state names
  var stateNames = {
    "0400000US01": "Alabama",
    "0400000US02": "Alaska",
    "0400000US04": "Arizona",
    "0400000US05": "Arkansas",
    "0400000US06": "California",
    "0400000US08": "Colorado",
    "0400000US09": "Connecticut",
    "0400000US10": "Delaware",
    "0400000US11": "District of Columbia",
    "0400000US12": "Florida",
    "0400000US13": "Georgia",
    "0400000US15": "Hawaii",
    "0400000US16": "Idaho",
    "0400000US17": "Illinois",
    "0400000US18": "Indiana",
    "0400000US19": "Iowa",
    "0400000US20": "Kansas",
    "0400000US21": "Kentucky",
    "0400000US22": "Louisiana",
    "0400000US23": "Maine",
    "0400000US24": "Maryland",
    "0400000US25": "Massachusetts",
    "0400000US26": "Michigan",
    "0400000US27": "Minnesota",
    "0400000US28": "Mississippi",
    "0400000US29": "Missouri",
    "0400000US30": "Montana",
    "0400000US31": "Nebraska",
    "0400000US32": "Nevada",
    "0400000US33": "New Hampshire",
    "0400000US34": "New Jersey",
    "0400000US35": "New Mexico",
    "0400000US36": "New York",
    "0400000US37": "North Carolina",
    "0400000US38": "North Dakota",
    "0400000US39": "Ohio",
    "0400000US40": "Oklahoma",
    "0400000US41": "Oregon",
    "0400000US42": "Pennsylvania",
    "0400000US44": "Rhode Island",
    "0400000US45": "South Carolina",
    "0400000US46": "South Dakota",
    "0400000US47": "Tennessee",
    "0400000US48": "Texas",
    "0400000US49": "Utah",
    "0400000US50": "Vermont",
    "0400000US51": "Virginia",
    "0400000US53": "Washington",
    "0400000US54": "West Virginia",
    "0400000US55": "Wisconsin",
    "0400000US56": "Wyoming",
  };

  // Load CSV data
  d3.csv("data.csv").then(function (data) {
   // Initialize objects to store heart attack counts and total people count in each state
    var stateHeartAttackCounts = {};
    var stateTotalPeople = {}; 
   // Calculate heart attack percentages for each state
    data.forEach(function (d) {
      var state = d.State;
      if (state in stateHeartAttackCounts) {
        if (d.HadHeartAttack === "Yes") {
          stateHeartAttackCounts[state]++;
        }
      } else {
        stateHeartAttackCounts[state] = d.HadHeartAttack === "Yes" ? 1 : 0;
      }
      // Count total people in each state
      if (state in stateTotalPeople) {
        stateTotalPeople[state]++;
      } else {
        stateTotalPeople[state] = 1;
      }
    });

    // Calculate percentages for each state based on total people in that state
    for (var state in stateHeartAttackCounts) {
      stateHeartAttackCounts[state] =
        (stateHeartAttackCounts[state] / stateTotalPeople[state]) * 100;
    }

    // Define color scale based on percentages
    var colorScale = d3
      .scaleThreshold()
      .domain([3.0, 4.5, 6, 7.5, 9])
      .range(["#fee5d9", "#fcae91", "#fb6a4a", "#de2d26", "#a50f15"]);

    // Draw states
    svg
      .append("g")
      .selectAll("path")
      .data(us.features)
      .enter()
      .append("a")
      .attr("href", function (d) {
        var stateCode = d.properties.GEO_ID;
        var stateName = stateNames[stateCode];
        return "state_stats.html?state=" + encodeURIComponent(stateName);
      })
      .append("path")
      .attr("d", path)
      .attr("fill", function (d) {
        var stateCode = d.properties.GEO_ID;
        var stateName = stateNames[stateCode];
        var percentage = stateHeartAttackCounts[stateName] || 0;
        return colorScale(percentage);
      })
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    // Define tooltip
    var tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("pointer-events", "none");

    // Add event listener for the "Show All Stats" button
    document
      .getElementById("showAllStatsButton")
      .addEventListener("click", function () {
        window.location.href = "all_stats.html"; // Redirect to a new page for all stats
      });

    // Function to handle mouseover event
    function handleMouseOver(event, d) {
      // Fade all states except the current one
      svg.selectAll("path").style("opacity", function () {
        return this === event.currentTarget ? 1 : 0.2;
      });

      // Highlight the current state
      d3.select(this).style("stroke", "black").style("stroke-width", 2);

      // Show tooltip
      var stateCode = d.properties.GEO_ID;
      var stateName = stateNames[stateCode];
      var percentage = stateHeartAttackCounts[stateName] || 0;
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(stateName + ": " + percentage.toFixed(2) + "%")
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    }

    // Function to handle mouseout event
    function handleMouseOut() {
      // Restore opacity and remove highlight
      svg
        .selectAll("path")
        .style("opacity", 1)
        .style("stroke", "black")
        .style("stroke-width", 1);

      // Hide tooltip
      tooltip.transition().duration(500).style("opacity", 0);
    }

    // Define legend
    var legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", "translate(900, 20)"); // Adjust the X value 

    var legendData = [
      { color: "#fee5d9", label: "0.00 - 3.00%" },
      { color: "#fcae91", label: "3.00 - 4.50%" },
      { color: "#fb6a4a", label: "4.50 - 6.00%" },
      { color: "#de2d26", label: "6.00 - 7.50%" },
      { color: "#a50f15", label: "7.50% and above" },
    ];

    var legendItems = legend
      .selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
      });

    legendItems
      .append("rect")
      .attr("class", "legend-color")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 20)
      .attr("height", 10)
      .style("fill", function (d) {
        return d.color;
      });

    legendItems
      .append("text")
      .attr("x", 30)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text(function (d) {
        return d.label;
      });
  });
});
