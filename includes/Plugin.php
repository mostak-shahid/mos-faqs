<?php

namespace MosPress\MosFaqs;

defined('ABSPATH') || exit;

use MosPress\MosFaqs\Admin\Post_Type;
use MosPress\MosFaqs\Public\Shortcode;

use MosPress\MosFaqs\Render\VC_Element;
use MosPress\MosFaqs\Render\Block;

use MosPress\MosFaqs\API\Ajax_API;
use MosPress\MosFaqs\API\Rest_API;
use MosPress\MosFaqs\Hook\Action_Hook;
use MosPress\MosFaqs\Hook\Filter_Hook;
use MosPress\MosFaqs\Core\ImportExport;
use MosPress\MosFaqs\Core\More;
use MosPress\MosFaqs\Core\Tools;
use MosPress\MosFaqs\UserMeta;

class Plugin {

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if (defined('MOS_FAQS_VERSION')) {
			$this->version = MOS_FAQS_VERSION;
		} else {
			$this->version = '1.0.0';
		}

		$this->plugin_name = 'mos-faqs';
		$this->define_admin_hooks();
		$this->define_public_hooks();

		Ajax_API::get_instance();
		Rest_API::get_instance();
		Action_Hook::get_instance();
		Filter_Hook::get_instance();
		
		new Post_Type($this->plugin_name, $this->version);
		new Shortcode($this->plugin_name, $this->version);
		new VC_Element();
		new Block($this->plugin_name, $this->version);
		
		// Instantiate additional core classes
		new ImportExport();
		new More();
		new Tools();
		new UserMeta();
	}


	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks()
	{
		$plugin_admin = new \MosPress\MosFaqs\Admin\AdminClass($this->plugin_name, $this->version);
		add_action('admin_enqueue_scripts', [$plugin_admin, 'enqueue_styles'], 9999);
		add_action('admin_enqueue_scripts', [$plugin_admin, 'enqueue_scripts'], 9999);
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks()
	{

		$plugin_public = new \MosPress\MosFaqs\Public\PublicClass($this->plugin_name, $this->version);
		add_action('wp_enqueue_scripts', [$plugin_public, 'enqueue_styles']);
		add_action('wp_enqueue_scripts', [$plugin_public, 'enqueue_scripts']);
		// Save settings by ajax
		add_action('wp_ajax_mos_faqs_ajax_callback', [$plugin_public, 'mos_faqs_ajax_callback']);
		add_action('wp_ajax_nopriv_mos_faqs_ajax_callback', [$plugin_public, 'mos_faqs_ajax_callback']);
	}


    // private static $instance = null;

    // public static function get_instance() {
    //     if (self::$instance === null) {
    //         self::$instance = new self();
    //         self::$instance->init();
    //     }
    //     return self::$instance;
    // }

    public function init() {

		Ajax_API::get_instance();
		Rest_API::get_instance();
		Action_Hook::get_instance();
		Filter_Hook::get_instance();
        
        // add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
    }

    public function enqueue_assets($hook) {

        if ($hook !== 'toplevel_page_mos-faqs') {
            return;
        }

        $asset_path = plugin_dir_path(__DIR__) . 'assets/build/';

        wp_enqueue_style(
            'mos-faqs-style',
            plugins_url('assets/build/app.css', dirname(__FILE__)),
            [],
            filemtime($asset_path . 'app.css')
        );

        wp_enqueue_script(
            'mos-faqs-script',
            plugins_url('assets/build/app.js', dirname(__FILE__)),
            [],
            filemtime($asset_path . 'app.js'),
            true
        );
    }
}
