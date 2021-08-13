#!/usr/bin/env python3
import json
from datetime import datetime
from jimuWorkout import JimuWorkout

SPORTS_MAP = {
    'CROSSFIT': 'Circuit',
    'PILATES': 'Pilates',
    'MARTIAL_ARTS': 'Martial arts',
    'WEIGHT_TRAINING': 'Weight',
    'SPINNING': 'Bike indoor',
    'YOGA': 'Yoga',
    'FITNESS_WALKING': 'Walking',
    'WALKING': 'Walking',
    'CYCLING_TRANSPORTATION': 'Bike outdoor',
    'TREADMILL_WALKING': 'Walking',
    'HIKING': 'Hiking',
    'STRETCHING': 'Stretching',
    'SWIMMING': 'Swimming',
    'CROSS_TRAINING': 'Circuit',
    'BOXING': 'Martial arts',
    'CYCLING_SPORT': 'Bike indoor',
    'TREADMILL_RUNNING': 'Walking',
}
TITLE_MAP = {
    'STRETCHING': '*Alongamento',
    'SPINNING': '*Bike',
    'CYCLING_TRANSPORTATION': '*Bike',
    'CYCLING_SPORT': '*Bike',
    'WALKING': '*Caminhada',
    'TREADMILL_WALKING': '*Esteira',
    'TREADMILL_RUNNING': '*Esteira',
    'FITNESS_WALKING': '*Caminhada',
    'HIKING': '*Trilha',
    'SWIMMING': '*Natação',
    'YOGA': '*Yoga',
    'PILATES': '*Pilates',
    'BOXING': '*Boxe',
    'CROSSFIT': '*Circuito',
    'CROSS_TRAINING': '*Circuito'
}

def transform_title_local(endo_workout, jimu_workout):
    # print(f"{endo_workout.sport} {endo_workout.start_time} {endo_workout.duration} {endo_workout.name}")  
    title = ''; local = ''; 
    title_local = endo_workout.name.split('-')
    
    if len(title_local) == 1:
        title = TITLE_MAP[endo_workout.sport]   
        local = endo_workout.name
    else: 
        title = title_local[0]
        local = title_local[1]
        if '[zoom] Karate' in title :
            title = 'Karate'
            local = 'Casa + zoom'

    if local == '':
        local = 'NAO_IDENTIFICADO'

    jimu_workout.title = title.strip()
    jimu_workout.local = local.strip()


def do(stage):
    print('* transforming: ' + str(len(stage)))
    jimu_workouts = []
    for endo_workout in stage:
        jimu_workout = JimuWorkout(
            '',
            datetime.strptime(endo_workout.start_time, "%Y-%m-%d") ,
            int(int(endo_workout.duration) / 60),
            '',
            SPORTS_MAP[endo_workout.sport]
        )
        transform_title_local(endo_workout, jimu_workout)
        jimu_workouts.append(jimu_workout)

    stage.clear()
    for jimu_workout in jimu_workouts: stage.append(jimu_workout.toJSON())