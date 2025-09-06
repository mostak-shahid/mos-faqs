<?php
if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'rest_api_init', function () {
    register_rest_route('mos-faqs/v1', '/plugins', [
        'methods' => 'GET',
        'callback' => function () {
            $response = wp_remote_get('https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[author]=mostakshahid&request[per_page]=24');
            if (is_wp_error($response)) {
                return new WP_Error('api_error', 'Failed to fetch plugins', ['status' => 500]);
            }
            return json_decode(wp_remote_retrieve_body($response), true);
        },
    ]);
    
    // ✅ Get posts (with embed info)
    // GET /wp-json/mos-faqs/v1/posts?page=1&per_page=10&status=publish&search=hello
    register_rest_route( 'mos-faqs/v1', '/posts', [
        'methods'  => 'GET',
        'callback' => 'mos_faqs_get_posts',
        // 'permission_callback' => function () {
        //     return current_user_can( 'edit_posts' );
        // },
        'args' => [
            'page'     => ['type' => 'integer'],
            'per_page' => ['type' => 'integer'],
            'status'   => ['type' => 'string'],
            'search'   => ['type' => 'string'],
            'orderby'  => ['type' => 'string'], // title|date
            'order'    => ['type' => 'string'], // asc|desc
        ],
    ]);

    // ✅ Change status of a single post
    // POST /wp-json/mos-faqs/v1/post/123/status
    // { "status": "draft" }
    register_rest_route( 'mos-faqs/v1', '/post/(?P<id>\d+)/status', [
        'methods'  => 'POST',
        'callback' => 'mos_faqs_change_post_status',
        'permission_callback' => function () {
            return current_user_can( 'edit_posts' );
        },
        'args' => [
            'status' => [
                'required' => true,
                'type'     => 'string',
                'enum'     => [ 'publish', 'draft', 'trash' ],
            ],
        ],
    ]);

    // ✅ Bulk status change
    // POST /wp-json/mos-faqs/v1/posts/status
    // { "ids": [1,2,3], "status": "trash" }

    register_rest_route( 'mos-faqs/v1', '/posts/status', [
        'methods'  => 'POST',
        'callback' => 'mos_faqs_bulk_change_status',
        'permission_callback' => function () {
            return current_user_can( 'edit_posts' );
        },
        'args' => [
            'ids' => [
                'required' => true,
                'type'     => 'array',
                'items'    => [ 'type' => 'integer' ],
            ],
            'status' => [
                'required' => true,
                'type'     => 'string',
                'enum'     => [ 'publish', 'draft', 'trash' ],
            ],
        ],
    ]);
});
/**
 * Return posts for DataTables (server-side).
 */
function mos_faqs_get_posts( WP_REST_Request $request ) {
    $page     = max( 1, intval( $request->get_param('page') ?: 1 ) );
    $per_page = max( 1, intval( $request->get_param('per_page') ?: 10 ) );
    $status   = sanitize_text_field( $request->get_param('status') ?: 'publish' );
    $search   = sanitize_text_field( $request->get_param('search') ?: '' );

    // Sorting
    $orderby_param = strtolower( sanitize_text_field( $request->get_param('orderby') ?: '' ) );
    $order_param   = strtoupper( sanitize_text_field( $request->get_param('order') ?: 'ASC' ) );
    $allowed_orderby = [
        'title' => 'title',
        'date'  => 'date',
        'id'    => 'ID',
    ];
    $orderby = isset( $allowed_orderby[ $orderby_param ] ) ? $allowed_orderby[ $orderby_param ] : 'date';
    $order   = in_array( $order_param, [ 'ASC', 'DESC' ], true ) ? $order_param : 'DESC';

    $args = [
        'post_type'      => 'post',
        'post_status'    => $status, // publish|draft|trash|etc
        'posts_per_page' => $per_page,
        'paged'          => $page,
        'orderby'        => $orderby,
        'order'          => $order,
        's'              => $search,
        'no_found_rows'  => false, // we need totals for DataTables
    ];

    $query = new WP_Query( $args );

    $rows = [];
    foreach ( $query->posts as $post ) {
        $author_id  = $post->post_author;
        $categories = wp_get_post_terms( $post->ID, 'category', [ 'fields' => 'names' ] );
        $tags       = wp_get_post_terms( $post->ID, 'post_tag', [ 'fields' => 'names' ] );

        $rows[] = [
            'id'    => $post->ID,
            'title' => get_the_title( $post ),
            'date'  => get_the_date( '', $post ),
            'author'=> [
                'id'     => $author_id,
                'name'   => get_the_author_meta( 'display_name', $author_id ),
                'avatar' => get_avatar_url( $author_id, [ 'size' => 24 ] ),
            ],
            'categories' => $categories ?: [],
            'tags'       => $tags ?: [],
            'status'       => get_post_status($post),
        ];
    }

    return [
        'data'  => $rows,
        'total' => (int) $query->found_posts,
        'page'  => (int) $page,
    ];
}

/**
 * Change status for a single post.
 */
function mos_faqs_change_post_status( WP_REST_Request $request ) {
    $post_id = (int) $request['id'];
    $status  = sanitize_text_field( $request['status'] );

    $updated = wp_update_post([
        'ID'          => $post_id,
        'post_status' => $status,
    ], true );

    if ( is_wp_error( $updated ) ) {
        return new WP_Error( 'update_failed', __( 'Failed to update post status', 'mos-faqs' ), [ 'status' => 500 ] );
    }

    return [ 'success' => true, 'post_id' => $post_id, 'status' => $status ];
}

/**
 * Bulk change status of posts.
 */
function mos_faqs_bulk_change_status( WP_REST_Request $request ) {
    $ids    = $request['ids'];
    $status = sanitize_text_field( $request['status'] );

    $updated = [];
    foreach ( $ids as $id ) {
        $result = wp_update_post([
            'ID'          => (int) $id,
            'post_status' => $status,
        ], true );

        if ( ! is_wp_error( $result ) ) {
            $updated[] = (int) $id;
        }
    }

    return [ 'success' => true, 'updated' => $updated, 'status' => $status ];
}
