$(function(){
    $("#typeFieldChoices").on('keyup paste', function () {
        var field_choice_values = $(this).val();
        $.ajax({
            type: "GET",
            url: '/project-management/get-field-choice-values/',
            data: {
                'field_choice_values': field_choice_values,
            },
            success: function (response) {
                if(response['success']) {
                    var field_choice_value_exist = response["field_choice_value_exist"];
                    var entered_field_choice_values_lower = response["entered_field_choice_values_lower"];

                    if (field_choice_value_exist == "False") {
                        $("#fieldChoiceStatus").html('<i class="fas fa-check-circle text-success pb-4"></i> <span class="text-success">Field choice option is available.</span>');
                        $("#fieldChoiceSave").removeAttr('disabled');
                    }
                    else {
                        $("#fieldChoiceStatus").html('<i class="fas fa-times-circle text-danger pb-4"></i> <span class="text-danger">Field choice option is already exists.</span>');
                        $("#fieldChoiceSave").attr('disabled','');
                    }
                    if (entered_field_choice_values_lower == '') {
                        $("#fieldChoiceStatus").html("");
                        $("#fieldChoiceSave").attr('disabled','');
                    }
                }
                else {

                }
            }
        });
    });
});


function show_field_choice_alert(message, alert){
    // alert for main html
    field_choice_alert_wrapper.innerHTML = `
    <div class="alert alert-${alert} alert-dismissible fade show" role="alert">
      <span>${message}</span>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`;
  $('#field_choice_alert_wrapper').children().first().delay(5000).fadeOut(3000);
};


$(function(){
    $('#fieldChoiceSave').click(function(){
        var input_field_choice_value = $("#typeFieldChoices").val();

        $.ajax({
            type: "POST",
            url: '/project-management/post-field-choice-values/',
            data: {
                'input_field_choice_value': input_field_choice_value,
                'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (response) {
                if(response['success']) {
                    $("#typeFieldChoices").val("");
                    $("#fieldChoiceSave").attr('disabled','');
                    $("#fieldChoiceStatus").html("");
                    show_field_choice_alert('Field choice created successfully!',"success");
                }
                else {
                    show_field_choice_alert('Something went wrong in field choice creation.',"danger");
                }
            }
        });

    });
});