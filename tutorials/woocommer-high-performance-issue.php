<?php
/*
Solve the below issue
WooCommerce has detected that some of your active plugins are incompatible with currently enabled WooCommerce features.
*/
// Add the below lines into plugin header
 * WC requires at least: 8.7.1
 * WC tested up to: 9.1.4
 * Woo:
// Add the below lines to plugin main fils
add_action('before_woocommerce_init', function () {
	if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
		\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
	}
});
