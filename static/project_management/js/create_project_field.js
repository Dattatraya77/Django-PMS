
$(".proj-field-multi-select").select2({
    placeholder:"Click here to select options.",
    closeOnSelect: true,
    tags: true,
    allowClear: true,
    multiple: true,
    tokenSeparators: ['/',',',';'," "],
});

$('#proj_field_choices').val(null).trigger('change');
$("#proj_field_choices option[value='']").remove();

$('#proj_field_type').on('change', function() {
    ck = $(this).val();

    if (ck=='multi-select' || ck=='single-select') {
        $('#proj_field_choices').val(null).trigger('change');
        $("#proj_field_choices option[value='']").remove();
        let field_choice_div = document.getElementById('proj_field_choice_div');
        field_choice_div.removeAttribute('hidden');
        let field_multi_select_class = document.getElementById('proj_field_choices');
        field_multi_select_class.classList.add("proj-field-multi-select");

    }
    else {
        let field_choice_div = document.getElementById('proj_field_choice_div');
        field_choice_div.setAttribute('hidden', true);
        let remove_select_class = document.getElementById("proj_field_choices");
        remove_select_class.classList.remove("proj-field-multi-select");
        $("#proj_field_choices > option").prop("selected", false);
    }
});


const projectField = document.getElementById('proj_field_title');

projectField.addEventListener('input', (event) => {
    projectField.style.background = 'white';
    $('#projFieldErrorMsg').html("");
})


projectField.addEventListener('blur', (event) => {
    if (event.target.value.length > 0) {
        $.ajax({
            type:'GET',
            url:'/project-management/check-field-duplication/',
            data:{
                field_title:$('#proj_field_title').val(),
            },
            success:function(response){
                create_proj_field_btn = document.getElementById('create_proj_field');
                if (response['success']) {
                    $('#projFieldErrorMsg').html("<span style='color: green;'>Field available!</span>");
                    create_proj_field_btn.removeAttribute('disabled');
                } else {
                    $('#projFieldErrorMsg').html("<span style='color: red;'>Field already exists!</span>");
                    create_proj_field_btn.setAttribute('disabled', true);
                 }
            },
            error: function (response) {
                alert('Error, try again!' + response['error']);
            }
        });
    }
});


$(function() {
    $('#proj_field_title').on('keypress', function(e) {
        var regex = new RegExp("[a-zA-Z_]");
        var key = e.keyCode || e.which;
        key = String.fromCharCode(key);
        if(!regex.test(key)) {
            e.returnValue = false;
            if(e.preventDefault) {
                e.preventDefault();
                create_proj_field_btn = document.getElementById('create_proj_field');
                $('#projFieldErrorMsg').html("<span style='color: red;'>Special characters not allowed except underscore(_)</span>");
            }
        }
    });
});