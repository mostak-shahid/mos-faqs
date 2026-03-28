<?php

namespace MosPress\MosFaqs\Public;

defined('ABSPATH') || exit;


/**
 * Structured Data for FAQs
 *
 * Generates schema.org/FAQPage microdata in both JSON-LD and Microdata formats
 *
 * @package    Mos_Faqs
 * @subpackage Mos_Faqs/public
 * @author     Md. Mostak Shahid
 * @since      3.0.0
 */
class StructuredData {

	/**
	 * Generate FAQ schema in JSON-LD format
	 *
	 * @param array $faqs Array of FAQ post objects
	 * @return string JSON-LD script tag
	 */
	public static function generate_json_ld($faqs) {
		if (empty($faqs)) {
			return '';
		}

		$schema_data = array(
			'@context' => 'https://schema.org',
			'@type' => 'FAQPage',
			'mainEntity' => array(),
		);

		foreach ($faqs as $faq) {
			$question = array(
				'@type' => 'Question',
				'name' => get_the_title($faq->ID),
			);

			$content = self::get_faq_content($faq->ID);
			if (!empty($content)) {
				$question['acceptedAnswer'] = array(
					'@type' => 'Answer',
					'text' => $content,
				);
			}

			$schema_data['mainEntity'][] = $question;
		}

		$json_data = wp_json_encode($schema_data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

		return '<script type="application/ld+json">' . $json_data . '</script>';
	}

	/**
	 * Generate FAQ microdata attributes for HTML elements
	 *
	 * @param object $faq FAQ post object
	 * @return array Microdata attributes
	 */
	public static function generate_microdata_attributes($faq) {
		return array(
			'itemscope' => '',
			'itemtype' => 'https://schema.org/Question',
			'itemprop' => 'mainEntity',
		);
	}

	/**
	 * Generate container microdata attributes
	 *
	 * @return array Container microdata attributes
	 */
	public static function generate_container_microdata() {
		return array(
			'itemscope' => '',
			'itemtype' => 'https://schema.org/FAQPage',
		);
	}

	/**
	 * Get FAQ content with proper formatting
	 *
	 * @param int $post_id Post ID
	 * @return string Sanitized FAQ content
	 */
	private static function get_faq_content($post_id) {
		$content = get_post_field('post_content', $post_id);

		$content = apply_filters('the_content', $content);
		$content = str_replace(']]>', ']]&gt;', $content);

		$content = wp_strip_all_tags($content);
		$content = trim($content);

		$content = preg_replace('/\s+/', ' ', $content);

		return $content;
	}

	/**
	 * Generate complete FAQ structured data
	 *
	 * @param array $faqs Array of FAQ post objects
	 * @return array Both JSON-LD and Microdata HTML
	 */
	public static function generate_faq_schema($faqs) {
		return array(
			'json_ld' => self::generate_json_ld($faqs),
			'container_attributes' => self::generate_container_microdata(),
		'item_attributes' => self::generate_microdata_attributes(!empty($faqs) ? $faqs[0] : null),
		'content itemprop' => 'text',
			'name itemprop' => 'name',
			'answer_itemprop' => 'acceptedAnswer',
			'answer_itemtype' => 'https://schema.org/Answer',
		);
	}

	/**
	 * Sanitize schema data
	 *
	 * @param string $data Raw data
	 * @return string Sanitized data
	 */
	private static function sanitize_schema_data($data) {
		return wp_kses_post($data);
	}
}
