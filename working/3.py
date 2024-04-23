import pandas as pd

# Read the CSV file into a DataFrame
df = pd.read_csv('data.csv')

# Filter the data to include only rows where HadHeartAttack is 'Yes'
heart_disease_df = df[df['HadHeartAttack'] == 'Yes']

# Group the filtered data by AgeCategory and calculate the percentage of people who had a heart attack in each age category
age_category_percentage = heart_disease_df.groupby('AgeCategory').size() / len(heart_disease_df) * 100

# Initialize an empty DataFrame to store the result
result_df = pd.DataFrame(columns=['AgeCategory', 'SleepHours'])

# For each age group, find the number of sleep hours of the maximum percentage of people who had a heart attack
for age_category in age_category_percentage.index:
    # Filter the data to include only rows with the current age category
    age_group_df = df[df['AgeCategory'] == age_category]
    # Get the maximum number of people who had a heart attack in this age category
    max_heart_attack_count = age_group_df['HadHeartAttack'].value_counts().max()
    # Filter the data to include only rows with the maximum number of people who had a heart attack
    max_heart_attack_df = age_group_df[age_group_df['HadHeartAttack'] == 'Yes']
    # Get the sleep hours of these people
    sleep_hours = max_heart_attack_df['SleepHours'].iloc[0]
    # Append the result to the result DataFrame
    result_df = pd.concat([result_df, pd.DataFrame({'AgeCategory': [age_category], 'SleepHours': [sleep_hours]})], ignore_index=True)

# Write the result to a new CSV file
result_df.to_csv('result.csv', index=False)
