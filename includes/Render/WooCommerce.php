<?php

namespace MosPress\MosFaqs\Render;

defined('ABSPATH') || exit;

class WooCommerce {

	private $plugin_name;
	private $version;

	public function __construct($plugin_name, $version) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;

		add_action('plugins_loaded', array($this, 'init_woocommerce_integration'));
	}

	public function init_woocommerce_integration() {
		// Check if WooCommerce is active using multiple methods
		$is_woocommerce_active = class_exists('WooCommerce') ||
		                        in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins'))) ||
		                        is_plugin_active('woocommerce/woocommerce.php');

		if (!$is_woocommerce_active) {
			return;
		}

		// Add admin tab
		add_filter('woocommerce_product_data_tabs', array($this, 'add_product_faq_tab'), 50);

		// Add admin panel content
		add_action('woocommerce_product_data_panels', array($this, 'add_product_faq_panel'), 10);

		// Enqueue scripts
		add_action('admin_enqueue_scripts', array($this, 'enqueue_woocommerce_assets'), 10);

		// Save product FAQ data
		add_action('woocommerce_process_product_meta', array($this, 'save_product_faq_data'), 10, 2);

		// Add front-end tab
		add_action('woocommerce_product_tabs', array($this, 'add_frontend_product_faq_tab'), 10);
	}

	public function add_product_faq_tab($tabs) {
		$tabs['mos_faq'] = array(
			'label' => __('FAQs', 'mos-faqs'),
			'target' => 'mos_faq_product_data',
			'class' => array('mos-faq-tab'),
			'priority' => 50,
		);
		return $tabs;
	}

	public function enqueue_woocommerce_assets($hook) {
		if ($hook !== 'post.php' && $hook !== 'post-new.php') {
			return;
		}

		$screen = get_current_screen();
		if (!$screen || $screen->id !== 'product') {
			return;
		}

		wp_enqueue_script(
			'mos-faq-woocommerce',
			plugins_url('assets/build/mos-faq-woocommerce.js', MOS_FAQS_MAIN_FILE),
			array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-api-fetch', 'wp-server-side-render'),
			$this->version,
			true
		);

		wp_localize_script('mos-faq-woocommerce', 'mosFaqWooCommerce', array(
			'restUrl' => rest_url('mos-faqs/v1/product-faq/'),
			'nonce' => wp_create_nonce('wp_rest'),
		));
	}

	public function add_product_faq_panel() {
		global $post;

		if (!$post) {
			return;
		}

		$product_id = $post->ID;
		$faq_settings = get_post_meta($product_id, '_mos_faq_settings', true);
		$faq_settings = wp_parse_args($faq_settings, array(
			'enabled' => false,
			'count' => -1,
			'offset' => 0,
			'author' => '1',
			'source' => 'recent',
			'posts' => '',
			'category' => '',
			'orderby' => '',
			'order' => '',
			'pagination' => false,
			'view' => 'accordion',
		));
		?>
		<div id="mos_faq_product_data" class="panel woocommerce_options_panel">
			<div class="options_group">
				<div id="mos-faq-woocommerce-container"></div>
				<script type="text/javascript">
					var mosFaqProductData = <?php echo json_encode($faq_settings); ?>;
					var mosFaqProductId = <?php echo $product_id; ?>;
				</script>
			</div>
		</div>
		<?php
	}

	public function save_product_faq_data($post_id) {
		// Check if this is an auto save
		if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
			return;
		}

		// Check if this is a revision
		if (wp_is_post_revision($post_id)) {
			return;
		}

		// Check post type
		if (get_post_type($post_id) !== 'product') {
			return;
		}

		// Check if user has permission
		if (!current_user_can('edit_products', $post_id)) {
			return;
		}

		// Get the FAQ settings from the form
		$faq_settings = array(
			'enabled' => isset($_POST['mos_faq_enabled']) ? (bool) $_POST['mos_faq_enabled'] : false,
			'count' => isset($_POST['mos_faq_count']) ? intval($_POST['mos_faq_count']) : -1,
			'offset' => isset($_POST['mos_faq_offset']) ? intval($_POST['mos_faq_offset']) : 0,
			'author' => isset($_POST['mos_faq_author']) ? sanitize_text_field($_POST['mos_faq_author']) : '1',
			'source' => isset($_POST['mos_faq_source']) ? sanitize_text_field($_POST['mos_faq_source']) : 'recent',
			'posts' => isset($_POST['mos_faq_posts']) ? sanitize_text_field($_POST['mos_faq_posts']) : '',
			'category' => isset($_POST['mos_faq_category']) ? sanitize_text_field($_POST['mos_faq_category']) : '',
			'orderby' => isset($_POST['mos_faq_orderby']) ? sanitize_text_field($_POST['mos_faq_orderby']) : '',
			'order' => isset($_POST['mos_faq_order']) ? sanitize_text_field($_POST['mos_faq_order']) : '',
			'pagination' => isset($_POST['mos_faq_pagination']) ? (bool) $_POST['mos_faq_pagination'] : false,
			'view' => isset($_POST['mos_faq_view']) ? sanitize_text_field($_POST['mos_faq_view']) : 'accordion',
		);

		// Update the post meta
		update_post_meta($post_id, '_mos_faq_settings', $faq_settings);
	}

	public function add_frontend_product_faq_tab($tabs) {
		global $product;

		if (!$product) {
			return $tabs;
		}

		$product_id = $product->get_id();
		$faq_settings = get_post_meta($product_id, '_mos_faq_settings', true);

		if (empty($faq_settings) || empty($faq_settings['enabled'])) {
			return $tabs;
		}

		$tabs['mos_faq'] = array(
			'title' => __('FAQs', 'mos-faqs'),
			'priority' => 25,
			'callback' => array($this, 'render_product_faq_tab_content'),
		);

		return $tabs;
	}

	public function render_product_faq_tab_content() {
		global $product;

		if (!$product) {
			return;
		}

		$product_id = $product->get_id();
		$faq_settings = get_post_meta($product_id, '_mos_faq_settings', true);

		if (empty($faq_settings) || empty($faq_settings['enabled'])) {
			return;
		}

		$atts = array(
			'count' => isset($faq_settings['count']) ? $faq_settings['count'] : -1,
			'offset' => isset($faq_settings['offset']) ? $faq_settings['offset'] : 0,
			'author' => isset($faq_settings['author']) ? $faq_settings['author'] : '1',
			'source' => isset($faq_settings['source']) ? $faq_settings['source'] : 'recent',
			'posts' => isset($faq_settings['posts']) ? $faq_settings['posts'] : '',
			'category' => isset($faq_settings['category']) ? $faq_settings['category'] : '',
			'orderby' => isset($faq_settings['orderby']) ? $faq_settings['orderby'] : '',
			'order' => isset($faq_settings['order']) ? $faq_settings['order'] : '',
			'pagination' => isset($faq_settings['pagination']) ? $faq_settings['pagination'] : false,
			'view' => isset($faq_settings['view']) ? $faq_settings['view'] : 'accordion',
		);

		echo '<div class="mos-faq-woocommerce-content">';
		echo do_shortcode('[mos_faq ' . $this->atts_to_string($atts) . ']');
		echo '</div>';
	}

	private function atts_to_string($atts) {
		$parts = array();
		foreach ($atts as $key => $value) {
			if (is_bool($value)) {
				if ($value) {
					$parts[] = $key . '="1"';
				}
			} elseif (!empty($value) || $value === '0' || $value === 0) {
				$parts[] = $key . '="' . esc_attr($value) . '"';
			}
		}
		return implode(' ', $parts);
	}
}
