
$("input:checkbox.notificationCheckbox").click(function() {
    if($(this).is(":checked")){
        $(this).attr('checked',true);
        $(this).val('on');
    }
    else {
        $(this).removeAttr('checked');
        $(this).val('off');
    }
});


$("#x_days_before_start_date").click(function(){
	if($("#x_days_before_start_date").is(':checked')){
        $("#x_hours_before_start_date").prop("checked", false);
        $("#x_hours_before_start_date").val('off');
        $("#x_days_before_start_date").val('on');
	}
	else {
	    $("#x_days_before_start_date").val('off');
	}

});

$("#x_hours_before_start_date").click(function(){
	if($("#x_hours_before_start_date").is(':checked')){
	    $("#x_days_before_start_date").prop("checked", false);
        $("#x_days_before_start_date").val('off');
        $("#x_hours_before_start_date").val('on');
	}
    else {
        $("#x_hours_before_start_date").val('off');
    }
});


$("#due_in_x_days").click(function(){
	if($("#due_in_x_days").is(':checked')){
	    $("#due_in_x_hours").prop("checked", false);
        $("#due_in_x_hours").val('off');
        $("#due_in_x_days").val('on');
	}
  	else {
  	    $("#due_in_x_days").val('off');
  	}
});

$("#due_in_x_hours").click(function(){
	if($("#due_in_x_hours").is(':checked')){
	    $("#due_in_x_days").prop("checked", false);
  	    $("#due_in_x_days").val('off');
  	    $("#due_in_x_hours").val('on');
	}
	else {
	    $("#due_in_x_hours").val('off');
	}

});


function createUpdateNotification(proj_id) {
    const project_id = proj_id;
    $("#createUpdateNotificationModal").modal("show");
}


function postCreateUpdateNotification(id){
    var notification_proj_id = id;
    var notify_on_off = document.getElementById('notify_on_off').value;
    var notify_groups = document.getElementById('notify_groups').value;
    var notify_other = document.getElementById('notify_other').value;
    var notify_other_options = document.getElementById('notify_other_email_select');
    var notify_other_list = Array.from(notify_other_options.selectedOptions).map(option => option.value);

    var task_starting = document.getElementById('task_starting').value;
    var task_due = document.getElementById('task_due').value;
    var task_completed = document.getElementById('task_completed').value;
    var delayed_by = document.getElementById('delayed_by').value;
    var reminder_on_whatsapp = document.getElementById('reminder_on_whatsapp').value;

    var x_days_before_start_date = document.getElementById('x_days_before_start_date').value;
    var x_hours_before_start_date = document.getElementById('x_hours_before_start_date').value;
    var due_in_x_days = document.getElementById('due_in_x_days').value;
    var due_in_x_hours = document.getElementById('due_in_x_hours').value;

    var select_x_days_before = document.getElementById('select_x_days_before').value;
    var select_x_hours_before = document.getElementById('select_x_hours_before').value;
    var select_due_in_x_days = document.getElementById('select_due_in_x_days').value;
    var select_due_in_x_hours = document.getElementById('select_due_in_x_hours').value;

    $.ajax({
        type: "POST",
        url: '/project-management/post-create-update-notification/',
        data: {
            'notification_proj_id': notification_proj_id,
            'notify_on_off':notify_on_off,
            'notify_groups':notify_groups,
            'notify_other':notify_other,
            'notify_other_list':JSON.stringify(notify_other_list),
            'task_starting':task_starting,
            'task_due':task_due,
            'task_completed':task_completed,
            'delayed_by':delayed_by,
            'reminder_on_whatsapp':reminder_on_whatsapp,
            'x_days_before_start_date':x_days_before_start_date,
            'x_hours_before_start_date':x_hours_before_start_date,
            'due_in_x_days':due_in_x_days,
            'due_in_x_hours':due_in_x_hours,
            'select_x_days_before':select_x_days_before,
            'select_x_hours_before':select_x_hours_before,
            'select_due_in_x_days':select_due_in_x_days,
            'select_due_in_x_hours':select_due_in_x_hours,
            'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
        },
        success:function(response){
            if(response['success']){
                $("#createUpdateNotificationModal").modal("hide");
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    width:300,
                    text: 'Notification saved successfully!',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(function(){
                   window.location.reload(1);
                }, 500);
            }
            else {
                console.log("Something went wrong in post create update notification!");
            }
        },error : function(xhr,errmsg,err) {
            console.log("post-create-update-notification error:->",err);
        }
    });
}