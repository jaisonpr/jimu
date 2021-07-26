'use strict';
import { formatTwoDigits, month } from '../util.js';
import { BaseController } from './base.js';
import { populateSportSelect } from './workoutHelper.js';


class HistoryController {

    static initForm() {
        
        populateSportSelect(true);

        let dateTime = new Date();
        let month = formatTwoDigits(dateTime.getMonth() + 1);
        let day = formatTwoDigits(dateTime.getDate());    

        $('#dateIni').val('2021-01-01'); 
        $('#dateFinal').val(`${dateTime.getFullYear()}-${month}-${day}`); 
        $("#dateIni").mask("9999-99", { autoclear: false });
        $("#dateFinal").mask("9999-99", { autoclear: false }); 

        $('#btnFilter').on('click', function (e) {
            HistoryController.filter();
        });
    }

    static filter() { 
        let dateIni = `${$('#dateIni').val()}-01`;
        let dateFinal = `${$('#dateFinal').val()}-${ new Date('2021', month($('#dateFinal').val()), 0).getDate()}`;
        let workouts = BaseController.sendQuery('workouts', 
            `title=${$('#title').val() }&`+
            `dateInitial=${dateIni}&`+
            `dateFinal=${dateFinal}&`+
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