<?php

namespace MosPress\MosFaqs\Core;
if ( ! defined( 'ABSPATH' ) ) exit;

class More
{
	protected $options;

	public function __construct()
	{
		$this->options = mos_faqs_get_option();
		if (isset($this->options['more']['enable_scripts']) && $this->options['more']['enable_scripts'] == 1) {
			// Add custom tab to product data panel
			add_action('wp_head', [$this, 'add_header_script'], 9999);
			add_action('wp_footer', [$this, 'add_footer_script'], 9999);
		}
	}

	//add_action('woocommerce_init', $plugin_public, 'ultimate_product_badge_for_woocommerce_add_badge', 9);
	public function add_header_script()
	{
		if (isset($this->options['more']['header_content']) && !empty($this->options['more']['header_content'])) {
			echo wp_kses($this->options['more']['header_content'], \MosPress\MosFaqs\Helpers\Utils::get_header_footer_kses());
		}
	}
	public function add_footer_script()
	{
		if (isset($this->options['more']['footer_content']) && !empty($this->options['more']['footer_content'])) {
			echo wp_kses($this->options['more']['footer_content'], \MosPress\MosFaqs\Helpers\Utils::get_header_footer_kses());
		}
		if (isset($this->options['more']['css']) && !empty($this->options['more']['css'])) {
			echo '<style id="mos_faqs_style">' . wp_kses_post($this->options['more']['css']) . '</style>';
		}
		if (isset($this->options['more']['js']) && !empty($this->options['more']['js'])) {
			echo '<script id="mos_faqs_script">' . wp_kses_post($this->options['more']['js']) . '</script>';
		}
	}
}



