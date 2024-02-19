import pandas as pd

tweets = pd.read_csv("dt_with_sentiment.csv",
                            dtype=str,
                            chunksize=1000,
                            na_values=['NA', 'N/A', 'NaN', 'missing'],
                            encoding='utf-8',
                            lineterminator='\n',
                            parse_dates=True)

df = pd.concat(tweets, ignore_index=True)
print(df.head(10))