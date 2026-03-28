<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://mostak-shahid.github.io/
 * @since             1.0.0
 * @package           MosFaqs
 *
 * @wordpress-plugin
 * Plugin Name:       Mos FAQs
 * Plugin URI:        https://mostak-shahid.github.io/plugins/mos-faqs.html
 * Description:       A simple FAQ plugin that lets you create FAQs, order FAQs, publicize FAQs, etc. It uses custom post types and taxonomies to manage an FAQ section for your site.
 * Version:           3.0.0
 * Author:            Md. Mostak Shahid
 * Author URI:        https://mostak-shahid.github.io/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       mos-faqs
 * Domain Path:       /languages
 */

defined('ABSPATH') || exit;
/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define('MOS_FAQS_VERSION', '3.0.0');
define('MOS_FAQS_NAME', 'Mos FAQs');
define('MOS_FAQS_PATH', plugin_dir_path(__FILE__));
define('MOS_FAQS_URL', plugin_dir_url(__FILE__));
define('MOS_FAQS_MAIN_FILE', __FILE__);
define('MOS_FAQS_REST_API_NAMESPACE', 'mos-faqs/v1');

require_once MOS_FAQS_PATH . '/vendor/autoload.php';
require_once MOS_FAQS_PATH . '/mos-faqs-functions.php';

/**
 * The code that runs during plugin activation.
 * This action is documented in src/Core/Activator.php
 */
function mos_faqs_activate()
{
	\MosPress\MosFaqs\Core\Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in src/Core/Deactivator.php
 */
function mos_faqs_deactivate()
{
	\MosPress\MosFaqs\Core\Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'mos_faqs_activate');
register_deactivation_hook(__FILE__, 'mos_faqs_deactivate');


/**
 * Register WP-CLI commands only if file exists
 */
if ( defined( 'WP_CLI' ) && WP_CLI && file_exists( plugin_dir_path( __FILE__ ) . 'includes/CLI/CLI_Command.php' ) ) {
    $cli_file = plugin_dir_path( __FILE__ ) . 'includes/CLI/CLI_Command.php';
    
    if ( file_exists( $cli_file ) ) {
        WP_CLI::add_command( 'mos-faqs', 'MosPress\MosFaqs\CLI\CLI_Command' );
    }
}

use MosPress\MosFaqs\Plugin;

// Plugin::get_instance();
new Plugin();