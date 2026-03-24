<?php

namespace MosPress\MosFaqs\Admin;
class Post_Type
{

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
    public function __construct($plugin_name, $version)
	{
        $this->plugin_name = $plugin_name;
        $this->version = $version;
        add_action('init', array($this, 'register_qa_post_type'));
        add_action('init', array($this, 'register_faq_category_taxonomy'));
        add_action('init', array($this, 'register_faq_tag_taxonomy'));
    }

    public function register_qa_post_type()
    {
        $labels = array(
            'name'                  => __('FAQs', 'mos-faqs'),
            'singular_name'         => __('FAQ', 'mos-faqs'),
            'menu_name'             => __('FAQs', 'mos-faqs'),
            'name_admin_bar'        => __('FAQ', 'mos-faqs'),
            'add_new'               => __('Add New', 'mos-faqs'),
            'add_new_item'          => __('Add New FAQ', 'mos-faqs'),
            'new_item'              => __('New FAQ', 'mos-faqs'),
            'edit_item'             => __('Edit FAQ', 'mos-faqs'),
            'view_item'             => __('View FAQ', 'mos-faqs'),
            'all_items'             => __('All FAQs', 'mos-faqs'),
            'search_items'          => __('Search FAQs', 'mos-faqs'),
            'parent_item_colon'     => __('Parent FAQs:', 'mos-faqs'),
            'not_found'             => __('No FAQs found.', 'mos-faqs'),
            'not_found_in_trash'    => __('No FAQs found in Trash.', 'mos-faqs'),
            'featured_image'        => __('FAQ Image', 'mos-faqs'),
            'set_featured_image'    => __('Set FAQ image', 'mos-faqs'),
            'remove_featured_image' => __('Remove FAQ image', 'mos-faqs'),
            'use_featured_image'    => __('Use as FAQ image', 'mos-faqs'),
            'archives'              => __('FAQ archives', 'mos-faqs'),
            'insert_into_item'      => __('Insert into FAQ', 'mos-faqs'),
            'uploaded_to_this_item' => __('Uploaded to this FAQ', 'mos-faqs'),
            'filter_items_list'     => __('Filter FAQs list', 'mos-faqs'),
            'items_list_navigation' => __('FAQs list navigation', 'mos-faqs'),
            'items_list'            => __('FAQs list', 'mos-faqs'),
        );

        $args = array(
            'labels'             => $labels,
            'description'        => __('FAQ post type.', 'mos-faqs'),
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => array('slug' => 'qa'),
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => null,
            'menu_icon'          => 'dashicons-editor-help',
            'supports'           => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
            'show_in_rest'       => true,
        );

        register_post_type('qa', $args);
    }

    public function register_faq_category_taxonomy()
    {
        $labels = array(
            'name'                       => __('FAQ Categories', 'mos-faqs'),
            'singular_name'              => __('FAQ Category', 'mos-faqs'),
            'search_items'               => __('Search FAQ Categories', 'mos-faqs'),
            'popular_items'              => __('Popular FAQ Categories', 'mos-faqs'),
            'all_items'                  => __('All FAQ Categories', 'mos-faqs'),
            'parent_item'                => __('Parent FAQ Category', 'mos-faqs'),
            'parent_item_colon'          => __('Parent FAQ Category:', 'mos-faqs'),
            'edit_item'                  => __('Edit FAQ Category', 'mos-faqs'),
            'view_item'                  => __('View FAQ Category', 'mos-faqs'),
            'update_item'                => __('Update FAQ Category', 'mos-faqs'),
            'add_new_item'               => __('Add New FAQ Category', 'mos-faqs'),
            'new_item_name'              => __('New FAQ Category Name', 'mos-faqs'),
            'separate_items_with_commas' => __('Separate FAQ categories with commas', 'mos-faqs'),
            'add_or_remove_items'        => __('Add or remove FAQ categories', 'mos-faqs'),
            'choose_from_most_used'      => __('Choose from the most used FAQ categories', 'mos-faqs'),
            'not_found'                  => __('No FAQ categories found.', 'mos-faqs'),
            'no_terms'                   => __('No FAQ categories', 'mos-faqs'),
            'menu_name'                  => __('FAQ Categories', 'mos-faqs'),
            'items_list_navigation'      => __('FAQ categories list navigation', 'mos-faqs'),
            'items_list'                 => __('FAQ categories list', 'mos-faqs'),
            'most_used'                  => __('Most Used', 'mos-faqs'),
            'back_to_items'              => __('&larr; Back to FAQ Categories', 'mos-faqs'),
        );

        $args = array(
            'labels'            => $labels,
            'hierarchical'      => true,
            'public'            => true,
            'show_ui'           => true,
            'show_admin_column' => true,
            'show_in_rest'      => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'faq-category'),
        );

        register_taxonomy('faq-category', array('qa'), $args);
    }

    public function register_faq_tag_taxonomy()
    {
        $labels = array(
            'name'                       => __('FAQ Tags', 'mos-faqs'),
            'singular_name'              => __('FAQ Tag', 'mos-faqs'),
            'search_items'               => __('Search FAQ Tags', 'mos-faqs'),
            'popular_items'              => __('Popular FAQ Tags', 'mos-faqs'),
            'all_items'                  => __('All FAQ Tags', 'mos-faqs'),
            'parent_item'                => null,
            'parent_item_colon'          => null,
            'edit_item'                  => __('Edit FAQ Tag', 'mos-faqs'),
            'view_item'                  => __('View FAQ Tag', 'mos-faqs'),
            'update_item'                => __('Update FAQ Tag', 'mos-faqs'),
            'add_new_item'               => __('Add New FAQ Tag', 'mos-faqs'),
            'new_item_name'              => __('New FAQ Tag Name', 'mos-faqs'),
            'separate_items_with_commas' => __('Separate FAQ tags with commas', 'mos-faqs'),
            'add_or_remove_items'        => __('Add or remove FAQ tags', 'mos-faqs'),
            'choose_from_most_used'      => __('Choose from the most used FAQ tags', 'mos-faqs'),
            'not_found'                  => __('No FAQ tags found.', 'mos-faqs'),
            'no_terms'                   => __('No FAQ tags', 'mos-faqs'),
            'menu_name'                  => __('FAQ Tags', 'mos-faqs'),
            'items_list_navigation'      => __('FAQ tags list navigation', 'mos-faqs'),
            'items_list'                 => __('FAQ tags list', 'mos-faqs'),
            'most_used'                  => __('Most Used', 'mos-faqs'),
            'back_to_items'              => __('&larr; Back to FAQ Tags', 'mos-faqs'),
        );

        $args = array(
            'labels'            => $labels,
            'hierarchical'      => false,
            'public'            => true,
            'show_ui'           => true,
            'show_admin_column' => true,
            'show_in_rest'      => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'faq-tag'),
        );

        register_taxonomy('faq-tag', array('qa'), $args);
    }
}
