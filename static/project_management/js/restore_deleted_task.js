function restoreDeletedTask(id){
    var restore_del_task_id = id;

    Swal.fire({
        title: '<h5>Are you sure you want to restore this deleted task?</h5>',
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
                    url: '/project-management/restore-deleted-task/',
                    data: {
                        'task_id': restore_del_task_id,
                        'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                    },
                    success: function (response) {
                        if(response['success']) {

                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                width:300,
                                text: 'Deleted task restored successfully!',
                                showConfirmButton: false,
                                timer: 1500
                            });

                            setTimeout(function(){
                               window.location.reload(1);
                            }, 500);
                        }
                        else {
                            var error_msg = response["error"];
                            Swal.fire({
                                title: '<h5>'+error_msg+'</h5>',
                                icon: 'warning',
                                cancelButtonColor: '#3085d6',
                                cancelButtonText: 'Ok',
                                customClass : {
                                    popup: 'swal2-popup-custom',
                                    icon : 'swal2-icon.swal2-warning',
                                    cancelButton: 'swal2-styled.swal2-cancel',
                                },
                            });
                        }
                    }
                });
            }
            catch (err) {
                console.log("Error in restore deleted task:->",err);
            }
        }
    })
}


function deleteTaskPermanently(id){
    var permanently_del_task_id = id;

    Swal.fire({
        title: '<h5>Are you sure you want to delete this task permanently?</h5>',
        text: "This will permanently delete the task, along with all child tasks that are associates to this parent task.",
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
                    url: '/project-management/delete-task-permanently/',
                    data: {
                        'task_id': permanently_del_task_id,
                        'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                    },
                    success: function (response) {
                        if(response['success']) {

                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                width:300,
                                text: 'Task deleted permanently!',
                                showConfirmButton: false,
                                timer: 1500
                            });

                            setTimeout(function(){
                               window.location.reload(1);
                            }, 500);
                        }
                        else {
                            console.log("Something went wrong in permanently delete task!");
                        }
                    }
                });
            }
            catch (err) {
                console.log("Error in permanently delete task:->",err);
            }
        }
    })
}