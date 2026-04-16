function restoreArchiveProject(id){
    var restore_archive_proj_id = id;

    Swal.fire({
        title: '<h5>Are you sure you want to restore this archive project?</h5>',
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
                    url: '/project-management/restore-archive-project/',
                    data: {
                        'proj_id': restore_archive_proj_id,
                        'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                    },
                    success: function (response) {
                        if(response['success']) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                width:300,
                                text: 'Archive project restored successfully!',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            setTimeout(function(){
                               window.location.reload(1);
                            }, 500);
                        }
                        else {
                            console.log("Something went wrong in restore archive project!");
                        }
                    }
                });
            }
            catch (err) {
                console.log("Error in restore archive project:->",err);
            }
        }
    })
}