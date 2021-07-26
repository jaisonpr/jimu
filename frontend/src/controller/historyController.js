'use strict';
import { BaseController } from './base.js';
import { basicFilterForm } from './formHelper.js';
import { populateSportSelect, formatInitialDate, formatFinalDate } from './formHelper.js';


class HistoryController {

    static initForm() {
        
        populateSportSelect(true);
        basicFilterForm();

        $('#btnFilter').on('click', function (e) {
            HistoryController.filter();
        });
    }

    static filter() { 
        let workouts = BaseController.sendQuery('workouts', 
            `title=${$('#title').val() }&`+
            `dateInitial=${formatInitialDate($('#dateIni').val())}&`+
            `dateFinal=${formatFinalDate($('#dateFinal').val())}&`+
            `local=${$('#local').val()}&`+
            `sport=${$('#sport').val()}`);

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
        $('#div-table-history').show();
    }
}
export { HistoryController };