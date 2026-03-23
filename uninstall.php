<?php
/**
 * Uninstall Plugin
 *
 * Fired when the plugin is uninstalled (deleted from WordPress admin).
 * This file is called automatically by WordPress.
 *
 * @package MosFaqs
 */

// If uninstall not called from WordPress, exit
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}
$options = get_option('mos_faqs_options', []);
if (isset($options['tools']['delete_data_on']) && $options['tools']['delete_data_on'] == 'delete') {
    mos_faqs_data_cleanup();
}