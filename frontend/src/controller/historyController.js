'use strict';
import { BaseController } from './base.js';
import { populateSportSelect } from './workoutHelper.js';


class HistoryController {

    static initForm() {
        
        let select = document.getElementById("sport");    
        let el = document.createElement("option");
            el.textContent = '';
            el.value = '';
            select.appendChild(el);

        populateSportSelect();

        let dateTime = new Date();

        let month = dateTime.getMonth() + 1;
        if (month < 10) month = '0' + month;
        let day = dateTime.getDate();    
        if (day < 10) day = '0' + day;

        document.getElementById('dateIni').value = '2021-01-01';
        document.getElementById('dateFinal').value = `${dateTime.getFullYear()}-${month}-${day}`;

        jQuery(function ($) {
            $("#dateIni").mask("9999-99-99", { autoclear: false });
            $("#dateFinal").mask("9999-99-99", { autoclear: false });
        });

        $('#btnFilter').on('click', function (e) {
            HistoryController.filter();
        });
    }

    static filter() {
        let title = document.getElementById('title').value;
        let dateIni = document.getElementById('dateIni').value;
        let dateFinal = document.getElementById('dateFinal').value;
        let local = document.getElementById('local').value;
        let sport = document.getElementById('sport').value;

        let query = `title=${title}&dateInitial=${dateIni}&dateFinal=${dateFinal}&local=${local}&sport=${sport}`; 
        let workouts = BaseController.getByQuery('workouts', query);

        workouts.forEach(w => {
            w.dateTime = `${w.dateTime.toString().substring(0, 10)} ${w.dateTime.toString().substring(11, 16)}`;
        });
            
        if ( $.fn.dataTable.isDataTable( '#table-history' ) ) {
            $('#table-history').DataTable();
        } else {
            $('#table-history').DataTable( {
                searching: false,
                data: JSON.parse( JSON.stringify(workouts)), 
                columns: [
                    { data: 'dateTime' }, 
                    { data: 'title' },
                    { data: 'duration' },
                    { data: 'local' },
                    { data: 'sport' }
                ]
            }) 
        }
        document.getElementById('div-table-history').style.display = "";
    }
}
export { HistoryController };