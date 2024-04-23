import json
import pandas as pd

# Load data from CSV
data = pd.read_csv('data.csv')

# Define the JSON structure
json_data = {
    "name": "stateName",
    "children": [
        {
            "name": "AgeCategory",
            "children": [
                { "name": "Age 18 to 24" },
                { "name": "Age 25 to 29" },
                { "name": "Age 30 to 34" },
                { "name": "Age 35 to 39" },
                { "name": "Age 40 to 44" },
                { "name": "Age 45 to 49" },
                { "name": "Age 50 to 54" },
                { "name": "Age 55 to 59" },
                { "name": "Age 60 to 64" },
                { "name": "Age 65 to 69" },
                { "name": "Age 70 to 74" },
                { "name": "Age 75 to 79" },
                { "name": "Age 80 or above" }
            ]
        },
        {
            "name": "GeneralHealth",
            "children": [
                { "name": "Very good" },
                { "name": "Good" },
                { "name": "Excellent" },
                { "name": "Fair" },
                { "name": "Poor" }
            ]
        },
        {
            "name": "SmokerStatus",
            "children": [
                { "name": "Former smoker" },
                { "name": "Never smoked" },
                { "name": "Current smoker - now smokes every day" },
                { "name": "Current smoker - now smokes some days" }
            ]
        }
    ]
}

# Calculate percentage for each category
for category in json_data['children']:
    category_name = category['name']
    for subcategory in category['children']:
        subcategory_name = subcategory['name']
        # Calculate percentage of individuals who had a heart attack
        percentage = len(data[(data['HadHeartAttack'] == 'Yes') & (data[category_name] == subcategory_name)]) / len(data) * 100
        # Round the percentage to 2 decimal places
        percentage = round(percentage, 2)
        # Append percentage to JSON structure
        subcategory['percentage'] = percentage

# Write the updated JSON data to a file
with open('output.json', 'w') as json_file:
    json.dump(json_data, json_file)

print("JSON data written to output.json")
