<?php
namespace MosPress\MosFaqs\Public;
use MosPress\MosFaqs\Public\StructuredData;
use MosPress\MosFaqs\Public\Rating;
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
            'count'				=> '-1',
            'offset'			=> 0,
            'author'			=> '1',
            'category'			=> '',
            'posts'				=> '',
            'source'			=> 'recent',
            'orderby'			=> '',
            'order'				=> '',
            'pagination'		=> 0,
            'view'				=> 'accordion',
        ), $atts, 'mos_faq' );

        $cat = ($atts['category']) ? preg_replace('/\s+/', '', $atts['category']) : '';
        $posts = ($atts['posts']) ? preg_replace('/\s+/', '', $atts['posts']) : '';

        $args = array(
            'post_type' 		=> 'qa',
            'paged' => get_query_var('paged') ? get_query_var('paged') : 1,
        );
        $args['posts_per_page'] = $atts['count'];

        if ($atts['source'] == 'selected_posts' && $atts['posts']) {
            $args['post__in'] = explode(',', $posts);
        } elseif ($atts['source'] == 'selected_categories' && $atts['category']) {
            $args['tax_query'][] = array(
                    'taxonomy' => 'faq-category',
                    'field'    => 'term_id',
                    'terms'    => explode(',', $cat),
                );
        } else {
            if ($atts['offset']) $args['offset'] = $atts['offset'];
        }
        if ($atts['orderby']) $args['orderby'] = $atts['orderby'];
        if ($atts['order']) $args['order'] = $atts['order'];
        if ($atts['author']) {
            $authors = array_map('intval', array_filter(explode(',', $atts['author'])));
            if (!empty($authors)) {
                $args['author__in'] = $authors;
            }
         }

         $query = new WP_Query( $args );
         $total_post = $query->post_count;

         $faqs = array();
         if ( $query->have_posts() ) :
            while ( $query->have_posts() ) :
                $query->the_post();
                $faqs[] = $query->post;
            endwhile;
            $query->rewind_posts();
         endif;

         $schema_data = StructuredData::generate_faq_schema($faqs);
         $container_attrs = self::html_attributes($schema_data['container_attributes']);
         $json_ld = $schema_data['json_ld'];

         $html .= '<div ' . $container_attrs . ' class="mos-faq-container">';
         $html .= $json_ld;

         if ( $query->have_posts() ) :
             $idenfier = rand(10,1000);
             $n = 0;
             $item_attrs = self::html_attributes($schema_data['item_attributes']);
             while ( $query->have_posts() ) : $query->the_post();
                
                $html .= '<div class="mos-faq-unit" ' . $item_attrs . '>';
                    $html .= '<div class="mos-faq-heading">';
                        $html .= '<h4 class="mos-faq-title" itemprop="' . $schema_data['name itemprop'] . '">';
                            if ($atts['view'] == 'accordion') $data_parent = 'data-parent="#mos-faq-'.$idenfier.'"';
                            //if ($atts['view'] != 'block') $href = 'href="#collapse'.$idenfier.$n.'"';
                            //$href = 'href="'.get_the_permalink().'"';
                            $href = 'href="#"';
                            $html .= '<a data-toggle="collapse" '.$data_parent.' '.$href.'>'.get_the_title().'</a>';
                            if ($index)	$html .= '<span class="mos-faq-icon-con"><i class="fa '.$slices[0].'"></i> <i class="fa '.$slices[1].'"></i></span>';
                        $html .= '</h4>';
                         $html .= '<div class="mos-faq-rating" data-post-id="' . get_the_ID() . '">';
                            $html .= '<span class="mos-faq-thumbs-up" data-vote="up">';
                                $html .= '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">';
                                    $html .= '<path d="M14 9V5a2 2 0 0 1-1 1h-2l-4 4a1 1 0 0 0 1 1h5l-4 4a1 1 0 0 0 1 1h2l-4 4a1 1 0 0 0 1 1h5l-4 4a1 1 0 0 0 1 1h2l-4 4a1 1 0 0 0 1 1h5l-4 4a1 1 0 0 0 1 1h2l-4 4a1 1 0 0 0 1 1h5l-4 4a1 1 0 0 0 1 1h2l-4 4a1 1 0 0 0 1 1h5l-4 4a1 1 0 0 0 1 1h2l-4 4a1 1 0 0 0 1 1h5"></path>';
                                    $html .= '<path d="M14 9V5a2 2 0 0 1-1 1h-2l-4 4a1 1 0 0 0 1 1h5"></path>';
                                $html .= '</svg>';
                            $html .= '</span>';
                            $html .= '<span class="mos-faq-thumbs-down" data-vote="down">';
                                $html .= '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">';
                                    $html .= '<path d="M10 15l-4 4a1 1 0 0 1 1l-4 4a1 1 0 0 1 1h-6"></path>';
                                    $html .= '<path d="M10 15l-4 4a1 1 0 0 0 1 1l-4 4a1 1 0 0 0 1 1h-6"></path>';
                                $html .= '</svg>';
                            $html .= '</span>';
                            $html .= '<span class="mos-faq-rating-count">';
                                $html .= '<span class="mos-faq-thumbs-up-count">0</span>';
                                $html .= '<span class="mos-faq-thumbs-down-count">0</span>';
                            $html .= '</span>';
                        $html .= '</div>';
                    $html .= '</div>';
                    if ($atts['view'] != 'block') $html .= '<div id="collapse'.$idenfier.$n.'" class="mos-faq-collapse">';
                        $html .= '<div class="mos-faq-body" ' . self::html_attributes(array(
                            'itemscope' => '',
                            'itemtype' => $schema_data['answer_itemtype'],
                            'itemprop' => $schema_data['answer_itemprop'],
                        )) . '>';
                            $html .= '<div itemprop="' . $schema_data['content itemprop'] . '">';
                            $html .= $this->mos_faq_get_the_content_with_formatting();
                            $html .= '</div>';
                        $html .= '</div>';
                    if ($atts['view'] != 'block') $html .= '</div>';				
                $html .= '</div><!--/.mos-faq-unit-->';
                $in = '';
                $n++;
            endwhile;
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

	private static function html_attributes($attributes) {
		$html = '';
		foreach ($attributes as $key => $value) {
			$html .= $key . '="' . esc_attr($value) . '" ';
		}
		return rtrim($html, ' ');
	}
}