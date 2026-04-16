
$(document).ready(function () {

    $('#specialCharModal').on('shown.bs.modal', function () {
        loader('hide');
    });

    $('#example_special_char').DataTable({
        responsive: true,
        dom: '<"toolbar"><"float-right pl-3"B>fltip',
        ordering: false,
        stateSave: true,
        pageLength : 10,
        lengthMenu: [
            [10, 25, 50, 100, -1],
            [10, 25, 50, 100, 'All'],
        ],

        buttons: [
            {
                extend:    'copyHtml5',
                text:      '<img src="/static/images/copy.png" width="20" height="20"/>',
                titleAttr: 'Copy list to clipboard',
                title: 'Solviti_Export_Text'
            },
            {
                extend:    'excelHtml5',
                text:      '<img src="/static/images/xls.png" width="20" height="20"/>',
                titleAttr: 'Export list in Excel file format',
                title: 'Solviti_Export_Excel'
            },
            {
                extend:    'csvHtml5',
                text:      '<img src="/static/images/export-csv.png" width="20" height="20"/>',
                titleAttr: 'Export list in CSV file format',
                title: 'Solviti_Export_CSV'
            },
            {
                extend:    'pdfHtml5',
                text:      '<img src="/static/images/pdf.png" width="20" height="20"/>',
                titleAttr: 'Export list in PDF file format',
                title: 'Solviti_Export_PDF',
                orientation: 'landscape',
                pageSize: 'LEGAL',
                exportOptions: {
                    columns: [ 0, 1, 2, 3 ]
                }
            },
        ],
        "language": {
            "search": '<i style="color:grey" class="fas fa-search" aria-hidden="true">_INPUT_</i>',
            "searchPlaceholder": "Filter Records",
        },
    });

    // Add Special Character
    $(document).on("click", ".add-char", function () {
        const row = $(this).closest("tr");
        const id = row.data("id");
        const selectedChar = row.find(".special-char-select").val();

        if (!selectedChar) {
            Swal.fire({
                title: 'Warning!',
                text: "Please select a special character!",
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
            return;
        }

        $.ajax({
            url: `/project-management/update-special-char/${id}/`,
            type: "POST",
            data: JSON.stringify({ special_char: selectedChar }),
            contentType: "application/json",
            headers: {
                "X-CSRFToken": $("[name=csrfmiddlewaretoken]").val()
            },
            success: function (data) {
                if (data.success) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        width: 300,
                        text: 'Special character saved successfully!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    Swal.fire({
                        title: 'Warning!',
                        text: "Please select a special character!",
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
            },
            error: function () {
                alert("An unexpected error occurred.");
            }
        });
    });

    // Delete Special Character
    $(document).on("click", ".delete-char", function () {

        const row = $(this).closest("tr");
        const id = row.data("id");
        const selectedChar = row.find(".special-char-select").val();
        if (!selectedChar) {
            return;
        }

        Swal.fire({
            title: '<h5>Are you sure you want to delete this Special Character Choice?</h5>',
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
                    url: `/project-management/delete-special-char/${id}/`,
                    type: "POST",
                    headers: {
                        "X-CSRFToken": $("[name=csrfmiddlewaretoken]").val()
                    },
                    success: function (data) {
                        if (data.success) {
                            // Reset dropdown
                            const select = row.find(".special-char-select");
                            select.val(""); // Reset value
                            select.find('option[value=""]').prop("selected", true); // Select default
                            select.trigger("change");

                            select.html(`
                              <option value="" selected>-- Select --</option>
                              <option value="MINOR">&#9675; MINOR</option>
                              <option value="MAJOR">&#9681; MAJOR</option>
                              <option value="CRITICAL">&#9679; CRITICAL</option>
                            `);

                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                width: 300,
                                text: 'Special character deleted successfully!',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        } else {
                            Swal.fire({
                                title: 'Warning!',
                                text: "Please select a special character!",
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
                    },
                    error: function () {
                        alert("An unexpected error occurred.");
                    }
                });
            }
        });
    });

});


