package com.jimu.sync.ui.activity;

import android.app.AlertDialog;
import android.os.Bundle;
import android.view.MenuItem;
import android.widget.AdapterView;
import android.widget.ListView;

import androidx.appcompat.app.AppCompatActivity;

import com.jimu.sync.R;
import com.jimu.sync.dao.WorkoutDAO;
import com.jimu.sync.ui.adapter.WorkoutsListAdapter;

import java.util.List;
import java.util.Map;

public class ListWorkoutsSyncActivity extends AppCompatActivity {



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list_workouts_sync);

        ListView view = findViewById(R.id.workouts_listview);
        List workouts = new WorkoutDAO().list();
        view.setAdapter( new WorkoutsListAdapter(workouts, this));
    }



    public void confirmDelete(final MenuItem item) {
        new AlertDialog
                .Builder(context)
                .setTitle("Removendo aluno")
                .setMessage("Tem certeza que quer remover o aluno?")
                .setPositiveButton("Sim", (dialogInterface, i) -> {
                    AdapterView.AdapterContextMenuInfo menuInfo =
                            (AdapterView.AdapterContextMenuInfo) item.getMenuInfo();
                    Aluno alunoEscolhido = adapter.getItem(menuInfo.position);
                    remove(alunoEscolhido);
                })
                .setNegativeButton("Não", null)
                .show();
    }
}