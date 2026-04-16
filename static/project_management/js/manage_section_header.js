
$('#close_manage_section_header').on('click', function() {
    loader('show');
    window.location.reload(1);
});


function manageSectionHeader(id) {
    $('#section_header_task_id').val(id);

    $.ajax({
        type: "GET",
        url: '/project-management/get-section-header/',
        data: {
            'section_header_task_id': id,
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
                $("#manageSectionHeaderModal").modal("show");
                $(".table-container").hide();

                // Save globally to reuse in delete handler
                window.section_metadata_json = response.section_metadata_json;
                window.section_header_data = response.section_header;

                // Call function to update the section metadata dropdown
                populateSectionMetadataDropdown(response.section_header, response.section_metadata_json);

                // Call function to handle column configuration details
                populateSectionHeaderTable(response.section_metadata_json);

            } else {
                console.log("Error in managing section header!");
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX error: " + error);
        }
    });
}


function populateSectionMetadataDropdown(sectionMetadata, sectionMetadataJson) {
    let dropdown = $("#sectionMetadata");
    dropdown.empty(); // Clear existing options

    // Extract already-used field IDs from the existing section_metadata_json
    let usedIds = [];
    if (sectionMetadataJson && sectionMetadataJson.column_config_details) {
        usedIds = sectionMetadataJson.column_config_details.map(item => item.id);
    }

    // Ensure the default option is always present
    dropdown.append('<option value="">Select Section Metadata Name</option>');

    sectionMetadata.forEach(item => {
        const isUsed = usedIds.includes(item.name);  // Using item.name because you group by name
        const tooltip = isUsed ? 'title="This metadata is already grouped under a header."' : "";
        const disabled = isUsed ? "disabled" : "";

        // Build text content with simulated small & warning style (not real HTML inside option)
        const displayText = isUsed
            ? `${item.name} (Already Grouped)`
            : item.name;

        dropdown.append(`
            <option value="${item.id}" data-position="${item.position}" ${disabled} ${tooltip}>
                ${displayText}
            </option>
        `);
    });

    // Add custom styling using CSS
    $("#sectionMetadata").addClass("custom-option-style");

    // Re-enable Bootstrap tooltips
    $('[title]').tooltip();


    // Handle Change Event
    $("#sectionMetadata, #numColumns").off("change").on("change", function () {
        $("#sectionMetadataError").text("");
        $("#numColumnsError").text("");
        generateFields();
    });

    function generateFields() {
        $(".table-container").show();
        // Ensure "Select Section Metadata" is the first option
        if ($("#sectionMetadata option[value='']").length === 0) {
            $("#sectionMetadata").prepend('<option value="">Select Section Metadata Name</option>');
        }

        const selectedMetadata = $("#sectionMetadata").val();
        const selectedColumns = parseInt($("#numColumns").val());
        const selectedPosition = parseInt($("#sectionMetadata option:selected").attr("data-position"));

        if (!selectedMetadata) {
            $("#dynamicFields").html(""); // Clear table if nothing is selected
            $("#numColumns").val(""); // Reset Number of Columns
            return;
        }

        let filteredMetadata = sectionMetadata.filter(item => item.position >= selectedPosition).slice(0, selectedColumns);

        // Auto-update #numColumns based on filteredMetadata length
        $("#numColumns").val(filteredMetadata.length);

        // Get headerName input value
        let headerNameValue = $("#headerName").val().trim();
        let mainHeaderName = headerNameValue ? headerNameValue : "";  // If exists, use it; otherwise, empty string

        // Create Table Structure
        let tableHtml = `<table class="custom-table">
            <thead>
                <tr>
                    <th colspan="${filteredMetadata.length}" id="dynamicHeaderName">${mainHeaderName}</th>
                </tr>
                <tr>`;

        // Add Sub-Headers
        filteredMetadata.forEach(item => {
            tableHtml += `<th>${item.name}</th>`;
        });

        tableHtml += `</tr>
            </thead>
            <tbody>
                <tr>`;

        // Add Input Fields
        filteredMetadata.forEach(item => {
            tableHtml += `<td><input type="hidden" class="minWidthInput" data-id="${item.name}"></td>`;
        });

        tableHtml += `</tr>
            </tbody>
        </table>`;

        $("#dynamicFields").html(tableHtml);

        // Attach event listener to update the header dynamically
        $("#headerName").on("input", function() {
            $("#headerNameError").text("");
            let headerText = $(this).val().trim() || "";  // If empty, set empty
            $("#dynamicHeaderName").text(headerText);
        });
    }

}


function populateSectionHeaderTable(sectionMetadataJson) {
    let tableBody = $("#manageSectionHeaderTable tbody");
    tableBody.empty();

    let sectionHeaders = [];  // Declare it outside to avoid ReferenceError

    try {
        sectionHeaders = sectionMetadataJson.column_config_details;
    } catch (err) {
        sectionHeaders = [];
        console.log("Error parsing sectionHeaders, defaulting to empty array:", err);
    }
    if (!Array.isArray(sectionHeaders) || sectionHeaders.length === 0) {
        tableBody.append(`
            <tr>
                <td colspan="3" class="text-center text-danger font-weight-bold">
                    No data available in table
                </td>
            </tr>
        `);
        return;
    }

    let index = 1;
    let i = 0;

    while (i < sectionHeaders.length) {
        let group = [];
        let current = sectionHeaders[i];

        const colspan = parseInt(current.header?.[0]?.colspan || 1);
        const headerName = current.header?.[0]?.text || "";

        // Collect metadata fields in this group
        for (let j = 0; j < colspan && (i + j) < sectionHeaders.length; j++) {
            group.push(sectionHeaders[i + j].id);
        }

        // Build horizontally scrollable "table row" look
        let groupHtml = `
            <div title="Section Metadata Header Name" class="text-center font-weight-bold section-metadata-cell">${headerName}</div>
            <div title="Section Metadata(Column) Name" class="section-group-scroll justify-content-center">
                ${group.map(name => `
                    <div class="section-metadata-cell">${name}</div>
                `).join("")}
            </div>
        `;

        const deleteButton = `
            <button title="Delete Section Header Group" class="btn btn-danger btn-sm myBtn" onclick="deleteSectionHeader(${i}, ${colspan})">
                <i class="fas fa-trash-alt"></i> Delete
            </button>`;

        tableBody.append(`
            <tr>
                <td>${index}</td>
                <td>${groupHtml}</td>
                <td class="text-center">${deleteButton}</td>
            </tr>
        `);

        i += colspan;
        index++;
    }
}


$("#saveMetadata").on("click", function () {
    $("#headerNameError").text("");
    $("#sectionMetadataError").text("");
    $("#numColumnsError").text("");

    let taskId = $("#section_header_task_id").val();
    let headerName = $("#headerName").val();
    let sectionMetadataValue = $("#sectionMetadata").val();
    let numColumns = $("#numColumns").val();

    let columnConfigDetails = [];
    let headers = [{ text: headerName, align: 'center', colspan: $(".minWidthInput").length }];

    $(".minWidthInput").each(function (index) {
        let id = $(this).data("id");
        columnConfigDetails.push({
            id: id,
            header: index === 0 ? headers.concat([{ text: id, align: 'center' }]) : ["", { text: id, align: 'center' }]
        });
    });

    if (headerName === "" || headerName === null) {
        $("#headerNameError").text("Header name field is required!");
        return;
    }

    if (sectionMetadataValue === "" || sectionMetadataValue === null) {
        $("#sectionMetadataError").text("Select Section Metadata field is required!");
        return;
    }

    if (numColumns === "" || numColumns === null) {
        $("#numColumnsError").text("Number of columns field is required!");
        return;
    }

    $.ajax({
        type: "POST",
        url: "/project-management/save-section-header/",
        contentType: "application/json",  // Send JSON data
        data: JSON.stringify({
            task_id: taskId,
            column_config_details: columnConfigDetails
        }),
        headers: {
            "X-CSRFToken": $("input[name=csrfmiddlewaretoken]").val() // Send CSRF token in headers
        },
        beforeSend: function () {
            loader('show');
        },
        success: function (response) {
            loader('hide');
            if (response.success) {

                var sectionHeaders = response["section_metadata_json"];

                // Update global values
                window.section_metadata_json = sectionHeaders;
                
                // Re-render table
                populateSectionHeaderTable(sectionHeaders);
                
                // Disable used dropdown items again
                populateSectionMetadataDropdown(window.section_header_data, sectionHeaders);
                
                // Reset Modal Data
                resetModalData();
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    width:300,
                    text: 'Section Header group created successfully!',
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
            loader('hide');
            alert("Failed to save data!");
        }
    });
});


function resetModalData() {
    $("#headerName").val("");  // Reset Header Name
    $("#sectionMetadata").val(""); // Reset Section Metadata Dropdown
    $("#numColumns").val(""); // Reset Number of Columns
    $("#dynamicFields").empty(); // Clear Dynamic Fields
    $(".table-container").hide();
}


function deleteSectionHeader(startIndex, count) {

    Swal.fire({
        title: 'Are you sure you want to delete this section header?',
        text: 'This will delete the entire section header group.',
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
            let updatedConfig = JSON.parse(JSON.stringify(window.section_metadata_json)); // clone

            if (Array.isArray(updatedConfig.column_config_details)) {
                updatedConfig.column_config_details.splice(startIndex, count); // 🧹 Remove group

                // AJAX call to persist the updated config
                $.ajax({
                    url: '/project-management/delete-section-header-group/',
                    method: 'POST',
                    data: {
                        task_id: $('#section_header_task_id').val(),
                        updated_config: JSON.stringify(updatedConfig),
                        csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
                    },
                    beforeSend: function () {
                        loader('show');
                    },
                    success: function (response) {
                        if (response.success) {
                            window.section_metadata_json = updatedConfig; // Update global
                            populateSectionHeaderTable(updatedConfig);    // 🔁 Re-render table

                            // Also re-populate dropdown to re-enable options
                            populateSectionMetadataDropdown(
                                window.section_header_data,    // Store this globally on initial load
                                updatedConfig
                            );
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                width:300,
                                text: 'Section Header group has been deleted successfully!',
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
                        Swal.fire('Error!', 'Failed to delete section header group.', 'error');
                    },
                    complete: function () {
                        loader('hide');
                    }
                });
            }
        }

    });
}
