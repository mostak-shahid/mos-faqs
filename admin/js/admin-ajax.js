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
                            // window.location.replace(url);

                            location.reload();
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
            } else {
                alert('Please try again');
            }
        }        
    });
    $('body').on('click', '.mos-faqs-install-github-plugin', function(e){
        e.preventDefault();
        var self = $(this);
        let sub_action = self.data('sub_action');
        let download_url = self.data('download_url');
        let plugin_slug = self.data('plugin_slug');
        let plugin_file = self.data('plugin_file');
        let plugin_source = self.data('plugin_source');
        // console.log(plugin_source);

        if(sub_action &&  plugin_source && plugin_slug ) {
            var dataJSON = {
                action: 'mos_faqs_ajax_install_plugins',
                _admin_nonce: mos_faqs_ajax_obj._admin_nonce,
                sub_action: sub_action,
                download_url: download_url,
                plugin_slug: plugin_slug,
                plugin_file: plugin_file,
                plugin_source: plugin_source,
            };
            $.ajax({
                cache: false,
                type: "POST",
                url: mos_faqs_ajax_obj.ajax_url,
                data: dataJSON,
                beforeSend: function() {
                    self.html('processing...');
                },
                success: function(response) {
                    console.log(response);
                    if (response.success) {
                        
                        // Simulate a mouse click:
                        // window.location.href = url;

                        // Simulate an HTTP redirect:
                        // window.location.replace(url);

                        // location.reload();
                    }
                    // on success
                    // code...
                },
                error: function(xhr, status, error) {
                    console.log('Status: ' + xhr.status);
                    console.log('Error: ' + xhr.responseText);
                },
                complete: function() {
                    self.html('Completed');
                }
            });
        }
    });
});
