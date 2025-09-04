<?php
/**
 * Export Custom Post Type with Taxonomies and Metadata to JSON.
 */
function export_custom_post_type_data() {
    if (!is_admin()) return; // Restrict to admin area
    if (!current_user_can('manage_options')) return; // Check permissions

    // Specify the custom post type
    $post_type = 'qa';
    $args = [
        'post_type' => $post_type,
        'posts_per_page' => -1,
    ];

    // Get all posts of the custom post type
    $posts = get_posts($args);
    $export_data = [];

    foreach ($posts as $post) {
        // Get taxonomies and terms associated with the post
        $taxonomies = get_object_taxonomies($post_type, 'names');
        $terms = [];
        
        foreach ($taxonomies as $taxonomy) {
            $terms[$taxonomy] = wp_get_post_terms($post->ID, $taxonomy, ['fields' => 'all']);
        }

        // Get all post metadata
        $metadata = get_post_meta($post->ID);

        // Prepare export data for each post
        $export_data[] = [
            'post' => $post,
            'terms' => $terms,
            'meta' => $metadata,
        ];
    }

    // Convert data to JSON and force download
    header('Content-disposition: attachment; filename=qa_export.json');
    header('Content-type: application/json');
    echo json_encode($export_data);
    exit;
}
add_action('admin_post_export_custom_post_type_data', 'export_custom_post_type_data');

// Add admin page for export
function export_custom_post_type_menu() {
    add_submenu_page('tools.php', 'Export QA', 'Export QA', 'manage_options', 'export-qa', function() {
        echo '<div class="wrap"><h1>Export Custom Post Type: QA</h1>';
        echo '<a href="' . admin_url('admin-post.php?action=export_custom_post_type_data') . '" class="button button-primary">Export QA Data</a>';
        echo '</div>';
    });
}
add_action('admin_menu', 'export_custom_post_type_menu');



/**
 * Import Custom Post Type with Taxonomies and Metadata from JSON.
 */
function import_custom_post_type_data() {
    if (!is_admin()) return; // Restrict to admin area
    if (!current_user_can('manage_options')) return; // Check permissions

    if (isset($_FILES['import_file'])) {
        $file = $_FILES['import_file']['tmp_name'];
        $data = json_decode(file_get_contents($file), true);

        foreach ($data as $item) {
            $post_data = (array)$item['post'];
            $post_data['ID'] = 0; // Create a new post

            // Insert post
            $post_id = wp_insert_post($post_data);

            // Restore taxonomies/terms
            foreach ($item['terms'] as $taxonomy => $terms) {
                $term_ids = wp_set_object_terms($post_id, wp_list_pluck($terms, 'slug'), $taxonomy);
            }

            // Restore metadata
            foreach ($item['meta'] as $meta_key => $meta_values) {
                foreach ($meta_values as $meta_value) {
                    add_post_meta($post_id, $meta_key, maybe_unserialize($meta_value));
                }
            }
        }

        echo "<div class='notice notice-success'><p>Import completed successfully!</p></div>";
    }

    echo '<div class="wrap"><h1>Import QA Data</h1>';
    echo '<form method="post" enctype="multipart/form-data">';
    echo '<input type="file" name="import_file" required />';
    echo '<button type="submit" class="button button-primary">Import QA Data</button>';
    echo '</form></div>';
}

add_action('admin_menu', function() {
    add_submenu_page('tools.php', 'Import QA', 'Import QA', 'manage_options', 'import-qa', 'import_custom_post_type_data');
});

