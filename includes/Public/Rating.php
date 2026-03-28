<?php

namespace MosPress\MosFaqs\Public;

defined('ABSPATH') || exit;

/**
 * FAQ Rating System
 *
 * Handles thumbs up/down voting for FAQ posts with IP-based restrictions
 *
 * @package    Mos_Faqs
 * @subpackage Mos_Faqs/public
 * @author     Md. Mostak Shahid
 * @since      3.0.0
 */
class Rating {

	/**
	 * Get user's IP address
	 *
	 * @return string IP address
	 */
	private static function get_user_ip() {
		if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
			$ip = $_SERVER['HTTP_CLIENT_IP'];
		} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
			$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
		} else {
			$ip = $_SERVER['REMOTE_ADDR'];
		}
		return sanitize_text_field($ip);
	}

	/**
	 * Get rating key for a post and IP
	 *
	 * @param int $post_id Post ID
	 * @param string $ip User IP address
	 * @return string Rating key
	 */
	private static function get_rating_key($post_id, $ip) {
		return 'mos_faq_' . $post_id . '_' . md5($ip);
	}

	/**
	 * Check if user has already rated this FAQ
	 *
	 * @param int $post_id Post ID
	 * @return bool True if already rated
	 */
	public static function has_rated($post_id) {
		$ip = self::get_user_ip();
		$key = self::get_rating_key($post_id, $ip);
		return get_transient($key) !== false;
	}

	/**
	 * Get FAQ ratings
	 *
	 * @param int $post_id Post ID
	 * @return array Ratings data
	 */
	public static function get_ratings($post_id) {
		$thumbs_up = get_post_meta($post_id, '_mos_faq_thumbs_up', true);
		$thumbs_down = get_post_meta($post_id, '_mos_faq_thumbs_down', true);

		$user_rated = self::has_rated($post_id);
		$user_vote = null;

		if ($user_rated) {
			$ip = self::get_user_ip();
			$key = self::get_rating_key($post_id, $ip);
			$user_vote = get_transient($key);
		}

		return array(
			'up' => absint($thumbs_up),
			'down' => absint($thumbs_down),
			'net' => absint($thumbs_up) - absint($thumbs_down),
			'user_rated' => $user_rated,
			'user_vote' => $user_vote,
		);
	}

	/**
	 * Register vote for a FAQ
	 *
	 * @param int $post_id Post ID
	 * @param string $vote 'up' or 'down'
	 * @return array Result with success status and message
	 */
	public static function vote($post_id, $vote) {
		$post = get_post($post_id);

		if (!$post || $post->post_type !== 'qa') {
			return array(
				'success' => false,
				'message' => __('Invalid FAQ post.', 'mos-faqs'),
			);
		}

		if ($vote !== 'up' && $vote !== 'down') {
			return array(
				'success' => false,
				'message' => __('Invalid vote type.', 'mos-faqs'),
			);
		}

		if (self::has_rated($post_id)) {
			return array(
				'success' => false,
				'message' => __('You have already rated this FAQ.', 'mos-faqs'),
			);
		}

		$ip = self::get_user_ip();
		$key = self::get_rating_key($post_id, $ip);

		$meta_key = $vote === 'up' ? '_mos_faq_thumbs_up' : '_mos_faq_thumbs_down';
		$current_count = get_post_meta($post_id, $meta_key, true);
		$new_count = absint($current_count) + 1;

		update_post_meta($post_id, $meta_key, $new_count);

		set_transient($key, $vote, DAY_IN_SECONDS * 30);

		return array(
			'success' => true,
			'message' => __('Thank you for your rating!', 'mos-faqs'),
		);
	}
}
