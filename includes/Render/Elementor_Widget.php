<?php

namespace MosPress\MosFaqs\Render;

defined('ABSPATH') || exit;

if (!defined('ELEMENTOR_VERSION') && !defined('ELEMENTOR_PATH')) {
	return;
}

class Elementor_Widget extends \Elementor\Widget_Base {

	public function get_name() {
		return 'mos_faqs';
	}

	public function get_title() {
		return __('Mos FAQs', 'mos-faqs');
	}

	public function get_icon() {
		return 'eicon-help-o';
	}

	public function get_categories() {
		return array('basic');
	}

	public function get_keywords() {
		return array('faq', 'questions', 'help');
	}

	protected function register_controls() {
		$this->start_controls_section(
			'faq_settings',
			array(
				'label' => __('FAQ Settings', 'mos-faqs'),
				'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
			)
		);

		$this->add_control(
			'source',
			array(
				'label'   => __('Source', 'mos-faqs'),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'default' => 'recent',
				'options' => array(
					'recent'             => __('Recent Posts', 'mos-faqs'),
					'selected_posts'     => __('Selected Posts', 'mos-faqs'),
					'selected_categories' => __('Selected Categories', 'mos-faqs'),
				),
			)
		);

		$faq_posts = get_posts(array(
			'post_type' => 'qa',
			'post_status' => 'publish',
			'posts_per_page' => -1,
			'fields' => 'ids',
		));

		$posts_options = array();
		foreach ($faq_posts as $post_id) {
			$posts_options[$post_id] = get_the_title($post_id);
		}

		$this->add_control(
			'posts',
			array(
				'label'       => __('Select Posts', 'mos-faqs'),
				'type'        => \Elementor\Controls_Manager::SELECT2,
				'multiple'    => true,
				'options'     => $posts_options,
				'label_block' => true,
				'condition'   => array(
					'source' => 'selected_posts',
				),
			)
		);

		$faq_categories = get_terms(array(
			'taxonomy' => 'faq-category',
			'hide_empty' => false,
		));

		$category_options = array();
		foreach ($faq_categories as $cat) {
			$category_options[$cat->term_id] = $cat->name;
		}

		$this->add_control(
			'category',
			array(
				'label'       => __('Select Categories', 'mos-faqs'),
				'type'        => \Elementor\Controls_Manager::SELECT2,
				'multiple'    => true,
				'options'     => $category_options,
				'label_block' => true,
				'condition'   => array(
					'source' => 'selected_categories',
				),
			)
		);

		$this->add_control(
			'count',
			array(
				'label'   => __('Count', 'mos-faqs'),
				'type'    => \Elementor\Controls_Manager::NUMBER,
				'default' => -1,
				'min'     => -1,
				'description' => __('Number of FAQs to display. Use -1 for all.', 'mos-faqs'),
			)
		);

		$this->add_control(
			'offset',
			array(
				'label'   => __('Offset', 'mos-faqs'),
				'type'    => \Elementor\Controls_Manager::NUMBER,
				'default' => 0,
				'min'     => 0,
			)
		);

		$users = get_users(array('orderby' => 'display_name'));
		$user_options = array();
		foreach ($users as $user) {
			$user_options[$user->ID] = $user->display_name . ' (' . $user->ID . ')';
		}

		$this->add_control(
			'author',
			array(
				'label'       => __('Author', 'mos-faqs'),
				'type'        => \Elementor\Controls_Manager::SELECT2,
				'multiple'    => true,
				'options'     => $user_options,
				'label_block' => true,
			)
		);

		$this->add_control(
			'orderby',
			array(
				'label'   => __('Order By', 'mos-faqs'),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'default' => '',
				'options' => array(
					''             => __('None', 'mos-faqs'),
					'ID'           => __('ID', 'mos-faqs'),
					'author'       => __('Author', 'mos-faqs'),
					'title'        => __('Title', 'mos-faqs'),
					'name'         => __('Name', 'mos-faqs'),
					'type'         => __('Type', 'mos-faqs'),
					'date'         => __('Date', 'mos-faqs'),
					'modified'     => __('Modified', 'mos-faqs'),
					'parent'       => __('Parent', 'mos-faqs'),
					'rand'         => __('Random', 'mos-faqs'),
					'comment_count' => __('Comment Count', 'mos-faqs'),
				),
			)
		);

		$this->add_control(
			'order',
			array(
				'label'   => __('Order', 'mos-faqs'),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'default' => '',
				'options' => array(
					''    => __('Default', 'mos-faqs'),
					'asc' => __('Ascending', 'mos-faqs'),
					'desc' => __('Descending', 'mos-faqs'),
				),
			)
		);

		$this->add_control(
			'view',
			array(
				'label'   => __('View', 'mos-faqs'),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'default' => 'accordion',
				'options' => array(
					'accordion'    => __('Accordion', 'mos-faqs'),
					'collapsible' => __('Collapsible', 'mos-faqs'),
					'block'       => __('Block', 'mos-faqs'),
				),
			)
		);

		$this->add_control(
			'pagination',
			array(
				'label'   => __('Show Pagination', 'mos-faqs'),
				'type'    => \Elementor\Controls_Manager::SWITCHER,
				'default' => false,
				'label_on'  => __('Yes', 'mos-faqs'),
				'label_off' => __('No', 'mos-faqs'),
			)
		);

		$this->end_controls_section();
	}

	protected function render() {
		$settings = $this->get_settings_for_display();

		$atts = array(
			'count'      => isset($settings['count']) ? $settings['count'] : -1,
			'offset'     => isset($settings['offset']) ? $settings['offset'] : 0,
			'author'     => isset($settings['author']) && !empty($settings['author']) ? implode(',', (array) $settings['author']) : '1',
			'source'     => isset($settings['source']) ? $settings['source'] : 'recent',
			'posts'      => isset($settings['posts']) && !empty($settings['posts']) ? implode(',', (array) $settings['posts']) : '',
			'category'   => isset($settings['category']) && !empty($settings['category']) ? implode(',', (array) $settings['category']) : '',
			'orderby'    => isset($settings['orderby']) ? $settings['orderby'] : '',
			'order'      => isset($settings['order']) ? $settings['order'] : '',
			'pagination' => isset($settings['pagination']) ? $settings['pagination'] : false,
			'view'       => isset($settings['view']) ? $settings['view'] : 'accordion',
		);

		echo do_shortcode('[mos_faq ' . $this->atts_to_string($atts) . ']');
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

	public function render_plain_content() {
		return '';
	}
}

// function mos_faqs_register_elementor_widget() {
// 	if (defined('ELEMENTOR_VERSION')) {
// 		\Elementor\Plugin::instance()->widgets_manager->register_widget_type(new Elementor_Widget());
// 	}
// }
// add_action('elementor/widgets/register', 'mos_faqs_register_elementor_widget');
