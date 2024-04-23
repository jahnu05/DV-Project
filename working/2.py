import pandas as pd

# Read the data from the CSV file
data = pd.read_csv('data.csv')

# Filter rows where HadHeartAttack is 'Yes'
heart_disease_data = data[data['HadHeartAttack'] == 'Yes']
def categorize_bmi(bmi):
    if bmi < 18.5:
        return 'Underweight (<18.5)'
    elif bmi < 25:
        return 'Normal weight (18.5-24.9)'
    elif bmi < 30:
        return 'Overweight (25-29.9)'
    else:
        return 'Obesity (>=30)'

# def categorize_bmi(bmi):
#     if bmi < 18.5:
#         return '< 18.5 -- underweight'
#     elif bmi < 25:
#         return '18.5-24.9 -- good'
#     elif bmi < 30:
#         return '25-29.9 -- overweight'
#     elif bmi  < 35:
#         return '30-34.9 --- obese'
#     elif bmi < 40:
#         return '35-39.9 --- obese'
#     else:
#         return '> 40 --- obese'
# # Apply the function to create a new column 'BMI category'
# data['BMI category'] = data['BMI'].apply(categorize_bmi)

# Apply the function to create a new column 'BMI category' to both data and heart_disease_data
# data['BMI category'] = data['BMI'].apply(categorize_bmi)
heart_disease_data.loc[:, 'BMI category'] = heart_disease_data['BMI'].apply(categorize_bmi)

# Calculate the percentage of people with heart disease in each BMI category for each AgeCategory
age_bmi_counts = heart_disease_data.groupby(['AgeCategory', 'BMI category']).size()
age_counts = data.groupby('AgeCategory').size()
age_bmi_percentage = (age_bmi_counts / age_counts).groupby('AgeCategory').idxmax()

# Create a DataFrame with AgeCategory and BMI range
result = pd.DataFrame({'AgeCategory': age_bmi_percentage.index,
                       'BMI range': age_bmi_percentage.values})
result['BMI range'] = result['BMI range'].apply(lambda x: x[1].replace("'", "").replace("(", "").replace(")", "") if pd.notna(x) else x)

# Save the result to a new CSV file
result.to_csv('max_percentage_heart_disease.csv', index=False)
