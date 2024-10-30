jQuery(document).ready(function($) {   
    $('body').on('click', '.mos-faqs-button-reset', function(reset){
        // console.log('clicked');
        reset.preventDefault();
        let text = "Are You Sure?\nAre you sure you want to proceed with the changes.";
        if (confirm(text) == true) {
            let name= $(this).data('name');
            let url= $(this).data('url');
            if(name) {
                var dataJSON = {
                    action: 'mos_faqs_reset_settings',
                    _admin_nonce: mos_faqs_ajax_obj._admin_nonce,
                    name: name,
                };
                $.ajax({
                    cache: false,
                    type: "POST",
                    url: mos_faqs_ajax_obj.ajax_url,
                    data: dataJSON,
                    // beforeSend: function() {
                    //     $('.some-class').addClass('loading');
                    // },
                    success: function(response) {
                        console.log(response);
                        if (response.success) {
                            
                            // Simulate a mouse click:
                            // window.location.href = url;

                            // Simulate an HTTP redirect:
                            window.location.replace(url);
                        }
                        // on success
                        // code...
                    },
                    error: function(xhr, status, error) {
                        console.log('Status: ' + xhr.status);
                        console.log('Error: ' + xhr.responseText);
                    },
                    complete: function() {}
                });
            }
        }        
    });
});
