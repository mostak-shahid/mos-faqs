jQuery(document).ready(function($) {
	$('.mos-faq-accordion .mos-faq-title a').click(function(event) {
	    event.preventDefault();
	    $(this).closest(".mos-faq-heading").siblings('.mos-faq-collapse').slideToggle("slow");
	    $(this).closest(".mos-faq-unit").toggleClass("opened");
	    $(this).closest(".mos-faq-unit").siblings().find('.mos-faq-collapse').slideUp("slow");
	    $(this).closest(".mos-faq-unit").siblings().removeClass("opened");
	});
	$('.mos-faq-collapsible .mos-faq-title a').click(function(event) {
	    event.preventDefault();
	    $(this).closest(".mos-faq-heading").siblings('.mos-faq-collapse').slideToggle("slow");
	    $(this).closest(".mos-faq-unit").toggleClass("opened");
	});
});