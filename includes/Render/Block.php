<?php

namespace MosPress\MosFaqs\Render;

defined('ABSPATH') || exit;

class Block {

	private $plugin_name;
	private $version;

	public function __construct($plugin_name, $version) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
		
		add_action('init', array($this, 'register_block_type'));
		add_action('enqueue_block_editor_assets', array($this, 'enqueue_block_assets'));
	}

	public function register_block_type() {
		register_block_type('mos-faqs/mos-faq', array(
			'editor_script' => 'mos-faq-block',
			'editor_style'  => 'mos-faq-block-editor',
			'style'         => 'mos-faq-block-style',
			'render_callback' => array($this, 'render_block'),
			'attributes' => array(
				'count' => array(
					'type' => 'number',
					'default' => -1,
				),
				'offset' => array(
					'type' => 'number',
					'default' => 0,
				),
				'author' => array(
					'type' => 'string',
					'default' => '1',
				),
				'source' => array(
					'type' => 'string',
					'default' => 'recent',
				),
				'posts' => array(
					'type' => 'string',
					'default' => '',
				),
				'category' => array(
					'type' => 'string',
					'default' => '',
				),
				'orderby' => array(
					'type' => 'string',
					'default' => '',
				),
				'order' => array(
					'type' => 'string',
					'default' => '',
				),
				'pagination' => array(
					'type' => 'boolean',
					'default' => false,
				),
				'view' => array(
					'type' => 'string',
					'default' => 'accordion',
				),
			),
		));
	}

	public function render_block($attributes) {
		$atts = array(
			'count' => isset($attributes['count']) ? $attributes['count'] : -1,
			'offset' => isset($attributes['offset']) ? $attributes['offset'] : 0,
			'author' => isset($attributes['author']) ? $attributes['author'] : '1',
			'source' => isset($attributes['source']) ? $attributes['source'] : 'recent',
			'posts' => isset($attributes['posts']) ? $attributes['posts'] : '',
			'category' => isset($attributes['category']) ? $attributes['category'] : '',
			'orderby' => isset($attributes['orderby']) ? $attributes['orderby'] : '',
			'order' => isset($attributes['order']) ? $attributes['order'] : '',
			'pagination' => isset($attributes['pagination']) ? $attributes['pagination'] : false,
			'view' => isset($attributes['view']) ? $attributes['view'] : 'accordion',
		);

		$shortcode_output = do_shortcode('[mos_faq ' . $this->atts_to_string($atts) . ']');

		return $shortcode_output;
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

	public function enqueue_block_assets() {
		$asset_path = plugin_dir_path(MOS_FAQS_MAIN_FILE) . 'assets/build/';

		wp_enqueue_script(
			'mos-faq-block',
			plugins_url('assets/build/mos-faq-block.js', MOS_FAQS_MAIN_FILE),
			array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-api-fetch', 'wp-server-side-render'),
			$this->version,
			true
		);

		if (file_exists($asset_path . 'mos-faq-block.css')) {
			wp_enqueue_style(
				'mos-faq-block-editor',
				plugins_url('assets/build/mos-faq-block.css', MOS_FAQS_MAIN_FILE),
				array('wp-edit-blocks'),
				$this->version
			);
		}
	}
}
