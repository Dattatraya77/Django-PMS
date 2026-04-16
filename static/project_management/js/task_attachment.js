var VALID_EXTENSIONS = ['pdf', 'docx', 'PDF', 'DOC', 'png', 'jpeg', 'jpg', 'txt', 'gif', 'tiff', 'xlsx', 'xls']
var attachment_name_list = [];


$('#attachment_file_input').on('change',function(e){
    var fileName = e.target.files[0].name;
    var files = e.target.files[0];
    for (var i = attachment_name_list.length; i > 0; i--) {
        attachment_name_list.pop();
    }
    attachment_name_list.push(files);
    uploaded_file_extension = fileName.split('.').pop();

    if (VALID_EXTENSIONS.includes(uploaded_file_extension)){
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
        $(this).siblings(".custom-file-label").append('<div class="pt-3"><span class="text-success">File type is valid. You can upload a file.</span></div>');
        $('.btn_upload').removeAttr("disabled");
    }
    else {
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
        $(this).siblings(".custom-file-label").append('<div class="pt-3"><span class="text-danger">File type is invalid. You can upload .pdf, .PDF, .docx, .DOC, .xlsx, .xls, .png, .jpeg, .jpg, .gif, .tiff, .ppt or .txt file.</span></div>');
        $('.btn_upload').attr("disabled",true);
    }
})


function getTaskAttachment(id) {
    var attachment_task_id = id;
    $('#attachment_task_id').val(attachment_task_id);

    try {
        $.ajax({
            type: "GET",
            url: '/project-management/get-task-attachment/',
            data: {
                'task_id': attachment_task_id,
            },
            success: function (response) {
                if(response['success']) {
                    var attachmentData = response['attachment_file_details'];
                    console.log("attachment_file_details ajax:->",attachmentData);
                    myJsonData = attachmentData;
                    var length = Object.keys(attachmentData.attachment_file_lists).length;
                    if (length == 0) {
                        $("#attachmentListTable").DataTable().rows().remove().draw();
                    }
                    else {
                        populateDataTable(myJsonData);
                        function populateDataTable(attachmentData) {
                            $("#attachmentListTable").DataTable({
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
                                            columns: [ 0, 1, 2, 3, 4, 5, 6]
                                        }
                                    },
                                ],
    
                                "language": {
                                    "search": '<i style="color:grey" class="fas fa-search" aria-hidden="true">_INPUT_</i>',
                                    "searchPlaceholder": "Filter Records",   // Placeholder for the search box
    
                                },
    
                            }).clear();
    
    
                            var length = Object.keys(attachmentData.attachment_file_lists).length;
                            for(var i = 1; i < length+1; i++) {
                                var attachment_file = attachmentData.attachment_file_lists['attachment_file'+i];
    
                                var date = new Date(attachment_file.Updated_On);
                                var time_zone = attachment_file.time_zone
                                var Updated_On = date.toLocaleString('en-US',{timeZone:time_zone});
    
                                $('#attachmentListTable').dataTable().fnAddData([
                                    attachment_file.File_ID,
                                    attachment_file.File_Name,
                                    attachment_file.File_Groups,
                                    attachment_file.File_Type,
                                    attachment_file.Created_By,
                                    Updated_On,
    
                                    `<td align="center">
    
                                        <div class="btn-group" role="group" aria-label="First group">
    
                                            <button title="Download Document" class="btn btn-outline-secondary btn-sm"
                                                    onclick="downloadPdf('${attachment_file.Document}','${attachment_file.File_ID}')">
                                                ${ attachment_file.File_Ext == 'pdf'?'<img src="/static/images/pdf.png" width="20" height="20"/>':
                                                attachment_file.File_Ext == 'docx'?'<img src="/static/images/ms-word.png" width="20" height="20"/>':
                                                attachment_file.File_Ext == 'xlsx'?'<img src="/static/images/xls.png" width="20" height="20"/>':
                                                attachment_file.File_Ext == 'txt'?'<img src="/static/images/txt.png" width="20" height="20"/>':
                                                '<img src="/static/images/download.png" width="20" height="20"/>'}
                                            </button>
    
                                            <button type="button" title="View Document" class="btn btn-outline-secondary btn-sm"
                                                    onclick="set_preview('${attachment_file.Document_Url}','${attachment_file.File_ID}')">
                                                <img src="/static/images/view-file.png" width="20" height="20"/>
                                            </button>
    
                                            <button type="button" title="Remove Attachment" class="btn btn-outline-secondary btn-sm"
                                                    onclick="remove_attachment('${attachment_file.task_id}','${attachment_file.File_ID}')">
                                                <i class="far fa-trash-alt fa-lg"></i>
                                            </button>
    
                                        </div>
                                    </td>`
                                ]);
                            }
    
                            $("#th_sortFileId").click();
                            $("#th_sortFileId").click();
                        }
                    }
                }
                else {
                    console.log("Something went wrong in get update task data!");
                }
            }
        });
    }
    catch (err) {
        console.log("get update task data error:->",err);
    }
}


function remove_attachment(t_id, attachment_id) {
    var task_id = t_id;
    var attachment_file_id = attachment_id;

    Swal.fire({
        title: '<h5>Are you sure you want to remove this attachment?</h5>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        cancelButtonText: 'No',
        confirmButtonText: 'Yes',
        reverseButtons: true,
        customClass : {
            popup: 'swal2-popup-custom',
            icon : 'swal2-icon.swal2-warning',
            confirmButton: 'swal2-styled.swal2-confirm',
            cancelButton: 'swal2-styled.swal2-cancel',
        },
        }).then((result) => {
            if(result.isConfirmed){
            $.ajax({
                type: "POST",
                url: '/project-management/remove-attachment/',
                data: {
                    'task_id': task_id,
                    'attachment_file_id':attachment_file_id,
                    'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                },
                success: function (response) {
                    if(response['success']) {
                        var remove_attachment_file = response['remove_attachment_file'];
                        if (remove_attachment_file == "Yes") {
                            getTaskAttachment(task_id);
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                width:300,
                                text: 'File removed from task!',
                                showConfirmButton: false,
                                timer: 3000
                            })
                        }
                        else {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                width:300,
                                title: 'Oops...',
                                text: 'Something went wrong!',
                                showConfirmButton: false,
                                timer: 3000
                            })
                        }

                    }
                    else {

                    }
                }
            });
        }
    })
}


function show_attachment_message(message, alert){
    // modal
    alert_attachment_message.innerHTML = `
    <div class="alert alert-${alert} alert-dismissible fade show" role="alert" >
      <span>${message}</span>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`;
    $('#alert_attachment_message').children().first().delay(3000).fadeOut(2000);
};

$('#btn_upload').click(function(){

    var form_data = $('#attachment_task_form').serializeArray()
    form_data = JSON.stringify(form_data);
    console.log("form_data:->",form_data);
    attachment_name_list.push(form_data);
    console.log("attachment_name_list:->",attachment_name_list);

    var my_task_id = $('#attachment_task_id').val();
    var fd = new FormData();
    var files = attachment_name_list[0];
    fd.append('file',files);
    fd.append('attachment_data',attachment_name_list[1]);
    var $form = $(this);

    // AJAX request
    $.ajax({
        type: "POST",
        url: '/project-management/post-task-attachment/',
        data: fd,
        contentType: false,
        processData: false,
        headers: {
            "X-CSRFToken": $("[name=csrfmiddlewaretoken]").val()
        },
        dataType: "json",
        success: function (res){
            if(res.success){
                getTaskAttachment(my_task_id);
                show_attachment_message('File attached successfully. Thank you!', 'success');
                for (var i = attachment_name_list.length; i > 0; i--) {
                    attachment_name_list.pop();
                }
                $(".custom-file-label").html('');
                $(".custom-file-label").html('Choose file');
                $('.btn_upload').attr("disabled",true);
            }
        }
    });
});


$('#close_attachment').click(function(){
    $(".custom-file-label").html('');
    $(".custom-file-label").html('Choose file');
    $('.btn_upload').attr("disabled",true);
});