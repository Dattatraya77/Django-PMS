
$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: "/project-management/section-master-list/",
        success: function (data) {
            loadSectionMasterTable(data);
        },
        error: function () {
            loader('hide');
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load section masters!',
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
    });

    let $choiceInput = $("#choiceInput");
    let $dropdownList = $('<div class="dropdown-menu" style="display: block;width: 892px; margin-left:15px; margin-top: -22px;"></div>').insertAfter($choiceInput).hide();

    $choiceInput.on("input", function () {
        const query = $(this).val().trim();
        if (query.length === 0) {
            $dropdownList.hide();
            return;
        }

        $.ajax({
            url: "/project-management/get-matching-choices/",
            data: { q: query },
            success: function (data) {
                $dropdownList.empty();
                if (data.results.length > 0) {
                    data.results.forEach(function (item) {
                        $dropdownList.append(
                            `<button class="dropdown-item" type="button">${item}</button>`
                        );
                    });
                    $dropdownList.show();
                } else {
                    $dropdownList.hide();
                }
            },
        });
    });

    // On selecting a dropdown item
    $dropdownList.on("click", ".dropdown-item", function () {
        $choiceInput.val($(this).text());
        $dropdownList.hide();
    });

    // Hide dropdown when clicking outside
    $(document).on("click", function (e) {
        if (!$(e.target).closest("#choiceInput").length && !$(e.target).closest(".dropdown-menu").length) {
            $dropdownList.hide();
        }
    });


    let $newChoiceInput = $("#newChoiceInput");
    let $newDropdownList = $('<div class="dropdown-menu" style="display: block;width: 630px; margin-left:15px;"></div>').insertAfter($newChoiceInput).hide();

    $newChoiceInput.on("input", function () {
        const query = $(this).val().trim();
        if (query.length === 0) {
            $newDropdownList.hide();
            return;
        }

        $.ajax({
            url: "/project-management/get-matching-choices/",
            data: { q: query },
            success: function (data) {
                $newDropdownList.empty();
                if (data.results.length > 0) {
                    data.results.forEach(function (item) {
                        $newDropdownList.append(
                            `<button class="dropdown-item" type="button">${item}</button>`
                        );
                    });
                    $newDropdownList.show();
                } else {
                    $newDropdownList.hide();
                }
            },
        });
    });

    // On selecting a dropdown item
    $newDropdownList.on("click", ".dropdown-item", function () {
        $newChoiceInput.val($(this).text());
        $newDropdownList.hide();
    });

    // Hide dropdown when clicking outside
    $(document).on("click", function (e) {
        if (!$(e.target).closest("#newChoiceInput").length && !$(e.target).closest(".dropdown-menu").length) {
            $newDropdownList.hide();
        }
    });


    // Open modal on Add button click
    $('#add_sub_choices').on('click', function () {
        $('#modalMetadataSelect').val('');
        $('#modalChoiceSelect').html('<option value="">Click here to select options.</option>').prop('disabled', true);
        $('#modalMetadataError, #modalChoiceError').text('');
        $('#addSubChoiceModal').modal('show');
    });

    // On metadata change: fetch related choices
    $('#modalMetadataSelect').on('change', function () {
        const metadataName = $(this).val();
        $('#modalChoiceSelect').html('');
        $('#modalChoiceError').text('');
        const sectionName = $('#sectionMasterName').val();

        if (!metadataName) {
            $('#modalChoiceSelect').html('<option value="">Click here to select options.</option>').prop('disabled', true);
            return;
        }

        // AJAX to get choices
        $.ajax({
            url: '/project-management/get-section-sub-metadata-choices/',
            data: { metadata_name: metadataName, section_master_name: sectionName},
            success: function (res) {
                if (res.success && res.choices.length > 0) {
                    let options = '<option value="">Select a choice</option>';
                    res.choices.forEach(choice => {
                        options += `<option value="${choice}">${choice}</option>`;
                    });
                    $('#modalChoiceSelect').html(options).prop('disabled', false);
                } else {
                    $('#modalChoiceSelect').html('<option value="">No choices found</option>').prop('disabled', true);
                }
            },
            error: function () {
                $('#modalChoiceSelect').html('<option value="">Error loading choices</option>').prop('disabled', true);
            }
        });
    });

    // On submit in modal
    $('#modalSubmitChoiceBtn').on('click', function () {
        const selectModalMetadata = $('#modalMetadataSelect').val();
        const selectedChoice = $('#modalChoiceSelect').val();
        const selectedSubMetadataName = $('#modalMetadataSelect').val();

        if (!selectModalMetadata) {
            $('#modalMetadataError').text('Please select a choice.');
            return;
        }

        if (!selectedChoice) {
            $('#modalChoiceError').text('Please select a choice.');
            return;
        }

        // Set the selected value in the original input
        $('#section_sub_choice').val(selectedChoice);
        $('#section_sub_metadata_name').val(selectedSubMetadataName);
        $('#addSubChoiceModal').modal('hide');
        $('#modalMetadataSelect').val(null).trigger('change');
        $('#modalChoiceSelect').val(null).trigger('change');
    });

});

// Handle creating choices
$('#createChoiceBtn').on('click', function () {
    const input = $('#choiceInput');
    const value = input.val().trim();
    const errorBox = $('#choiceInputError');

    // Clear any previous error
    errorBox.text('');

    if (value === '') {
        errorBox.text('Please enter your choice.');
        return;
    }

    let isDuplicate = false;

    // Check if value already exists (case-insensitive)
    $('#choiceList li').each(function () {
        if ($(this).data('choice')?.toLowerCase() === value.toLowerCase()) {
            isDuplicate = true;
            return false; // break loop
        }
    });

    if (isDuplicate) {
        errorBox.text(`Choice "${value}" is already added. Please choose a different choice name.`);
        return;
    }

    const listLength = $('#choiceList li').length + 1;  // Serial number

    // Create new list item with serial number
    const listItem = $(`
        <li class="list-group-item d-flex justify-content-between align-items-center" style="background-color: aquamarine;">
            <span><strong>${listLength}.</strong> ${value}</span>
            <button title="Click here to remove choice" type="button" class="btn btn-sm btn-danger remove-choice">Delete</button>
        </li>
    `);
    listItem.data('choice', value);

    $('#choiceList').prepend(listItem);  // Add at end
    input.val('');
});


// Re-index choices after deletion (latest created = serial 1 at top)
$('#choiceList').on('click', '.remove-choice', function () {
    $(this).closest('li').remove();

    const totalItems = $('#choiceList li').length;

    $('#choiceList li').each(function (index) {
        const choiceText = $(this).data('choice');
        const serialNumber = totalItems - index; // Reverse indexing
        $(this).find('span').html(`<strong>${serialNumber}.</strong> ${choiceText}`);
    });
});


$('#sectionMasterName').on('change', function () {
    // Clear previous error messages
    $('#sectionMasterNameError').text('');
    $('#sectionMasterMetadataNameError').text('');
    $('#existingChoicesMessage').hide(); // Hide old message
    $('#choiceList').empty(); // Optionally clear previous choices
    $('#sectionMasterMetadataName').val(null).trigger('change');

    // Hide the table
    $('#existingChoicesTableBody').closest('table').attr('hidden', true);


    const sectionName = $('#sectionMasterName').val();

    if (sectionName) {
        $('#add_sub_choices').prop('disabled', false);
        return;
    }
    else {
        $('#add_sub_choices').prop('disabled', true);
        $('#section_sub_choice').val('');
        $('#section_sub_metadata_name').val('');
        return;
    }
});


let existingChoicesCache = [];

$('#sectionMasterMetadataName').on('change', function () {
    $('#sectionMasterMetadataNameError').text('');
    $('#existingChoicesMessage').hide();
    $('#choiceList').empty();
    existingChoicesCache = [];

    // Hide the table
    $('#existingChoicesTableBody').closest('table').attr('hidden', true);

    const metadataName = $(this).val();
    if (!metadataName) return;

    $.ajax({
        url: '/project-management/get-existing-choices/',
        method: 'GET',
        data: { metadata_name: metadataName },
        beforeSend: function () {
            loader('show');
        },
        complete: function () {
            loader('hide');
        },
        success: function (res) {
            loader('hide');
            const tableBody = $('#existingChoicesTableBody');
            tableBody.empty();

            if (res.success && res.section_masters.length > 0) {

                $('#existingChoicesText').html(`
                    Choices already exist for <strong>${metadataName}</strong>. Do you want to load them?
                    Click on the <button type="button" class="btn btn-info btn-xs">Copy</button> button from the below table to add choices.
                `);
                $('#existingChoicesMessage').show();

                res.section_masters.forEach((sm, index) => {
                    const row = $(`
                        <tr>
                            <td>${sm.id}</td>
                            <td>${sm.section_master_name}</td>
                            <td>${sm.section_sub_metadata_name || ''}</td>
                            <td>${sm.section_sub_choice || ''}</td>
                            <td>${sm.section_master_metadata_name}</td>
                            <td>
                                <button title="Click here to copy choices" type="button" class="btn btn-info btn-xs copy-section-choice" data-choices='${JSON.stringify(sm.choices)}'>
                                    Copy
                                </button>
                            </td>
                        </tr>
                    `);

                    tableBody.append(row);
                });

                // Show the table
                tableBody.closest('table').removeAttr('hidden');
            }
            else {
                $('#sectionMasterMetadataNameError').text('');
                $('#existingChoicesMessage').hide();
                $('#choiceList').empty();
                $('#existingChoicesText').html('');
            }
        }
    });
});


// Handle clear event separately
$('#sectionMasterName, #sectionMasterMetadataName').on('select2:clear', function () {
    $('#existingChoicesText').html('');
    $('#choiceList').empty();
    $('#existingChoicesTableBody').closest('table').attr('hidden', true);
});


// Handle Copy Button Click
$(document).on('click', '.copy-section-choice', function () {
    const list = $('#choiceList');
    list.empty();

    const choices = JSON.parse($(this).attr('data-choices'));
    existingChoicesCache = choices.reverse();  // Optional, for serials

    existingChoicesCache.forEach((choice, idx) => {
        const serial = existingChoicesCache.length - idx;
        const li = $(`
            <li class="list-group-item d-flex justify-content-between align-items-center" style="background-color: aquamarine;">
                <span><strong>${serial}.</strong> ${choice}</span>
                <button type="button" class="btn btn-sm btn-danger remove-choice">Delete</button>
            </li>
        `);
        li.data('choice', choice);
        list.append(li);
    });

    $('#existingChoicesMessage').hide();
    existingChoicesCache = [];

    // Smooth scroll to the choiceList
    $('html, body').animate({
        scrollTop: $('#add_choice_div_id').offset().top - 100 // Adjust offset if needed
    }, 500);
});


$('#choiceInput').on('paste keyup change click', function () {
    // Clear previous error messages
    $('#choiceInputError').text('');
});


// Handle form submit
$('#submitSectionMaster').on('click', function () {
    const sectionMasterName = $('#sectionMasterName').val();
    const metadataName = $('#sectionMasterMetadataName').val();
    const sectionSubMetadataName = $('#section_sub_metadata_name').val();
    const sectionSubChoiceName = $('#section_sub_choice').val();

    if (!sectionMasterName) {
        $('#sectionMasterNameError').text('Please select section master name.');
        // Smooth scroll to the form-title
        $('html, body').animate({
            scrollTop: $('#form-title').offset().top // Adjust offset if needed
        }, 500);
        return;
    }

    if (!metadataName) {
        $('#sectionMasterMetadataNameError').text('Please select section master metadata name.');
        // Smooth scroll to the form-title
        $('html, body').animate({
            scrollTop: $('#form-title').offset().top // Adjust offset if needed
        }, 500);
        return;
    }

    const choices = [];

    $('#choiceList li').each(function () {
        choices.push($(this).data('choice'));
    });

    $.ajax({
        type: 'POST',
        url: '/project-management/create-section-master/',
        data: {
            section_master_name: sectionMasterName,
            section_master_metadata_name: metadataName,
            section_sub_metadata_name: sectionSubMetadataName,
            section_sub_choice_name: sectionSubChoiceName,
            choices: JSON.stringify(choices),
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
        },
        beforeSend: function () {
            loader('show');
        },
        complete: function () {
            loader('hide');
        },
        success: function (response) {
            loader('hide');
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                width:300,
                text: 'Section Master created successfully!',
                showConfirmButton: false,
                timer: 3000
            });
            location.reload();
        },
        error: function (err) {
            loader('hide');
            var error_message = err.responseJSON?.message || 'Error in create section master!.';
            $('#sectionMasterMetadataNameError').html(error_message);
            // Scroll to the target
            const target = $("#sectionMasterMetadataName");
            $("html, body").animate({
                scrollTop: target.offset().top - 250
            }, 1000);
        }
    });
});


let sectionMasters = [];
let selectedSectionMasterId = null;

function loadSectionMasterTable(data) {
    sectionMasters = data;
    renderFilteredTable(data); // Call the filtered renderer
}

function renderFilteredTable(filteredData) {
    const tbody = document.getElementById("sectionMasterTableBody");
    tbody.innerHTML = "";

    if (filteredData.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 6;
        td.className = "text-center text-danger font-weight-bold";
        td.textContent = "No data available in table";
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    filteredData.forEach((item) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.section_master_name}</td>
            <td>${item.section_sub_metadata_name}</td>
            <td>${item.section_sub_choice_name}</td>
            <td>${item.section_master_metadata_name}</td>
            <td>
                <button class="btn btn-sm ${item.is_completed ? 'btn-success' : 'btn-primary'}"
                        onclick="confirmStatusChange(${item.id}, ${item.is_completed})">
                    ${item.status}
                </button>
            </td>
            <td>
                <button title="Click here to update section master" class="btn btn-secondary btn-sm" onclick="openUpdateModal(${item.id})">
                    <i class="fas fa-edit btn-secondary"></i>
                </button>
                <button title="Click here to delete section master" class="btn btn-danger btn-sm" onclick="deleteSectionMaster(${item.id})">
                    <i class="fas fa-trash-alt btn-danger"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}


function confirmStatusChange(id, isCompleted) {
    const newStatus = isCompleted ? "In Progress" : "Completed";
    Swal.fire({
        title: 'Change Status',
        text: `Do you want to mark this as ${newStatus}?`,
        icon: 'question',
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
            toggleStatus(id);
        }
    });
}


function toggleStatus(id) {
    $.ajax({
        type: 'POST',
        url: '/project-management/toggle-section-status/',
        data: {
            section_id: id,
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        success: function (response) {
            if (response.success) {
                const updated = sectionMasters.map((item) => {
                    if (item.id === id) {
                        item.is_completed = response.is_completed;
                        item.status = response.new_status;
                    }
                    return item;
                });
                renderFilteredTable(updated);
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to update status!',
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


// Listen for input in the search box
document.getElementById("searchInput").addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    const filtered = sectionMasters.filter(item =>
        (item.section_master_name || "").toLowerCase().includes(query) ||
        (item.section_master_metadata_name || "").toLowerCase().includes(query) ||
        (item.section_sub_choice_name || "").toLowerCase().includes(query)
    );
    renderFilteredTable(filtered);
});


// Open the update modal and load choices
function openUpdateModal(id) {
    selectedSectionMasterId = id;
    const section = sectionMasters.find(item => item.id === id);
    const ul = document.getElementById("existingChoicesList");
    ul.innerHTML = "";

    // Update header based on is_sub_choice
    if (section.section_sub_metadata_name) {
        $('#update_section_master_choice_header').text(`Note: Parameters being used for "${section.section_sub_choice_name}"`);
    } else {
        $('#update_section_master_choice_header').text(`Note: Choices being used for column name "${section.section_master_metadata_name}"`);
    }

    section.choices.forEach(choice => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.style.backgroundColor = "aquamarine";
        li.textContent = choice;

        const delBtn = document.createElement("button");
        delBtn.className = "btn btn-sm btn-danger";
        delBtn.title = "Click here to remove choice";
        delBtn.textContent = "Delete";
        delBtn.onclick = function () {
            Swal.fire({
                title: '<h5>Are you sure you want to delete this Section Master Choice?</h5>',
                text: "You will not be able to recover this Section Master Choice again!",
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
                    $.ajax({
                        type: 'POST',
                        url: `/project-management/remove-choice/`,
                        data: {
                            section_master_id: selectedSectionMasterId,
                            choice: choice,
                            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
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
                                li.remove();
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'success',
                                    width:300,
                                    text: 'Section Master Choice deleted successfully!',
                                    showConfirmButton: false,
                                    timer: 2000
                                });
                            } else {
                                loader('hide');
                                Swal.fire({
                                    title: 'Error!',
                                    text: 'Failed to remove choice!',
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
            });
        };

        li.appendChild(delBtn);
        ul.appendChild(li);
    });

    $('#updateSectionMasterModal').modal('show');
}

// Add new choice to section master
document.getElementById("addChoiceBtn").addEventListener("click", function () {
    const input = document.getElementById("newChoiceInput");
    const value = input.value.trim();
    if (value && selectedSectionMasterId) {
        $.ajax({
            type: 'POST',
            url: '/project-management/add-choice/',
            data: {
                section_master_id: selectedSectionMasterId,
                choice: value,
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
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
                    const li = document.createElement("li");
                    li.className = "list-group-item d-flex justify-content-between align-items-center";
                    li.style.backgroundColor = "aquamarine";
                    li.textContent = value;

                    const delBtn = document.createElement("button");
                    delBtn.className = "btn btn-sm btn-danger";
                    delBtn.title = "Click here to remove choice";
                    delBtn.textContent = "Delete";
                    delBtn.onclick = function () {
                        Swal.fire({
                            title: '<h5>Are you sure you want to delete this Section Master Choice?</h5>',
                            text: "You will not be able to recover this Section Master Choice again!",
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
                                $.ajax({
                                    type: 'POST',
                                    url: '/project-management/remove-choice/',
                                    data: {
                                        section_master_id: selectedSectionMasterId,
                                        choice: value,
                                        csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
                                    },
                                    beforeSend: function () {
                                        loader('show');
                                    },
                                    complete: function () {
                                        loader('hide');
                                    },
                                    success: function (res) {
                                        if (res.success) {
                                            loader('hide');
                                            li.remove();
                                            Swal.fire({
                                                position: 'top-end',
                                                icon: 'success',
                                                width:300,
                                                text: 'Section Master Choice deleted successfully!',
                                                showConfirmButton: false,
                                                timer: 2000
                                            });
                                        } else {
                                            loader('hide');
                                            Swal.fire({
                                                title: 'Error!',
                                                text: 'Failed to remove choice!',
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
                        });
                    };

                    li.appendChild(delBtn);
                    document.getElementById("existingChoicesList").prepend(li);
                    input.value = "";
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        width:300,
                        text: 'Section Master Choice created successfully!',
                        showConfirmButton: false,
                        timer: 2000
                    });
                } else {
                    loader('hide');
                    const errMsg = response.error || 'Failed to add choice!';
                    $('#newChoiceInputError').text(errMsg);  // Show near input
                }
            }
        });
    }
    else {
        $('#newChoiceInputError').text('Please enter your new choice.');
    }
});

// Delete the section master
function deleteSectionMaster(id) {
    Swal.fire({
        title: '<h5>Are you sure you want to delete this Section Master?</h5>',
        text: "You will not be able to recover this Section Master again!",
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
            $.ajax({
                type: 'POST',
                url: '/project-management/delete-section-master/',
                data: {
                    section_master_id: id,
                    csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
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
                        sectionMasters = sectionMasters.filter(item => item.id !== id);
                        loadSectionMasterTable(sectionMasters);
                    } else {
                        loader('hide');
                        Swal.fire({
                            title: 'Error!',
                            text: 'Failed to delete Section Master!',
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
    });
}


$('#newChoiceInput').on('paste keyup change click', function () {
    // Clear previous error messages
    $('#newChoiceInputError').text('');
});

