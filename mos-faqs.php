<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://programmelab.com/
 * @since             3.0.1
 * @package           Mos_Faqs
 *
 * @wordpress-plugin
 * Plugin Name:       Mos FAQs
 * Plugin URI:        https://programmelab.com/mos-faqs/
 * Description:       A simple FAQ plugin that lets you create FAQs, order FAQs, publicize FAQs, etc. It uses custom post types and taxonomies to manage an FAQ section for your site.
 * Version:           3.0.1
 * Author:            Md. Mostak Shahid
 * Author URI:        https://programmelab.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       mos-faqs
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if (!defined('ABSPATH')) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 3.0.1 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define('MOS_FAQS_VERSION', '3.0.1');
define('MOS_FAQS_NAME', __('Mos FAQs', 'mos-faqs'));

define('MOS_FAQS_PATH', plugin_dir_path(__FILE__));
define('MOS_FAQS_URL', plugin_dir_url(__FILE__));



/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-mos-faqs-activator.php
 */
function mos_faqs_activate()
{
	require_once MOS_FAQS_PATH . 'includes/class-mos-faqs-activator.php';
	Mos_Faqs_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-mos-faqs-deactivator.php
 */
function mos_faqs_deactivate()
{
	require_once MOS_FAQS_PATH . 'includes/class-mos-faqs-deactivator.php';
	Mos_Faqs_Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'mos_faqs_activate');
register_deactivation_hook(__FILE__, 'mos_faqs_deactivate');

if (file_exists(MOS_FAQS_PATH . '/vendor/autoload.php')) {
	require_once MOS_FAQS_PATH . '/vendor/autoload.php';
}
/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require MOS_FAQS_PATH . 'includes/class-mos-faqs.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    3.0.1
 */
function mos_faqs_run()
{

	$plugin = new Mos_Faqs();
	$plugin->run();
}
mos_faqs_run();

function mos_faqs_get_tabs()
{
	$mos_faqs_tabs = [];
	/*$mos_faqs_tabs = [
		'integration' => [
			'slug' => 'integration',
			'name' => esc_html__('Restrictions', 'mos-faqs'),
			'description' => esc_html__('Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 'mos-faqs'),
			'url' => 'mos-faqs',
			'sub' => [
				'security-for-woocommerce' => [
					'slug' => 'security-for-woocommerce',
					'name' => esc_html__('Settings', 'mos-faqs'),
					'description' => esc_html__('Below you will find all the settings you need to restrict specific countires and IP addressses that you wish to restrict for your WooCommerce site. The restrictons will be applied to your WooCommerce pages.', 'mos-faqs'),
					'url' => 'mos-faqs'
				],
				'customize' => [
					'slug' => 'customize',
					'name' => esc_html__('Customize', 'mos-faqs'),
					'description' => esc_html__('Below you will find all the settings you need to customize restriction pages including the images that the visitor will see if they are restricted from accessing the website. The customization will be applied to your WooCommerce pages.', 'mos-faqs'),
					'url' => 'mos-faqs-integration-customize'
				],
			],
		],
	];*/
	// Apply filter to allow modification of $variable by other plugins
	$mos_faqs_tabs = apply_filters('mos_faqs_tabs_modify', $mos_faqs_tabs);

	return $mos_faqs_tabs;
}

function mos_faqs_get_default_options()
{
	$mos_faqs_default_options = [
		'base_input' => [
			'text_input' => '',
			'email_input' => '',
			'color_input' => '',
			'date_input' => '',
			'datetime_local_input' => '',
			'textarea_input' => '',
			'switch_input' => '1',
			'radio_input' => 'radio-2',
			'datalist_input' => '',
			'select_input' => '',
		],
		'array_input' => [
			'checkbox_input' => [],
			'multi_select_input' => [],
		],		
		'elements' => [
			'basic' => [
				'ip' => '',
				'text_field' => 'this is a text field',
				'textarea_field' => 'this is a textarea field',
				'select_field' => 'select-1',
				'radio_field' => 'radio-1',
				'radio_field_2' => 'radio-2',
				'checkbox_field' => ['checkbox-1', 'checkbox-3'],
				'checkbox_field_2' => ['checkbox-2', 'checkbox-3'],
				'checkbox_field_3' => ['checkbox-1', 'checkbox-3'],
				'multiselect_field' => ['select-2', 'select-3'],
				'multiselect_field_2' => ['select-3', 'select-4'],
				'switch' => 0,
			],
			'advanced' => [
				'media_uploader' => [
					'url' => '',
					'id' => 0
				],
				'countries_list' => [
					['value' => "Albania", 'code' => "AL"],
					['value' => "Algeria", 'code' => "DZ"],
				],
				'ips' => ["111.111.111.111", "222.222.222.222"],
				'emails' => ["asd@asd.asd", "abc@abc.abc"],
				'repeatablesorter_group' => [
					[
						"enabler" => true,
						"title" => "123 Main St",
						"note" => "Leave at door",
						"enable" => true,
						"gender" => "male",
						"country" => "us",
						"languages" => ["en", "fr"],
						"hobbies" => ["reading", "sports"],
					]
				],
				'repeatablesorter' => [
					'https://www.facebook.com/',
					'https://web.whatsapp.com/',
					'https://www.youtube.com/',
					'https://web.skype.com/'
				]
			]
		]
		// 'editor-input' => '<p>Lorem</p>',

	];
	$mos_faqs_default_options = apply_filters('mos_faqs_default_options_modify', $mos_faqs_default_options);

	return $mos_faqs_default_options;
}
function mos_faqs_get_option()
{
	$mos_faqs_options_database = get_option('mos_faqs_options', []);
	$mos_faqs_options = array_replace_recursive(mos_faqs_get_default_options(), $mos_faqs_options_database);
	return $mos_faqs_options;
}
function mos_faqs_is_plugin_page()
{
	if (function_exists('get_current_screen')) {
		$current_screen = get_current_screen();
		$tabs = mos_faqs_get_tabs();
		$pages = [];
		if (isset($tabs) && sizeof($tabs)) {
			foreach ($tabs as $tab) {
				$pages[] = 'admin_page_' . $tab['url'];
				if (isset($tab['sub']) && sizeof($tab['sub'])) {
					foreach ($tab['sub'] as $subtab) {
						$pages[] = 'admin_page_' . $subtab['url'];
					}
				}
			}
		}

		if (
			$current_screen->id == 'toplevel_page_mos-faqs'
			|| $current_screen->id == 'mos-faqs_page_mos-faqs-react'
			|| in_array($current_screen->id, $pages)
		) {
			return true;
		}
	}
	return false;
}
