$(document).ready(function () {

    jQuery.extend($.fn.dataTableExt.oSort, {
        "date-eu-pre": function (date) {
            date = date.replace(" ", "");

            if (!date) {
                return 0;
            }

            var year;
            var eu_date = date.split(/[\.\-\/]/);

            /*year (optional)*/
            if (eu_date[2]) {
                year = eu_date[2];
            }
            else {
                year = 0;
            }

            /*month*/
            var month = eu_date[1];
            if (month.length == 1) {
                month = 0+month;
            }

            /*day*/
            var day = eu_date[0];
            if (day.length == 1) {
                day = 0+day;
            }

            return (year + month + day) * 1;
        },

        "date-eu-asc": function (a, b) {
            return ((a < b) ? -1 : ((a > b) ? 1 : 0));
        },

        "date-eu-desc": function (a, b) {
            return ((a < b) ? 1 : ((a > b) ? -1 : 0));
        }
    });


    var toDoTable = $('#do_today_table').DataTable({
        responsive: true,
        dom: '<"toolbar"><"float-right pl-3"B>fltip',
        ordering: true,
        //stateSave: true,
        pageLength : 5,
        lengthMenu: [
            [5, 10, 25, 50, -1],
            [5, 10, 25, 50, 'All'],
        ],
        columnDefs : [{type: 'date-eu', targets: 4}],

        buttons: [
            {
                extend:    'copyHtml5',
                text:      '<img src="/static/images/copy.png" width="20" height="20"/>',
                titleAttr: 'Copy list to clipboard',
                title: 'Solviti_Export_Text'
            },
            {
                extend:    'excelHtml5',
                text:      '<img src="/static/images/xls.png" width="20" height="20"/>',
                titleAttr: 'Export list in Excel file format',
                title: 'Solviti_Export_Excel'
            },
            {
                extend:    'csvHtml5',
                text:      '<img src="/static/images/export-csv.png" width="20" height="20"/>',
                titleAttr: 'Export list in CSV file format',
                title: 'Solviti_Export_CSV'
            },
            {
                extend:    'pdfHtml5',
                text:      '<img src="/static/images/pdf.png" width="20" height="20"/>',
                titleAttr: 'Export list in PDF file format',
                title: 'Solviti_Export_PDF',
                orientation: 'landscape',
                pageSize: 'LEGAL',
                exportOptions: {
                    columns: [ 0, 1, 2, 3, 4, 5]
                }
            },

        ],
        "language": {
            "search": '<i style="color:grey" class="fas fa-search" aria-hidden="true">_INPUT_</i>',
            "searchPlaceholder": "Filter Records",   // Placeholder for the search box
        },

    });

    $('#do_later_table').DataTable({
        responsive: true,
        dom: '<"toolbar"><"float-right pl-3"B>fltip',
        ordering: true,
        pageLength : 5,
        lengthMenu: [
            [5, 10, 25, 50, -1],
            [5, 10, 25, 50, 'All'],
        ],
        columnDefs : [{type: 'date-eu', targets: 4}],

        buttons: [
            {
                extend:    'copyHtml5',
                text:      '<img src="/static/images/copy.png" width="20" height="20"/>',
                titleAttr: 'Copy list to clipboard',
                title: 'Solviti_Export_Text'
            },
            {
                extend:    'excelHtml5',
                text:      '<img src="/static/images/xls.png" width="20" height="20"/>',
                titleAttr: 'Export list in Excel file format',
                title: 'Solviti_Export_Excel'
            },
            {
                extend:    'csvHtml5',
                text:      '<img src="/static/images/export-csv.png" width="20" height="20"/>',
                titleAttr: 'Export list in CSV file format',
                title: 'Solviti_Export_CSV'
            },
            {
                extend:    'pdfHtml5',
                text:      '<img src="/static/images/pdf.png" width="20" height="20"/>',
                titleAttr: 'Export list in PDF file format',
                title: 'Solviti_Export_PDF',
                orientation: 'landscape',
                pageSize: 'LEGAL',
                exportOptions: {
                    columns: [ 0, 1, 2, 3, 4, 5]
                }
            },

        ],
        "language": {
            "search": '<i style="color:grey" class="fas fa-search" aria-hidden="true">_INPUT_</i>',
            "searchPlaceholder": "Filter Records",   // Placeholder for the search box
        },

    });

});
