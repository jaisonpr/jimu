#!/usr/bin/env python3
from pathlib import Path
from endoWorkout import EndoWorkout

def get_field(line): return line.split(':')[1].replace('"','').replace('},','').strip()

def do(stage):    
    print('* extracting')
    entries = Path.cwd().joinpath('endo2jimu', 'data', 'Workouts')
    for entry in entries.iterdir():
        with open(entry, 'r') as f:   
            sport = ''; start_time = ''; duration = ''; name = ''
            for line in f:
                if 'name' in line:          name = get_field(line)
                if 'sport' in line:         sport = get_field(line)
                if 'start_time' in line:    start_time = get_field(line)[:-3]
                if 'duration_s' in line:    duration = get_field(line)  
            stage.append( EndoWorkout(name, sport, start_time, duration))
        f.close()
