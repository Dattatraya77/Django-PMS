function project_remove_association(proj_id, project_associate_id) {
    var project_id = proj_id;
    var project_associate_file_id = project_associate_id;

    Swal.fire({
            title: '<h5>Are you sure you want to remove this association?</h5>',
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
                url: '/project-management/project-remove-association/',
                data: {
                    'project_id': project_id,
                    'project_associate_file_id':project_associate_file_id,
                    'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                },
                success: function (response) {
                    if(response['success']) {
                        var project_remove_associated_file = response['project_remove_associated_file'];
                        if (project_remove_associated_file == "Yes") {
                            project_associated_file_list(project_id);
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                width:300,
                                text: 'File removed from association list!',
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


function project_remove_association_list(proj_id, project_associate_id) {
    var project_id = proj_id;
    var project_associate_file_id = project_associate_id;

    $.ajax({
        type: "POST",
        url: '/project-management/project-remove-association/',
        data: {
            'project_id': project_id,
            'project_associate_file_id':project_associate_file_id,
            'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (response) {
            if(response['success']) {
                var project_remove_associated_file = response['project_remove_associated_file'];
                if (project_remove_associated_file == "Yes") {
                    project_associated_file_list(project_id);
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        width:300,
                        text: 'File removed from association list!',
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