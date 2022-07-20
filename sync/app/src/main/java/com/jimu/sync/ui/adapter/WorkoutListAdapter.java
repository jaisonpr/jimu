package com.jimu.sync.ui.adapter;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.jimu.sync.R;
import com.jimu.sync.model.Workout;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class WorkoutsListAdapter extends BaseAdapter {

    private final List<Workout> workouts;

    public WorkoutsListAdapter(List<Workout> workouts, Context context) {
        this.workouts = workouts;
        this.context = context;
    }

    private final Context context;

    @Override
    public int getCount() {
        return this.workouts.size();
    }

    @Override
    public Workout getItem(int position) {
        return workouts.get(position);
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @Override
    public View getView(int position, View view, ViewGroup parent) {

        View viewCreated = LayoutInflater
                .from(context)
                .inflate(R.layout.workout_item, parent, false);

        Workout workout = getItem(position);

        TextView txtSport = viewCreated.findViewById(R.id.workout_item_sport);
        txtSport.setText( workout.getSport());

        TextView txtDate = viewCreated.findViewById(R.id.workout_item_date);
        txtDate.setText( workout.getDate());

        TextView txtDuration = viewCreated.findViewById(R.id.workout_item_duration);
        txtDuration.setText( workout.getDuration());

        return viewCreated;
    }
}
