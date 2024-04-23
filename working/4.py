import pandas as pd

# Read the data from the CSV file
data = pd.read_csv('data.csv')

# Filter rows where HadHeartAttack is 'Yes'
heart_disease_data = data[data['HadHeartAttack'] == 'Yes']

def categorize_bmi(bmi):
    if bmi < 18.5:
        return '< 18.5'
    elif bmi < 25:
        return '18.5-24.9'
    elif bmi < 30:
        return '25-29.9'
    elif bmi  < 35:
        return '30-34.9'
    elif bmi < 40:
        return '35-39.9'
    else:
        return '> 40'

# Apply the function to create a new column 'BMI category' to both data and heart_disease_data
data['BMI category'] = data['BMI'].apply(categorize_bmi)
heart_disease_data['BMI category'] = heart_disease_data['BMI'].apply(categorize_bmi)

# Calculate the percentage of people with heart disease in each BMI category for each AgeCategory
age_bmi_counts = heart_disease_data.groupby(['AgeCategory', 'BMI category']).size()
age_counts = data.groupby('AgeCategory').size()
age_bmi_percentage = (age_bmi_counts / age_counts).groupby('AgeCategory').idxmax()

# Create a DataFrame with AgeCategory, BMI range, and SleepHours
result = pd.DataFrame({'AgeCategory': age_bmi_percentage.index,
                       'BMI range': age_bmi_percentage.values,
                       'SleepHours': 0})  # Initialize SleepHours column with 0
result['BMI range'] = result['BMI range'].apply(lambda x: x[1].replace("'", "").replace("(", "").replace(")", "") if pd.notna(x) else x)

# Fill in the SleepHours column based on the maximum percentage of people who had a heart attack in each age category
for index, row in result.iterrows():
    age_category = row['AgeCategory']
    max_heart_attack_df = data[(data['AgeCategory'] == age_category) & (data['HadHeartAttack'] == 'Yes')]
    max_heart_attack_count = max_heart_attack_df.shape[0]
    if max_heart_attack_count > 0:
        max_sleep_hours = max_heart_attack_df['SleepHours'].iloc[0]
        result.at[index, 'SleepHours'] = max_sleep_hours

# Save the result to a new CSV file
result.to_csv('g2.csv', index=False)
