(function($) {
    'use strict';

    $(document).ready(function() {
        if (typeof mos_faqs_ajax_obj === 'undefined') {
            console.error('mos_faqs_ajax_obj is not defined');
            return;
        }

        const nonce = mos_faqs_ajax_obj._wp_nonce;

        window.mosFaqVote = function(postId, voteType) {
            const apiUrl = '/wp-json/mos-faqs/v1/faq/vote/' + postId;

            $('.mos-faq-unit[data-post-id="' + postId + '"]').addClass('voting');

            $.ajax({
                url: apiUrl,
                type: 'POST',
                data: {
                    vote: voteType,
                    _wpnonce: nonce
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', nonce);
                },
                success: function(response) {
                    if (response.success) {
                        const ratingUnit = $('.mos-faq-unit[data-post-id="' + postId + '"]');

                        ratingUnit.find('.mos-faq-thumbs-up-count').text(response.ratings.up);
                        ratingUnit.find('.mos-faq-thumbs-down-count').text(response.ratings.down);

                        if (response.ratings.user_vote === 'up') {
                            ratingUnit.find('.mos-faq-thumbs-up').addClass('active');
                        } else if (response.ratings.user_vote === 'down') {
                            ratingUnit.find('.mos-faq-thumbs-down').addClass('active');
                        }

                        ratingUnit.removeClass('voting');

                        ratingUnit.addClass('voted');
                    } else {
                        $('.mos-faq-unit[data-post-id="' + postId + '"]').removeClass('voting');
                        alert(response.message);
                    }
                },
                error: function(xhr, status, error) {
                    $('.mos-faq-unit[data-post-id="' + postId + '"]').removeClass('voting');
                    console.error('Error voting:', error);
                    alert('Error submitting your vote. Please try again.');
                }
            });
        };

        $('.mos-faq-rating').on('click', '.mos-faq-thumbs-up, .mos-faq-thumbs-down', function(e) {
            e.preventDefault();
            
            const ratingContainer = $(this).closest('.mos-faq-rating');
            const postId = ratingContainer.data('post-id');
            const voteType = $(this).data('vote');

            if (typeof window.mosFaqVote === 'function') {
                window.mosFaqVote(postId, voteType);
            } else {
                console.error('mosFaqVote function not available');
            }
        });

        $.each($('.mos-faq-unit[data-post-id]'), function(index, element) {
            const postId = $(element).data('post-id');
            const apiUrl = '/wp-json/mos-faqs/v1/faq/ratings/' + postId;

            $.get({
                url: apiUrl,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', nonce);
                },
                success: function(response) {
                    if (response.user_rated) {
                        if (response.user_vote === 'up') {
                            $(element).find('.mos-faq-thumbs-up').addClass('active');
                        } else if (response.user_vote === 'down') {
                            $(element).find('.mos-faq-thumbs-down').addClass('active');
                        }
                        $(element).addClass('voted');
                    }

                    $(element).find('.mos-faq-thumbs-up-count').text(response.up);
                    $(element).find('.mos-faq-thumbs-down-count').text(response.down);
                },
                error: function(xhr, status, error) {
                    console.error('Error loading ratings:', error);
                }
            });
        });
    });

})(jQuery);
