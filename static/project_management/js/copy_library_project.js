
$(document).ready(function () {

    // AJAX to update project fields
    $(".library-project-select").on("change", function () {
        $("#libraryProjectNameError").html('');
        $("#projectNameError").html('');
        const projectId = $(this).val();

        if (projectId) {
            $.ajax({
                type: "GET",
                url: '/project-management/get-project-details-view/',
                data: {
                    'project_id': projectId,
                },
                beforeSend: function () {
                    loader('show');
                },
                complete: function () {
                    loader('hide');
                },
                success: function (response) {
                    if (response.success) {
                        loader('hide');

                        $("#projectName").val(response.name);
                        $("#projectDescription").val(response.description);
                        var proj_group = response["proj_group"];
                        var project_group_list = response["project_group_list"];
                        let html_copy_library_project_group = '';
                        html_copy_library_project_group += `
                            <div class="col-12">
                                <div class="form-group">
                                    <label class="">Project groups:</label>
                                    <div class="scroll form-group">
                                        <select multiple class="library-project-group-select" id="library_project_group_select">
                                            `
                                            for (var i=0; i < project_group_list.length; i++){
                                                if(project_group_list.includes(proj_group[i])){
                                                    html_copy_library_project_group +=`<option value="${ proj_group[i] }" selected>${ proj_group[i] }</option>`
                                                }
                                                html_copy_library_project_group +=`<option value="${ project_group_list[i] }">${ project_group_list[i] }</option>`
                                            }
                                        html_copy_library_project_group +=`</select>
                                    </div>
                                </div>
                            </div>
                            `
                        $("#copy_library_project_group").html(html_copy_library_project_group);

                        $(".library-project-group-select").select2({
                            placeholder: "Click here to select options.",
                            closeOnSelect: true,
                            tags: false,
                            allowClear: true,
                            multiple: true,
                        });

                        $(".library-project-group-select option").each(function() {
                            $(this).siblings('[value="'+ this.value +'"]').remove();
                        });
                    } else {
                        alert(response.error || "Something went wrong!");
                    }
                },
                error: function () {
                    alert("Failed to fetch project data.");
                }
            });
        }
    });
});


$(".library-project-select").on("select2:clear", function (e) {

    $("#libraryProjectNameError").html('');
    $("#projectNameError").html('');

    // Clear project name & description
    $("#projectName").val("");
    $("#projectDescription").val("");

    // Clear project groups section
    $("#copy_library_project_group").html("");

    // ✅ Reset checkbox to default checked
    const checkbox = document.getElementById("copyValuesCheckbox");
    const label = document.getElementById("copyValuesLabel");

    checkbox.checked = true;
    checkbox.value = "with_values";
    label.textContent = "Copy project with values";
    label.classList.remove("text-warning");
    label.classList.add("text-success");
});


$(document).ready(function () {
    const checkbox = document.getElementById("copyValuesCheckbox");
    const label = document.getElementById("copyValuesLabel");

    // Initial color setup
    label.classList.add("text-success");

    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            checkbox.value = "with_values";
            label.textContent = "Copy project with values";
            label.classList.remove("text-warning");
            label.classList.add("text-success");
        } else {
            checkbox.value = "without_values";
            label.textContent = "Copy project without values";
            label.classList.remove("text-success");
            label.classList.add("text-warning");
        }
    });
});


function copyLibraryProject() {

    $("#libraryProjectNameError").html('');
    $("#projectNameError").html('');

    var projectID = document.getElementById('library_project_select').value;
    if (projectID == ''){
        $("#libraryProjectNameError").html('<span class="text-danger">Please select a project.</span>');
        return;
    }
    var projectName = document.getElementById('projectName').value;
    if (projectName == ''){
        $("#projectNameError").html('<span class="text-danger">Please enter a project name.</span>');
        return;
    }
    var projectDescription = document.getElementById('projectDescription').value;
    var copy_proj_with_or_without_values = document.getElementById("copyValuesCheckbox").value;
    var project_group_options = document.getElementById('library_project_group_select');
    var project_groups = Array.from(project_group_options.selectedOptions).map(option => option.value);

    if ((projectID != '' & projectName != '')){

        $.ajax({
            type: "POST",
            url: '/project-management/copy-library-project/',
            data: {
                'projectID': projectID,
                'projectName':projectName,
                'projectDescription':projectDescription,
                'copy_proj_with_or_without_values': copy_proj_with_or_without_values,
                'project_groups':JSON.stringify(project_groups),
                'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
            },
            beforeSend: function () {
                loader('show');
            },
            complete: function () {
                loader('hide');
            },
            success:function(response){
                if(response['success']){

                    loader('hide');
                    $("#copyLibraryProjectModal").modal("hide");
                    var new_project_id = response["new_project_id"];
                    window.location.href = `/project-management/tree-grid-view/${new_project_id}/`;
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        width:300,
                        text: 'Project copied successfully!',
                        showConfirmButton: false,
                        timer: 3000
                    });

                }
                else {
                    console.log("Error in copy library project!");
                }
            },error : function(xhr,errmsg,err) {
                console.log("Error in copy library project:->", err);
            }
        });
    }
}
