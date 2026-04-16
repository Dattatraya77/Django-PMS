
let task_status_changed = false;
let task_id;
function getUpdateTaskData(id) {
    task_id = id;
    console.log("update row id:->",task_id);
    try {
        $.ajax({
            type: "GET",
            url: '/project-management/get-update-task-data/',
            data: {
                'task_id': task_id,
            },
            success: function (response) {
                if(response['success']) {
                    $("#taskUpdateModal").modal("show");
                    const update_task_data = response['update_task_data'];
                    console.log("update_task_data:->",update_task_data);
                    var min_date = response['min_date'];
                    let html_data = '';

                    update_task_data.forEach(function (item) {
                        if (item.type == "textarea"){
                            html_data += `
                            <div class="input-group" title="${item.name}">
                                <div class="input-group-prepend">
                                    <span title="${item.name}" class="input-group-text">${item.name}</span>
                                </div>
                                <textarea ${ item.editable == 'false'?'readonly':''} name="${item.name}" class="form-control" id="${item.id}">${item.value}</textarea>
                            </div><br>`
                        }
                        else {
                            html_data += `<div class="input-group" title="${item.name}">
                            <div class="input-group-prepend">
                                <div title="${item.name}" class="form-control input-group-text">${item.name }</div>
                            </div>`
                            if (item.type == "multi-select" || item.type == "people"){
                                html_data += `<select ${ item.editable == 'false'?'disabled':''} multiple style="height:30px;" id="${item.id}" name="${item.name}" class="multiple-select form-control">`
                                    for (var i=0; i < item.choices.length; i++){
                                            if(item.choices.includes(item.value[i])){
                                                html_data +=`<option value="${ item.value[i] }" selected>${ item.value[i] }</option>`
                                            }
                                            else{
                                                html_data +=`<option value="${ item.choices[i] }">${ item.choices[i] }</option>`
                                            }
                                        }
                                html_data +=`</select>`
                            }
                            else if (item.type == "single-select"){
                                html_data += `<select ${ item.editable == 'false'?'disabled':''} style="height:30px;" id="${item.id}" name="${item.name}" class="single-select form-control">
                                    <option value="" disabled selected>Please Select Your Choice.</option>`
                                    item.choices.forEach(function (it) {
                                        if (item.value == it ){
                                            html_data += `<option value="${item.value}" selected>${item.value}</option>`
                                        }
                                        else {
                                            html_data += `<option value="${it}">${it}</option>`
                                        }
                                    });
                                html_data +=`</select>`
                            }
                            else if (item.type == "bool"){
                                html_data += `<select ${ item.editable == 'false'?'disabled':''} style="height:30px;" id="${item.id}" name="${item.name}" class="single-select-boolean form-control">`
                                    item.choices.forEach(function (it) {
                                        if (item.value == it ){
                                            html_data += `<option value="${item.value}" selected>${item.value}</option>`
                                        }
                                        else {
                                            html_data += `<option value="${it}">${it}</option>`
                                        }
                                    });
                                html_data +=`</select>`
                            }
                            else if (item.type == "date"){
                                if(item.id == "due_date"){
                                    html_data += `<input ${ item.editable == 'false'?'readonly':''} type="${item.type}" id="${item.id}" name="${item.name}" min="${min_date}" class="form-control" id="${item.name}" value="${item.value}">`
                                }
                                else {
                                    html_data += `<input ${ item.editable == 'false'?'readonly':''} type="${item.type}" id="${item.id}" name="${item.name}" class="form-control" id="${item.name}" value="${item.value}">`
                                }
                                html_data += `</div><br>`
                            }
                            else {
                                html_data += `<input ${ item.editable == 'false'?'readonly':''} type="${item.type}" id="${item.id}" name="${item.name}" class="form-control" id="${item.name}" value="${item.value}">`
                            }
                            html_data += `</div><br>`
                        }
                    });
                    $('#update_task_div').html(html_data);
                    $(".multiple-select").select2({
                        placeholder:"Please Select Your Choice.",
                        closeOnSelect: true,
                        tags: true,
                        allowClear: true,
                        multiple: true,
                    });
                    $(".single-select").select2({
                        placeholder:"Please Select Your Choice.",
                        closeOnSelect: true,
                        tags: true,
                        allowClear: false,
                        multiple: false,
                    });
                    $(".single-select-boolean").select2({
                        placeholder:"Please Select Your Choice.",
                        closeOnSelect: true,
                        tags: false,
                        allowClear: false,
                        multiple: false,
                    });
                    $('#status').on('change',function(){
                       task_status_changed = true;
                    });
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


$('#update_task_btn').on("click",function (event) {
    //event.preventDefault();
    var formData = {};
    formData['id']= task_id;
    $("#update_task_form input, #update_task_form select, #update_task_form textarea").each(function(i, obj) {

        if (obj.id != ''){
            formData[obj.id]= $(obj).val();
        }
    })
    console.log("formData:->",formData);
    var status_value = formData.status;

    try {
        $.ajax({
            type: "POST",
            url: '/project-management/post-update-task-data/',
            data: {
                'formData': JSON.stringify(formData),
                'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (response) {
                if(response['success']) {
                    $("#taskUpdateModal").modal("hide");
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        width:300,
                        text: 'Task updated successfully!',
                        showConfirmButton: false,
                        timer: 7000
                    })
                    setTimeout(function(){
                       window.location.reload(1);
                    }, 500);

                    if(task_status_changed == true & status_value == 'Completed'){
                        try {
                            $.ajax({
                                type: "POST",
                                url: '/project-management/send-task-completed-email/',
                                data: {
                                    'task_id': task_id,
                                    'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                                },
                                success: function (response) {
                                    if(response['success']) {
                                        console.log("Sent task completed email successfully!");
                                    }
                                    else {
                                        console.log("Something went wrong in Send Task Completed Email!");
                                    }
                                }
                            });
                        }
                        catch (err) {
                            console.log("Error in Send Task Completed Email:->",err);
                        }
                    }
                }
                else {
                    console.log("Something went wrong in update task!");
                }
            }
        });
    }
    catch (err) {
        console.log("Error in update task:->",err);
    }
});