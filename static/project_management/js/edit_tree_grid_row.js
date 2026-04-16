
let before_status_value;
treeGrid.events.on("afterEditStart", function(row,col, editorType){
    before_status_value = row.status
});
treeGrid.events.on("afterEditEnd", function(value,row,column){
    var treeGridRow = row;
    console.log("treeGridRow:->",treeGridRow);
    try {
        $.ajax({
            type: "POST",
            url: '/project-management/edit-tree-grid-row/',
            data: {
                'row': JSON.stringify(treeGridRow),
                'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (response) {
                if(response['success']) {
                    console.log("Cell edited successfully!");
                    if(column.id == 'status' & value == 'Completed' & before_status_value != 'Completed'){
                        var task_id = row.id;
                        try {
                            $.ajax({
                                type: "POST",
                                url: '/project-management/send-task-completed-email/',
                                data: {
                                    'task_id': task_id,
                                    'csrfmiddlewaretoken':$('input[name=csrfmiddlewaretoken]').val(),
                                },
                                success: function (response) {
                                    if(response['success']) {
                                        console.log("Sent task completed email successfully!");
                                    }
                                    else {
                                        console.log("Something went wrong in Send Task Completed Email!");
                                    }
                                }
                            });
                        }
                        catch (err) {
                            console.log("Error in Send Task Completed Email:->",err);
                        }
                    }
                }
                else {
                    console.log("Something went wrong in edit tree grid row!");
                }
            }
        });
    }
    catch (err) {
        console.log("Edit Tree Grid Row Error:->",err);
    }
});
