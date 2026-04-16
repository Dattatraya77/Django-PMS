function restoreDeletedProject(id){
    var restore_del_proj_id = id;

    Swal.fire({
        title: '<h5>Are you sure you want to restore this deleted project?</h5>',
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
                    url: '/project-management/restore-deleted-project/',
                    data: {
                        'proj_id': restore_del_proj_id,
                        'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                    },
                    success: function (response) {
                        if(response['success']) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                width:300,
                                text: 'Deleted project restored successfully!',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            setTimeout(function(){
                               window.location.reload(1);
                            }, 500);
                        }
                        else {
                            console.log("Something went wrong in restore deleted project!");
                        }
                    }
                });
            }
            catch (err) {
                console.log("Error in restore deleted project:->",err);
            }
        }
    })
}


function permanentlyDeleteProject(id){
    var permanently_del_proj_id = id;

    Swal.fire({
        title: '<h5>Are you sure you want to delete this project permanently?</h5>',
        text: "This will permanently delete the project, along with all tasks that are only in this project.",
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
                    url: '/project-management/permanently-delete-project/',
                    data: {
                        'proj_id': permanently_del_proj_id,
                        'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                    },
                    success: function (response) {
                        if(response['success']) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                width:300,
                                text: 'Project deleted permanently!',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            setTimeout(function(){
                               window.location.reload(1);
                            }, 500);
                        }
                        else {
                            console.log("Something went wrong in permanently delete project!");
                        }
                    }
                });
            }
            catch (err) {
                console.log("Error in permanently delete project:->",err);
            }
        }
    })
}