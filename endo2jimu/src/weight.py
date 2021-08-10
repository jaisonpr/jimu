
def get_database():
    from pymongo import MongoClient 

    client = MongoClient("mongodb://127.0.0.1:27017/")
    return client['jimu-db']

def get_weights():
    from pathlib import Path
    from datetime import datetime

    weights = []
    entries = Path.cwd().joinpath('endo2jimu', 'data', 'Weights')
    for entry in entries.iterdir():
        with open(entry, 'r') as f:
            weight = ''; date = ''
            for line in f:
                if 'weight_kg' in line:
                    weight = line.strip().replace(',', '').replace('_kg', '')[11:-1]
                if 'date' in line:
                    sdate = line.strip()[10:-13]
                    date = datetime.strptime(sdate, "%Y-%m-%d") 
                    weights.append( { "date" : date, "weight" : weight, "bmi" : 0 } )
    return weights

print('***** START *****')

db = get_database()
collection = db["bodymeasurements"]
collection.insert_many( get_weights())

print('***** END *****')