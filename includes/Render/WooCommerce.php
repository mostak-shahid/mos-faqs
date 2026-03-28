<?php

namespace MosPress\MosFaqs\Render;

defined('ABSPATH') || exit;
use WP_Error;
use WP_Query;
use WP_User_Query;
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
		$is_woocommerce_active = class_exists('WooCommerce') || in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins'))) || is_plugin_active('woocommerce/woocommerce.php');

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

		// Register REST API endpoint for saving FAQ settings
		add_action('rest_api_init', array($this, 'register_rest_routes'));
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

		global $post;
		$product_id = $post ? $post->ID : 0;

		// wp_enqueue_script(
		// 	'mos-faq-woocommerce',
		// 	plugins_url('assets/build/mos-faq-woocommerce.js', MOS_FAQS_MAIN_FILE),
		// 	array('react', 'react-dom', 'wp-element', 'wp-api-fetch', '@douyinfe/semi-ui'),
		// 	$this->version,
		// 	true
		// );
		wp_enqueue_script(
			'mos-faq-product',
			plugins_url('assets/build/mos-faq-product.js', MOS_FAQS_MAIN_FILE),
			['jquery'],
            time(),
            true
		);

		wp_localize_script('mos-faq-product', 'mosFaqProduct', array(
			'restUrl' => rest_url('mos-faqs/v1/product-faq/'),
			'nonce' => wp_create_nonce('wp_rest'),
			'productId' => $product_id,
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
		<?php wp_nonce_field( 'mos_faqs_product_action', 'mos_faqs_product_field' ); ?>
		<div id="mos_faq_product_data" class="panel woocommerce_options_panel">
			<div class="options_group">
				<!-- Hidden form fields for traditional form submission -->
				<input type="hidden" id="mos_faq_enabled" name="mos_faq_enabled" value="<?php echo $faq_settings['enabled'] ? '1' : '0'; ?>">
				<input type="hidden" id="mos_faq_count" name="mos_faq_count" value="<?php echo esc_attr($faq_settings['count']); ?>">
				<input type="hidden" id="mos_faq_offset" name="mos_faq_offset" value="<?php echo esc_attr($faq_settings['offset']); ?>">
				<input type="hidden" id="mos_faq_author" name="mos_faq_author" value="<?php echo esc_attr($faq_settings['author']); ?>">
				<input type="hidden" id="mos_faq_source" name="mos_faq_source" value="<?php echo esc_attr($faq_settings['source']); ?>">
				<input type="hidden" id="mos_faq_posts" name="mos_faq_posts" value="<?php echo esc_attr($faq_settings['posts']); ?>">
				<input type="hidden" id="mos_faq_category" name="mos_faq_category" value="<?php echo esc_attr($faq_settings['category']); ?>">
				<input type="hidden" id="mos_faq_orderby" name="mos_faq_orderby" value="<?php echo esc_attr($faq_settings['orderby']); ?>">
				<input type="hidden" id="mos_faq_order" name="mos_faq_order" value="<?php echo esc_attr($faq_settings['order']); ?>">
				<input type="hidden" id="mos_faq_pagination" name="mos_faq_pagination" value="<?php echo $faq_settings['pagination'] ? '1' : '0'; ?>">
				<input type="hidden" id="mos_faq_view" name="mos_faq_view" value="<?php echo esc_attr($faq_settings['view']); ?>">
				<!-- <div id="mos-faq-woocommerce-container"></div> -->
				<div id="mos-faqs-product-react-app"></div>
				<script type="text/javascript">
					var mosFaqProductData = <?php echo json_encode($faq_settings); ?>;
					var mosFaqProductId = <?php echo $product_id; ?>;
				</script>
			</div>
		</div>
		<?php
	}

	public function save_product_faq_data($post_id) {
		if ( isset( $_POST['mos_faqs_product_field'] ) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['mos_faqs_product_field'])), 'mos_faqs_product_action' ) ) {
					
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
		} else {
			// Nonce is invalid, do not save data
			return;
		}
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

	public function register_rest_routes() {
		register_rest_route('mos-faqs/v1', '/product-faq/(?P<product_id>[\d]+)', array(
			'methods' => 'POST',
			'callback' => array($this, 'save_product_faq_settings_rest'),
			'permission_callback' => array($this, 'check_product_edit_permission'),
		));

		register_rest_route('mos-faqs/v1', '/product-faq/(?P<product_id>[\d]+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'get_product_faq_settings_rest'),
			'permission_callback' => array($this, 'check_product_read_permission'),
		));

		register_rest_route('mos-faqs/v1', '/test', array(
			'methods' => 'GET',
			'callback' => array($this, 'test_endpoint'),
			'permission_callback' => '__return_true',
		));

		register_rest_route('mos-faqs/v1', '/search-posts', array(
			'methods' => 'GET',
			'callback' => array($this, 'search_faq_posts'),
			'permission_callback' => '__return_true',
		));

		register_rest_route('mos-faqs/v1', '/search-categories', array(
			'methods' => 'GET',
			'callback' => array($this, 'search_faq_categories'),
			'permission_callback' => '__return_true',
		));

		register_rest_route('mos-faqs/v1', '/search-users', array(
			'methods' => 'GET',
			'callback' => array($this, 'search_users'),
			'permission_callback' => '__return_true',
		));
	}

	public function check_product_edit_permission($request) {
		$product_id = $request->get_param('product_id');
		return current_user_can('edit_products', $product_id);
	}

	public function check_product_read_permission($request) {
		return true;
	}

	public function test_endpoint($request) {
		return rest_ensure_response(array(
			'status' => 'success',
			'message' => 'REST API is working',
			'post_type_exists' => post_type_exists('qa'),
			'taxonomy_exists' => taxonomy_exists('faq-category'),
		));
	}

	public function save_product_faq_settings_rest($request) {
		$product_id = intval($request->get_param('product_id'));

		if (get_post_type($product_id) !== 'product') {
			return new WP_Error('invalid_product', 'Invalid product ID', array('status' => 400));
		}

		$faq_settings = array(
			'enabled' => isset($request['enabled']) ? (bool) $request['enabled'] : false,
			'count' => isset($request['count']) ? intval($request['count']) : -1,
			'offset' => isset($request['offset']) ? intval($request['offset']) : 0,
			'author' => isset($request['author']) ? sanitize_text_field($request['author']) : '1',
			'source' => isset($request['source']) ? sanitize_text_field($request['source']) : 'recent',
			'posts' => isset($request['posts']) ? sanitize_text_field($request['posts']) : '',
			'category' => isset($request['category']) ? sanitize_text_field($request['category']) : '',
			'orderby' => isset($request['orderby']) ? sanitize_text_field($request['orderby']) : '',
			'order' => isset($request['order']) ? sanitize_text_field($request['order']) : '',
			'pagination' => isset($request['pagination']) ? (bool) $request['pagination'] : false,
			'view' => isset($request['view']) ? sanitize_text_field($request['view']) : 'accordion',
		);

		update_post_meta($product_id, '_mos_faq_settings', $faq_settings);

		return rest_ensure_response(array(
			'success' => true,
			'message' => 'FAQ settings saved successfully',
			'settings' => $faq_settings,
		));
	}

	public function get_product_faq_settings_rest($request) {
		$product_id = intval($request->get_param('product_id'));

		$faq_settings = get_post_meta($product_id, '_mos_faq_settings', true);

		if (empty($faq_settings)) {
			$faq_settings = array(
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
			);
		}

		return rest_ensure_response($faq_settings);
	}

	public function search_faq_posts($request) {
		$search = sanitize_text_field($request->get_param('search'));
		$page = intval($request->get_param('page'));
		if ($page < 1) {
			$page = 1;
		}
		$per_page = intval($request->get_param('per_page'));
		if ($per_page < 1) {
			$per_page = 20;
		}

		$args = array(
			'post_type' => 'qa',
			'post_status' => 'publish',
			'posts_per_page' => $per_page,
			'paged' => $page,
			'orderby' => 'date',
			'order' => 'DESC',
			'fields' => 'ids',
		);

		if ($search && !empty($search)) {
			$args['s'] = $search;
		}

		$query = new WP_Query($args);
		$posts = array();

		if (!empty($query->posts)) {
			foreach ($query->posts as $post_id) {
				$posts[] = array(
					'id' => $post_id,
					'title' => get_the_title($post_id),
				);
			}
		}

		return rest_ensure_response(array(
			'posts' => $posts,
			'total' => $query->found_posts,
			'pages' => $query->max_num_pages,
		));
	}

	public function search_faq_categories($request) {
		$search = sanitize_text_field($request->get_param('search'));
		$page = intval($request->get_param('page'));
		$per_page = intval($request->get_param('per_page'));
		if ($per_page < 1) {
			$per_page = 20;
		}

		$args = array(
			'taxonomy' => 'faq-category',
			'hide_empty' => false,
			'number' => $per_page,
			'offset' => ($page - 1) * $per_page,
			'orderby' => 'count',
			'order' => 'DESC',
		);

		if ($search && !empty($search)) {
			$args['search'] = $search;
		}

		$terms = get_terms($args);
		$categories = array();

		if (!is_wp_error($terms)) {
			foreach ($terms as $term) {
				$categories[] = array(
					'id' => $term->term_id,
					'name' => $term->name,
				);
			}
		}

		$count_args = array(
			'taxonomy' => 'faq-category',
			'hide_empty' => false,
		);

		if ($search && !empty($search)) {
			$count_args['search'] = $search;
		}

		$total_count = wp_count_terms('faq-category', $count_args);

		return rest_ensure_response(array(
			'categories' => $categories,
			'total' => $total_count,
			'pages' => ceil($total_count / $per_page),
		));
	}

	public function search_users($request) {
		$search = sanitize_text_field($request->get_param('search'));
		$page = intval($request->get_param('page'));
		if ($page < 1) {
			$page = 1;
		}
		$per_page = intval($request->get_param('per_page'));
		if ($per_page < 1) {
			$per_page = 20;
		}

		$args = array(
			'number' => $per_page,
			'offset' => ($page - 1) * $per_page,
			'orderby' => 'registered',
			'order' => 'DESC',
		);

		if ($search && !empty($search)) {
			$args['search'] = '*' . $search . '*';
		}

		$user_query = new WP_User_Query($args);
		$users = array();
		$results = $user_query->get_results();

		if (!empty($results)) {
			foreach ($results as $user) {
				$users[] = array(
					'id' => $user->ID,
					'name' => $user->display_name,
				);
			}
		}

		$total = $user_query->get_total();

		return rest_ensure_response(array(
			'users' => $users,
			'total' => $total ? $total : 0,
			'pages' => $total > 0 ? ceil($total / $per_page) : 0,
		));
	}
}
