<?php

namespace MosPress\MosFaqs\Render;
/*for more details
https://kb.wpbakery.com/docs/inner-api/vc_map/
https://github.com/proteusthemes/visual-composer-elements
*/
if ( ! defined( 'ABSPATH' ) ) exit;
use vc_map;
class VC_Element
{
	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct()
	{
        add_action('vc_before_init', [$this, 'mos_faqs_vc']);
    }
    function mos_faqs_vc() {
        vc_map( array(
            "name" => __( "Mos FAQs", "mos-faqs" ),
            "base" => 'mos_faq',
            "class" => "",
            "category" => __( "Mos Elements", "mos-faqs"),
            'icon'     => plugins_url( 'images/mos-vc.png', __FILE__ ),
                    
            "params" => array(
                array(
                    "type" => "textfield",
                    "heading" => __( "Limit", "mos-faqs" ),
                    "param_name" => "limit",
                    "value" => __( "-1", "mos-faqs" ),
                    "description" => __( "number of post to show per page. Default -1.", "mos-faqs" )
                ),
                array(
                    "type" => "textfield",
                    "heading" => __( "Offset", "mos-faqs" ),
                    "param_name" => "offset",
                    "value" => __( "0", "mos-faqs" ),
                    "description" => __( "Number of post to displace or pass over.<br/><b>Warning:</b> Setting the offset parameter overrides/ignores the paged parameter and breaks pagination. The 'offset' parameter is ignored when 'limit'=-1 (show all posts) is used.", "mos-faqs" )
                ),
                array(
                    "type" => "textfield",
                    "holder" => "div",
                    "class" => "mos-faqs-meta mos-faqs-author",
                    "admin_label" => false,
                    "heading" => __( "Author", "mos-faqs" ),
                    "param_name" => "author",
                    "description" => __( "Use author id or comma-separated list of IDs.", "mos-faqs" )
                ),
                array(
                    "type" => "textfield",
                    "holder" => "div",
                    "class" => "mos-faqs-meta mos-faqs-category",
                    "admin_label" => false,
                    "heading" => __( "Categories", "mos-faqs" ),
                    "param_name" => "category",
                    "description" => __( "Category ids from where you like to display posts. Please seperate ids by comma (,).", "mos-faqs" )
                ),
                array(
                    "type" => "textfield",
                    "holder" => "div",
                    "class" => "mos-faqs-meta mos-faqs-tag",
                    "admin_label" => false,
                    "heading" => __( "Tags", "mos-faqs" ),
                    "param_name" => "tag",
                    "description" => __( "Tag ids from where you like to display posts. Please seperate ids by comma (,).", "mos-faqs" )
                ),
                array(
                    "type" => "dropdown",
                    "holder" => "div",
                    "class" => "mos-faqs-meta mos-faqs-order",
                    "admin_label" => false,
                    "heading" => __( "Order", "mos-faqs" ),
                    "param_name" => "order",
                    'value'       => array(
                        'DESC'   => 'DESC',
                        'ASC'   => 'ASC'
                    ),
                    "description" => __( "Designates the ascending or descending order of the 'orderby' parameter. Defaults to 'DESC'.", "mos-faqs" )
                ),
                array(
                    "type" => "dropdown",
                    "holder" => "div",
                    "class" => "mos-faqs-meta mos-faqs-order",
                    "admin_label" => false,
                    "heading" => __( "Order by", "mos-faqs" ),
                    "param_name" => "orderby",
                    'value'       => array(
                        'No order'   => 'none',
                        'Order by post id'   => 'ID',
                        'Order by author'   => 'author',
                        'Order by title'   => 'title',
                        'Order by name'   => 'name',
                        'Order by post type.'   => 'type',
                        'Order by date.'   => 'date',
                        'Order by last modified date.'   => 'modified',
                        'Order by lparent id.'   => 'parent',
                        'Random order.'   => 'rand',
                        'Order by number of comments.'   => 'comment_count',
                    ),
                    "description" => __( "Sort retrieved posts by parameter. Defaults to 'date (post_date)'. One or more options can be passed.", "mos-faqs" )
                ),
                array(
                    "type" => "textfield",
                    "heading" => __( "Container", "mos-faqs" ),
                    "param_name" => "container",
                    "description" => __( "Whether or not to include wrapper.", "mos-faqs" )
                ),
                array(
                    "type" => "textfield",
                    "heading" => __( "Container Class", "mos-faqs" ),
                    "param_name" => "container_class",
                    "description" => __( "Class that is applied to the container.", "mos-faqs" )
                ),
                array(
                    "type" => "textfield",
                    "heading" => __( "Class", "mos-faqs" ),
                    "param_name" => "class",
                    "description" => __( "Class that is applied to the faq body.", "mos-faqs" )
                ),
                array(
                    "type" => "dropdown",
                    "heading" => __( "Grid", "mos-faqs" ),
                    "param_name" => "grid",
                    'value'       => array(
                        'One Grid'   => '1',
                        'Two Grids'   => '2',
                        'Three Grids'   => '3',
                        'Four Grids'   => '4',
                        'Five Grids'   => '5',
                    ),
                    "description" => __( "Range from 1 to 5.", "mos-faqs" )
                ),
                array(
                    "type" => "dropdown",
                    "heading" => __( "Singular", "mos-faqs" ),
                    "param_name" => "singular",
                    'value'       => array(
                        'No'   => '0',
                        'Yes'   => '1',
                    ),
                    "description" => __( "Whether or not to allow to open singularly.", "mos-faqs" )
                ),
                array(
                    "type" => "dropdown",
                    "heading" => __( "Pagination", "mos-faqs" ),
                    "param_name" => "pagination",
                    'value'       => array(
                        'No'   => '0',
                        'Yes'   => '1',
                    ),
                    "description" => __( "Whether or not to include pagination.", "mos-faqs" )
                ),
                array(
                    "type" => "dropdown",
                    "holder" => "div",
                    "class" => "mos-faqs-meta mos-faqs-view",
                    "admin_label" => false,
                    "heading" => __( "View", "mos-faqs" ),
                    "param_name" => "view",
                    'value'       => array(
                        'Accordion'   => 'accordion',
                        'Collapsible '   => 'collapsible',
                        'Block '   => 'block',
                    ),
                    "description" => __( "faq can be viewwd in like accordion, collapsible or block.", "mos-faqs" )
                ),
            )
        ));
    }
}
