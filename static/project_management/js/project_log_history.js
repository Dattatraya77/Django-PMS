
function getProjectLogHistory(proj_id) {
    var proj_log_history_id = proj_id;
    $("#projectLogHistoryModal").modal("show");

    try {
        $.ajax({
            type: "GET",
            url: '/project-management/get-project-log-history/',
            data: {
                'proj_id': proj_log_history_id,
            },
            dataType: "json",
            beforeSend: function () {
                loader('show');
            },
            complete: function () {
                loader('hide');
            },
            success: function (response) {
                if(response['success']) {
                    // task log history
                    loader('hide');
                    var project_log_data = response['project_history_details'];
                    taskLogJsonData = project_log_data;
                    var length = Object.keys(project_log_data.project_logs).length;
                    if (length == 0) {
                        $("#projectLogHistoryTable").DataTable().rows().remove().draw();
                    }
                    else {
                        $('#projectLogHistoryTable').modal();
                        populateDataTable(taskLogJsonData);
                        function populateDataTable(project_log_data) {
                            $("#projectLogHistoryTable").DataTable({
                                responsive: true,
                                dom: '<"toolbar"><"float-right pl-3"B>fltip',
                                ordering: true,
                                retrieve: true,

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
                                            columns: [ 0, 1, 2, 3, 4]
                                        }
                                    },
                                ],

                                "language": {
                                    "search": '<i style="color:grey" class="fas fa-search" aria-hidden="true">_INPUT_</i>',
                                    "searchPlaceholder": "Filter Records",   // Placeholder for the search box

                                },

                            }).clear();

                            var length = Object.keys(project_log_data.project_logs).length;
                            for(var i = 1; i < length+1; i++) {
                                var project_log = project_log_data.project_logs['project_log'+i];
                                var date = new Date(project_log.Created_At);
                                var time_zone = project_log.time_zone
                                var Created_At = date.toLocaleString('en-US',{timeZone:time_zone});

                                $('#projectLogHistoryTable').dataTable().fnAddData([
                                    project_log.Log_ID,
                                    project_log.Project_ID,
                                    project_log.Log_Message,
                                    project_log.Created_By,
                                    Created_At,
                                    project_log.Project_Log_Status,
                                ]);
                            }
                        }
                    }
                }
                else {
                    loader('hide');
                    console.log("Something went wrong in get project log history!");
                }
            }
        });
    }
    catch (err) {
        loader('hide');
        console.log("get task log history error:->",err);
    }
}


$('#close_project_log_history').click(function(){
    $("#projectLogHistoryTable").modal("hide");
});

