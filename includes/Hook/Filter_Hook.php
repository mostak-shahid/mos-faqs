<?php
namespace MosPress\MosFaqs\Hook;

if ( ! defined( 'ABSPATH' ) ) exit;

class Filter_Hook {

    private $plugin_slug;      // mos-faqs
    private $plugin_basename;  // mos-faqs/mos-faqs.php
    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __construct() {

        // Automatically detect plugin slug + basename
        $this->plugin_basename = plugin_basename( MOS_FAQS_MAIN_FILE ); 
        $this->plugin_slug     = dirname( $this->plugin_basename );

        /**
         * Now supports:
         * plugin_action_links_mos-faqs/mos-faqs.php
         * WITHOUT hard-coding strings.
         */
        add_filter(
            "plugin_action_links_{$this->plugin_basename}",
            [ $this, 'mos_faqs_add_action_links' ]
        );

        add_filter('admin_body_class', [ $this, 'mos_faqs_admin_body_class' ]);

        add_filter('mos_faqs_default_options_modify', [ $this, 'modify_mos_faqs_default_options' ]);
        add_filter('mos_faqs_default_colors_modify', [ $this, 'modify_mos_faqs_default_colors' ]);
        add_filter('mos_faqs_default_gradients_modify', [ $this, 'modify_mos_faqs_default_gradients' ]);
        add_filter('mos_faqs_default_tables_modify', [ $this, 'modify_mos_faqs_default_tables' ]);

        /**
         * Allow PRO add-ons or Module Federation remotes to inject links dynamically
         */
        add_filter('mos_faqs_action_links_extra', '__return_empty_array');

        

    }

    /**
     * Add Settings link + dynamic injected links
     */
    public function mos_faqs_add_action_links( $links ) {

        $default_links = [
            '<a href="' . admin_url("admin.php?page={$this->plugin_slug}") . '">' .
                esc_html__('Settings', 'mos-faqs') .
            '</a>',
            '<a href="https://mostak-shahid.github.io/plugins/mos-faqs.html" target="_blank">' .
                esc_html__('Docs', 'mos-faqs') .
            '</a>',
            '<a href="https://www.facebook.com/mospressbd" target="_blank">' .
                esc_html__('Community', 'mos-faqs') .
            '</a>',
        ];

        /**
         * Dynamic links injected from PRO plugin or remote MF
         * Example:
         * add_filter( 'mos_faqs_action_links_extra', function($links) {
         *     $links[] = '<a href="https://example.com/pro">Go Pro</a>';
         *     return $links;
         * });
         */
        $extra_links = apply_filters('mos_faqs_action_links_extra', []);

        return array_merge( $default_links, $extra_links, $links );
    }

    /**
     * Add body classes on plugin pages
     */
    public function mos_faqs_admin_body_class( $classes ) {
        // error_log("Filter_Hook constructor called");
        if (function_exists('mos_faqs_is_plugin_page') && mos_faqs_is_plugin_page()) {
            $classes .= ' ' . sanitize_html_class( $this->plugin_slug . '-settings-template' ) . ' ';
        }
        return $classes;
    }

    /**
     * Default options filter (still dynamic)
     */
    public function modify_mos_faqs_default_options( $opts ) {
        $defaults = [
            
            'components' => [
                'free' => [
                    'background' => [],
                    'boxshadow' => [
                        'enabled' => false,
                        'inset' => false,
                    ],
                    // 'color' => '#ffffff',
                    'colorpicker' => '',
                    // 'gradient' => 'linear-gradient(135deg, #ff8c00 0%, #fcff41 100%)',
                    'gradient' => '',
                    'font' => [
                        'enabled' => false,
                    ],
                    'media_uploader' => [],
                    'multicolor' => [],
                    'textshadow' => [
                        'enabled' => false,
                    ],
                    'unitcontrol' => '',
                ],
                'pro' => [
                    'background' => [],
                    'boxshadow' => [
                        'enabled' => false,
                        'inset' => false,
                    ],
                    // 'color' => '#ffffff',
                    'colorpicker' => '',
                    // 'gradient' => 'linear-gradient(135deg, #ff8c00 0%, #fcff41 100%)',
                    'gradient' => '',
                    'font' => [
                        'enabled' => false,
                    ],
                    'media_uploader' => [],
                    'multicolor' => [],
                    'textshadow' => [
                        'enabled' => false,
                    ],
                    'unitcontrol' => '',
                ],
            ],
            'style' => [
                'faq_unit' => [
                    'background' => [],
                    'color' => [],
                    'border' => [],
                    'padding' => '',
                    'margin' => '',
                    'boxshadow' => [],
                ],
                'faq_title' => [
                    'background' => [],
                    'color' => [],
                    'font' => [],
                    'border' => [],
                    'padding' => '',
                    'margin' => '',
                    'boxshadow' => [],
                    'textshadow' => [],
                ],
                'faq_content' => [
                    'background' => [],
                    'color' => [],
                    'font' => [],
                    'border' => [],
                    'padding' => '',
                    'margin' => '',
                    'boxshadow' => [],
                    'textshadow' => [],
                ],
                'faq_icon' => [
                    'icon' => '',
                    'background' => [],
                    'color' => [],
                    'rotation' => 0,
                    'height' => '',
                    'width' => '',
                ],
                'faq_misc' => [
                    'hide_category' => false,
                    'hide_author' => false,
                    'hide_date' => false,
                    'hide_rating' => false,
                ],
            ],
            'basic' => [
                'text' => '',
                'textarea' => '',
                'radio' => 'radio-1',
                'select' => 'select-2',
                'number' => 10,
                'color' => '#ff0000',
                'checkbox' => true,
                'switch' => true,
                'date' => '',
                'time' => '',
                'datetime' => '',

            ],
            'array' => [
                'checkbox' => ['checkbox-1', 'checkbox-3']
            ],
            'more' => [
                'enable_scripts' => false,
                'css' => '/* CSS Code Here */',
                'js' => '// JavaScript Code Here',
                'header_content' => '<!-- Content inside HEAD tag -->',
                'footer_content' => '<!-- Content inside BODY tag -->',
            ],
            'tools' => [
                'hide_plugin' => false, // delete, uninstall, none
                'self_defense' => false, // delete, uninstall, none
                'delete_data_on' => 'none', // delete, uninstall, none
            ]
        ];
        return wp_parse_args( $opts, $defaults );
    }

    /**
     * Default options filter (still dynamic)
     */
    public function modify_mos_faqs_default_colors( $opts ) {
        $defaults = [
            ['name' => esc_html__('Black', 'mos-faqs'), 'color' => '#000000'],
            ['name' => esc_html__('Blue', 'mos-faqs'), 'color' => '#0073AA'],
            ['name' => esc_html__('Cyan', 'mos-faqs'), 'color' => '#00A0D2'],
            ['name' => esc_html__('Deep Blue', 'mos-faqs'), 'color' => '#005075'],
            ['name' => esc_html__('Deep Purple', 'mos-faqs'), 'color' => '#23036A'],
            ['name' => esc_html__('Gold', 'mos-faqs'), 'color' => '#FFB900'],
            ['name' => esc_html__('Gray', 'mos-faqs'), 'color' => '#888888'],
            ['name' => esc_html__('Green', 'mos-faqs'), 'color' => '#008000'],
            ['name' => esc_html__('Light Gray', 'mos-faqs'), 'color' => '#E6E6E6'],
            ['name' => esc_html__('Lime Green', 'mos-faqs'), 'color' => '#82C91E'],
            ['name' => esc_html__('Navy Blue', 'mos-faqs'), 'color' => '#001F3F'],
            ['name' => esc_html__('Orange', 'mos-faqs'), 'color' => '#FF6600'],
            ['name' => esc_html__('Pink', 'mos-faqs'), 'color' => '#FF4081'],
            ['name' => esc_html__('Purple', 'mos-faqs'), 'color' => '#800080'],
            ['name' => esc_html__('Red', 'mos-faqs'), 'color' => '#FF0000'],
            ['name' => esc_html__('Silver', 'mos-faqs'), 'color' => '#C0C0C0'],
            ['name' => esc_html__('White', 'mos-faqs'), 'color' => '#FFFFFF'],
            ['name' => esc_html__('Yellow', 'mos-faqs'), 'color' => '#FFFF00'],
        ];
        return wp_parse_args( $opts, $defaults );
    }

    /**
     * Default options filter (still dynamic)
     */
    public function modify_mos_faqs_default_gradients( $opts ) {
        $defaults = [
            ['name' => esc_html__('Blue to Purple', 'mos-faqs'), 'gradient' => 'linear-gradient(135deg, #0064fa 0%, #800080 100%)'],
            ['name' => esc_html__('Pink to Orange', 'mos-faqs'), 'gradient' => 'linear-gradient(135deg, #ff4081 0%, #ff6600 100%)'],
            ['name' => esc_html__('Cyan to Blue', 'mos-faqs'), 'gradient' => 'linear-gradient(135deg, #00a0d2 0%, #0073aa 100%)'],
            ['name' => esc_html__('Lime Green to Green', 'mos-faqs'), 'gradient' => 'linear-gradient(135deg, #82c91e 0%, #008000 100%)'],
            ['name' => esc_html__('Gold to Orange', 'mos-faqs'), 'gradient' => 'linear-gradient(135deg, #ffb900 0%, #ff6600 100%)'],
            ['name' => esc_html__('Red to Deep Purple', 'mos-faqs'), 'gradient' => 'linear-gradient(135deg, #ff0000 0%, #23036a 100%)'],
            ['name' => esc_html__('Yellow to Lime Green', 'mos-faqs'), 'gradient' => 'linear-gradient(135deg, #ffff00 0%, #82c91e 100%)'],
            ['name' => esc_html__('Silver to Gray', 'mos-faqs'), 'gradient' => 'linear-gradient(135deg, #c0c0c0 0%, #888888 100%)'],
	    ];
        return wp_parse_args( $opts, $defaults );
    }

    /**
     * Default options filter (still dynamic)
     */
    public function modify_mos_faqs_default_tables( $opts ) {
        $defaults = [
            ['mos_faqs_logs'],
	    ];
        return wp_parse_args( $opts, $defaults );
    }
}
