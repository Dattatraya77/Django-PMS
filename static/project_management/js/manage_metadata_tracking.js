
$('#close_manage_metadata_tracking').on('click', function() {
    loader('show');
    window.location.reload(1);
});


function manageMetadataTracking(id) {
    $('#metadata_tracking_task_id').val(id);

    $.ajax({
        type: "GET",
        url: '/project-management/get-section-metadata-name/',
        data: {
            'metadata_tracking_task_id': id,
        },
        beforeSend: function () {
            loader('show');
        },
        complete: function () {
            loader('hide');
        },
        success: function(response) {
            if (response.success) {
                loader('hide');
                $("#manageMetadataTrackingModal").modal("show");
                // Call function to update the section metadata dropdown
                populateSectionMetadataNameDropdown(response.section_header, response.section_metadata_json);

            } else {
                console.log("Error in managing Metadata Tracking!");
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX error: " + error);
        }
    });
}


function populateSectionMetadataNameDropdown(sectionMetadata, sectionMetadataNameJson) {
    let dropdown = $("#sectionMetadataName");
    dropdown.empty(); // Clear existing options

    // Extract already-used field IDs from the existing section_metadata_json
    let usedIds = [];
    if (sectionMetadataNameJson && sectionMetadataNameJson.column_config_details) {
        usedIds = sectionMetadataNameJson.column_config_details.map(item => item.id);
    }

    // Ensure the default option is always present
    dropdown.append('<option value="">Select Section Metadata Name</option>');

    sectionMetadata.forEach(item => {
        const displayText = item.name;

        dropdown.append(`
            <option value="${item.id}" id="${item.id}">
                ${displayText}
            </option>
        `);
    });

    let section_value_dropdown = $("#sectionMetadataValue");
    section_value_dropdown.empty(); // Clear existing options
    section_value_dropdown.append('<option value="">Select Section Metadata Value</option>');

}


$('#sectionMetadataName').on('change', function () {
    // Clear previous error messages
    $('#sectionMetadataNameError').text('');
    $('#sectionMetadataValueError').text('');
    $('#showMetadataTrackingDiv').html('');

    const selectedFieldId = $("#sectionMetadataName option:selected").attr("id");  // project field ID
    const selectedTaskId = $('#metadata_tracking_task_id').val();
    const selectedRowPosition = $('#selected_row_position').val();


    if (!selectedFieldId || !selectedTaskId) {
        $('#sectionMetadataValue').empty().append('<option value="">Select Section Metadata Value</option>');
        return;
    }

    $.ajax({
        url: '/project-management/get-section-metadata-values/',
        type: 'GET',
        data: {
            'project_field_id': selectedFieldId,
            'task_id': selectedTaskId,
            'selected_row_position':selectedRowPosition,
        },
        beforeSend: function () {
            loader('show');
        },
        success: function (response) {
            loader('hide');
            const dropdown = $('#sectionMetadataValue');
            dropdown.empty();
            dropdown.append('<option value="">Select Section Metadata Value</option>');

            if (response.success && response.values.length > 0) {
                response.values.forEach(item => {
                    dropdown.append(`<option value="${item.section_meta_val_position}">${item.section_metadata_value}</option>`);
                });
            }
        },
        error: function (xhr) {
            loader('hide');
            console.error("Failed to fetch section metadata values:", xhr.responseText);
        }
    });
});


$('#sectionMetadataValue').on('change', function () {
    // Clear previous error messages
    $('#sectionMetadataNameError').text('');
    $('#sectionMetadataValueError').text('');
    $('#showMetadataTrackingDiv').html('');
});


$('#showTrackMetadata').on('click', function () {
    // Clear previous error messages
    $('#sectionMetadataNameError').text('');
    $('#sectionMetadataValueError').text('');

    const sectionMetadataName = $('#sectionMetadataName').val();  // field_id
    const sectionMetadataValue = $('#sectionMetadataValue').val(); // section_meta_val_position
    const taskId = $('#metadata_tracking_task_id').val();

    let hasError = false;

    if (!sectionMetadataName) {
        $('#sectionMetadataNameError').text('Please select section metadata name.');
        hasError = true;
    }

    if (!sectionMetadataValue) {
        $('#sectionMetadataValueError').text('Please select section metadata value.');
        hasError = true;
    }

    if (hasError) return;

    // All validations passed – send the AJAX request
    const payload = {
        task_id: taskId,
        position: sectionMetadataValue,
        field_id: sectionMetadataName
    };

    $.ajax({
        url: '/project-management/fetch-metadata-tracking-values/',
        type: 'POST',
        data: JSON.stringify(payload),
        contentType: 'application/json',
        headers: {
            "X-CSRFToken": $("input[name=csrfmiddlewaretoken]").val() // Send CSRF token in headers
        },
        beforeSend: function () {
            loader('show');
        },
        success: function (response) {
            loader('hide');
            const container = $('#showMetadataTrackingDiv');
            container.empty();

            if (response.success && response.changes.length > 0) {
                const changes = response.changes;
                let html = '';

                // Start with first new value if no old value
                html += `<h4 class="text-center alert-primary">Metadata Tracking List</h4>`;
                changes.forEach((change, index) => {
                    let tracking_new_value = change.new_value;
                    let tracking_old_value = change.old_value;

                    // Normalize null/None/'null'/'' to empty string
                    if (!tracking_new_value || tracking_new_value === 'null' || tracking_new_value === 'None') {
                        tracking_new_value = '';
                    }
                    if (!tracking_old_value || tracking_old_value === 'null' || tracking_old_value === 'None') {
                        tracking_old_value = '';
                    }

                    html += `
                        <div class="mb-4">
                            <div><strong>${tracking_new_value}</strong></div>
                            <div class="d-flex align-items-center">
                                <div class="text-danger" style="font-size:70px; width:25px; margin-top:-25px;">
                                    ↑
                                </div>
                                <div style="padding-left:10px;">
                                    <div class="text-secondary">
                                        <i class="fas fa-user"></i>
                                        <span class="text-primary fw-bold">Changed by:</span>
                                        <span class="text-success">${change.changed_by}</span>
                                    </div>
                                    <div class="text-secondary">
                                        <i class="fas fa-clock"></i>
                                        <span class="text-primary fw-bold">Changed at:</span>
                                        <span class="text-warning">${change.changed_at}</span>
                                    </div>
                                </div>
                            </div>
                            <div><strong>${tracking_old_value}</strong></div>
                        </div>
                    `;

                });


                container.html(html);
            } else {
                container.html('<div class="text-danger">No tracking history available for the selected metadata.</div>');
            }
        },
        error: function (xhr) {
            loader('hide');
            console.error('Tracking failed', xhr.responseText);
        }
    });
});
