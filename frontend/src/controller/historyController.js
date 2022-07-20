'use strict';
import { BaseController } from './base.js';
import { basicFilterForm } from './helper/formHelper.js';
import { populateSportSelect, formatInitialDate, formatFinalDate, formatDate } from './helper/formHelper.js';


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
  
        workouts.map( function(w) { 
            w.dateTime = formatDate(w.dateTime);
            return w; 
        });
            
        $('#table-history').DataTable().destroy();
        if ( $.fn.dataTable.isDataTable( '#table-history' ) ) {
            $('#table-history').DataTable();
        } else {
            $('#table-history').DataTable( {
                searching: false,
                data: workouts, 
                columns: [
                    { data: 'dateTime' }, 
                    { data: 'title' },
                    { data: 'duration' },
                    { data: 'local' },
                    { data: 'sport' }
                ]
            });
        }
        $('#div-table-history').show();
    }
}
export { HistoryController };