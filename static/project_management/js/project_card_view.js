
var url = '/project-management/project-data/';


function updateProjectCardView(id){
    var proj_id = id;
    try {
        $.ajax({
            type: "GET",
            url: '/project-management/get-update-project-view/',
            data: {
                'proj_id': proj_id,
            },
            beforeSend: function () {
                loader('show');
            },
            complete: function () {
                loader('hide');
            },
            success: function (response) {
                if(response['success']) {
                    loader('hide');
                    $("#updateProjectCardModal").modal("show");
                    var project_list_dict = response["project_list"];
                    var proj_id = project_list_dict[0]["proj_id"];
                    var proj_name = project_list_dict[0]["proj_name"];
                    var proj_description = project_list_dict[0]["proj_description"];
                    var proj_status = project_list_dict[0]["proj_status"];
                    var proj_start_date = project_list_dict[0]["proj_start_date"];
                    var proj_end_date = project_list_dict[0]["proj_end_date"];
                    var project_status_list = project_list_dict[0]["project_status_list"];
                    var proj_group = project_list_dict[0]["proj_group"];
                    var project_group_list = project_list_dict[0]["project_group_list"];
                    var proj_signature = project_list_dict[0]["proj_signature"];
                    var proj_master_name = project_list_dict[0]["proj_master_name"];
                    var proj_master_name_list = response["section_master_names"];
                    var proj_dropdown_field = project_list_dict[0]["proj_dropdown_field"];
                    var proj_dropdown_field_list = response["proj_dropdown_field_list"];

                    let html_update_project = '';
                    html_update_project += `
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="form-group">
                                <label for="projectName">Project name:</label>
                                <input placeholder="Project name..." type="text" id="projectName" name="projectName" class="form-control" value="${proj_name}" required>
                                <small class="text-danger" id="updateProjectNameError"></small>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-12">
                            <div class="form-group">
                                <label for="projectDescription">Project description:</label>
                                <textarea placeholder="Project description..." name="projectDescription" id="projectDescription" cols="30" rows="3" class="form-control">${proj_description}</textarea>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label class="">Chassis Number:</label>
                                <div class="scroll form-group">
                                    <select class="project-dropdown-single-select" id="project_dropdown_single_select">
                                        <option id="-1" value="">Please Select Your Choice.</option>`
                                        for (var i=0; i < proj_dropdown_field_list.length; i++){
                                            if(proj_dropdown_field_list[i] == proj_dropdown_field){
                                                html_update_project +=`<option value="${ proj_dropdown_field }" selected>${ proj_dropdown_field }</option>`
                                            }
                                            else{
                                                html_update_project +=`<option value="${ proj_dropdown_field_list[i] }">${ proj_dropdown_field_list[i] }</option>`
                                            }
                                        }
                                    html_update_project +=`</select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label class="">Project master data model:</label>
                                <div class="scroll form-group">
                                    <select class="project-master-single-select" id="project_master_single_select">
                                        <option id="-1" value="">Please Select Your Choice.</option>`
                                        for (var i=0; i < proj_master_name_list.length; i++){
                                            if(proj_master_name_list[i] == proj_master_name){
                                                html_update_project +=`<option value="${ proj_master_name }" selected>${ proj_master_name }</option>`
                                            }
                                            else{
                                                html_update_project +=`<option value="${ proj_master_name_list[i] }">${ proj_master_name_list[i] }</option>`
                                            }
                                        }
                                    html_update_project +=`</select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label class="">Project status:</label>
                                <div class="scroll form-group">
                                    <select class="update-project-single-select" id="update_project_single_select">
                                        <option id="-1" value="">Please Select Your Choice.</option>`
                                        for (var i=0; i < project_status_list.length; i++){
                                            if(project_status_list[i] == proj_status){
                                                html_update_project +=`<option value="${ proj_status }" selected>${ proj_status }</option>`
                                            }
                                            else{
                                                html_update_project +=`<option value="${ project_status_list[i] }">${ project_status_list[i] }</option>`
                                            }
                                        }
                                    html_update_project +=`</select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label class="">Project groups:</label>
                                <div class="scroll form-group">
                                    <select multiple class="update-project-group-select" id="update_project_group_select">
                                        <option id="-1" value="">Please Select Your Choice.</option>`;
                                        for (var i = 0; i < project_group_list.length; i++) {
                                            const group = project_group_list[i];
                                            const selected = proj_group.includes(group) ? "selected" : "";
                                            html_update_project += `<option value="${ group }" ${ selected }>${ group }</option>`;
                                        }
                                    html_update_project += `</select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="projectStartDate">Project start date:</label>
                                <input type="date" id="projectStartDate" name="projectStartDate" class="form-control" value="${proj_start_date}">
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="projectEndDate">Project end date:</label>
                                <input type="date" id="projectEndDate" name="projectEndDate" class="form-control" value="${proj_end_date}">
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-8">
                            <label for="projectSignature">Project signature:</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-9" title="${proj_signature}">
                            <div class="form-group">
                                <textarea style="background-color: palegreen;" placeholder="Project signature..." disabled name="projectSignature" id="projectSignature" cols="30" rows="2" class="form-control">${proj_signature}</textarea>
                            </div>
                        </div>
                        <div class="col-1" style="margin-left: -5px; margin-top:13px;">
                            <a onclick="addUpdateProjSignature(${proj_id})" href="#" title="Click here to add or update project signature" id="addUpdateProjSignature" class="btn btn-primary"><i class="fas fa-file-signature"></i><a/>
                        </div>

                        <div class="col-1" style="margin-left: 10px; margin-top:13px;">
                            <a onclick="deleteProjSignature(${proj_id})" href="#" title="Click here to delete project signature" id="deleteProjSignature" class="btn btn-danger"><i class="fas fa-trash-alt"></i></a>
                        </div>

                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <button id="update_project_card_btn" onclick="postUpdateProjectView('${ proj_id }')" title="Click to update task" class="btn btn-primary btn-block" type="button"><i class="fas fa-pen"></i> Update Project</button>
                        </div>
                        <div class="col-md-6">
                            <button data-dismiss="modal" aria-label="Close" title="Click to cancel update" class="btn btn-secondary btn-block" type="button"><i class="fas fa-window-close"></i> Cancel Update</button>
                        </div>
                    </div>`;

                    $("#update_project_card_div").html(html_update_project);
                    $(".update-project-single-select").select2({
                        placeholder:"Please Select Your Choice.",
                        closeOnSelect: true,
                        tags: false,
                        allowClear: true,
                        multiple: false,
                    });

                    $(".project-dropdown-single-select").select2({
                        placeholder:"Please Select Your Choice.",
                        closeOnSelect: true,
                        tags: true,
                        allowClear: true,
                        multiple: false,
                    });

                    $(".project-master-single-select").select2({
                        placeholder:"Please Select Your Choice.",
                        closeOnSelect: true,
                        tags: false,
                        allowClear: true,
                        multiple: false,
                    });

                    $(".update-project-group-select").select2({
                        placeholder:"Please Select Your Choice.",
                        closeOnSelect: true,
                        tags: false,
                        allowClear: true,
                        multiple: true,
                    });

                    $(".update-project-group-select option").each(function() {
                      $(this).siblings('[value="'+ this.value +'"]').remove();
                    });

                }
                else {
                    loader('hide');
                    console.log("Something went wrong in update project card view!");
                }
            }
        });
    }
    catch (err) {
        loader('hide');
        console.log("Update project card view error:->",err);
    }
}


function postUpdateProjectView(id){
    var update_proj_id = id;
    var update_proj_name = document.getElementById('projectName').value;
    var update_proj_description = document.getElementById('projectDescription').value;
    var update_proj_status = document.getElementById('update_project_single_select').value;
    var update_proj_start_date = document.getElementById('projectStartDate').value;
    var update_proj_end_date = document.getElementById('projectEndDate').value;
    var options = document.getElementById('update_project_group_select');
    var update_proj_group = Array.from(options.selectedOptions).map(option => option.value);
    var update_proj_master_name = document.getElementById('project_master_single_select').value;
    var update_proj_dropdown_field = document.getElementById('project_dropdown_single_select').value;

    if (!update_proj_name) {
        $("#updateProjectNameError").text("Project name is required!");

        // Scroll inside the modal instead of the full page
        var modalBody = $('#updateProjectCardModal').find('.modal-body');
        if (modalBody.length) {
            modalBody.animate({
                scrollTop: $('#projectName').offset().top
            }, 1000);
        }
        return;
    }


    $.ajax({
        type: "POST",
        url: '/project-management/post-update-project-view/',
        data: {
            'update_proj_id': update_proj_id,
            'update_proj_name':update_proj_name,
            'update_proj_description':update_proj_description,
            'update_proj_status':update_proj_status,
            'update_proj_start_date':update_proj_start_date,
            'update_proj_end_date':update_proj_end_date,
            'update_proj_group':JSON.stringify(update_proj_group),
            'update_proj_master_name': update_proj_master_name,
            'update_proj_dropdown_field': update_proj_dropdown_field,
            'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
        },
        beforeSend: function () {
            loader('show');
        },
        complete: function () {
            loader('hide');
        },
        success:function(response){
            if(response['success']){
                loader('hide');
                $("#updateProjectCardModal").modal("hide");
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    width:300,
                    text: 'Project updated successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(function(){
                   window.location.reload(1);
                }, 500);
            }
            else {
                loader('hide');
                console.log("Something went wrong in update project card view post!");
            }
        },error : function(xhr,errmsg,err) {
            loader('hide');
            console.log("Update project card view error post:->",err);
        }
    });
}


function deleteProjectCardView(id){
    var delete_proj_id = id;

    Swal.fire({
        title: '<h5>Are you sure you want to delete this project?</h5>',
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
            try {
                $.ajax({
                    type: "POST",
                    url: '/project-management/delete-project-card-view/',
                    data: {
                        'delete_proj_id': delete_proj_id,
                        'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                    },
                    success: function (response) {
                        if(response['success']) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                width:300,
                                text: 'Project deleted successfully!',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            setTimeout(function(){
                               window.location.reload(1);
                            }, 500);
                        }
                        else {
                            console.log("Something went wrong in delete project!");
                        }
                    }
                });
            }
            catch (err) {
                console.log("Error in delete project:->",err);
            }
        }
    })
}


function moveToArchive(id){
    var archive_proj_id = id;

    Swal.fire({
        title: '<h5>Are you sure you want to move this project to archive?</h5>',
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
            try {
                $.ajax({
                    type: "POST",
                    url: '/project-management/move-to-archive/',
                    data: {
                        'archive_proj_id': archive_proj_id,
                        'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                    },
                    success: function (response) {
                        if(response['success']) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                width:300,
                                text: 'Project moved to archive successfully!',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            setTimeout(function(){
                               window.location.reload(1);
                            }, 500);
                        }
                        else {
                            console.log("Something went wrong in moved to archive project!");
                        }
                    }
                });
            }
            catch (err) {
                console.log("Error in moved to archive project:->",err);
            }
        }
    })
}


let html_card_div = '';
project_list.forEach(function (item) {

    const isLocked = item.proj_lock === "true";  // compare string
    const lockIcon = isLocked ? 'fas fa-unlock text-success' : 'fas fa-lock text-danger';
    const lockLabel = isLocked ? 'Unlock Me' : 'Lock Me';  // reversed: if locked, offer unlock
    const lockTooltip = isLocked ? 'Click here to unlock project' : 'Click here to lock project';

    var item_proj_name = item.proj_name;
    var item_proj_name_length = item_proj_name.length;
    if(item_proj_name_length > 45){
        var item_proj_name_result = item_proj_name.substring(0, 45)+'...';
    }
    else {
        var item_proj_name_result = item_proj_name;
    }

    var item_description = item.proj_description;
    var item_description_length = item_description.length;
    if(item_description_length > 60){
        var item_description_result = item_description.substring(0, 60)+'...';
    }
    else {
        var item_description_result = item_description;
    }

    if (item.proj_status == 'Completed' || item.proj_status == 'Closed'){
        var color = 'success';
        var icon = '<i class="fas fa-check-circle pr-2"></i>';
    }
    else if (item.proj_status == 'In Progress'){
        var color = 'primary';
        var icon = '<i class="fas fa-spinner pr-2"></i>';
    }
    else if (item.proj_status == 'Not Started'){
        var color = 'warning';
        var icon = '<i class="fas fa-times-circle pr-2"></i>'
    }
    else if (item.proj_status == 'On Hold'){
        var color = 'danger';
        var icon = '<i class="fas fa-exclamation-circle pr-2"></i>';
    }
    else if (item.proj_status == 'Started'){
        var color = 'secondary';
        var icon = '<i class="fas fa-arrow-circle-right pr-2"></i>';
    }
    else {
        var color = 'info';
        var icon = '<i class="fas fa-plus-circle pr-2"></i>';
    }
    html_card_div += `
        <div class="col-sm-3 col-md-3 pb-2 item">
            <div class="card border-${color} mb-3 item-card" style="border-radius: 20px; width:16rem; height:11rem;">
                <div class="card-header text-${ color } d-flex justify-content-between"><span title="Project status">${ icon }${ item.proj_status }</span>
                    <span>
                        <button title="Update project" type="button" class="btn btn-sm text-success" onclick="updateProjectCardView('${ item.proj_id }')">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <a title="More Action" class="dropbtn text-secondary" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            <i class="fas fa-ellipsis-v"></i>
                        </a>
                        <div class="dropdown-menu dropdown-content">
                            <a href="#" class="dropdown-item">
                                <button title="Delete project" type="button" class="btn btn-sm" onclick="deleteProjectCardView('${ item.proj_id }')">
                                    <i class="fa fa-trash text-danger"></i><span class="pl-2"><sub>Delete</sub></span>
                                </button>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                                <button title="Move to archive" type="button" class="btn btn-sm" onclick="moveToArchive('${ item.proj_id }')">
                                    <i class="fa fa-archive text-secondary"></i><span class="pl-2"><sub>Archive</sub></span>
                                </button>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                                <button title="Copy Project" type="button" class="btn btn-sm" onclick="copyProject('${ item.proj_id }')">
                                    <i class="fa fa-copy text-secondary"></i><span class="pl-2"><sub>Copy Project</sub></span>
                                </button>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                                <button title="Project Log History" type="button" class="btn btn-sm" onclick="getProjectLogHistory('${ item.proj_id }')">
                                    <i class="fas fa-hospital-symbol text-secondary"></i><span class="pl-2"><sub>Project Log History</sub></span>
                                </button>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                                <button title="Export to xlsx file" type="button" class="btn btn-sm open-export-modal" data-toggle="modal" data-target="#exportModal" data-proj-id="${ item.proj_id }">
                                    <i class="fas fa-download text-secondary"></i>
                                    <span class="pl-2"><sub>Export to xlsx/pdf file</sub></span>
                                </button>
                            </a>
                            <div class="dropdown-divider"></div>
                            ${user_is_admin ? `
                            <a href="#" class="dropdown-item">
                                <button id="lock-btn-${item.proj_id}"
                                        data-proj-id="${item.proj_id}"
                                        class="btn btn-sm toggle-lock-btn"
                                        title="${lockTooltip}">
                                    <i class="${lockIcon}"></i>
                                    <span class="pl-2"><sub>${lockLabel}</sub></span>
                                </button>
                            </a>
                            <div class="dropdown-divider"></div>` : ''}
                        </div>
                    </span>
                </div>

                <a href="/project-management/tree-grid-view/${ item.proj_id }/">
                    <div class="card-body" title="Click here to view project tasks...">
                        <h5 class="card-title text-${ color }">${ item_proj_name_result }</h5>
                        <p class="card-text text-${ color }">${ item_description_result }</p>
                    </div>
                </a>
            </div>
        </div>`;
    $('#projectCardView').html(html_card_div);
});


function addUpdateProjSignature(id){
    var add_update_proj_signature_id = id;
    var signature_val = $("#projectSignature").val();
    if(signature_val) {
        var title_str = '<h5>Are you sure you want to update this project signature?</h5>'
        var text_str = 'Project signature updated successfully!'
        var signature_status = 'Update'
    }
    else {
        var title_str = '<h5>Are you sure you want to add signature to this project?</h5>'
        var text_str = 'Project signature added successfully!'
        var signature_status = 'Add'
    }

    Swal.fire({
        title: title_str,
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
            try {
                $.ajax({
                    type: "POST",
                    url: '/project-management/add-update-proj-signature/',
                    data: {
                        'add_update_proj_signature_id': add_update_proj_signature_id,
                        'signature_status': signature_status,
                        'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                    },
                    beforeSend: function () {
                        loader('show');
                    },
                    complete: function () {
                        loader('hide');
                    },
                    success: function (response) {
                        if(response['success']) {
                            loader('hide');
                            var proj_signature = response["proj_signature"];
                            $("#projectSignature").val(proj_signature);
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                width:300,
                                text: text_str,
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                        else {
                            loader('hide');
                            console.log("Something went wrong in add or update project signature!");
                        }
                    }
                });
            }
            catch (err) {
                loader('hide');
                console.log("Error in add or update project signature:->",err);
            }
        }
    })
}


function deleteProjSignature(id){
    var delete_proj_signature_id = id;

    var delete_signature_val = $("#projectSignature").val();
    if(!delete_signature_val) {
        return;
    }

    Swal.fire({
        title: '<h5>Are you sure you want to delete this project signature?</h5>',
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
            try {
                $.ajax({
                    type: "POST",
                    url: '/project-management/delete-proj-signature/',
                    data: {
                        'delete_proj_signature_id': delete_proj_signature_id,
                        'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                    },
                    beforeSend: function () {
                        loader('show');
                    },
                    complete: function () {
                        loader('hide');
                    },
                    success: function (response) {
                        if(response['success']) {
                            loader('hide');
                            var proj_signature = response["proj_signature"];
                            $("#projectSignature").val(proj_signature);
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                width:300,
                                text: 'Project signature deleted successfully!',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                        else {
                            loader('hide');
                            console.log("Something went wrong in delete project signature!");
                        }
                    }
                });
            }
            catch (err) {
                loader('hide');
                console.log("Error in delete project signature:->",err);
            }
        }
    })
}


$(document).ready(function () {

    $('.toggle-lock-btn').on('click', function (e) {
        e.preventDefault();
        const button = $(this);
        const projId = button.data('proj-id');
        const label = button.find('sub').text().trim(); // Get the label text

        // Determine action based on label
        const isUnlocking = label === "Unlock Me";
        const swalTitle = isUnlocking
            ? "Are you sure you want to unlock this project?"
            : "Are you sure you want to lock this project?";
        const successMessage = isUnlocking
            ? "Project unlocked successfully!"
            : "Project locked successfully!";

        Swal.fire({
            title: swalTitle,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            cancelButtonText: 'No',
            confirmButtonText: 'Yes',
            reverseButtons: true,
            customClass: {
                popup: 'swal2-popup-custom',
                icon: 'swal2-icon.swal2-warning',
                confirmButton: 'swal2-styled.swal2-confirm',
                cancelButton: 'swal2-styled.swal2-cancel',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: '/project-management/project-lock-unlock/',
                    data: {
                        'proj_id': projId,
                        'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
                    },
                    success: function (response) {
                        if (response.success) {

                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                width: 300,
                                text: successMessage,
                                showConfirmButton: false,
                                timer: 1500
                            });

                            const font_awesome_icon = button.find('i');
                            const label = button.find('sub');

                            if (response.locked) {
                                font_awesome_icon.removeClass('text-danger fas fa-lock')
                                                  .addClass('text-success fas fa-unlock');
                                label.text('Unlock Me');
                                button.attr('title', 'Click here to unlock project');
                            } else {
                                font_awesome_icon.removeClass('text-success fas fa-unlock')
                                                  .addClass('text-danger fas fa-lock');
                                label.text('Lock Me');
                                button.attr('title', 'Click here to lock project');
                            }

                        }
                    },
                    error: function () {
                        alert("Failed to toggle project lock.");
                    }
                });
            }
        });
    });
});
