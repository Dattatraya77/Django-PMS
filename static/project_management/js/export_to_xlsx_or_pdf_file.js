let export_proj_id = null;

// When any export modal button is clicked
$(document).on('click', '.open-export-modal', function () {
    export_proj_id = $(this).data('proj-id');
    console.log("Setting export_proj_id: ", export_proj_id);
    $('#export_proj_id').val(export_proj_id);  // Save to modal
});

function exportExcelToSingleSheet() {
    const proj_id = $('#export_proj_id').val();
    console.log("Exporting Excel for proj_id:", proj_id);

    if (!proj_id) {
        alert("Project ID missing.");
        return;
    }

    try {
        loader('show');
        const downloadUrl = '/project-management/export-excel-to-single-sheet/?proj_id=' + proj_id;
        window.location.href = downloadUrl;

        setTimeout(() => {
            loader('hide');
            console.log("Excel file download triggered.");
        }, 2000);
    } catch (err) {
        loader('hide');
        console.log("Error exporting excel-to-single-sheet:", err);
    }
}


function exportExcelToGroupedHierarchy() {
    const proj_id = $('#export_proj_id').val();
    console.log("Exporting Excel for proj_id:", proj_id);

    if (!proj_id) {
        alert("Project ID missing.");
        return;
    }

    try {
        loader('show');
        const downloadUrl = '/project-management/export-excel-to-grouped-hierarchy/?proj_id=' + proj_id;
        window.location.href = downloadUrl;

        setTimeout(() => {
            loader('hide');
            console.log("Excel file download triggered.");
        }, 2000);
    } catch (err) {
        loader('hide');
        console.log("Error exporting excel-to-grouped-hierarchy:", err);
    }
}


function exportExcelToSeparateSheets() {
    const proj_id = $('#export_proj_id').val();
    console.log("Exporting Excel for proj_id:", proj_id);

    if (!proj_id) {
        alert("Project ID missing.");
        return;
    }

    try {
        loader('show');
        const downloadUrl = '/project-management/export-excel-to-separate-sheets/?proj_id=' + proj_id;
        window.location.href = downloadUrl;

        setTimeout(() => {
            loader('hide');
            console.log("Excel file download triggered.");
        }, 2000);
    } catch (err) {
        loader('hide');
        console.log("Error exporting excel-to-separate-sheets:", err);
    }
}


function downloadPDF() {

    const proj_id = $('#export_proj_id').val();
    const pdfMode = $('#pdfExportOption').val();

    if (!proj_id) {
        alert("Project ID missing.");
        return;
    }

    try {
        loader('show');
        const url = `/project-management/export-to-pdf-file/?proj_id=${proj_id}&mode=${pdfMode}`;
        window.location.href = url;

        setTimeout(() => {
            loader('hide');
            console.log("Excel file download triggered.");
        }, 2000);
    } catch (err) {
        loader('hide');
        console.log("Error exporting PDF:", err);
    }
}

