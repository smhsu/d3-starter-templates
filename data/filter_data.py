import pandas as pd

def process_chunks(file_path):
    chunks = pd.read_csv(file_path,
                            dtype=str,
                            chunksize=1000,
                            na_values=['NA', 'N/A', 'NaN', 'missing'],
                            encoding='utf-8',
                            lineterminator='\n',
                            parse_dates=True)
    

    dtype_dict = {'created_at': str, 'likes': int, 'retweet_count': int, 'sentiment\r': int}
    df = pd.DataFrame(columns=['likes', 'retweet_count'])

    for i, chunk in enumerate(chunks):
        print(i, end='\r')
        # if i > 10:
        #     break
        try:
            chunk = chunk.astype(dtype_dict, errors='ignore')
            chunk['created_at'] = pd.to_datetime(chunk['created_at'])
            chunk['day'] = chunk['created_at'].dt.to_period('D')
            chunk['likes'] = chunk['likes'].astype(float)
            chunk['retweet_count'] = chunk['retweet_count'].astype(float)
            daily_totals = chunk.groupby(['day', 'sentiment\r']).agg({'likes': 'sum', 'retweet_count': 'sum'})
            df = pd.concat([df, daily_totals])
        except Exception as e:
            print('Exception: ' + e)
            pass
    return df

# Directory file path to Donald Trump tweets
file_path_dt = "./dt_with_sentiment.csv"
# Directory file path to Joe Biden tweets
file_path_jb = "./jb_with_sentiment.csv"

file_paths = [file_path_dt, file_path_jb]
output_paths = ['dt_dates_sentiment.csv', 'jb_dates_sentiment.csv']
for i in range(2):
    df = process_chunks(file_paths[i])
    df.reset_index(inplace=True)
    df = df.groupby('index').agg({'likes': 'sum', 'retweet_count': 'sum'})
    df.reset_index(inplace=True)
    df['day'] = df['index'].astype(str).str.extract(r"(\d+-\d+-\d+)").astype(str)
    df['sentiment'] = df['index'].astype(str).str.extract(r", (-?\d+)").astype(float).fillna(0).astype(int)
    df = df.drop(df.columns[0], axis=1)
    df.to_csv(output_paths[i], index=False)
