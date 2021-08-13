#!/usr/bin/env python3
from datetime import datetime
from jimuWorkout import JimuWorkout

def get_database():
    from pymongo import MongoClient 
    client = MongoClient("mongodb://127.0.0.1:27017/")
    return client['jimu-db']

def do(stage):
    print('* loading: ' + str(len(stage)))
 
    db = get_database()
    collection = db["workouts"]
    collection.insert_many( stage )