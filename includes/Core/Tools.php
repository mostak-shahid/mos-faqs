<?php

namespace MosPress\MosFaqs\Core;
if ( ! defined( 'ABSPATH' ) ) exit;
use MosPress\MosFaqs\API\Ajax_API;
use MosPress\MosFaqs\Hook\Filter_Hook;
use MosPress\MosFaqs\Hook\Action_Hook;
use MosPress\MosFaqs\Core\Deactivator;
class Tools
{
    protected $options;

	public function __construct()
	{
		$this->options = mos_faqs_get_option();
        if (isset($this->options['tools']['hide_plugin']) && $this->options['tools']['hide_plugin'] == 1) {
            // Hide plugin from plugins list
            add_filter('all_plugins', 'mos_faqs_hide_plugin_from_list');
        }
        if (isset($this->options['tools']['self_defense']) && $this->options['tools']['self_defense'] == 1) {
            add_action('admin_footer', [Action_Hook::class, 'mos_faqs_deactivation_scripts']);
            // AJAX handler to verify password
            add_action('wp_ajax_verify_user_password', [Ajax_API::class, 'verify_user_password_ajax']);
        }

        // if (isset($this->options['tools']['delete_data_on']) && $this->options['tools']['delete_data_on'] == 'deactivate') {
        //     // Cleaning up on Deactive
        // } else if (isset($this->options['tools']['delete_data_on']) && $this->options['tools']['delete_data_on'] == 'delete') {
        //     // Cleaning up on Delete
        // }

        add_action('wp_ajax_mos_faqs_reset_all_settings', [Ajax_API::class, 'mos_faqs_reset_all_settings']);	
        
    }
}