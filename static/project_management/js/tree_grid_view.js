
const isProjLocked = is_proj_editable; // proj_lock true => not editable
console.log("isProjLocked:->",isProjLocked);

const isEditable = isProjLocked === true ? false : true;
console.log("isEditable:->",isEditable);

let delete_task_permissions = delete_permissions;

var hide_section_row_ids=[];

// Function to generate attachment template with the toggle icon click event
function getAttachmentTemplate(text, row, col) {
    var t_id = row.id;
    var progress_per = row.progress;

    if (row.is_section == "True") {
        // Push only if the ID is not already in the array
        if (!hide_section_row_ids.includes(row.id)) {
            hide_section_row_ids.push(row.id);
        }

        // Extract section label properly
        let labelHtml = "";
        if (row.section_label && typeof row.section_label === "object" && Object.keys(row.section_label).length > 0) {
            labelHtml = Object.entries(row.section_label)
                .map(([key, value]) => `<span><strong>${key}:</strong> ${value}</span>`)
                .join(" | "); // Separate label fields with a separator
        }

        // Add 'fa-circle' icon with a click event
        let toggleIcon  = `<i title="Click to open or close Section Metadata table" class="fab fa-markdown fa-sm text-primary toggle-nested-grid" data-row-id="${row.id}" style="cursor:pointer;"></i>`;

        return `<span><strong class="group-task-row">${toggleIcon } ${text || "New Section"}</strong> ${labelHtml ? ` (${labelHtml})` : ""}</span>`;
    } else {
        if (text) {
            return text + `<progress title="${progress_per}% Complete" value="${progress_per}" max="100" style="width:50px; height:33px;"></progress>`;
        } else {
            return text;
        }
    }
}


const t_data = task_data;
var col_data = column_data;
const proj_id = project_id;

function convertStringBooleans(obj) {
    if (Array.isArray(obj)) {
        return obj.map(convertStringBooleans); // Recursively process arrays
    } else if (typeof obj === "object" && obj !== null) {
        for (let key in obj) {
            if (typeof obj[key] === "string") {
                let lowerVal = obj[key];
                if (lowerVal === "true") {
                    obj[key] = true;
                } else if (lowerVal === "false") {
                    obj[key] = false;
                }
            } else if (typeof obj[key] === "object") {
                obj[key] = convertStringBooleans(obj[key]); // Recursively process nested objects
            }
        }
    }
    return obj;
}

// Convert the dataset
let editing_dataset = convertStringBooleans(t_data);

let treeGrid;
let config = {
    type:"tree",
    columns:[
        {
            id:"task_name",
            type:"string",
            minWidth:450,
            editorType:"input",
            header:[
                {
                    text:"Task name",
                },
                {
                    content:"inputFilter",
                    tooltipTemplate:() =>"Search a task"
                }
            ],
            template:getAttachmentTemplate,
            htmlEnable:true,
        },
        {
            id:"action",
            header:[
                {
                    text:`<div class="tree_grid_dropdown dropdown">
                        <a style="margin-right:0px;" href="#" title="More Action" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></a>
                        <div class="tree_grid_dropdown_menu dropdown-menu">
                            <div class="dhx-demo_grid-actions">
                                <button style="margin-left:17px;" onclick="addNewRow()" title="Add new task" class="dhx-demo_grid-action dhx-demo_grid-action--addTask">
                                    <i class="dxi dxi-plus"></i>
                                </button>
                            </div>
                            <div class="tree_grid_dropdown_menu dropdown-divider"></div>
                            <div class="dhx-demo_grid-actions">
                                <button style="margin-left:17px;" onclick="removeAllTask()" title="Remove all task" class="dhx-demo_grid-action dhx-demo_grid-action--removeAllTask">
                                    <i class="dxi dxi-delete"></i>
                                </button>
                            </div>
                            <div class="tree_grid_dropdown_menu dropdown-divider"></div>
                            <div class="dhx-demo_grid-actions">
                                <button style="margin-left:17px;" onclick="addNewSection()" title="Add new section" class="dhx-demo_grid-action dhx-demo_grid-action--addTask">
                                    <i class="fas fa-layer-group"></i>
                                </button>
                            </div>
                        </div>
                    </div>`,
                    align:"center",
                    rowspan: 2,
                }
            ],
            minWidth:30,
            htmlEnable:true,
            sortable:false,
            align:"center",
            tooltip:false,
            editable:false,
            template:() => {
                return `
                <div class="tree_grid_dropdown dropdown">
                    <a href="#" title="More Action" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></a>
                    <div class="tree_grid_dropdown_menu dropdown-menu">
                        <div class="dhx-demo_grid-actions">
                            <button title="Add new subtask" class="dhx-demo_grid-action dhx-demo_grid-action--addSubtask add_subtask_row">
                                <i class="dxi dxi-plus"></i>
                            </button>
                        </div>
                        <div class="tree_grid_dropdown_menu dropdown-divider"></div>
                        <div class="dhx-demo_grid-actions">
                            <button title="Delete task" class="dhx-demo_grid-action dhx-demo_grid-action--remove remove">
                                <i class="dxi dxi-delete"></i>
                            </button>
                        </div>
                        <div class="tree_grid_dropdown_menu dropdown-divider"></div>
                        <div class="dhx-demo_grid-actions">
                            <a data-toggle="modal" href="#taskUpdateModal" data-target='#taskUpdateModal' title="Update Task" class="dhx-demo_grid-action dhx-demo_grid-action--updateTask updateTask">
                                <i class="dxi dxi-pencil"></i>
                            </a>
                        </div>
                        <div class="tree_grid_dropdown_menu dropdown-divider"></div>
                        <div class="dhx-demo_grid-actions">
                            <button title="Duplicate task" class="dhx-demo_grid-action dhx-demo_grid-action--addSubtask duplicate">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                        <div class="tree_grid_dropdown_menu dropdown-divider"></div>
                        <div class="dhx-demo_grid-actions">
                            <a data-toggle="modal" href="#addAttachmentModal" data-target='#addAttachmentModal' title="Add Attachment" class="dhx-demo_grid-action dhx-demo_grid-action--addSubtask addAttachment">
                                <i class="fas fa-paperclip"></i>
                            </a>
                        </div>
                        <div class="tree_grid_dropdown_menu dropdown-divider"></div>
                        <div class="dhx-demo_grid-actions">
                            <a title="Add, Update or Delete Section Label" class="dhx-demo_grid-action dhx-demo_grid-action--addSubtask manageSectionLabel">
                                <i class="fas fa-layer-group"></i>
                            </a>
                        </div>
                        <div class="tree_grid_dropdown_menu dropdown-divider"></div>
                        <div class="dhx-demo_grid-actions">
                            <button title="Make Section or Task" class="dhx-demo_grid-action makeSectionORTask">
                                <i class="fas fa-tasks text-info"></i>
                            </button>
                        </div>
                        <div class="tree_grid_dropdown_menu dropdown-divider"></div>
                        <div class="dhx-demo_grid-actions">
                            <button title="Manage Section Metadata" class="dhx-demo_grid-action manageSectionMetadata">
                                <i class="fab fa-monero text-info"></i>
                            </button>
                        </div>
                        <div class="tree_grid_dropdown_menu dropdown-divider"></div>
                        <div class="dhx-demo_grid-actions">
                            <button title="Manage Section Metadata Header" class="dhx-demo_grid-action manageSectionHeader">
                                <i class="fas fa-h-square text-info"></i>
                            </button>
                        </div>
                        <div class="tree_grid_dropdown_menu dropdown-divider"></div>
                        <div class="dhx-demo_grid-actions">
                            <button title="Manage Metadata Tracking" class="dhx-demo_grid-action manageMetadataTracking">
                                <i class="fab fa-markdown text-info"></i>
                            </button>
                        </div>
                        <div class="tree_grid_dropdown_menu dropdown-divider"></div>

                    </div>
                </div>
                `
            }
        },

    ],
    eventHandlers: {
        onclick: {
            "remove": (event, { row }) => {

                if (delete_task_permissions == 'False'){
                    Swal.fire({
                        title: 'Permission Denied!',
                        text: 'You do not have permission to delete the task(s), please contact the administrator!',
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
                var is_section = row.is_section;
                if (is_section == "True"){
                    var title = '<h5>Are you sure you want to remove this section?</h5>';
                    var text = 'It will delete all tasks related to this section!';
                }
                else {
                    var title = '<h5>Are you sure you want to remove this task?</h5>';
                    var text = 'It will delete all tasks related to this task!';
                }
                Swal.fire({
                title: title,
                text: text,
                icon: 'warning',
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
                    if(result.isConfirmed){
                        const task_id = row.id;
                        try {
                            $.ajax({
                                type: "POST",
                                url: '/project-management/remove-task/',
                                data: {
                                    'task_id': task_id,
                                    'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                                },
                                success: function (response) {
                                    if(response['success']) {
                                        const row_id = response["task_id"];
                                        treeGrid.data.remove(row_id);
                                        Swal.fire({
                                            position: 'top-end',
                                            icon: 'success',
                                            width:300,
                                            text: 'Task removed successfully!',
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                    }
                                    else {
                                        console.log("Something went wrong in removed task!");
                                    }
                                }
                            });
                        }
                        catch (err) {
                            console.log("Error in remove task:->",err);
                        }
                    }
                })
            },
            "duplicate": (event, { row }) => {
                Swal.fire({
                title: '<h5>Are you sure you want to duplicate task?</h5>',
                icon: 'warning',
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
                    if(result.isConfirmed){
                        const task_id = row.id;
                        try {
                            $.ajax({
                                type: "POST",
                                url: '/project-management/duplicate-task/',
                                data: {
                                    'task_id': task_id,
                                    'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                                },
                                success: function (response) {
                                    if(response['success']) {
                                        Swal.fire({
                                            position: 'top-end',
                                            icon: 'success',
                                            width:300,
                                            text: 'Task duplicated successfully!',
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                        setTimeout(function(){
                                           window.location.reload(1);
                                        }, 500);
                                    }
                                    else {
                                        console.log("Something went wrong in duplicate task!");
                                    }
                                }
                            });
                        }
                        catch (err) {
                            console.log("Error in duplicate task:->",err);
                        }
                    }
                })
            },
            "add_subtask_row": (event, { row }) => {

                try {
                    $.ajax({
                        type: "POST",
                        url: '/project-management/add-new-subtask/',
                        data: {
                            'project_id': proj_id,
                            'parent': row.id,
                            'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                        },
                        success: function (response) {
                            if(response['success']) {
                                const task_id = response["task_id"];
                                const parent_id = response["parent_id"];
                                const start_date = response["start_date"];
                                const progress = response["progress"];
                                treeGrid.data.add({
                                    "id": task_id,
                                    "task_name": "New Subtask",
                                    "parent": parent_id,
                                    "start_date": start_date,
                                    "progress": progress,
                                });
                                console.log("New subtask added successfully!");
                            }
                            else {
                                console.log("Something went wrong in add subtask!");
                            }
                        }
                    });
                }
                catch (err) {
                    console.log("Error in added new subtask:->",err);
                }

            },
            "updateTask": (event, { row }) => {
                getUpdateTaskData(row.id);
            },
            "addAttachment": (event, { row }) => {
                getTaskAttachment(row.id);
            },
            "taskLogHistory": (event, { row }) => {
                getTaskLogHistory(row.id);
            },
            "manageSectionLabel": (event, { row }) => {
                manageSectionLabel(row.id);
            },
            "makeSectionORTask": (event, { row }) => {
                var is_section = row.is_section;
                if (is_section == "True"){
                    var title = '<h5>Are you sure you want to change this section to task?</h5>';
                    var text = 'It will change section task to normal task!';
                }
                else {
                    var title = '<h5>Are you sure you want to change this task to section?</h5>';
                    var text = 'It will change normal task to section task!';
                }
                Swal.fire({
                title: title,
                text: text,
                icon: 'warning',
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
                    if(result.isConfirmed){
                        const task_id = row.id;
                        try {
                            $.ajax({
                                type: "POST",
                                url: '/project-management/make-section-or-task/',
                                data: {
                                    'task_id': task_id,
                                    'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                                },
                                beforeSend: function () {
                                    loader('show');
                                },
                                complete: function () {
                                    loader('hide');
                                },
                                success: function (response) {
                                    if(response['success']) {
                                        loader('hide');
                                        window.location.reload(1);
                                        Swal.fire({
                                            position: 'top-end',
                                            icon: 'success',
                                            width:300,
                                            text: 'Task updated successfully!',
                                            showConfirmButton: false,
                                            timer: 1500
                                        });
                                    }
                                    else {
                                        console.log("Something went wrong in make section or task!");
                                    }
                                }
                            });
                        }
                        catch (err) {
                            console.log("Error in make section or task:->",err);
                        }
                    }
                })
            },
            "manageSectionMetadata": (event, { row }) => {
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
                manageSectionMetadata(row.id);
            },
            "manageSectionHeader": (event, { row }) => {
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
                manageSectionHeader(row.id);
            },
            "manageMetadataTracking": (event, { row }) => {
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
                manageMetadataTracking(row.id);
            },
        }
    },
    data: editing_dataset,
    editable: true,
    adjust: true,
    selection: "row",
    autoHeight: true,
    //collapsed: true,
    autoWidth: true,
    leftSplit: 2,
    keyNavigation: true,
    multiselection: true,
    resizable: true,
    //dragItem: "row",
    css: "group-task-row",

};


function getStatusTemplate(value) {
    if (!value) return;
    lowercase_value = value[0].toLowerCase();
    if(lowercase_value === 'a'){
        style='background-color:#0048BA'
    }
    else if(lowercase_value === 'b'){
        style='background-color:#7CB9E8'
    }
    else if(lowercase_value === 'c' || value === 'Completed'){
        style='background-color:#5cb85c'
    }
    else if(lowercase_value === 'd' || value === 'Delayed'){
        style='background-color:#d9534f'
    }
    else if(lowercase_value === 'e'){
        style='background-color:#EED9C4'
    }
    else if(lowercase_value === 'f'){
        style='background-color:#9F2B68'
    }
    else if(lowercase_value === 'g'){
        style='background-color:#3B7A57'
    }
    else if(lowercase_value === 'h'){
        style='background-color:#FFBF00'
    }
    else if(lowercase_value === 'i' || value === 'In Progress'){
        style='background-color:#0275d8'
    }
    else if(lowercase_value === 'j'){
        style='background-color:#00FFFF'
    }
    else if(lowercase_value === 'k'){
        style='background-color:#DA1884'
    }
    else if(lowercase_value === 'l'){
        style='background-color:#000000'
    }
    else if(lowercase_value === 'm'){
        style='background-color:#318CE7'
    }
    else if(lowercase_value === 'n' || value === 'Not Started'){
        style='background-color:gray'
    }
    else if(lowercase_value === 'o' || value === 'On Hold'){
        style='background-color:#f0ad4e'
    }
    else if(lowercase_value === 'p'){
        style='background-color:#36454F'
    }
    else if(lowercase_value === 'q'){
        style='background-color:#954535'
    }
    else if(lowercase_value === 'r'){
        style='background-color:#FF3800'
    }
    else if(lowercase_value === 's'){
        style='background-color:#2E2D88'
    }
    else if(lowercase_value === 't'){
        style='background-color:#CCFF00'
    }
    else if(lowercase_value === 'u'){
        style='background-color:#50C878'
    }
    else if(lowercase_value === 'v'){
        style='background-color:#AB4B52'
    }
    else if(lowercase_value === 'w'){
        style='background-color:#A2006D'
    }
    else if(lowercase_value === 'x'){
        style='background-color:#C154C1'
    }
    else if(lowercase_value === 'y'){
        style='background-color:#EEDC82'
    }
    else if(lowercase_value === 'z'){
        style='background-color:#FF5470'
    }
    else {
        style='background-color:#228B22'
    }
    return `
        <div class='dhx-demo_grid-template'>
            <div class='dhx-demo_grid-status' style='${style}'></div>
            <span>${value}</span>
        </div>
    `
}


function getNumberTemplate(value) {
    if (!value) return;
    if (isNaN(value)) return "";
    else return value;
}


col_data.forEach(function (item){
    config.columns.push(item);
})


function isDisabledDate(date) {
    currentDateObj = new Date();
    var monthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var currentDate  = currentDateObj.getDate();
    var currentMonth  = monthsArr[currentDateObj.getMonth()];
    var currentYear = currentDateObj.getFullYear();
    var current_date = new Date(`${currentDate} ${currentMonth}, ${currentYear}`);
    if (new Date(date) < current_date) {
        return date.getDate()
    }
}


hide_section_col_ids = [];
col_data.forEach(function (item){

//    if(item.id == 'start_date'){
//        item['editable']=false
//    }
    // Push only if the ID is not already in the array
    if (!hide_section_col_ids.includes(item.id)) {
        hide_section_col_ids.push(item.id);
    }
    config.columns.forEach(function (it){
        try {
            if(it.editable == 'false'){
                it['editable'] = false
                it['mark']=function (cell, data) { return "col_cell_color"; }
                it.htmlEnable=true
            }
            if(it.editable == 'true'){
                it['editable'] = true
            }
        }
        catch(err){
            console.log(err);
        }
        if(it.editorType == 'combobox' && it.id != 'urgency'){
            it.editorConfig={newOptions: true,
                template: ({ value }) => getStatusTemplate(value),
            }
            it.template=getStatusTemplate
            it.htmlEnable=true
        }
        if(it.editorType == 'multiselect' && it.id != 'assignee' && it.customType != 'people'){
            it.editorConfig={newOptions: true}
        }
        if(it.type == 'number'){
            it.editorConfig={
                template: ({ value }) => getNumberTemplate(value),
            }
            it.template=getNumberTemplate
            it.htmlEnable=true
        }
        if(it.type == 'date' && it.id == 'due_date'){
            it.editorConfig={
                disabledDates:isDisabledDate
            }
        }
        if(it.customType == 'signature'){
            it['editable'] = false
            it['mark']=function (cell, data) {
                if (cell) {
                    return "signature_col_cell_color";
                }
                else {
                    return;
                }
            }
            it.htmlEnable=true
        }
    })


})

function createGrid() {
    if (treeGrid) {
        treeGrid.destructor();
    }
    treeGrid = new dhx.TreeGrid("treegrid", config);
}

let selector = document.querySelectorAll("[name=editable]");
for (let index = 0; index < selector.length; index++) {
    selector[index].addEventListener("change", function (e) {
        config.editable = (e.target.id === "true");
        createGrid();
    });
}


createGrid();


function exportXLSX() {
    treeGrid.export.xlsx({
        url: "//export.dhtmlx.com/excel"
    });
}
//function exportCSV() {
//    treeGrid.export.csv();
//}

let url = "https://export.dhtmlx.com"
function exportFile(file) {
    const config = {
        url: `${url}/grid/${file}/8.1`,
    }
    // if (file === "pdf") config.pdf = { format: false }; // Like one pdf page

    treeGrid.export[file](config);
}

//document.querySelector("#pdf").addEventListener("click", () => exportFile("pdf"));
//document.querySelector("#png").addEventListener("click", () => exportFile("png"));




// the method for adding a new row into Grid
function addNewRow() {
    try {
        $.ajax({
            type: "POST",
            url: '/project-management/add-new-task/',
            data: {
                'project_id': proj_id,
                'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (response) {
                if(response['success']) {
                    const data = treeGrid.data;
                    const id = response["task_id"];
                    const start_date = response["start_date"];
                    const progress = response["progress"];
                    const row = data.add({
                        "id":id,
                        "task_name": "New Task",
                        "start_date": start_date,
                        "progress": progress,
                    });
                    console.log("New task added successfully!");
                }
                else {
                    console.log("Something went wrong in add task!");
                }
            }
        });
    }
    catch (err) {
        console.log("Error in added new task:->",err);
    }

    dhx.awaitRedraw().then(function () {
        treeGrid.scrollTo(row, "task_name")
    })
}


function removeAllTask() {

    if (delete_task_permissions == 'False'){
        Swal.fire({
            title: 'Permission Denied!',
            text: 'You do not have permission to delete the task(s), please contact the administrator!',
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
    const data = treeGrid.data;

    Swal.fire({
        title: '<h5>Are you sure you want to remove all tasks?</h5>',
        icon: 'warning',
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
        if(result.isConfirmed){
            try {
                $.ajax({
                    type: "POST",
                    url: '/project-management/remove-all-task/',
                    data: {
                        'proj_id': proj_id,
                        'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                    },
                    success: function (response) {
                        if(response['success']) {
                            const row = data.removeAll();
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                width:300,
                                text: 'All task removed successfully!',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                        else {
                            console.log("Something went wrong in removed task!");
                        }
                    }
                });
            }
            catch (err) {
                console.log("Error in remove task:->",err);
            }
        }
    })
}


//treeGrid.events.on("afterEditEnd", function(value,row,column){
//    console.log("afterEditEnd:->",value,row.id, row);
//});


treeGrid.events.on("afterRowDrop", function(data, events) {
    console.log("Data:->",data);
});


treeGrid.events.on("beforeColumnDrop", function (sourceId, targetId) {
    console.log("sourceId:->",sourceId, "targetId:->",targetId);
});

let selectedRowIdList = [];


treeGrid.selection.events.on("afterSelect", function(row, col){
    if(col.customType == "signature" && isEditable){
        $("#selected_task_id").val(row.id); // Store task ID
        $("#signatureModal").modal("show"); // Open Bootstrap modal

    }
    else {
        selectedRowIdList.push(JSON.stringify(row.id));
        localStorage.setItem("selected_rows", JSON.stringify(selectedRowIdList));
    }

});


treeGrid.selection.events.on("afterUnSelect", function(row, col){
    const index = selectedRowIdList.indexOf(JSON.stringify(row.id));
    const x = selectedRowIdList.splice(index, 1);
    localStorage.setItem("selected_rows", JSON.stringify(selectedRowIdList));
});

// Ensure CSS class exists
var style = document.createElement("style");
style.innerHTML = `
    .my_custom_class {
        display: none !important;
    }
`;
document.head.appendChild(style);

// Apply CSS class to hide specified cells after treeGrid is initialized
hide_section_row_ids.forEach(rowId => {
    hide_section_col_ids.forEach(colId => {
        treeGrid.addCellCss(rowId, colId, "my_custom_class");
    });
});

// the method for adding a new section into Grid
function addNewSection() {
    try {
        $.ajax({
            type: "POST",
            url: '/project-management/add-new-section/',
            data: {
                'project_id': proj_id,
                'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
            },
            beforeSend: function () {
                loader('show');
            },
            complete: function () {
                loader('hide');
            },
            success: function (response) {
                if(response['success']) {

                    loader('hide');

                    const data = treeGrid.data;
                    const id = response["task_id"];

                    const row = data.add({
                        "id":id,
                        "task_name": "New Section",
                    });

                    window.location.reload(1);

                    // 🔹 Remove any existing progress elements in the new row
                    setTimeout(() => {
                        document.querySelectorAll(`[data-dhx-id="${id}"] progress`).forEach(progress => {
                            progress.remove();
                        });
                    }, 50); // Delay to ensure the DOM is updated

                    hide_section_col_ids.forEach(colId => {
                        treeGrid.addCellCss(id, colId, "my_custom_class");
                    });
                }
                else {
                    console.log("Something went wrong in add new section!");
                }
            }
        });
    }
    catch (err) {
        console.log("Error in added new section:->",err);
    }

    dhx.awaitRedraw().then(function () {
        treeGrid.scrollTo(row, "task_name")
    })
}


// Function to handle signature actions
function manageSignature(actionType) {

    const task_id = $("#selected_task_id").val(); // Get stored task ID
    const col_id = treeGrid.selection.getCell().column.id;
    $.ajax({
        type: "POST",
        url: '/project-management/add-update-delete-signature/',
        data: {
            'task_id': task_id,
            'action': actionType,
            'col_id':col_id,
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
                const row_id = response["task_id"];
                const signature = response["signature"] || "";

                if (actionType === "delete") {
                    treeGrid.data.update(row_id, { [col_id]: "" }); // Remove signature
                } else {
                    treeGrid.data.update(row_id, { [col_id]: signature }); // Add/Update signature
                }
                setTimeout(function(){
                    loader('show');
                    window.location.reload();
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        width: 300,
                        text: response["message"],
                        showConfirmButton: false,
                        timer: 1500
                    });
                }, 1);

            } else {
                console.log("Error:", response["error"]);
            }
        },
        error: function (err) {
            console.log("AJAX Error:", err);
        }
    });

    $("#signatureModal").modal("hide"); // Close modal

}


// Use event delegation to ensure click events always work
$("#signatureModal").on("click", "#addSignatureBtn", function () {
    console.log("Add Signature Clicked!");
    manageSignature("add");
});

$("#signatureModal").on("click", "#updateSignatureBtn", function () {
    manageSignature("update");
});

$("#signatureModal").on("click", "#deleteSignatureBtn", function () {
    manageSignature("delete");
});

// Log when modal is shown or hidden
$("#signatureModal").on("shown.bs.modal", function () {
    console.log("Modal opened.");
});

$("#signatureModal").on("hidden.bs.modal", function () {
    console.log("Modal closed.");
});


$('#closeSignatureModalBtn').on('click', function() {
    loader('show');
    window.location.reload(1);
});



