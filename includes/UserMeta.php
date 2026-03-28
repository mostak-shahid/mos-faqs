<?php

namespace MosPress\MosFaqs;

defined('ABSPATH') || exit;

class UserMeta {

    public function __construct() {
        add_action('admin_enqueue_scripts', [$this, 'enqueue_profile_assets']);
        add_action('rest_api_init', [$this, 'register_rest_routes']);

        add_action('show_user_profile', [$this, 'render_field']);
        add_action('edit_user_profile', [$this, 'render_field']);

        add_action('personal_options_update', [$this, 'save_field']);
        add_action('edit_user_profile_update', [$this, 'save_field']);
    }


    public function enqueue_profile_assets($hook) {

        // Only load on profile pages
        if ($hook !== 'profile.php' && $hook !== 'user-edit.php') {
            return;
        }

        // wp_enqueue_style(
        //     'mos-faqs-profile',
        //     plugins_url('assets/profile.css', dirname(__FILE__)),
        //     [],
        //     filemtime(plugin_dir_path(dirname(__FILE__)) . 'assets/profile.css')
        // );

        wp_enqueue_script(
            'mos-faqs-profile',
            plugins_url('assets/build/profile.js', dirname(__FILE__)),
            ['jquery'],
            time(),
            true
        );

        wp_localize_script(
            'mos-faqs-profile',
            'mos_faqs_profile_obj',
            [
                'user_id' => get_current_user_id(),
                'nonce' => wp_create_nonce('wp_rest'),
                'api_url' => rest_url('mos-faqs/v1'),
            ]
        );
    }

    /**
     * Render custom field
     */
    public function render_field($user) {
        ?>
        <h2><?php echo esc_html__('Mos FAQs Info', 'mos-faqs'); ?></h2>
        <div id="mos-faqs-profile-react-app"></div>
        <?php wp_nonce_field( 'mos_faqs_profile_action', 'mos_faqs_profile_field' ); ?>

        <!-- Hidden inputs that React will populate -->
        <input type="hidden" name="mos_faqs_switch" id="mos_faqs_switch_hidden" value="<?php echo esc_attr(get_user_meta($user->ID, 'mos_faqs_switch', true) ?: '0'); ?>" />
        <input type="hidden" name="mos_faqs_custom_input" id="mos_faqs_custom_input_hidden" value="<?php echo esc_attr(get_user_meta($user->ID, 'mos_faqs_custom_input', true) ?: ''); ?>" />

        <!-- Media hidden inputs -->
        <input type="hidden" name="mos_faqs_media_id" id="mos_faqs_media_id_hidden" value="<?php echo esc_attr(get_user_meta($user->ID, 'mos_faqs_media_id', true) ?: '0'); ?>" />
        <input type="hidden" name="mos_faqs_media_url" id="mos_faqs_media_url_hidden" value="<?php echo esc_attr(get_user_meta($user->ID, 'mos_faqs_media_url', true) ?: ''); ?>" />

        <table class="form-table">
            <tr>
                <th>
                    <label for="mos_faqs_company">
                        <?php echo esc_html__('Company Name', 'mos-faqs'); ?>
                    </label>
                </th>
                <td>
                    <input
                        type="text"
                        name="mos_faqs_company"
                        id="mos_faqs_company"
                        value="<?php echo esc_attr(get_user_meta($user->ID, 'mos_faqs_company', true)); ?>"
                        class="regular-text"
                    />
                    <p class="description">
                        <?php echo esc_html__('Enter the user\'s company name.', 'mos-faqs'); ?>
                    </p>
                </td>
            </tr>
        </table>
        <?php
    }

    /**
     * Save custom field
     */
    public function save_field($user_id) {

        if (!current_user_can('edit_user', $user_id)) {
            return;
        }
        if ( isset( $_POST['mos_faqs_profile_field'] ) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['mos_faqs_profile_field'])), 'mos_faqs_profile_action' ) ) {
            // Save Company Name
            $mos_faqs_company = isset($_POST['mos_faqs_company']) ? sanitize_text_field(wp_unslash($_POST['mos_faqs_company'])) : '';
            update_user_meta(
                $user_id,
                'mos_faqs_company',
                $mos_faqs_company
            );

            // Save Switch value (mos_faqs_switch)
            $mos_faqs_switch = isset($_POST['mos_faqs_switch']) ? sanitize_text_field(wp_unslash($_POST['mos_faqs_switch'])) : '0';
            update_user_meta(
                $user_id,
                'mos_faqs_switch',
                $mos_faqs_switch
            );

            // Save Custom Input value (mos_faqs_custom_input)
            $mos_faqs_custom_input = isset($_POST['mos_faqs_custom_input']) ? sanitize_text_field(wp_unslash($_POST['mos_faqs_custom_input'])) : '';
            update_user_meta(
                $user_id,
                'mos_faqs_custom_input',
                $mos_faqs_custom_input
            );

            /*
            'mos_faqs_media' => [
                'id' => get_user_meta($user_id, 'mos_faqs_media_id', true) ?: 0,
                'url' => get_user_meta($user_id, 'mos_faqs_media_url', true) ?: '',
                'thumbnail' => get_user_meta($user_id, 'mos_faqs_media_url', true) ?: '',
            ],
            */

            // Save Media ID
            $mos_faqs_media_id = isset($_POST['mos_faqs_media_id']) ? sanitize_text_field(wp_unslash($_POST['mos_faqs_media_id'])) : '0';
            $mos_faqs_media_url = isset($_POST['mos_faqs_media_url']) ? esc_url_raw(wp_unslash($_POST['mos_faqs_media_url'])) : '';
            update_user_meta(
                $user_id,
                'mos_faqs_media',
                [
                    'id' => $mos_faqs_media_id,
                    'url' => $mos_faqs_media_url,
                ]
            );

        }
    }

    /**
     * Register REST API routes
     */
    public function register_rest_routes() {
        register_rest_route(
            MOS_FAQS_REST_API_NAMESPACE,
            '/user-profile-meta',
            [
                'methods' => 'GET',
                'callback' => [$this, 'get_user_profile_meta'],
                'permission_callback' => function() {
                    return is_user_logged_in();
                },
            ]
        );
    }

    /**
     * Get user profile meta via REST API
     */
    public function get_user_profile_meta() {
        $user_id = get_current_user_id();

        if (!$user_id) {
            return new \WP_Error(
                'not_logged_in',
                __('User not logged in', 'mos-faqs'),
                ['status' => 401]
            );
        }

        return [
            'mos_faqs_switch' => get_user_meta($user_id, 'mos_faqs_switch', true) ?: '0',
            'mos_faqs_custom_input' => get_user_meta($user_id, 'mos_faqs_custom_input', true) ?: '',
            'mos_faqs_media' => [
                'id' => get_user_meta($user_id, 'mos_faqs_media_id', true) ?: 0,
                'url' => get_user_meta($user_id, 'mos_faqs_media_url', true) ?: '',
                'thumbnail' => get_user_meta($user_id, 'mos_faqs_media_url', true) ?: '',
            ],
        ];
    }
}
