
function getProjectTaskLogHistory(proj_id) {
    var proj_task_log_history_id = proj_id;
    $("#projectTaskLogHistoryModal").modal("show");

    try {
        $.ajax({
            type: "GET",
            url: '/project-management/get-project-task-log-history/',
            data: {
                'proj_id': proj_task_log_history_id,
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
                    var task_log_data = response['task_history_details'];
                    taskLogJsonData = task_log_data;
                    var length = Object.keys(task_log_data.task_logs).length;
                    if (length == 0) {
                        $("#projectTaskLogHistoryTable").DataTable().rows().remove().draw();
                    }
                    else {
                        $('#projectTaskLogHistoryTable').modal();
                        populateDataTable(taskLogJsonData);
                        function populateDataTable(task_log_data) {
                            $("#projectTaskLogHistoryTable").DataTable({
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
                                            columns: [ 0, 1, 2, 3, 4, 5]
                                        }
                                    },
                                ],

                                "language": {
                                    "search": '<i style="color:grey" class="fas fa-search" aria-hidden="true">_INPUT_</i>',
                                    "searchPlaceholder": "Filter Records",   // Placeholder for the search box

                                },

                            }).clear();

                            var length = Object.keys(task_log_data.task_logs).length;
                            for(var i = 1; i < length+1; i++) {
                                var task_log = task_log_data.task_logs['task_log'+i];
                                var date = new Date(task_log.Created_At);
                                var time_zone = task_log.time_zone
                                var Created_At = date.toLocaleString('en-US',{timeZone:time_zone});

                                $('#projectTaskLogHistoryTable').dataTable().fnAddData([
                                    task_log.Log_ID,
                                    task_log.Task_ID,
                                    task_log.Log_Message,
                                    task_log.Created_By,
                                    Created_At,
                                    task_log.Task_Log_Status,
                                ]);
                            }
                        }
                    }
                }
                else {
                    loader('hide');
                    console.log("Something went wrong in get task log history!");
                }
            }
        });
    }
    catch (err) {
        loader('hide');
        console.log("get task log history error:->",err);
    }
}


$('#close_task_log_history').click(function(){
    $("#projectTaskLogHistoryTable").modal("hide");
});

