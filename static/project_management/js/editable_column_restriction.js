

function editableColumnRestriction(id){
    var proj_id = id;
    try {
        $.ajax({
            type: "GET",
            url: '/project-management/get-editable-column-restriction/',
            data: {
                'proj_id': proj_id,
            },
            success: function (response) {
                if(response['success']) {
                    $("#editableColumnRestrictionModal").modal("show");
                    $("#project_template_field_id").val('');
                    var editable_column_name_list = response["editable_column_name_list"];
                    console.log("editable_column_name_list:->",editable_column_name_list);
                    let html_editable_column = '';
                    html_editable_column += `
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <label style="font-weight:900">Select column name:</label>
                                    <select name="editable_column_name_select" class="editable-column-name-select" id="editable_column_name_select">
                                        <option id="-1" value="">Please select column name.</option>`
                                        editable_column_name_list.forEach(function (item) {
                                            html_editable_column += `<option value="${item.proj_template_id}">${item.text}</option>`;
                                        });
                                    html_editable_column +=`</select>
                                    <div id="column_name_error"></div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <label style="font-weight:900">Add/Update groups to be restricted:</label>
                                    <select name="editable_user_group_select" multiple class="editable-user-group-select" id="editable_user_group_select">
                                        <option id="-1" value="">Please select group name.</option>
                                    </select>
                                    <div>
                                        <span class="text-warning">Note: If you add groups to be restricted, then user belonging to that group cannot edit the selected column fields.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <button onclick="createEditableColumnGroups()" title="Click to save changes" class="btn btn-primary btn-block" type="button"><i class="fas fa-user-edit"></i> Save Changes</button>
                            </div>
                            <div class="col-md-6">
                                <button data-dismiss="modal" aria-label="Close" title="Click to cancel changes" class="btn btn-secondary btn-block" type="button"><i class="fas fa-window-close"></i> Cancel Changes</button>
                            </div>
                        </div>
                    `;
                    $("#editable_column_group_div").html(html_editable_column);
                    $(".editable-column-name-select").select2({
                        placeholder:"Please select column name.",
                        closeOnSelect: true,
                        tags: false,
                        allowClear: true,
                        multiple: false,
                    });
                    $(".editable-user-group-select").select2({
                        placeholder: "Please select group name.",
                        closeOnSelect: true,
                        tags: false,
                        allowClear: true,
                        multiple: true,
                        tokenSeparators: ['/',',',';'," "],
                    });

                    $("#editable_column_name_select").on('change', function() {
                        var proj_template_id = $(this).val();

                        try {
                            $.ajax({
                                type: "GET",
                                url: '/project-management/get-editable-column-groups/',
                                data: {
                                    'proj_template_id': proj_template_id,
                                },
                                success: function (response) {
                                    if(response['success']) {

                                        $("#project_template_field_id").val('');
                                        $("#column_name_error").html('');
                                        var proj_temp_field_id = response['proj_template_id'];
                                        var user_groups = response['user_groups'];
                                        var column_groups = response['column_groups'];

                                        $("#project_template_field_id").val(proj_temp_field_id);
                                        $("#editable_user_group_select").empty();
                                        let html_data_column_groups = '';
                                        user_groups.forEach(function (user_group) {
                                            if (column_groups.includes(user_group)) {
                                                html_data_column_groups += `<option selected value="${user_group}">${user_group}</option>`
                                            }
                                            else{
                                                html_data_column_groups += `<option value="${user_group}">${user_group}</option>`
                                            }
                                        });
                                        $("#editable_user_group_select").html(html_data_column_groups);
                                    }
                                    else {
                                        console.log("Something went wrong in editable_column_name_select!");
                                    }
                                }
                            });
                        }
                        catch (err) {
                            console.log("editable_column_name_select error:->",err);
                        }

                    });
                }
                else {
                    console.log("Something went wrong in editableColumnRestriction!");
                }
            }
        });
    }
    catch (err) {
        console.log("editableColumnRestriction error:->",err);
    }
}


function createEditableColumnGroups() {

    $("#column_name_error").html('');

    var get_proj_temp_field_id = document.getElementById('project_template_field_id').value;
    console.log("get_proj_temp_field_id:->",get_proj_temp_field_id);

    var group_options = document.getElementById('editable_user_group_select');
    var selected_column_group_options = Array.from(group_options.selectedOptions).map(option => option.value);
    console.log("selected_column_group_options:->",selected_column_group_options);

    if (get_proj_temp_field_id == ''){
        $("#column_name_error").html('<span class="text-danger">Please select a column name.</span>');
    }

    if ((get_proj_temp_field_id != '')){
        console.log("Column group restrictions saved successfully!");

        $.ajax({
            type: "POST",
            url: '/project-management/post-editable-column-groups/',
            data: {
                'get_proj_temp_field_id': get_proj_temp_field_id,
                'selected_column_group_options':JSON.stringify(selected_column_group_options),
                'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
            },
            success:function(response){
                if(response['success']){
                    $("#editableColumnRestrictionModal").modal("hide");
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        width:300,
                        text: 'Column group restrictions saved successfully!',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    setTimeout(function(){
                       window.location.reload(1);
                    }, 500);
                }
                else {
                    console.log("Error in Create Editable Column Groups!");
                }
            },error : function(xhr,errmsg,err) {
            }
        });
    }
}