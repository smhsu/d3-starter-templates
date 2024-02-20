import pandas as pd
import json

def csv_to_json(csv_file):
    # Read the CSV file into a DataFrame
    df = pd.read_csv(csv_file)
    
    # Convert the DataFrame to a JSON object
    json_data = df.to_dict(orient='records')
    
    return json_data

file_path = './jb_with_sentiment.csv'
output_path = 'jb_tweet.js'
json_data = csv_to_json(file_path)

with open(output_path, 'w') as f:
        json.dump(json_data, f, indent=4)