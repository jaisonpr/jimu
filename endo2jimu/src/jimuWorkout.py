#!/usr/bin/env python3

class JimuWorkout:
    def __init__(self, title, dateTime, duration, local, sport):
        self.title = title
        self.dateTime = dateTime
        self.duration = duration
        self.local = local
        self.sport = sport

    def __str__(self):
        return f'[{self.sport}] {self.dateTime}\t{self.duration}\t{self.title} - {self.local}'

    def toJSON(self):
        return { 
            "title" : self.title, 
            "dateTime" : self.dateTime, 
            "duration" : self.duration, 
            "local" : self.local, 
            "sport" : self.sport
        }