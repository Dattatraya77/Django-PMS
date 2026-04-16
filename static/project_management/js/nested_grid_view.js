
function getSplCharTemplate(value) {
    if (!value) return;
    lowercase_value = value.toLowerCase();
    if(lowercase_value === 'minor'){
        class_name='circle minor'
    }
    else if(lowercase_value === 'major'){
        class_name='circle major'
    }
    else if(lowercase_value === 'critical'){
        class_name='circle critical'
    }
    else {
        class_name='circle minor'
    }
    return `
        <div class='dhx-demo_grid-template'>
            <div class="severity">
                <div class="${class_name}"></div>
                <span>${value}</span>
            </div>
        </div>
    `
}

const rowMenu = new dhx.ContextMenu(null, {
    data: [
        { "id": "insertRowAbove", "value": "Insert row above", "icon": "dxi dxi-arrow-up" },
        { "id": "insertRowBelow", "value": "Insert row below", "icon": "dxi dxi-arrow-down" },
        { "id": "clearRow", "value": "Clear row", "icon": "dxi dxi-close" },
        { "id": "deleteRow", "value": "Delete row", "icon": "dxi dxi-delete" },
        { "id": "trackMetadata", "value": "Track Metadata", "icon": "dxi dxi-plus" }
    ]
});

// Function to toggle nested grid and switch icon
function toggleNestedGrid(rowId) {
    treeGrid.config.leftSplit = 0;
    treeGrid.paint();

    $.ajax({
        type: "GET",
        url: '/project-management/nested-grid-metadata-view/',
        data: {
            'task_id': rowId,
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
                var context = response["context"];
                var column_config_details = context["column_config_details"];

                if(context["columns"] == ""){
                    Swal.fire({
                        title: 'Error!',
                        text: 'Columns not added, please add columns first!',
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
                    return;
                }

                var nested_grid_columns = context["columns"];

                let converted_boolean_data = convertStringBooleans(context["task_data_list"]);
                var nested_grid_data = converted_boolean_data;
                console.log("nested_grid_data:->",nested_grid_data);

                var rowNode = document.querySelector(`.dhx_grid-row[data-dhx-id="${rowId}"]`);
                if (!rowNode) return;

                var dataWrap = document.querySelector(".dhx_data-wrap");
                if (!dataWrap) return;

                var gridWidth = dataWrap.offsetWidth; // Get width from .dhx_data-wrap

                var nestedGridId = `nestedGrid-${rowId}`;
                var existingNestedGrid = document.getElementById(nestedGridId);
                var gridBody = document.querySelector(".dhx_grid-body");

                // Remove existing nested grid if already present
                if (existingNestedGrid) {
                    treeGrid.config.leftSplit = 2;
                    treeGrid.paint();
                    existingNestedGrid.remove();
                    rowNode.style.marginBottom = "0px"; // Reset margin
                    return;
                }

                // Remove all other nested grids before creating a new one
                document.querySelectorAll(".nested-grid").forEach((grid) => grid.remove());

                // Get row position
                var rowRect = rowNode.getBoundingClientRect();
                var gridRect = gridBody.getBoundingClientRect();
                var topOffset = rowRect.top - gridRect.top + gridBody.scrollTop;

                // Push down rows below the parent row
                rowNode.style.marginBottom = "210px"; // Add space for nested grid

                // Create a new div for the nested grid
                var nestedDiv = document.createElement("div");
                nestedDiv.classList.add("nested-grid");
                nestedDiv.id = nestedGridId;
                nestedDiv.style.position = "absolute";
                nestedDiv.style.top = `${topOffset + rowNode.offsetHeight}px`;
                nestedDiv.style.left = "0px";
                nestedDiv.style.width = `${gridWidth}px`; // Set width from .dhx_data-wrap
                nestedDiv.style.height = "400px";
                nestedDiv.style.border = "1px solid #ddd";
                nestedDiv.style.backgroundColor = "#fff";
                nestedDiv.style.zIndex = "1";
                nestedDiv.style.overflowX = "auto";
                nestedDiv.style.overflowY = "auto";

                gridBody.appendChild(nestedDiv);

                // Function to update nested grid position and width dynamically
                function updateNestedGridPosition() {
                    var updatedRowNode = document.querySelector(`.dhx_grid-row[data-dhx-id="${rowId}"]`);
                    if (!updatedRowNode) return;

                    var updatedGridWidth = dataWrap.offsetWidth; // Get updated width

                    var updatedRowRect = updatedRowNode.getBoundingClientRect();
                    var updatedTopOffset = updatedRowRect.top - gridRect.top + gridBody.scrollTop;

                    nestedDiv.style.top = `${updatedTopOffset + updatedRowNode.offsetHeight}px`;
                    nestedDiv.style.width = `${updatedGridWidth}px`; // Update width dynamically
                }

                // Listen to scroll and resize events to dynamically update width
                gridBody.addEventListener("scroll", updateNestedGridPosition);
                window.addEventListener("resize", updateNestedGridPosition);

                // Before initializing the nested grid
                nested_grid_columns.push({
                    id: "actions",
                    header: [{ text: "Actions", tooltip: true, align: "center" }],
                    minWidth:80,
                    maxWidth:80,
                    mark: () => "dhx-demo_color--gray",
                    template: () => `<i class="dxi dxi-dots-vertical row-menu"></i>`,
                    align: "center",
                    tooltip: false, editable: false, sortable: false, htmlEnable: true,
                    position:0,
                    order:0,

                } );

                console.log("nested_grid_columns:->",nested_grid_columns);

                nested_grid_columns.forEach(function (item){
                    console.log("item:->",item);
                    if(item.type == 'number'){
                        item.editorConfig={
                            template: ({ value }) => getNumberTemplate(value),
                        }
                        item.template=getNumberTemplate
                        item.htmlEnable=true
                    }
                    if(item.customType == 'signature'){
                        item['editable'] = false
                        item['mark']=function (cell, data) {
                            if (cell) {
                                return "signature_col_cell_color";
                            }
                            else {
                                return;
                            }
                        }
                        item.htmlEnable=true
                    }
                    if(item.id == 'SPL CHAR'){
                        item.editorConfig={newOptions: false,
                            template: ({ value }) => getSplCharTemplate(value),
                        }
                        item.template=getSplCharTemplate
                        item.htmlEnable=true
                        item['editable'] = false
                    }

                    // Merge column_config_details if id matches
                    let matchingColumn = column_config_details.find(col => col.id === item.id);
                    if (matchingColumn) {
                        item.header = matchingColumn.header;
                    }

                    // Append {content: 'selectFilter'} to header if needed
                    if (item.editorType === 'combobox' || item.editorType === 'multiselect' || item.type === 'string' || item.type === 'date') {
                        // Prevent duplicate 'selectFilter' insertion
                        const hasSelectFilter = item.header.some(h => h.content === 'selectFilter');
                        if (!hasSelectFilter) {
                            item.header.push({ content: 'selectFilter' });
                        }
                    }

                });

                let dragItemValue = "";

                if (delete_task_permissions == 'False'){
                    dragItemValue = "";
                }
                else {
                    dragItemValue = "column";
                }

                // Initialize the nested DHTMLX Grid
                setTimeout(() => {
                    let nestedGrid = new dhx.TreeGrid(nestedGridId, {
                        type: "grid",
                        columns: nested_grid_columns,
                        editable: isEditable,
                        selection: "row",
                        autoHeight: true,
                        resizable: true,
                        autoWidth: true,
                        width: "100%",
                        dragItem: dragItemValue,
                        data: nested_grid_data,
                        eventHandlers: {
                            onclick: {
                                "row-menu": event => rowMenu.showAt(event.target),
                            }
                        },
                    });
                    nestedGrid.paint();

                    nestedGrid.selection.events.on("afterSelect", function(row, col){
                        if(col.customType == "signature" && isEditable){

                            $("#gridSignatureModal").modal("show"); // Open Bootstrap modal

                            // Use event delegation to ensure click events always work
                            $("#gridSignatureModal").on("click", "#addGridSignatureBtn", function () {
                                manageGridSignature("add", rowId, row.position, col.id, nestedGrid, row.id);
                            });

                            $("#gridSignatureModal").on("click", "#updateGridSignatureBtn", function () {
                                manageGridSignature("update", rowId, row.position, col.id, nestedGrid, row.id);
                            });

                            $("#gridSignatureModal").on("click", "#deleteGridSignatureBtn", function () {
                                manageGridSignature("delete", rowId, row.position, col.id, nestedGrid, row.id);
                            });

                        }
                    });

                    let shouldOpenEditor = false;
                    let activityChoicesCache = {};  // Cache only for "PARAMETERS TO BE CHECKED"

                    nestedGrid.events.on("beforeEditStart", function (row, col) {
                        const metadataName = col.id;

                        // Only apply caching logic for PARAMETERS TO BE CHECKED
                        const isTargetColumn = metadataName === "PARAMETERS TO BE CHECKED";

                        if (col.editorType === "combobox" && !shouldOpenEditor) {
                            const rowIndex = nestedGrid.data.getIndex(row.id);
                            const allRows = nestedGrid.data.serialize();

                            let actualActivity = null;

                            // Traverse upward to find nearest non-empty ACTIVITY value
                            for (let i = rowIndex; i >= 0; i--) {
                                const act = allRows[i]["ACTIVITY"];
                                if (act && act.trim() !== "") {
                                    actualActivity = act.trim();
                                    break;
                                }
                            }

                            if (!actualActivity) {
                                console.warn("No ACTIVITY found above. Skipping choice assignment.");
                                return true;
                            }

                            const actualColumns = Object.keys(row).filter(key =>
                                !key.startsWith('$') &&
                                !['id', 'position', 'order', 'parent'].includes(key) &&
                                typeof row[key] !== 'object'
                            );

                            const colData = {};
                            actualColumns.forEach(colName => {
                                colData[colName] = row[colName];
                            });

                            // If it's the target column and cached, use cache
                            if (isTargetColumn && activityChoicesCache[actualActivity]) {
                                col.options = activityChoicesCache[actualActivity];
                                shouldOpenEditor = true;
                                nestedGrid.editCell(row.id, col.id);
                                setTimeout(() => { shouldOpenEditor = false; }, 100);
                                return false;
                            }

                            // AJAX fetch for target column or others
                            $.ajax({
                                url: "/project-management/get-nested-combobox-choices/",
                                method: "POST",
                                data: JSON.stringify({
                                    section_sub_metadata_name: metadataName,
                                    sub_column_data: { ACTIVITY: actualActivity },
                                    project_row_id: rowId
                                }),
                                contentType: "application/json",
                                beforeSend: function () {
                                    loader('show');
                                },
                                complete: function () {
                                    loader('hide');
                                },
                                success: function (res) {
                                    if (res.success) {
                                        loader('hide');
                                        let choices = Array.isArray(res.choices) ? res.choices : [];
                                        if (choices.length > 0) {
                                            // Convert string choices to { id, value }
//                                            col.options = res.choices.map(choice => ({
//                                                id: choice,
//                                                value: choice
//                                            }));
                                            col.options = res.choices;

                                            // Cache it if needed
                                            if (isTargetColumn) {
                                                activityChoicesCache[actualActivity] = col.options;
                                            }

                                            shouldOpenEditor = true;
                                            nestedGrid.editCell(row.id, col.id);
                                            setTimeout(() => { shouldOpenEditor = false; }, 100);
                                        } else {
                                            // Show "Not Found" in proper format
                                            col.options = [{
                                                id: "",
                                                value: "Not Found"
                                            }];

                                            // Still cache to avoid repeated AJAX
                                            if (isTargetColumn) {
                                                activityChoicesCache[actualActivity] = col.options;
                                            }

                                            shouldOpenEditor = true;
                                            nestedGrid.editCell(row.id, col.id);
                                            setTimeout(() => { shouldOpenEditor = false; }, 100);
                                        }
                                    }
                                },
                                error: function (xhr) {
                                    loader('hide');
                                    col.options = [{
                                        id: "",
                                        value: "Not Found"
                                    }];
                                    // Still cache to avoid repeated AJAX
                                    if (isTargetColumn) {
                                        activityChoicesCache[actualActivity] = col.options;
                                    }
                                    shouldOpenEditor = true;
                                    nestedGrid.editCell(row.id, col.id);
                                    setTimeout(() => { shouldOpenEditor = false; }, 100);
                                    console.error("AJAX error:", xhr.responseText);
                                }
                            });

                            return false;
                        }

                        return true;
                    });


                    nestedGrid.events.on("afterEditEnd", function (value, row, column) {
                        if (column.id === "PARAMETERS TO BE CHECKED") {
                            if (!value) return;

                            $.ajax({
                                url: "/project-management/get-special-char-choice/",
                                method: "POST",
                                contentType: "application/json",
                                data: JSON.stringify({ master_choice: value }),
                                success: function (res) {
                                    if (res.success) {
                                        console.log("res:->",res);
                                        // Only update SPL CHAR if column exists and value is not empty
                                        if ("SPL CHAR" in row) {
                                            nestedGrid.data.update(row.id, {
                                                "SPL CHAR": res.special_char_choice
                                            });

                                            var position = row.position;

                                            // update-section-metadata-values
                                            $.ajax({
                                                type: "POST",
                                                url: '/project-management/update-section-metadata-values/',
                                                data: {
                                                    'task_id': rowId,
                                                    'position': position,
                                                    'column_id': 'SPL CHAR',
                                                    'value': res.special_char_choice,
                                                    'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                                                },
                                                success:function(response){
                                                    if(response['success']){
                                                        console.log("SPL CHAR Section metadata values updated successfully!");
                                                    }
                                                    else {
                                                        console.log("Error in update SPL CHAR section metadata values!");
                                                    }
                                                },error : function(xhr,errmsg,err) {
                                                    console.log("Error in update SPL CHAR section metadata values:->",err);
                                                }
                                            });
                                        }
                                        else {
                                            nestedGrid.data.update(row.id, {
                                                "SPL CHAR": ""
                                            });
                                        }
                                    }
                                },
                                error: function (xhr) {
                                    console.error("Error checking special_char_choice:", xhr.responseText);
                                }
                            });
                        }
                    });



                    // Delay width adjustment to ensure it's set correctly
                    setTimeout(() => {
                        nestedDiv.style.width = `${dataWrap.offsetWidth}px`; // Final width update
                    }, 50);

                    // Function to get CSRF token from cookies
                    function getCSRFToken() {
                        let csrfToken = null;
                        if (document.cookie) {
                            document.cookie.split(';').forEach(cookie => {
                                const [name, value] = cookie.trim().split('=');
                                if (name === 'csrftoken') {
                                    csrfToken = value;
                                }
                            });
                        }
                        return csrfToken;
                    }

                    // When column starts dragging
                    nestedGrid.events.on("afterColumnDrag", (data, event) => {
                        console.log(`Column ${data.start} is being dragged`);
                    });

                    // When column is dropped
                    nestedGrid.events.on("afterColumnDrop", (data, event) => {

                        // Get updated column order
                        const updatedColumns = nestedGrid.config.columns.map((col, index) => ({
                            id: col.order,  // Column ID
                            position: index + 1  // Updated position
                        }));

                        // Send updated column order to backend
                        $.ajax({
                            url: '/project-management/update-column-order/',
                            type: 'POST',
                            headers: {
                                "X-CSRFToken": $("input[name=csrfmiddlewaretoken]").val()  // Include CSRF token
                            },
                            data: JSON.stringify({
                                "task_id": rowId,
                                "new_order": updatedColumns  // Send updated column ID and position
                            }),
                            contentType: "application/json",
                            success: function(response) {
                                console.log("Column order updated:", response);
                            },
                            error: function(error) {
                                console.error("Error updating column order:", error);
                            }
                        });
                    });


                    // When row starts dragging
                    nestedGrid.events.on("afterRowDrag", (data, event) => {
                        console.log(`Row ${data.start} is being dragged`);
                    });

                    // When row is dropped
                    nestedGrid.events.on("afterRowDrop", (data, event) => {
                        // Get updated row order and filter out unnecessary properties
                        const updatedData = nestedGrid.data.serialize().map((row, index) => {
                            const cleanedRow = { ...row };  // Clone the row object

                            // Update position based on new order
                            cleanedRow.position = index + 1;

                            return cleanedRow;
                        });

                        // Send updated order to the backend
                        $.ajax({
                            url: '/project-management/update-row-order/',
                            type: 'POST',
                            headers: { "X-CSRFToken": getCSRFToken() }, // CSRF Token in Headers
                            contentType: "application/json",
                            data: JSON.stringify({
                                'task_id': rowId,
                                'new_order': updatedData
                            }),
                            success: function(response) {
                                console.log("Row order updated:", response);
                            },
                            error: function(xhr) {
                                console.error("Error updating row order:", xhr.responseText);
                            }
                        });
                    });

//                    nestedGrid.events.on("cellRightClick", (row, column, event) => {
//                        event.preventDefault();
//                        nestedGrid.selection.setCell(row, column);
//                        rowMenu.showAt(event.target);
//                    });

                    nestedGrid.events.on("afterResizeEnd", (column, event) => {

                        var config_col_id = column.id;
                        var config_metadata_id = column.order;
                        var config_metadata_position = column.position;
                        var config_metadata_width = column.width;

                        $.ajax({
                            url: '/project-management/add-update-section-metadata-width/',
                            method: 'POST',
                            headers: { "X-CSRFToken": getCSRFToken() }, // CSRF Token in Headers
                            contentType: "application/json",
                            data: JSON.stringify({
                                'task_id': rowId,
                                'config_col_id': config_col_id,
                                'config_metadata_id': config_metadata_id,
                                'config_metadata_position': config_metadata_position,
                                'config_metadata_width': config_metadata_width,
                            }),
                            success: function (response) {
                                if (response.success) {
                                    console.log("Metadata Column width added or updated successfully!");
                                } else {
                                    console.log("Failed to add or update Section Metadata Column width!")
                                }
                            },
                            error: function (err) {
                                console.log('Error in add or update Section Metadata Column width:->', err);
                            },
                        });

                    });


                    rowMenu.events.on("click", id => {

                        const row = nestedGrid.selection.getCell()?.row;

                        if (!row || !row.id) {
                            console.warn("No row selected for action:", id);
                            return; // Prevent errors if no row is selected
                        }

                        if (id === "trackMetadata") {
                            manageMetadataTracking(rowId);
                            const r_position = row.position;
                            $('#selected_row_position').val(r_position);
                        }

                        if (id === "deleteRow" && row.position === 1) {
                            Swal.fire({
                                title: 'Warning!',
                                text: 'You cannot delete the first row!',
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
                            return; // Stop further execution
                        }

                        const rowIndex = nestedGrid.data.getIndex(row.id);

                        let requestData = {
                            task_id: rowId,  // Parent Task ID
                            position: row.position, // Row position in metadata
                            action: id === "insertRowAbove" ? "insert_above" :
                                    id === "insertRowBelow" ? "insert_below" :
                                    id === "clearRow" ? "clear_row" :
                                    id === "deleteRow" ? "delete_row" : null
                        };

                        if (!requestData.action) return;

                        if (delete_task_permissions == 'False'){
                                Swal.fire({
                                    title: 'Permission Denied!',
                                    text: 'You do not have permission to do this action, please contact the administrator!',
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

                        function modifyRow(){
                            // Send AJAX request to backend
                            $.ajax({
                                url: '/project-management/modify-nested-grid-row/',
                                type: 'POST',
                                headers: { "X-CSRFToken": getCSRFToken() },  // CSRF Token for security
                                contentType: "application/json",
                                data: JSON.stringify(requestData),
                                beforeSend: function () {
                                    loader('show');
                                },
                                complete: function () {
                                    loader('hide');
                                },
                                success: function(response) {
                                    if (response.success) {
                                        loader('hide');
                                        nestedGrid.data.parse(response.updated_data);  // Refresh grid data for other actions
                                    } else {
                                        loader('hide');
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
                                error: function(xhr) {
                                    loader('hide');
                                    console.error("Error:", xhr.responseText);
                                }
                            });

                        }

                        if (["clear_row", "delete_row"].includes(requestData.action)) {

                            Swal.fire({
                                title: `<h5>Are you sure you want to ${requestData.action === "clear_row" ? "clear" : "delete"} this row?</h5>`,
                                text: "You will not be able to recover this data!",
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
                                    modifyRow();
                                }
                            });
                        }
                        else {
                            modifyRow();
                        }
                    });

                    let number_value_before = {}; // Use an object to store values per row-column

                    nestedGrid.events.on("beforeEditStart", function(row, column) {
                        var columnType = column.type;
                        var row_id = row.id;
                        var col_id = column.id;

                        if (columnType === "number") {
                            var value = row[col_id]; // Get current value

                            number_value_before["row_id"] = row_id;
                            number_value_before["col_id"] = col_id;
                            number_value_before["value"] = value;
                        }
                    });

                    nestedGrid.events.on("afterEditEnd", (value, currentRow, column) => {

                        var position = currentRow.position;
                        var column_id = column.id;
                        const rows = nestedGrid.data.serialize();

                        var columnType = column.type;
                        if (columnType === "number" && isNaN(value)) {
                            Swal.fire({
                                title: "Invalid Input!",
                                text: "Please enter a valid number.",
                                icon: "warning",
                                showCancelButton: false,
                                confirmButtonText: 'OK',
                                customClass : {
                                    popup: 'swal2-popup-custom',
                                    icon : 'swal2-icon.swal2-warning',
                                    confirmButton: 'swal2-styled.swal2-confirm',
                                    cancelButton: 'swal2-styled.swal2-cancel',
                                },
                            });
                            nestedGrid.data.update(number_value_before["row_id"], { [number_value_before["col_id"]]: number_value_before["value"] });
                            return; // Stop further execution
                        }

                        $.ajax({
                            type: "POST",
                            url: '/project-management/update-section-metadata-values/',
                            data: {
                                'task_id': rowId,
                                'position': position,
                                'column_id': column_id,
                                'value': value,
                                'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                            },
                            success:function(response){
                                if(response['success']){
                                    console.log("Section metadata values updated successfully!");
                                }
                                else {
                                    console.log("Error in update section metadata values!");
                                }
                            },error : function(xhr,errmsg,err) {
                                console.log("Error in update section metadata values:->",err);
                            }
                        });
                    });
                }, 200);

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

// Attach click event listener to dynamically handle plus/minus icons
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("toggle-nested-grid")) {
        var rowId = event.target.getAttribute("data-row-id");
        toggleNestedGrid(rowId);
    }
});


// Function to handle signature actions
function manageGridSignature(actionType, rowId, sign_row_position, sign_col_id, nestedGrid, grid_row_id){

    $.ajax({
        type: "POST",
        url: '/project-management/grid-add-update-delete-signature/',
        data: {
            'task_id': rowId,
            'action': actionType,
            'col_id':sign_col_id,
            'row_position':sign_row_position,
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
        },
        beforeSend: function () {
            loader('show');
        },
        complete: function () {
            loader('hide');
        },
        success: function (response) {
            if (response['success']) {
                loader('hide');
                const signature = response["signature"] || "";

                if (actionType === "delete") {
                    nestedGrid.data.update(grid_row_id, { [sign_col_id]: "" }); // Remove signature
                } else {
                    nestedGrid.data.update(grid_row_id, { [sign_col_id]: signature }); // Add/Update signature
                }

                // Store rowId in localStorage before refresh
                localStorage.setItem("expandNestedGridAfterReload", rowId);

                loader('show');
                window.location.reload(1);

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    width: 300,
                    text: response["message"],
                    showConfirmButton: false,
                    timer: 1500
                });

                var nestedGrid_parent = "nestedGrid-"+rowId;
                nestedGrid.expand(nestedGrid.data.getId(nestedGrid_parent));

            } else {
                console.log("Error:", response["error"]);
            }
        },
        error: function (err) {
            console.log("AJAX Error:", err);
        }
    });

    $("#gridSignatureModal").modal("hide"); // Close modal

}


// Log when modal is shown or hidden
$("#gridSignatureModal").on("shown.bs.modal", function () {
    console.log("Modal opened.");
});

$("#gridSignatureModal").on("hidden.bs.modal", function () {
    console.log("Modal closed.");
});


$('#closeGridSignatureModalBtn').on('click', function() {
    loader('show');
    window.location.reload(1);
});


$(document).ready(function () {
    let expandRowId = localStorage.getItem("expandNestedGridAfterReload");

    if (expandRowId) {
        requestAnimationFrame(() => {
            toggleNestedGrid(expandRowId); // Call your function to expand grid
            localStorage.removeItem("expandNestedGridAfterReload"); // Clear stored value
        });
    }
});
