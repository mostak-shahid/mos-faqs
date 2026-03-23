<?php
namespace MosPress\MosFaqs\Helpers;

class Utils {

	public static function get_client_ip()
	{
		if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
			return sanitize_text_field( wp_unslash($_SERVER['HTTP_CLIENT_IP']));
		} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
			return sanitize_text_field( wp_unslash($_SERVER['HTTP_X_FORWARDED_FOR']));
		} elseif (!empty($_SERVER['REMOTE_ADDR'])) {
			return sanitize_text_field( wp_unslash($_SERVER['REMOTE_ADDR']));
		}
	}

	public static function get_header_footer_kses() {
		return array(
			'script' => array(
				'type' => true,
				'src' => true,
				'async' => true,
				'defer' => true,
				'crossorigin' => true,
				'integrity' => true,
				'nonce' => true,
			),
			'style' => array(
				'type' => true,
				'media' => true,
			),
			'link' => array(
				'rel' => true,
				'href' => true,
				'type' => true,
				'media' => true,
				'crossorigin' => true,
				'integrity' => true,
			),
			'meta' => array(
				'name' => true,
				'content' => true,
				'charset' => true,
				'http-equiv' => true,
				'property' => true,
			),
		);
	}
}