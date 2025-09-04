jQuery(document).ready(function($) {    
    var $tabs = $("#mos-faqs-settings-tabs").tabs();

    // // On tab change, store index in hidden input
    // $tabs.on("tabsactivate", function(event, ui){
    //     var active = $tabs.tabs("option", "active");
    //     $(".active_tab_input").val(active);
    // });

    // // Read from hidden input to set the tab on load
    // var activeIndex = parseInt($("#active_tab_input").val());
    // if(!isNaN(activeIndex)) {
    //     $tabs.tabs("option", "active", activeIndex);
    // }

    // Restore tab from localStorage
    var storedIndex = localStorage.getItem('safwActiveTabIndex');
    if (storedIndex !== null) {
        $tabs.tabs("option", "active", parseInt(storedIndex));
        $('#active_tab_input').val(storedIndex);
    }

    // On tab change, store in hidden field AND localStorage
    $tabs.on("tabsactivate", function(event, ui) {
        var activeIndex = $tabs.tabs("option", "active");
        $("#active_tab_input").val(activeIndex);
        localStorage.setItem('safwActiveTabIndex', activeIndex);
    });
});