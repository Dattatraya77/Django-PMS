$('#close_manage_section_metadata').on('click', function() {
    loader('show');
    window.location.reload(1);
});


$(document).ready(function () {
    // Initialize Select2 for dynamic choices
    $('#select_choices').select2({
        tags: true,
        placeholder: "Add or select options",
        allowClear: true,
        closeOnSelect: true,
        multiple: true,
    });
});


$(document).ready(function () {
    // Initialize Select2 for metadata selection
    $("#section_metadata_key").select2({
        tags: true,  // Allows adding new metadata dynamically
        placeholder: "Select or Add Section Metadata...",
        allowClear: true,
        closeOnSelect: true,
    });

    // Fetch section metadata fields and populate dropdown
    $.ajax({
        type: "GET",
        url: "/project-management/get-section-metadata-fields/",
        success: function (response) {
            if (response.success) {
                response.fields.forEach(function (field) {
                    let option = new Option(field.field_title, field.field_id, false, false);
                    $(option).attr("data-type", field.field_type);
                    $("#section_metadata_key").append(option);
                });
            }
        },
        error: function (xhr) {
            console.error("Error fetching metadata fields:", xhr.responseText);
        }
    });

    // Update metadata type dropdown based on selected metadata key
    $("#section_metadata_key").change(function () {
        $('#metadata_name_error').text("");
        let selectedOption = $(this).find(":selected");  // Get selected option
        let selectedType = selectedOption.data("type");  // Extract metadata type
        let fieldId = selectedOption.val();  // Get the selected field ID

        // Ensure metadata type is set correctly (handle undefined or empty cases)
        if (selectedType === undefined || selectedType === null || selectedType === "") {
            $("#section_metadata_type").val("string").trigger("change");  // Reset to "string"
        } else {
            $("#section_metadata_type").val(selectedType).trigger("change");
        }

        // Fetch choices only if type is "single-select" or "multi-select"
        if (selectedType === "single-select" || selectedType === "multi-select") {
            $("#select_choices_container").show();
            fetchMetadataChoices(fieldId);
        } else {
            $("#select_choices_container").hide();
            $("#select_choices").val(null).trigger("change");  // Reset choices dropdown
        }
    });

});


// Fetch choices dynamically for single-select and multi-select
function fetchMetadataChoices(fieldId) {
    $.ajax({
        type: "GET",
        url: `/project-management/get-metadata-field-choices/${fieldId}/`,
        beforeSend: function () {
            loader('show');
        },
        complete: function () {
            loader('hide');
        },
        success: function (response) {
            if (response.success) {
                loader('hide');
                $("#select_choices").empty();
                response.choices.forEach(function (choice) {
                    $("#select_choices").append(new Option(choice, choice));
                });
                $("#select_choices_container").show();
            }
        },
        error: function (xhr) {
            console.error("Error fetching metadata choices:", xhr.responseText);
        }
    });
}


// Show/hide Select2 field based on metadata type
$('#section_metadata_type').change(function () {
    $('#metadata_name_error').text("");
    $('#metadata_type_error').text("");
    let selectedType = $(this).val();
    if (selectedType === 'single-select' || selectedType === 'multi-select') {
        $('#select_choices_container').show();
    } else {
        $('#select_choices_container').hide();
    }
});


function manageSectionMetadata(id) {
    $('#section_metadata_task_id').val(id);

    $.ajax({
        type: "GET",
        url: '/project-management/get-section-metadata/',
        data: {
            'section_metadata_task_id': id,
        },
        beforeSend: function () {
            loader('show');
        },
        complete: function () {
            loader('hide');
        },
        success: function(response) {
            if(response.success) {
                loader('hide');
                var is_section = response["is_section"];
                if(is_section == "False"){
                    Swal.fire({
                        title:'<h4>OOPS!</h4>',
                        text: 'You can not add metadata, because this is not a section task!',
                        icon: 'warning',
                        showCancelButton: false,
                        confirmButtonText: 'OK',
                        customClass : {
                            popup: 'swal2-popup-custom',
                            icon : 'swal2-icon.swal2-warning',
                            confirmButton: 'swal2-styled.swal2-confirm',
                            cancelButton: 'swal2-styled.swal2-cancel',
                        },
                    });
                }
                else {
                    $("#manageSectionMetadataModal").modal("show");
                    populateSectionMetadataTable(response.section_metadata);
                }
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.error,
                    icon: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'OK',
                    customClass : {
                        popup: 'swal2-popup-custom',
                        icon : 'swal2-icon.swal2-warning',
                        confirmButton: 'swal2-styled.swal2-confirm',
                        cancelButton: 'swal2-styled.swal2-cancel',
                    },
                });
            }
        }
    });
}


function populateSectionMetadataTable(metadata) {
    let tableBody = $("#manageSectionMetadataTable tbody");
    tableBody.empty();

    console.log("metadata.column_details:->",metadata.column_details);

    if (!metadata || metadata.column_details.length === 0) {
        tableBody.append(`
            <tr>
                <td colspan="4" class="text-center text-danger font-weight-bold">
                    No data available in table
                </td>
            </tr>
        `);
        return;
    }
    else {
        metadata.column_details.forEach((item, index) => {
            tableBody.append(`
                <tr data-id="${item.id}" data-position="${item.position}" class="sortable-row">
                    <td title="Drag-and-Drop to change the position of Section Metadata" class="handle">${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.type}</td>
                    <td>
                        <button title="Click here to delete Section Metadata" class="btn btn-danger btn-sm myBtn" onclick="deleteSectionMetadata('${item.id}')">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </td>
                </tr>
            `);
        });
    }


    // Enable drag-and-drop sorting
    makeTableSortable();
}


function makeTableSortable() {
    $("#manageSectionMetadataTable tbody").sortable({
        handle: ".handle",  // Only allow dragging from handle
        axis: "y",  // Restrict movement to vertical axis
        update: function () {
            updateSectionMetadataOrder();
            updateSerialNumbers(); // Update serial numbers dynamically
        }
    });
}


// Function to update serial numbers dynamically after sorting
function updateSerialNumbers() {
    $("#manageSectionMetadataTable tbody tr").each(function (index) {
        $(this).find("td:first").text(index + 1);
    });
}


$(document).ready(function () {
    // Fetch section metadata fields on modal open
    $.ajax({
        type: "GET",
        url: "/project-management/get-section-metadata-fields/",
        success: function (response) {
            if (response.success) {
                let options = '<option value="">Select Section Metadata...</option>';
                response.fields.forEach(function (field) {
                    options += `<option value="${field.field_id}" data-type="${field.field_type}">${field.field_title}</option>`;
                });
                $("#section_metadata_key").html(options);
            }
        },
        error: function (xhr) {
            console.error("Error fetching metadata fields:", xhr.responseText);
        }
    });

    // Update metadata type dropdown based on selection
    $("#section_metadata_key").change(function () {
        let selectedType = $(this).find(":selected").data("type");
        $("#section_metadata_type").val(selectedType).trigger("change");
    });
});


$(document).ready(function () {
    $("#btn_add_section_metadata").click(function () {
        let metadataKey = $("#section_metadata_key").val();
        let metadataType = $("#section_metadata_type").val();
        let taskID = $("#section_metadata_task_id").val();
        let choices = $("#select_choices").val() || [];

        if (!metadataKey) {
            $("#metadata_name_error").text("(*)Metadata name is required!");
            return;
        }

        if (!metadataType) {
            $("#metadata_type_error").text("(*)Metadata type is required!");
            return;
        }

        $.ajax({
            url: "/project-management/add-section-metadata/",
            type: "POST",
            data: {
                section_metadata_key: metadataKey,
                section_metadata_type: metadataType,
                section_metadata_task_id: taskID,
                select_choices: choices,
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            },
            success: function (response) {
                if (response.success) {
                    populateSectionMetadataTable(response.section_metadata);
                    $('#metadata_name_error').text("");
                    $("#metadata_type_error").text("");
                    $('#section_metadata_key').val(null).trigger('change');
                    $('#select_choices').val(null).trigger('change');
                    $('#select_choices_container').hide();
                    $('#section_metadata_type').val('string').trigger('change');

                    // 🔹 Fetch updated metadata type dropdown options
                    updateMetadataTypeDropdown();

                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        width:300,
                        text: 'Section metadata added successfully!',
                        showConfirmButton: false,
                        timer: 1500
                    });

                } else {
                    $('#section_metadata_key').val(null).trigger('change');
                    $('#select_choices').val(null).trigger('change');
                    $('#select_choices_container').hide();
                    $('#section_metadata_type').val('string').trigger('change');
                    Swal.fire({
                        title: 'Error!',
                        text: response.error,
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'OK',
                        customClass : {
                            popup: 'swal2-popup-custom',
                            icon : 'swal2-icon.swal2-warning',
                            confirmButton: 'swal2-styled.swal2-confirm',
                            cancelButton: 'swal2-styled.swal2-cancel',
                        },
                    });
                }
            },
            error: function () {
                alert("Error in AJAX request.");
            }
        });
    });
});


function updateMetadataTypeDropdown() {
    $.ajax({
        type: "GET",
        url: "/project-management/get-section-metadata-fields/",
        success: function (response) {
            if (response.success) {
                let options = '<option value="">Select Section Metadata...</option>';
                response.fields.forEach(function (field) {
                    options += `<option value="${field.field_id}" data-type="${field.field_type}">${field.field_title}</option>`;
                });
                $("#section_metadata_key").html(options);
            }
        },
        error: function (xhr) {
            console.error("Error fetching metadata fields:", xhr.responseText);
        }
    });
}


function updateSectionMetadataOrder() {
    let orderedMetadata = [];
    $("#manageSectionMetadataTable tbody tr").each(function (index) {
        orderedMetadata.push({
            id: $(this).data("id"),  // ID of the metadata record
            position: index + 1       // New position after sorting
        });
    });
    console.log("orderedMetadata:->",orderedMetadata);

    $.ajax({
        type: "POST",
        url: "/project-management/update-section-metadata-order/",
        data: {
            section_metadata_task_id: $("#section_metadata_task_id").val(),
            ordered_metadata: JSON.stringify(orderedMetadata),
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    width: 300,
                    text: 'Section metadata order updated successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });

                // Update serial numbers dynamically
                updateSerialNumbers();
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.error,
                    icon: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'swal2-popup-custom',
                        icon: 'swal2-icon.swal2-warning',
                        confirmButton: 'swal2-styled.swal2-confirm',
                        cancelButton: 'swal2-styled.swal2-cancel',
                    },
                });
            }
        },
        error: function(xhr) {
            console.error("Error updating metadata order:", xhr.responseText);
        }
    });
}


function deleteSectionMetadata(section_temp_meta_id) {
    if (delete_task_permissions == 'False'){
        Swal.fire({
            title: 'Permission Denied!',
            text: 'You do not have permission to delete this Section Metadata, please contact the administrator!',
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK',
            customClass : {
                popup: 'swal2-popup-custom',
                icon : 'swal2-icon.swal2-warning',
                confirmButton: 'swal2-styled.swal2-confirm',
                cancelButton: 'swal2-styled.swal2-cancel',
            },
        });
        return; // Stop further execution
    }
    Swal.fire({
        title: '<h5>Are you sure you want to delete this section metadata?</h5>',
        text: "You will not be able to recover this metadata again!",
        icon: "warning",
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
        if (result.isConfirmed) {
            let section_metadata_task_id = $("#section_metadata_task_id").val();

            $.ajax({
                type: "POST",
                url: "/project-management/delete-section-metadata/",
                data: {
                    'section_metadata_task_id': section_metadata_task_id,
                    'section_temp_meta_id': section_temp_meta_id,
                    csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
                },
                success: function(response) {
                    if (response.success) {
                        // 🔹 Refresh table data
                        populateSectionMetadataTable(response.section_metadata);

                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            width: 300,
                            text: 'Section metadata deleted successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: response.error,
                            icon: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'OK',
                            customClass: {
                                popup: 'swal2-popup-custom',
                                icon: 'swal2-icon.swal2-warning',
                                confirmButton: 'swal2-styled.swal2-confirm',
                                cancelButton: 'swal2-styled.swal2-cancel',
                            },
                        });
                    }
                },
                error: function(xhr) {
                    console.error("Error deleting section metadata:", xhr.responseText);
                }
            });
        }
    });
}

