// Function to dynamically load a script from a given URL
function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  // Callback once script is loaded
  script.onload = function () {
    if (callback) callback();
  };
  // Append script to the document body
  document.body.appendChild(script);
}

// Array of script URLs to load sequentially
var scripts = [
  "./main/stacked_bar.js",
  "./main/main_age_no_bar.js",
  "./main/main_covid.js",
  "./main/main_sex_pie.js",
  "./main/main_health_pie.js",
  "./main/main_smoking.js",
  "./main/main_diabetes_pie.js",
];

// Function to load scripts sequentially with a 1.5-second delay between each
function loadScriptsSequentially(index) {
  if (index < scripts.length) {
    loadScript(scripts[index], function () {
      setTimeout(function () {
        loadScriptsSequentially(index + 1);
      }, 1500); // 1.5-second delay
    });
  }
}

// Start loading scripts from the first script in the array
loadScriptsSequentially(0);
