function upload_show_alert(message, alert){
    // alert for main html
    alert_wrapper.innerHTML = `
    <div class="alert alert-${alert} alert-dismissible fade show" role="alert">
      <span>${message}</span>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`;
    $('#alert_wrapper').children().first().delay(5000).fadeOut(3000);
};


let original_document_id;
function upload_associate_file(doc_id) {
    original_document_id = doc_id;
    console.log("original_document_id:->",original_document_id);
    var isAdvancedUpload = function () {
    var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();

    // applying the effect for every form
    var forms = document.querySelectorAll('.box');


    $(document).ready(function ($) {

        Array.prototype.forEach.call(forms, function (form) {
            var input = form.querySelector('input[type="file"]'),
                label = form.querySelector('label'),
                errorMsg = form.querySelector('.box__error span'),
                restart = form.querySelectorAll('.box__restart'),
                droppedFiles = false,
                showFiles = function (files) {
                    label.textContent = files[0].name;
                },
                triggerFormSubmit = function () {
                    var event = document.createEvent('HTMLEvents');
                    event.initEvent('submit', true, false);
                    form.dispatchEvent(event);
                };

            // letting the server side to know we are going to make an Ajax request
            var ajaxFlag = document.createElement('input');
            ajaxFlag.setAttribute('type', 'hidden');
            ajaxFlag.setAttribute('name', 'ajax');
            ajaxFlag.setAttribute('value', 1);
            form.appendChild(ajaxFlag);

            // automatically submit the form on file select
            input.addEventListener('change', function (e) {
                showFiles(e.target.files);
            });

            // drag&drop files if the feature is available
            if (isAdvancedUpload) {
                form.classList.add('has-advanced-upload'); // letting the CSS part to know drag&drop is supported by the browser

                ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
                    form.addEventListener(event, function (e) {
                        // preventing the unwanted behaviours
                        e.preventDefault();
                        e.stopPropagation();
                    });
                });
                ['dragover', 'dragenter'].forEach(function (event) {
                    form.addEventListener(event, function () {
                        form.classList.add('is-dragover');
                    });
                });
                ['dragleave', 'dragend', 'drop'].forEach(function (event) {
                    form.addEventListener(event, function () {
                        form.classList.remove('is-dragover');
                    });
                });
                form.addEventListener('drop', function (e) {
                    droppedFiles = e.dataTransfer.files; // the files that were dropped
                    showFiles(droppedFiles);

                });
            }


            // if the form was submitted
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                // preventing the duplicate submissions if the current one is in progress
                if (form.classList.contains('is-uploading')) return false;

                form.classList.add('is-uploading');
                form.classList.remove('is-error');

                if (isAdvancedUpload) // ajax file upload for modern browsers
                {
                    e.preventDefault();

                    // gathering the form data
                    var ajaxData = new FormData(form);
                    if (droppedFiles) {
                        Array.prototype.forEach.call(droppedFiles, function (file) {
                            ajaxData.append(input.getAttribute('name'), file);

                        });
                    }

                    ajaxData.append('original_document_id',original_document_id);
                    $('#upload').removeAttr('disabled');
                    $.ajax({
                        method: 'POST',
                        url: '/project-management/upload-csv-file/',
                        data: ajaxData,
                        cache: false,
                        contentType: false,
                        processData: false,
                        headers: {
                            "X-CSRFToken": $("[name=csrfmiddlewaretoken]").val()
                        },
                        success: function (response) {
                            form.classList.remove('is-uploading');
                            if(response['success']) {
                                console.log("File uploaded successfully!");
                            }
                            else {
                                loader('hide'); //hide loading ...
                                form.classList.add('is-error');
                                console.log(response['debug']);
                                alert('Error. Please, try again!');
                                window.location.reload();
                            }
                        },

                        error: function (response) {

                            loader('hide'); //hide loading ...

                            form.classList.remove('is-uploading');
                            form.classList.add('is-error');
                            console.log(response);
                            alert('Something went wrong, Please try again!');
                            window.location.reload();
                        }
                    });
                }
                else // fallback Ajax solution upload for older browsers
                {
                    var iframeName = 'uploadiframe' + new Date().getTime(),
                        iframe = document.createElement('iframe');

                    $iframe = $('<iframe name="' + iframeName + '" style="display: none;"></iframe>');

                    iframe.setAttribute('name', iframeName);
                    iframe.style.display = 'none';

                    document.body.appendChild(iframe);
                    form.setAttribute('target', iframeName);

                    iframe.addEventListener('load', function () {
                        var data = JSON.parse(iframe.contentDocument.body.innerHTML);
                        form.classList.remove('is-uploading')
                        form.classList.add(data.success == true ? 'is-success' : 'is-error')
                        form.removeAttribute('target');
                        if (!data.success) errorMsg.textContent = data.error;
                        iframe.parentNode.removeChild(iframe);
                    });
                }
            });
            // restart the form if has a state of error/success
            Array.prototype.forEach.call(restart, function (entry) {
                entry.addEventListener('click', function (e) {
                    e.preventDefault();
                    form.classList.remove('is-error', 'is-success');
                    input.click();
                });
            });
        });

    });
}