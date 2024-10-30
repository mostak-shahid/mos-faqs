<?php

/**
 * Fired during plugin activation
 *
 * @link       https://www.programmelab.com/
 * @since      3.0.0
 *
 * @package    Mos_FAQs
 * @subpackage Mos_FAQs/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      3.0.0
 * @package    Mos_FAQs
 * @subpackage Mos_FAQs/includes
 * @author     Programmelab <rizvi@programmelab.com>
 */
class Mos_FAQs_Activator
{

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    3.0.0
	 */
	public static function activate()
	{
		$mos_faqs_options = mos_faqs_get_option();
		update_option('mos_faqs_options', $mos_faqs_options);
		add_option('mos_faqs_do_activation_redirect', true);
	}
}
