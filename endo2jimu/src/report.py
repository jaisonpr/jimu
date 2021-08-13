#!/usr/bin/env python3
from pathlib import Path
import datetime
import time

def get_field(line): return line.split(':')[1].replace('"','').replace('},','').strip()

LOCALS = [
    'budokan', 'casa', 'budyoga', 'pilates fit center', 'dtp', 'better you', 'monique', 'kawai shihan', 'sesc', 'rf',
    'bc', 'bunsei', 'tokushi', 'pucpr', 'nikkei', 'orleans', 'trilha', 'nao_identificado', 'morro_tirolesa', 'st_Amaro',
    'nikkei', 'st_amaro', 'sao jose' ]
WORKOUTS = [
    'karate', 'aikido', 'poc', 'poca', 'fisio', 'bat', 'corep', 'batoc', 'ap ab', 'abs', 
    'ap_ab', 'superior', '[zoom] karate', 'corep / hiit', 'pre', 'treino a',
    'treino b', 'treino c', 'bike', 'bat / hiit', 'poc / hiit',
    'superior + bike', 'core / hiit', 'bat + bike', 'poc + bike', 'superior / hiit', 
    'hiit', 'solo', 'oc', 'core', 'bat / p', 'o', 'treino p', 'superior', 'p', 'c',
    'trilha', 'wing chun', 'fundamentos' ] 

def analyze_field1(file_name, field1, file):    
    if field1.lower() not in LOCALS:
        file.write('1-1: %s - %s\n' % (file_name, field1))
        if field1.lower() not in WORKOUTS:
            file.write('1-2: %s - %s\n' % (file_name, field1))
    
def analyze_field2(file_name, field1, field2, file):    
    if field1.lower().strip() not in WORKOUTS:
        file.write('2-1: %s\t%s\t%s\n' % (file_name, field1, ''))  
    if field2.lower().strip() not in LOCALS:  
        file.write('2-2: %s\t%s\t%s\n' % (file_name, field1, field2))  

def analyze_field3(file_name, field1, field2, field3, file):   
    file.write('3: %s\t%s\t%s\t%s\n' % (file_name, field1, field2, field3))  


def analyze():
    print('* analyzing')
    
    out_path = Path.cwd().joinpath('endo2jimu', 'data', 'analyze_result.txt')
    with open(out_path, 'w') as out_file:      
        input = Path.cwd().joinpath('endo2jimu', 'data', 'Workouts')
        for entry in input.iterdir():
            with open(entry, 'r') as f:    
                for line in f:
                    if 'name' in line:
                        lname = line.split(':')[1].replace('"','').replace('},','').strip()
                        sname = lname.split('-')
                        
                        if len(sname) == 1: analyze_field1(entry.name, sname[0], out_file)
                        if len(sname) == 2: analyze_field2(entry.name, sname[0], sname[1], out_file)
                        if len(sname) == 3: analyze_field3(entry.name, sname[0], sname[1], sname[2], out_file)
            f.close()  
    out_file.close()    

def format_time(seconds, granularity=3):
    intervals = (
        ('weeks', 604800),  # 60 * 60 * 24 * 7
        ('days', 86400),    # 60 * 60 * 24
        ('hours', 3600),    # 60 * 60
        ('minutes', 60),
        ('seconds', 1),
    )    
    result = []
    for name, count in intervals:
        value = seconds // count
        if value:
            seconds -= value * count
            if value == 1: name = name.rstrip('s')
            result.append("{} {}".format(value, name))
    return ', '.join(result[:granularity])

def discovery():
    print('* discovering')
    sports = {}
    total_workouts = 0
    total_time = 0

    input = Path.cwd().joinpath('endo2jimu', 'data', 'Workouts')
    for entry in input.iterdir():
        sport_name = ''
        duration = 0
        with open(entry, 'r') as f:    
            for line in f:
                if 'duration_s' in line:    
                    duration = int(get_field(line))
                    total_time += duration
                if 'sport' in line:
                    sport_name = get_field(line)
                    total_workouts += 1
        f.close()      

        if sport_name in sports.keys(): 
            sports[sport_name][0] += duration 
            sports[sport_name][1] += 1
        else:
            sports[sport_name] = [duration, 1]

    sports['***Total***'] = [total_time, total_workouts]

    output = Path.cwd().joinpath('endo2jimu', 'data', 'discovery_result.txt')
    with open(output, 'w') as f:  
        for sport_name in sports:
            sport = sports[sport_name]            
            print(sport)
            f.write("%s\t\t\t%s\t\t\t%s\n" % (sport_name, sport[1], sport[0]) )
        f.write("%s (%s)" % (sport[0], format_time(sport[0])))
    f.close()     

def do():
    print('* reporting')
    discovery()
    analyze()
     

