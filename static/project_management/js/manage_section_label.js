
$('#close_manage_section_label').on('click', function() {
    loader('show');
    window.location.reload(1);
});


function manageSectionLabel(id) {
    $('#section_task_id').val(id);

    $.ajax({
        type: "GET",
        url: '/project-management/get-section-label/',
        data: {
            'section_task_id': id,
        },
        beforeSend: function () {
            loader('show');
        },
        complete: function () {
            loader('hide');
        },
        success: function(response) {
            if(response.success) {
                loader('hide');
                var is_section = response["is_section"];
                if(is_section == "False"){
                    Swal.fire({
                        title:'<h4>OOPS!</h4>',
                        text: 'You can not add label, because this is not a section task!',
                        icon: 'warning',
                        showCancelButton: false,
                        confirmButtonText: 'OK',
                        customClass : {
                            popup: 'swal2-popup-custom',
                            icon : 'swal2-icon.swal2-warning',
                            confirmButton: 'swal2-styled.swal2-confirm',
                            cancelButton: 'swal2-styled.swal2-cancel',
                        },
                    });
                }
                else {
                    $("#manageSectionLabelModal").modal("show");
                    populateSectionLabelTable(response.section_label);
                }
            } else {
                alert(response.error);
            }
        }
    });
}


function populateSectionLabelTable(label) {
    let tableBody = $("#manageSectionLabelTable tbody");
    tableBody.empty();

    if (!label || Object.keys(label).length === 0) {
        // If label is empty, show an error message
        tableBody.append(`
            <tr>
                <td colspan="4" class="text-center text-danger font-weight-bold">
                    No data available in table
                </td>
            </tr>
        `);
        return;
    }

    let index = 1;
    for (let key in label) {
        let value = label[key];
        tableBody.append(`
            <tr>
                <td>${index++}</td>
                <td>${key}</td>
                <td>${value}</td>
                <td>
                    <button title="Click here to update Section Label" class="btn btn-primary btn-sm" onclick="openUpdateLabelModal('${key}', '${value}')"><i class="fas fa-edit"></i> Update</button>
                    <button title="Click here to delete Section Label" class="btn btn-danger btn-sm" onclick="deleteSectionLabel('${key}')"><i class="fas fa-trash-alt"></i> Delete</button>
                </td>
            </tr>
        `);
    }
}


$("#btn_add_section_label").click(function () {
    let section_task_id = $("#section_task_id").val();
    let key = $("#section_label_key").val().trim();
    let value = $("#section_label_value").val().trim();

    if (!key || !value) {
        Swal.fire({
            title:'<h4>OOPS!</h4>',
            text: 'Please enter both section label name and section label value.',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'OK',
            customClass : {
                popup: 'swal2-popup-custom',
                icon : 'swal2-icon.swal2-warning',
                confirmButton: 'swal2-styled.swal2-confirm',
                cancelButton: 'swal2-styled.swal2-cancel',
            },
        });
        return;
    }

    $.ajax({
        type: "POST",
        url: "/project-management/add-section-label/",
        data: {
            'section_task_id': section_task_id,
            'section_label_key': key,
            'section_label_value': value,
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        success: function(response) {
            if(response.success) {
                populateSectionLabelTable(response.section_label);
                $("#section_label_key, #section_label_value").val("");
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    width:300,
                    text: 'Section label added successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                var error_message = response["error"];
                Swal.fire({
                    title:'<h4>OOPS!</h4>',
                    text: error_message,
                    icon: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'OK',
                    customClass : {
                        popup: 'swal2-popup-custom',
                        icon : 'swal2-icon.swal2-warning',
                        confirmButton: 'swal2-styled.swal2-confirm',
                        cancelButton: 'swal2-styled.swal2-cancel',
                    },
                });
            }
        }
    });
});


function openUpdateLabelModal(key, value) {
    $("#old_section_label_key").val(key);
    $("#new_section_label_key").val(key);
    $("#new_section_label_value").val(value);
    $("#updateSectionLabelModal").modal("show");
}


function updateSectionLabel() {
    let section_task_id = $("#section_task_id").val();
    let oldKey = $("#old_section_label_key").val();
    let newKey = $("#new_section_label_key").val().trim();
    let newValue = $("#new_section_label_value").val().trim();

    if (!newKey || !newValue) {
        Swal.fire({
            title:'<h4>OOPS!</h4>',
            text: 'Please enter both section label name and section label value.',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'OK',
            customClass : {
                popup: 'swal2-popup-custom',
                icon : 'swal2-icon.swal2-warning',
                confirmButton: 'swal2-styled.swal2-confirm',
                cancelButton: 'swal2-styled.swal2-cancel',
            },
        });
        return;
    }

    $.ajax({
        type: "POST",
        url: "/project-management/update-section-label/",
        data: {
            'section_task_id': section_task_id,
            'old_section_label_key': oldKey,
            'new_section_label_key': newKey,
            'new_section_label_value': newValue,
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        success: function(response) {
            if(response.success) {
                $("#updateSectionLabelModal").modal("hide");
                manageSectionLabel(section_task_id);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    width:300,
                    text: 'Section label updated successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                var error_message = response["error"];
                Swal.fire({
                    title:'<h4>OOPS!</h4>',
                    text: error_message,
                    icon: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'OK',
                    customClass : {
                        popup: 'swal2-popup-custom',
                        icon : 'swal2-icon.swal2-warning',
                        confirmButton: 'swal2-styled.swal2-confirm',
                        cancelButton: 'swal2-styled.swal2-cancel',
                    },
                });
            }
        }
    });
}


function deleteSectionLabel(key) {

    let section_task_id = $("#section_task_id").val();

        Swal.fire({
            title: '<h5>Are you sure you want to delete this section label?</h5>',
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
                url: "/project-management/delete-section-label/",
                data: {
                    'section_task_id': section_task_id,
                    'section_label_key': key,
                    csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
                },
                success: function(response) {
                    if(response.success) {
                        manageSectionLabel(section_task_id);
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            width:300,
                            text: 'Section label deleted successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        var error_message = response["error"];
                        Swal.fire({
                            title:'<h4>OOPS!</h4>',
                            text: error_message,
                            icon: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'OK',
                            customClass : {
                                popup: 'swal2-popup-custom',
                                icon : 'swal2-icon.swal2-warning',
                                confirmButton: 'swal2-styled.swal2-confirm',
                                cancelButton: 'swal2-styled.swal2-cancel',
                            },
                        });
                    }
                }
            });
        }
    });
}



