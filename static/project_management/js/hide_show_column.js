document.getElementById("form-select").addEventListener("change", function(e) {
  col = e.target.value;
  console.log("col:->",col);
});


function showCol() {
    try {
        $.ajax({
            type: "POST",
            url: '/project-management/show-column/',
            data: {
                'field_details': col,
                'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (response) {
                if(response['success']) {
                    var field_title = response["field_title"];
                    treeGrid.showColumn(field_title);
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        width:300,
                        text: 'Column shows successfully!',
                        showConfirmButton: false,
                        timer: 7000
                    })
                    setTimeout(function(){
                       window.location.reload(1);
                    }, 500);

                }
                else {
                    console.log("Something went wrong in show column!");
                }
            }
        });
    }
    catch (TypeError) {
        Swal.fire({
            title: '<h5>Please select column name!</h5>',
            icon: 'warning',
            cancelButtonColor: '#3085d6',
            cancelButtonText: 'Ok',
            customClass : {
                popup: 'swal2-popup-custom',
                icon : 'swal2-icon.swal2-warning',
                cancelButton: 'swal2-styled.swal2-cancel',
            },
        })
    }

}


function hideCol() {
    try {
        $.ajax({
            type: "POST",
            url: '/project-management/hide-column/',
            data: {
                'field_details': col,
                'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (response) {
                if(response['success']) {
                    var field_title = response["field_title"];
                    treeGrid.hideColumn(field_title);
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        width:300,
                        text: 'Column hide successfully!',
                        showConfirmButton: false,
                        timer: 7000
                    })
                    setTimeout(function(){
                       window.location.reload(1);
                    }, 500);
                }
                else {
                    console.log("Something went wrong in hide column!");
                }
            }
        });
    }
    catch (TypeError) {
        Swal.fire({
            title: '<h5>Please select column name!</h5>',
            icon: 'warning',
            cancelButtonColor: '#3085d6',
            cancelButtonText: 'Ok',
            customClass : {
                popup: 'swal2-popup-custom',
                icon : 'swal2-icon.swal2-warning',
                cancelButton: 'swal2-styled.swal2-cancel',
            },
        })
    }

}