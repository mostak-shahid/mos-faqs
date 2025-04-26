<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://mostak-shahid.github.io/
 * @since      3.0.1
 *
 * @package    Mos_Faqs
 * @subpackage Mos_Faqs/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      3.0.1
 * @package    Mos_Faqs
 * @subpackage Mos_Faqs/includes
 * @author     Programmelab <mostak.shahid@gmail.com>
 */
class Mos_Faqs_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    3.0.1
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'mos-faqs',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
