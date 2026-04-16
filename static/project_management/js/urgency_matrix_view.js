const proj_id = project_id;

function urgency_matrix_func(proj_id, duration_select_val){
    var selected_value = duration_select_val;

    try {
        $.ajax({
            type: "GET",
            url: '/project-management/urgency-matrix-ajax-view/',
            data: {
                'proj_id': proj_id,
                'selected_value':selected_value,
            },
            success: function (response) {
                if(response['success']) {

                    var urgent_and_important = response["urgent_and_important"];
                    var less_urgent_but_important = response["less_urgent_but_important"];
                    var urgent_but_less_important = response["urgent_but_less_important"];
                    var neither_urgent_nor_important = response["neither_urgent_nor_important"];
                    var urgency_matrix_error_msg = response["urgency_matrix_error_msg"];

                    $("#urgent_and_important_tbody").html('');
                    $("#less_urgent_but_important_tbody").html('');
                    $("#urgent_but_less_important_tbody").html('');
                    $("#neither_urgent_nor_important_tbody").html('');
                    $("#urgency_matrix_error_msg").html('');

                    if (urgency_matrix_error_msg != '') {
                        $("#urgency_matrix_error_msg").removeAttr('hidden');
                        $("#urgency_matrix_error_msg").append(`<div class="alert alert-danger alert-dismissible fade show" role="alert"><span>${urgency_matrix_error_msg}</span></div>`);
                    }
                    else {
                        $("#urgency_matrix_error_msg").attr('hidden', true);
                    }

                    var create_urgent_and_important_tr = '';
                    if (urgent_and_important.length != 0) {
                        urgent_and_important.forEach(function (item) {
                            create_urgent_and_important_tr += `<tr><td>${item.task_id}</td><td>${item.task_name}</td></tr>`;
                        });
                    }
                    else {
                        create_urgent_and_important_tr += `<tr><td>#</td><td>[No tasks]</td></tr>`;
                    }
                    $("#urgent_and_important_tbody").append(create_urgent_and_important_tr);

                    var create_less_urgent_but_important_tr = '';
                    if (less_urgent_but_important.length != 0) {
                        less_urgent_but_important.forEach(function (item) {
                            create_less_urgent_but_important_tr += `<tr><td>${item.task_id}</td><td>${item.task_name}</td></tr>`;
                        });
                    }
                    else {
                        create_less_urgent_but_important_tr += `<tr><td>#</td><td>[No tasks]</td></tr>`;
                    }
                    $("#less_urgent_but_important_tbody").append(create_less_urgent_but_important_tr);

                    var create_urgent_but_less_important_tr = '';
                    if (urgent_but_less_important.length != 0) {
                        urgent_but_less_important.forEach(function (item) {
                            create_urgent_but_less_important_tr += `<tr><td>${item.task_id}</td><td>${item.task_name}</td></tr>`;
                        });
                    }
                    else {
                        create_urgent_but_less_important_tr += `<tr><td>#</td><td>[No tasks]</td></tr>`;
                    }
                    $("#urgent_but_less_important_tbody").append(create_urgent_but_less_important_tr);

                    var create_neither_urgent_nor_important_tr = '';
                    if (neither_urgent_nor_important.length != 0) {
                        neither_urgent_nor_important.forEach(function (item) {
                            create_neither_urgent_nor_important_tr += `<tr><td>${item.task_id}</td><td>${item.task_name}</td></tr>`;
                        });
                    }
                    else {
                        create_neither_urgent_nor_important_tr += `<tr><td>#</td><td>[No tasks]</td></tr>`;
                    }
                    $("#neither_urgent_nor_important_tbody").append(create_neither_urgent_nor_important_tr);

                }
                else {
                    console.log("Something went wrong in urgency matrix ajax view!");
                }
            }
        });
    }
    catch (err) {
        console.log("Error in urgency matrix ajax view:->",err);
    }
};


$(document).ready(function(){
    urgency_matrix_func(proj_id, '0');
});


$('#duration-select-id').on('change', function() {
    urgency_matrix_func(proj_id, $(this).val());
})

function mySearchFunction1() {
  	var input, filter, table, tr, td, i, txtValue;
  	input = document.getElementById("myInput1");
  	filter = input.value.toUpperCase();
  	table = document.getElementById("urgent_and_important_table");
  	tr = table.getElementsByTagName("tr");
  	for (i = 0; i < tr.length; i++) {
    	td = tr[i].getElementsByTagName("td")[1];
    	if (td) {
      		txtValue = td.textContent || td.innerText;
      		if (txtValue.toUpperCase().indexOf(filter) > -1) {
        		tr[i].style.display = "";
      		}
      		else {
        		tr[i].style.display = "none";
      		}
    	}
  	}
}


function mySearchFunction2() {
  	var input, filter, table, tr, td, i, txtValue;
  	input = document.getElementById("myInput2");
  	filter = input.value.toUpperCase();
  	table = document.getElementById("less_urgent_but_important_table");
  	tr = table.getElementsByTagName("tr");
  	for (i = 0; i < tr.length; i++) {
    	td = tr[i].getElementsByTagName("td")[1];
    	if (td) {
      		txtValue = td.textContent || td.innerText;
      		if (txtValue.toUpperCase().indexOf(filter) > -1) {
        		tr[i].style.display = "";
      		}
      		else {
        		tr[i].style.display = "none";
      		}
    	}
  	}
}


function mySearchFunction3() {
  	var input, filter, table, tr, td, i, txtValue;
  	input = document.getElementById("myInput3");
  	filter = input.value.toUpperCase();
  	table = document.getElementById("urgent_but_less_important_table");
  	tr = table.getElementsByTagName("tr");
  	for (i = 0; i < tr.length; i++) {
    	td = tr[i].getElementsByTagName("td")[1];
    	if (td) {
      		txtValue = td.textContent || td.innerText;
      		if (txtValue.toUpperCase().indexOf(filter) > -1) {
        		tr[i].style.display = "";
      		}
      		else {
        		tr[i].style.display = "none";
      		}
    	}
  	}
}


function mySearchFunction4() {
  	var input, filter, table, tr, td, i, txtValue;
  	input = document.getElementById("myInput4");
  	filter = input.value.toUpperCase();
  	table = document.getElementById("neither_urgent_nor_important_table");
  	tr = table.getElementsByTagName("tr");
  	for (i = 0; i < tr.length; i++) {
    	td = tr[i].getElementsByTagName("td")[1];
    	if (td) {
      		txtValue = td.textContent || td.innerText;
      		if (txtValue.toUpperCase().indexOf(filter) > -1) {
        		tr[i].style.display = "";
      		}
      		else {
        		tr[i].style.display = "none";
      		}
    	}
  	}
}