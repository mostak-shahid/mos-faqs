<?php

/**
 * Fired during plugin activation
 *
 * @link       https://mostak-shahid.github.io/
 * @since      3.0.1
 *
 * @package    Mos_Faqs
 * @subpackage Mos_Faqs/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      3.0.1
 * @package    Mos_Faqs
 * @subpackage Mos_Faqs/includes
 * @author     Programmelab <mostak.shahid@gmail.com>
 */
class Mos_Faqs_Activator
{

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    3.0.1
	 */
	public static function activate()
	{
		$mos_faqs_options = mos_faqs_get_option();
		update_option('mos_faqs_options', $mos_faqs_options);
		add_option('mos_faqs_do_activation_redirect', true);
	}
}
