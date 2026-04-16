
$('#field_type').on('change', function() {
    ck = $(this).val();

    if (ck=='multi-select' || ck=='single-select') {
        $('#field_choices').val(null).trigger('change');
        $("#field_choices option[value='']").remove();
        //$("#field_choices > option").prop("selected", false);
        let field_choice_div = document.getElementById('field_choice_div');
        field_choice_div.removeAttribute('hidden');
        let field_multi_select_class = document.getElementById('field_choices');
        field_multi_select_class.classList.add("field-multi-select");

    }
    else {
        let field_choice_div = document.getElementById('field_choice_div');
        field_choice_div.setAttribute('hidden', true);
        let remove_select_class = document.getElementById("field_choices");
        remove_select_class.classList.remove("field-multi-select");
        $("#field_choices > option").prop("selected", false);
    }
});


const tempTitle = document.getElementById("temp_title");
const tempDescription = document.getElementById("temp_description");
const tempGroup = document.getElementById("temp_group");

const addField = document.getElementById("add_field");
const fieldTitle = document.getElementById("field_title");
const fieldDescription = document.getElementById("field_description");
const fieldType = document.getElementById("field_type");
const options = document.getElementById("field_choices");
const Fields = document.getElementById("fields");

const libraryOptions = document.getElementById("library_field_choices");

let temp_details = [];

let fieldsStorage = localStorage.getItem("fields")
? JSON.parse(localStorage.getItem("fields"))
: [];


function add_field_values() {

    if (fieldTitle.value == ''){
        $('#fieldErrorMsg').html("<span style='color: red;'>Enter field title!</span>");
    }
    else {
        $('#fieldErrorMsg').html("");
        fieldsStorage.push({"field_title":fieldTitle.value,"field_description":fieldDescription.value,"field_type":fieldType.value,"field_choice":Array.from(options.selectedOptions).map(option => option.value)});
        localStorage.setItem("fields", JSON.stringify(fieldsStorage));
        listBuilder(fieldTitle.value);
        fieldTitle.value = "";
        fieldDescription.value = "";
    }
}


function add_library_field_values() {
    if (libraryOptions.value == ""){
        $('#fieldSelectErrorMsg').html("<span style='color: red;'>Please select option!</span>");
    }
    else {
        $('#fieldSelectErrorMsg').html("");
        fieldsStorage.push({"field_title":libraryOptions.value,"field_description":"","field_type":"","field_choice":[]});
        localStorage.setItem("fields", JSON.stringify(fieldsStorage));
        listBuilder(libraryOptions.value);
        libraryOptions.value = "";
    }
}


const listBuilder = (text) => {
    const note = document.createElement("li");
    note.innerHTML = '<button type="button" class="btn btn-sm btn-outline-primary">'+text+'</button>' + ' <button class="btn btn-sm btn-outline-danger" onclick="deleteNote(this)"><i class="fas fa-trash"></i></button><hr>';
    fields.appendChild(note);
};


const getNotes = JSON.parse(localStorage.getItem("fields"));
(getNotes || []).forEach((note) => {
    listBuilder(note.field_title);
});


const deleteNote = (btn) => {
    let el = btn.parentNode;
    const index = [...el.parentElement.children].indexOf(el);
    fieldsStorage.splice(index, 1);
    localStorage.setItem("fields", JSON.stringify(fieldsStorage));
    el.remove();
    projectField.style.background = 'white';
    $('#fieldErrorMsg').html("");
};


function save_field_values() {
    if (tempTitle.value == ""){
        $('#tempTitleErrorMsg').html("<span style='color: red;'>Please enter template title!</span>");
        window.scrollTo(0, 0);
        console.log("fieldsStorage:->",fieldsStorage);
    }
    else {
        $('#tempTitleErrorMsg').html("");
        temp_details.push({"temp_title":tempTitle.value, "temp_description":tempDescription.value,"temp_group":Array.from(tempGroup.selectedOptions).map(option => option.value)});
        console.log("fieldsStorage:->",fieldsStorage);
        console.log("temp_details:->",temp_details);

        try {
            $.ajax({
                type: "POST",
                url: '/project-management/create-project-template/',
                data: {
                    'fieldsStorage': JSON.stringify(fieldsStorage),
                    'temp_details':JSON.stringify(temp_details),
                    'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                },
                dataType: "json",
                success: function (response) {
                    if(response['success']) {
                        console.log("done");
                        document.getElementById("projectTemplateForm").reset();
                        localStorage.removeItem("fields");

                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            width:300,
                            text: 'Template created successfully!',
                            showConfirmButton: false,
                            timer: 7000
                        })
                        setTimeout(function(){
                           window.location.reload(1);
                        }, 500);

                    }
                    else {
                        console.log("Something went wrong in create project template!");
                    }
                }
            });
        }
        catch (err) {
            console.log("error in create project template:->",err);
        }
    }

}


const projectField = document.getElementById('field_title');

projectField.addEventListener('input', (event) => {
    projectField.style.background = 'white';
    $('#fieldErrorMsg').html("");
})


projectField.addEventListener('blur', (event) => {
    if (event.target.value.length > 0) {
        $.ajax({
            type:'GET',
            url:'/project-management/check-field-duplication/',
            data:{
                field_title:$('#field_title').val(),
            },
            success:function(response){
                add_field_btn = document.getElementById('add_field');
                if (response['success']) {
                    $('#fieldErrorMsg').html("<span style='color: green;'>Field available!</span>");
                    add_field_btn.removeAttribute('disabled');
                } else {
                    $('#fieldErrorMsg').html("<span style='color: red;'>Field already exists!</span>");
                    add_field_btn.setAttribute('disabled', true);
                 }
            },
            error: function (response) {
                alert('Error, try again!' + response['error']);
            }
        });
    }
});


function changeFunc() {
    $('#fieldSelectErrorMsg').html("");
}

const templateTitle = document.getElementById('temp_title');

templateTitle.addEventListener('input', (event) => {
    templateTitle.style.background = 'white';
    $('#tempTitleErrorMsg').html("");
})