import pandas as pd

# Load the CSV file
data = pd.read_csv('data.csv')

# Convert 'HadHeartAttack' column to numerical values
data['HadHeartAttack'] = data['HadHeartAttack'].map({'No': 0, 'Yes': 1})

# Create a new column 'group' combining AgeCategory and GeneralHealth
data['group'] = data['AgeCategory'] + '_' + data['GeneralHealth']

# Group the data by the 'group' column
grouped = data.groupby('group')

# Calculate the percentage
percentage = grouped.apply(lambda x: x['HadHeartAttack'].sum() / len(x) * 100)

# Create a DataFrame from the result
result_df = percentage.reset_index()
result_df.columns = ['Group', 'PercentageWithHeartDisease']

# Split the 'Group' column into 'AgeCategory' and 'GeneralHealth'
result_df[['AgeCategory', 'GeneralHealth']] = result_df['Group'].str.split('_', expand=True)
result_df = result_df.drop('Group', axis=1)

# Write the result to a CSV file
result_df.to_csv('output.csv', index=False)