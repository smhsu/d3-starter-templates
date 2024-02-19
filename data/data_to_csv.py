import pandas as pd
from textblob import TextBlob

# Label sentiment for tweet based on polarity
def label_sentiment(tweet):
    if isinstance(tweet, str):
        analysis = TextBlob(tweet)
        if analysis.sentiment.polarity > 0:
            # Positive sentiment
            return 1
        elif analysis.sentiment.polarity == 0:
            # Neutral sentiment
            return 0
        else:
            # Negative sentiment
            return -1
    else:
        # None for non-string values
        return 0
    
def process_chunks(file_path):
    chunks = pd.read_csv(file_path,
                            dtype=str,
                            chunksize=1000,
                            na_values=['NA', 'N/A', 'NaN', 'missing'],
                            encoding='utf-8',
                            lineterminator='\n',
                            parse_dates=True)
    dtype_dict = {'likes': int, 'retweet_count': int, 'user_followers_count': int, 'tweet': str}
    dfs = []
    for i, chunk in enumerate(chunks):
        print(i)
        try:
            chunk = chunk.astype(dtype_dict, errors='ignore')
            chunk['sentiment'] = chunk['tweet'].apply(label_sentiment)
            dfs.append(chunk)
        except:
            pass
    return dfs

# Directory file path to Donald Trump tweets
file_path_dt = "/Users/aadarshkrishnan/Desktop/raw_data/hashtag_donaldtrump.csv"
# Directory file path to Joe Biden tweets
file_path_jb = "/Users/aadarshkrishnan/Desktop/raw_data/hashtag_joebiden.csv"


# Add Sentiment Column to Donald Trump Tweets
dfdt_chunks = process_chunks(file_path_dt)
dfdt = pd.concat(dfdt_chunks, ignore_index=True)
print("donald trump tweets finished")

# Add Sentiment Column to Joe Biden Tweets
dfjb_chunks = process_chunks(file_path_jb)
dfjb = pd.concat(dfjb_chunks, ignore_index=True)
print("joe biden tweets finished")

# Create new csv with sentiment
dfdt.to_csv("dt_with_sentiment.csv", index=False)
dfjb.to_csv("jb_with_sentiment.csv", index=False)

print("writing all tweets to csv finished")