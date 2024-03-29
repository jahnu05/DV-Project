// Function to get the value of a URL parameter by name
function getParameterByName(name, url) {
    // If URL is not provided, use the current window's URL
    if (!url) url = window.location.href;

    // Escape special characters in the name
    name = name.replace(/[\[\]]/g, "\\$&");

    // Create a regex to match the parameter with its value
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");

    // Execute the regex on the URL to get the matching results
    var results = regex.exec(url);
    
    // If no results, return null
    if (!results) return null;

    // If the parameter has no value, return an empty string
    if (!results[2]) return "";

    // Decode the URI component and replace any plus signs with spaces
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Extract the state name parameter from the URL
var stateName = getParameterByName("state");

// Update the main heading element with the state name
var mainHeading = document.getElementById("main-heading");
mainHeading.textContent = "Stats of " + stateName + " State";
