<?php
namespace MosPress\MosFaqs\Public;

use WP_Query;
/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://mostak-shahid.github.io/
 * @since      1.0.0
 *
 * @package    Mos_Faqs
 * @subpackage Mos_Faqs/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Mos_Faqs
 * @subpackage Mos_Faqs/public
 * @author     Md. Mostak Shahid <mostak.shahid@gmail.com>
 */
class Shortcode
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
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct($plugin_name, $version)
	{
		$this->plugin_name = $plugin_name;
		$this->version = $version;
        add_shortcode( 'mos_faq', [$this, 'mos_faq_func'] );
	}

    public function mos_faq_func( $atts = array(), $content = '' ) {
        global $icons;
        $mos_faq_option = get_option( 'mos_faq_option' ); //mos_faq_icon
        $index = $mos_faq_option['mos_faq_icon'];
        $slices = explode(" ",$icons[$index]);
        $html = '';
        $atts = shortcode_atts( array(
            'limit'				=> '-1',
            'offset'			=> 0,
            'author'			=> 1,
            'category'			=> '',
            'tag'				=> '',
            'orderby'			=> '',
            'order'				=> '',
            'container'			=> 0,
            'container_class'	=> '',
            'class'				=> '',
            'grid'				=> 1,
            'singular'			=> 0,
            'pagination'		=> 0,
            'view'				=> 'accordion', //accordion, collapsible, block
        ), $atts, 'mos_faq' );

        $cat = ($atts['category']) ? preg_replace('/\s+/', '', $atts['category']) : '';
        $tag = ($atts['tag']) ? preg_replace('/\s+/', '', $atts['tag']) : '';

        $args = array( 
            'post_type' 		=> 'qa',
            'paged' => get_query_var('paged') ? get_query_var('paged') : 1,
        );
        $args['posts_per_page'] = $atts['limit'];
        if ($atts['offset']) $args['offset'] = $atts['offset'];

        if ($atts['category'] OR $atts['tag']) {
            $args['tax_query'] = array();
            if ($atts['category'] AND $atts['tag']) {
                $args['tax_query']['relation'] = 'OR';
            }
            if ($atts['category']) {
                $args['tax_query'][] = array(
                        'taxonomy' => 'faq-category',
                        'field'    => 'term_id',
                        'terms'    => explode(',', $cat),
                    );
            }
            if ($atts['tag']) {
                $args['tax_query'][] = array(
                        'taxonomy' => 'faq-tag',
                        'field'    => 'term_id',
                        'terms'    => explode(',', $tag),
                    );
            }
        }
        if ($atts['orderby']) $args['orderby'] = $atts['orderby'];
        if ($atts['order']) $args['order'] = $atts['order'];
        if ($atts['author']) $args['author'] = $atts['author'];
        if ($atts['grid'] > 5 ) $atts['grid'] = 5;
        elseif ($atts['grid'] < 1 ) $atts['grid'] = 1;
        // var_dump($args);
        // die();

        $query = new WP_Query( $args );
        $total_post = $query->post_count;
        $single_col = round( $total_post / $atts['grid'] );
        if ( $query->have_posts() ) :
            $idenfier = rand(10,1000);
            $n = 0;
            $html .= '<div id="mos-faq-'.$idenfier.'" class="mos-faq-'.$atts['view'].' mos-faq-container ' . $atts['container_class'] . '">';
            $html .= '<div class="mos-faq-col-'.$atts['grid'] . '">';
            while ( $query->have_posts() ) : $query->the_post();
                
                $html .= '<div class="mos-faq-unit ' . $atts['class'] . '">';
                    $html .= '<div class="mos-faq-heading">';
                        $html .= '<h4 class="mos-faq-title">';
                            if ($atts['view'] == 'accordion') $data_parent = 'data-parent="#mos-faq-'.$idenfier.'"';
                            //if ($atts['view'] != 'block') $href = 'href="#collapse'.$idenfier.$n.'"';
                            //$href = 'href="'.get_the_permalink().'"';
                            $href = 'href="#"';
                            $html .= '<a data-toggle="collapse" '.$data_parent.' '.$href.'>'.get_the_title().'</a>';
                            if ($index)	$html .= '<span class="mos-faq-icon-con"><i class="fa '.$slices[0].'"></i> <i class="fa '.$slices[1].'"></i></span>';
                        $html .= '</h4>';
                    $html .= '</div>';
                    if ($atts['view'] != 'block') $html .= '<div id="collapse'.$idenfier.$n.'" class="mos-faq-collapse">'; // in
                        $html .= '<div class="mos-faq-body">';
                            $html .= $this->mos_faq_get_the_content_with_formatting();
                            //$html .= get_the_content();
                            if ($atts['singular']) $html = '<a href="'.get_the_permalink().'">Details</a>';
                        $html .= '</div>';
                    if ($atts['view'] != 'block') $html .= '</div>';				
                $html .= '</div><!--/.mos-faq-unit-->';
                $in = '';
                $n++;
                if ($n % $single_col == 0 AND $n < $total_post) $html .= '</div><!--/.mos-faq-col-'.$atts['grid'] . '-->' . '<div class="mos-faq-col-'.$atts['grid'] . '">';
            endwhile;
            $html .= '</div><!--/.mos-faq-col-'.$atts['grid'] . '-->';
            $html .= '</div><!--/.mos-faq-container-->';
            wp_reset_postdata();
            if ($atts['pagination']) :
                $html .= '<div class="pagination-wrapper faq-pagination">'; 
                    $html .= '<nav class="navigation pagination" role="navigation">';
                        $html .= '<div class="nav-links">'; 
                        $big = 999999999; // need an unlikely integer
                        $html .= paginate_links( array(
                            'base' => str_replace( $big, '%#%', get_pagenum_link( $big ) ),
                            'format' => '?paged=%#%',
                            'current' => max( 1, get_query_var('paged') ),
                            'total' => $query->max_num_pages,
                            'prev_text'          => __('Prev'),
                            'next_text'          => __('Next')
                        ) );
                        $html .= '</div>';
                    $html .= '</nav>';
                $html .= '</div>';
            endif;
        endif;
        return $html;
    }


    public function mos_faq_get_the_content_with_formatting ($more_link_text = '(more...)', $stripteaser = 0, $more_file = '') {
        $content = get_the_content($more_link_text, $stripteaser, $more_file);
        $content = apply_filters('the_content', $content);
        $content = str_replace(']]>', ']]&gt;', $content);
        return $content;
    }
}