<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://programmelab.com/
 * @since      3.0.1
 *
 * @package    Mos_Faqs
 * @subpackage Mos_Faqs/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Mos_Faqs
 * @subpackage Mos_Faqs/admin
 * @author     Qrogrammelab <programmelab@asd.asd>
 */
class Mos_Faqs_Admin
{

	/**
	 * The ID of this plugin.
	 *
	 * @since    3.0.1
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    3.0.1
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    3.0.1
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct($plugin_name, $version)
	{

		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    3.0.1
	 */
	public function enqueue_styles()
	{

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Mos_Faqs_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Mos_Faqs_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		wp_enqueue_style($this->plugin_name . '-google-font', 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap', array(), $this->version, 'all');
		wp_enqueue_style($this->plugin_name, MOS_FAQS_URL . 'assets/css/style.css', array(), $this->version, 'all');
		wp_enqueue_style($this->plugin_name . '-admin', MOS_FAQS_URL . 'admin/css/admin-style.css', array(), $this->version, 'all');
		// wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/mos-faqs-admin.css', array(), $this->version, 'all');			
		// wp_enqueue_style( $this->plugin_name, plugin_dir_url(__DIR__) . 'admin/css/mos-faqs-admin.css', array(), $this->version, 'all' );


	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    3.0.1
	 */
	public function enqueue_scripts()
	{

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Mos_Faqs_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Mos_Faqs_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		wp_enqueue_script($this->plugin_name, MOS_FAQS_URL . 'assets/js/script.js', array('jquery'), $this->version, false);

		wp_enqueue_media();
		$current_screen = get_current_screen();
		if ($current_screen->id == 'mos-faqs_page_mos-faqs-react') {
			wp_enqueue_script(
				$this->plugin_name . '-react',
				MOS_FAQS_URL . 'build/index.js',
				array('wp-element', 'wp-components', 'wp-api-fetch', 'wp-i18n', 'wp-media-utils', 'wp-block-editor', 'react', 'react-dom'),
				$this->version,
				true
			);
		}

		wp_enqueue_script($this->plugin_name . '-admin-ajax', plugin_dir_url(__FILE__) . 'js/admin-ajax.js', array('jquery'), $this->version, false);
		wp_enqueue_script($this->plugin_name . '-admin-script', plugin_dir_url(__FILE__) . 'js/admin-script.js', array('jquery'), $this->version, false);
		$ajax_params = array(
			'admin_url' => admin_url(),
			'ajax_url' => admin_url('admin-ajax.php'),
			'_admin_nonce' => esc_attr(wp_create_nonce('mos_faqs_admin_nonce')),
			// 'install_plugin_wpnonce' => esc_attr(wp_create_nonce('updates')),
		);
		wp_localize_script($this->plugin_name . '-admin-ajax', 'mos_faqs_ajax_obj', $ajax_params);
	}


	/**
	 * Adding menu to admin menu.
	 *
	 * @since    3.0.1
	 */
	public function mos_faqs_admin_menu()
	{
		add_menu_page(
			esc_html(MOS_FAQS_NAME),
			esc_html(MOS_FAQS_NAME),
			'manage_options',
			$this->plugin_name,
			array($this, 'mos_faqs_dashboard_php_page_html'),
			plugin_dir_url(__DIR__) . 'admin/images/menu-icon.svg',
			57
		);
		add_submenu_page(
			$this->plugin_name,
			esc_html__('PHP Page', 'mos-faqs'),
			esc_html__('PHP Page', 'mos-faqs'),
			'manage_options',
			$this->plugin_name,
			array($this, 'mos_faqs_dashboard_php_page_html')
		);
		add_submenu_page(
			$this->plugin_name,
			esc_html__('React Page', 'mos-faqs'),
			esc_html__('React Page', 'mos-faqs'),
			'manage_options',
			$this->plugin_name . '-react',
			array($this, 'mos_faqs_dashboard_react_page_html')
		);
		/*add_submenu_page(
			$this->plugin_name,
			esc_html__('Sub', 'mos-faqs'),
			esc_html__('Sub', 'mos-faqs'),
			'manage_options',
			$this->plugin_name . '-sub',
			array($this, 'mos_faqs_dashboard_page_html')
		);
		$tabs = mos_faqs_get_tabs();
		if (sizeof($tabs)) {
			foreach ($tabs as $key => $tab) {
				if (isset($tab['sub']) && $tab['sub']) {
					foreach ($tab['sub'] as $k => $subtab) {
						add_submenu_page(
							$this->plugin_name . '-sub',
							// 'admin.php?page=wc-settings',
							esc_html($subtab['name']),
							esc_html($subtab['name']),
							'manage_options',
							$subtab['url'],
							array($this, 'mos_faqs_dashboard_page_html')
						);
					}
				} else {
					add_submenu_page(
						$this->plugin_name . '-sub',
						// 'admin.php?page=wc-settings',
						esc_html($tab['name']),
						esc_html($tab['name']),
						'manage_options',
						$tab['url'],
						array($this, 'mos_faqs_dashboard_page_html')
					);
				}
			}
		}
		remove_submenu_page($this->plugin_name, $this->plugin_name . '-sub');*/
	}
	/**
	 * Loading plugin Welcome page.
	 *
	 * @since    3.0.1
	 */
	public function mos_faqs_dashboard_php_page_html()
	{
		if (!current_user_can('manage_options')) {
			return;
		}
		include_once('partials/' . $this->plugin_name . '-admin-display.php');
	}
	public function mos_faqs_dashboard_react_page_html()
	{
		if (!current_user_can('manage_options')) {
			return;
		}
		include_once('partials/' . $this->plugin_name . '-admin-display-react.php');
	}

	/**
	 * Add settings action link to the plugins page.
	 *
	 * @since    3.0.1
	 */
	public function mos_faqs_add_action_links($links)
	{

		/**
		 * Documentation : https://codex.wordpress.org/Plugin_API/Filter_Reference/plugin_action_links_(plugin_file_name)
		 * The "plugins.php" must match with the previously added add_submenu_page first option.
		 * For custom post type you have to change 'plugins.php?page=' to 'edit.php?post_type=your_custom_post_type&page='
		 * 
		 */
		$settings_link = array(
			'<a href="' . admin_url('admin.php?page=' . $this->plugin_name) . '">' . esc_html__('Settings', 'mos-faqs') . '</a>',
			// '<a href="' . admin_url('admin.php?page=' . $this->plugin_name . '-settings') . '">' . esc_html__('Settings', 'mos-faqs') . '</a>'
		);
		return array_merge($settings_link, $links);
	}

	/**
	 * Add body classes to the settings pages.
	 *
	 * @since    3.0.1
	 */
	public function mos_faqs_admin_body_class($classes)
	{

		$current_screen = get_current_screen();
		// var_dump($current_screen->id);
		if (mos_faqs_is_plugin_page()) {
			$classes .= ' ' . $this->plugin_name . '-settings-template ';
		}
		return $classes;
	}

	/**
	 * Redirect to the welcome pages.
	 *
	 * @since    3.0.1
	 */
	public function mos_faqs_do_activation_redirect()
	{
		if (get_option('mos_faqs_do_activation_redirect')) {
			delete_option('mos_faqs_do_activation_redirect');
			wp_safe_redirect(admin_url('admin.php?page=' . $this->plugin_name));
		}
	}

	/**
	 * Removing all notieces from settings page.
	 *
	 * @since    3.0.1
	 */
	public function mos_faqs_hide_admin_notices()
	{
		// $current_screen = get_current_screen();
		// var_dump($current_screen->id);
		if (mos_faqs_is_plugin_page()) {
			remove_all_actions('user_admin_notices');
			remove_all_actions('admin_notices');
		}
	}
	public function mos_faqs_option_form_submit()
	{
		$mos_faqs_options = array_replace_recursive(mos_faqs_get_option(), get_option('mos_faqs_options', []));
		if (isset($_POST['options_form_field']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['options_form_field'])), 'options_form_action')) {

			$err = 0;

			$mos_faqs_options["base_input"]["text_input"] = isset($_POST["mos_faqs_options"]["base_input"]["text_input"]) ? sanitize_text_field(wp_unslash($_POST["mos_faqs_options"]["base_input"]["text_input"])) : '';

			$mos_faqs_options["base_input"]["email_input"] = isset($_POST["mos_faqs_options"]["base_input"]["email_input"]) ? sanitize_email(wp_unslash($_POST["mos_faqs_options"]["base_input"]["email_input"])) : '';

			$mos_faqs_options["base_input"]["color_input"] = isset($_POST["mos_faqs_options"]["base_input"]["color_input"]) ? sanitize_hex_color(wp_unslash($_POST["mos_faqs_options"]["base_input"]["color_input"])) : '';

			$mos_faqs_options["base_input"]["date_input"] = isset($_POST["mos_faqs_options"]["base_input"]["date_input"]) ? sanitize_text_field(wp_unslash($_POST["mos_faqs_options"]["base_input"]["date_input"])) : '';

			$mos_faqs_options["base_input"]["datetime_local_input"] = isset($_POST["mos_faqs_options"]["base_input"]["datetime_local_input"]) ? sanitize_text_field(wp_unslash($_POST["mos_faqs_options"]["base_input"]["datetime_local_input"])) : '';

			$mos_faqs_options["base_input"]["textarea_input"] = isset($_POST["mos_faqs_options"]["base_input"]["textarea_input"]) ? sanitize_textarea_field(wp_unslash($_POST["mos_faqs_options"]["base_input"]["textarea_input"])) : '';

			$mos_faqs_options["base_input"]["switch_input"] = isset($_POST["mos_faqs_options"]["base_input"]["switch_input"]) ? sanitize_text_field(wp_unslash($_POST["mos_faqs_options"]["base_input"]["switch_input"])) : '';

			$mos_faqs_options["base_input"]["radio_input"] = isset($_POST["mos_faqs_options"]["base_input"]["radio_input"]) ? sanitize_text_field(wp_unslash($_POST["mos_faqs_options"]["base_input"]["radio_input"])) : '';

			$mos_faqs_options["base_input"]["datalist_input"] = isset($_POST["mos_faqs_options"]["base_input"]["datalist_input"]) ? sanitize_text_field(wp_unslash($_POST["mos_faqs_options"]["base_input"]["datalist_input"])) : '';

			$mos_faqs_options["base_input"]["select_input"] = isset($_POST["mos_faqs_options"]["base_input"]["select_input"]) ? sanitize_text_field(wp_unslash($_POST["mos_faqs_options"]["base_input"]["select_input"])) : '';

			$mos_faqs_options["editor_input"] = isset($_POST["mos_faqs_options"]["editor_input"]) ? wp_kses_post(wp_unslash($_POST["mos_faqs_options"]["editor_input"])) : '';

			$mos_faqs_options["array_input"]["checkbox_input"] = isset($_POST["mos_faqs_options"]["array_input"]["checkbox_input"]) ? array_map('sanitize_text_field', wp_unslash($_POST["mos_faqs_options"]["array_input"]["checkbox_input"])) : [];

			$mos_faqs_options["array_input"]["multi-select_input"] = isset($_POST["mos_faqs_options"]["array_input"]["multi-select_input"]) ? array_map('sanitize_text_field', wp_unslash($_POST["mos_faqs_options"]["array_input"]["multi-select_input"])) : [];

			if (!$err) {
				$_POST['settings-updated'] = true;
			}

			// var_dump($_POST);
		}
		update_option('mos_faqs_options', $mos_faqs_options);
	}
	// add_action('admin_head', 'mos_faqs_option_form_submit');
	private function reset_option_by_path(&$options, $defaults, $path)
	{
		$keys = explode('.', $path);
		$target = &$options;
		$default = $defaults;

		foreach ($keys as $key) {
			if (!isset($target[$key]) || !isset($default[$key])) {
				return false; // path not found
			}
			$target = &$target[$key];
			$default = $default[$key];
		}

		// Set the value at the final nested level
		$target = $default;
		return true;
	}

	public function mos_faqs_reset_settings()
	{
		// wp_send_json_success($_POST['_admin_nonce']);
		if (isset($_POST['_admin_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_admin_nonce'])), 'mos_faqs_admin_nonce')) {
			$name = sanitize_text_field(wp_unslash($_POST['name']));
			$mos_faqs_options = mos_faqs_get_option();
			$mos_faqs_default_options = mos_faqs_get_default_options();

			$success = $this->reset_option_by_path($mos_faqs_options, $mos_faqs_default_options, $name);

			if ($success) {
				update_option('mos_faqs_options', $mos_faqs_options);
				wp_send_json_success(['message' => __('Settings reset successfully.', 'mos-faqs')]);
			} else {
				wp_send_json_error(['error_message' => __('Invalid settings path.', 'mos-faqs')]);
			}
		} else {
			wp_send_json_error(array('error_message' => esc_html__('Nonce verification failed. Please try again.', 'mos-faqs')));
			// wp_die(esc_html__('Nonce verification failed. Please try again.', 'mos-faqs'));
		}
		wp_die();
	}
	public function mos_faqs_reset_all_settings()
	{
		if (isset($_POST['_admin_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_admin_nonce'])), 'mos_faqs_admin_nonce')) {
			// wp_send_json_success(array('variation_id' => $variation_id, 'price' => $price));
			$mos_faqs_default_options = mos_faqs_get_default_options();
			update_option('mos_faqs_options', $mos_faqs_default_options);
			wp_send_json_success();
		} else {
			wp_send_json_error(array('error_message' => esc_html__('Nonce verification failed. Please try again.', 'mos-faqs')));
			// wp_die(esc_html__('Nonce verification failed. Please try again.', 'mos-faqs'));
		}
		wp_die();
	}
	function mos_faqs_update_completed($upgrader_object, $options)
	{

		// If an update has taken place and the updated type is plugins and the plugins element exists
		if ($options['action'] == 'update' && $options['type'] == 'plugin' && isset($options['plugins'])) {
			foreach ($options['plugins'] as $plugin) {
				// Check to ensure it's my plugin
				if ($plugin == plugin_basename(__FILE__)) {
					// do stuff here
					$mos_faqs_options = array_replace_recursive(mos_faqs_get_option(), get_option('mos_faqs_options', []));
					update_option('mos_faqs_options', $mos_faqs_options);
				}
			}
		}
	}

	// add_action('admin_init', 'mos_faqs_product_category_data');
	/*
	* Add custom routes to the Rest API
	*
	* @since    1.0.8
	*/
	//add_action('rest_api_init', 'mos_faqs_rest_api_init');
	public function mos_faqs_rest_api_init()
	{
		register_rest_route(
			'mos-faqs/v1',
			'/options',
			array(
				'methods'  => 'GET',
				'callback' => [$this, 'rest_mos_faqs_get_options'],
				'permission_callback' => '__return_true', // Allow public access
			)
		);

		//Add the POST 'mos-faqs/v1/options' endpoint to the Rest API
		register_rest_route(
			'mos-faqs/v1',
			'/options',
			array(
				'methods'             => 'POST',
				'callback'            => [$this, 'rest_mos_faqs_update_options'],
				'permission_callback' => '__return_true'
			)
		);
	}
	public function rest_mos_faqs_get_options(WP_REST_Request $request)
	{
		// if (!current_user_can('manage_options')) {
		// 	return new WP_Error(
		// 		'rest_update_error',
		// 		'Sorry, you are not allowed to update the DAEXT UI Test options.',
		// 		array('status' => 403)
		// 	);
		// }
		$mos_faqs_options = mos_faqs_get_option();
		return new WP_REST_Response($mos_faqs_options, 200);
	}
	public function rest_mos_faqs_update_options(WP_REST_Request $request) //WP_REST_Request $request
	{
		// if (!current_user_can('manage_options')) {
		// 	return new WP_Error(
		// 		'rest_update_error',
		// 		'Sorry, you are not allowed to update the DAEXT UI Test options.',
		// 		array('status' => 403)
		// 	);
		// }
		$mos_faqs_options_old = mos_faqs_get_option();

		$mos_faqs_options = map_deep(wp_unslash($request->get_param('mos_faqs_options')), 'sanitize_text_field');

		$mos_faqs_options ? update_option('mos_faqs_options', $mos_faqs_options) : '';
		$response = [
			'success' => true,
			'msg'	=> esc_html__('Data successfully added.', 'mos-faqs')
		];

		// return $response;
		return new WP_REST_Response($response, 200);

		/*
		
		return new WP_REST_Response([
			'success' => true,
			'message' => 'Plugin installed successfully.'
		], 200);
		

		return new WP_REST_Response([
			'success' => false,
			'message' => 'Installed plugin could not be identified'
		], 404);
		*/
	}
	public function mos_faqs_ajax_install_plugins()
	{

		if (!current_user_can('install_plugins')) {
			wp_send_json_error('Permission denied');
		}
		if (isset($_POST['_admin_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_admin_nonce'])), 'mos_faqs_admin_nonce')) {

			// wp_send_json_success('Working');

			$sub_action = isset($_POST['sub_action']) ? sanitize_text_field(wp_unslash($_POST['sub_action'])) : '';
			$plugin_slug = isset($_POST['plugin_slug']) ? sanitize_text_field(wp_unslash($_POST['plugin_slug'])) : ''; //'mos-woocommerce-protected-categories';


			$plugin_source = isset($_POST['plugin_source']) ? sanitize_text_field(wp_unslash($_POST['plugin_source'])) : 'internal'; //$plugin_slug . '/mos-woocommerce-protected-categories.php';		

			include_once ABSPATH . 'wp-admin/includes/file.php';
			include_once ABSPATH . 'wp-admin/includes/misc.php';
			include_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
			include_once ABSPATH . 'wp-admin/includes/plugin.php';

			$plugin_file = '';
			if ($plugin_source == 'external') {
				$plugin_file = ($plugin_slug && isset($_POST['plugin_file'])) ? $plugin_slug . '/' . sanitize_text_field(wp_unslash($_POST['plugin_file'])) : ''; //$plugin_slug . '/mos-woocommerce-protected-categories.php';
			} else {
				$plugin_file = $plugin_slug . '/' . $plugin_slug . '.php';
			}
			if ($sub_action === 'install' || $sub_action === 'install_activate') {
				if ($plugin_source == 'external') {
					$download_url = isset($_POST['download_url']) ? sanitize_url(wp_unslash($_POST['download_url'])) : ''; //'https://github.com/mostak-shahid/mos-woocommerce-protected-categories/archive/refs/heads/main.zip';

					$upgrader = new Plugin_Upgrader();
					$installed = $upgrader->install($download_url);

					if (is_wp_error($installed)) {
						wp_send_json_error('Install failed: ' . $installed->get_error_message());
					}

					// GitHub plugin zip will likely extract with this kind of name
					$extracted_dir = WP_PLUGIN_DIR . '/' . $plugin_slug;
					if (is_dir($extracted_dir)) {
						rename($extracted_dir, WP_PLUGIN_DIR . '/' . $plugin_slug);
					}
				} else {

					include_once ABSPATH . 'wp-admin/includes/plugin-install.php';

					$api = plugins_api('plugin_information', ['slug' => $plugin_slug, 'fields' => ['sections' => false]]);
					if (is_wp_error($api)) {
						wp_send_json_error(['message' => 'Plugin info fetch failed']);
					}

					$upgrader = new Plugin_Upgrader(new WP_Ajax_Upgrader_Skin());
					$install_result = $upgrader->install($api->download_link);

					if (is_wp_error($install_result)) {
						wp_send_json_error(['message' => 'Install failed: ' . $install_result->get_error_message()]);
					}
				}

				if ($sub_action === 'install') {
					wp_send_json_success('Plugin installed.');
				}
			}

			if ($sub_action === 'install_activate' || $sub_action === 'activate') {
				// wp_send_json_success(WP_PLUGIN_DIR . '/' .$plugin_file);
				// if (!file_exists(WP_PLUGIN_DIR . '/' . $plugin_file)) {
				// 	wp_send_json_error('Plugin not installed.');
				// }
				$result = activate_plugin(WP_PLUGIN_DIR . '/' . $plugin_file);
				if (is_wp_error($result)) {
					wp_send_json_error('Activation failed: ' . $result->get_error_message());
				} else {
					wp_send_json_success('Plugin activated.');
				}
			}

			wp_send_json_error(array('error_message' => esc_html__('Unknown action.', 'mos-faqs')));
		} else {
			wp_send_json_error(array('error_message' => esc_html__('Nonce verification failed. Please try again.', 'mos-faqs')));
			// wp_die(esc_html__('Nonce verification failed. Please try again.', 'mos-faqs'));
		}
		wp_die();
	}


	// 	add_action('wp_ajax_mos_plugin_manage', function () {
	//   check_ajax_referer('mos_plugin_nonce', 'security');
	// });
	public function mos_faqs_ajax_plugins_status()
	{

		if (!current_user_can('install_plugins')) {
			wp_send_json_error(array('error_message' => esc_html__('Permission denied', 'mos-faqs')));
		}
		if (isset($_POST['_admin_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_admin_nonce'])), 'mos_faqs_admin_nonce')) {
			// $slug = isset($_POST['slug']) ? sanitize_text_field(wp_unslash($_POST['slug'])) : '';
			$file = isset($_POST['file']) ? sanitize_text_field(wp_unslash($_POST['file'])) : '';

			if (!is_plugin_active($file) && !file_exists(WP_PLUGIN_DIR . '/' . $file)) {
				wp_send_json_success(array('success_message' => esc_html('not_installed')));
			} elseif (!is_plugin_active($file) && file_exists(WP_PLUGIN_DIR . '/' . $file)) {
				wp_send_json_success(array('success_message' => esc_html('not_active')));
			} elseif (is_plugin_active($file)) {
				wp_send_json_success(array('success_message' => esc_html('active')));
			}
		} else {
			wp_send_json_error(array('error_message' => esc_html__('Nonce verification failed. Please try again.', 'mos-faqs')));
			// wp_die(esc_html__('Nonce verification failed. Please try again.', 'mos-faqs'));
		}
		wp_die();
	}
}
