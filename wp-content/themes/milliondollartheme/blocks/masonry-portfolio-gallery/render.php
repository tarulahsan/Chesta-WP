<?php
/**
 * Masonry Portfolio Gallery Block Render Callback.
 * (Optimized with no_found_rows and transient caching)
 *
 * @param array $attributes Block attributes.
 * @return void Echos HTML content for the block.
 */

// Transient Caching: Try to get cached HTML first.
// Note: $attributes are passed directly to this file when used as "render" field in block.json
$transient_key_masonry = 'mdt_masonry_gallery_' . md5( wp_json_encode( $attributes ) );
$cached_html_masonry = get_transient( $transient_key_masonry );

if ( false !== $cached_html_masonry ) {
    echo $cached_html_masonry;
    return;
}

// Ensure all attributes from block.json have defaults or are checked for existence.
$defaults = array(
    'selectedCategories' => '',
    'numberOfItems' => 9,
    'orderBy' => 'date',
    'order' => 'DESC',
    'columnMinWidth' => 250,
    'imageSize' => 'medium_large',
    'imageAspectRatio' => 'auto',
    'showPostTitleOnHover' => true,
    'hoverEffect' => 'zoom',
    'itemStyle' => 'default',
    'gap' => 16,
    'align' => '',
);
$attr = array_merge($defaults, $attributes);

$query_args = array(
    'post_type'      => 'post', // Or a CPT if defined later
    'posts_per_page' => intval($attr['numberOfItems']),
    'orderby'        => sanitize_text_field($attr['orderBy']),
    'order'          => sanitize_text_field($attr['order']),
    'post_status'    => 'publish',
    'no_found_rows'  => true, // Optimization: Do not count total rows
);

if ( ! empty($attr['selectedCategories']) ) {
    $cat_query_field = is_numeric(explode(',', $attr['selectedCategories'])[0]) ? 'category__in' : 'category_name';
    $query_args[$cat_query_field] = array_map('sanitize_text_field', explode(',', $attr['selectedCategories']));
    if ($cat_query_field === 'category__in') {
        $query_args[$cat_query_field] = array_map('intval', $query_args[$cat_query_field]);
    }
}

$query = new WP_Query( $query_args );

ob_start(); // Start output buffering AFTER transient check and initial setup

if ( ! $query->have_posts() ) {
    $no_posts_message = '<p class="no-posts-found">' . esc_html__( 'No items found matching your criteria.', 'milliondollartheme' ) . '</p>';
    // For ServerSideRender, it might be better to wrap this in the block's outer div if that's expected by editor controls.
    // However, as this render.php is used for front-end, this simple message is okay.
    // If we were to cache this, it would be done before echo and return.
    echo $no_posts_message;
    $html_output_masonry = ob_get_clean();
    set_transient( $transient_key_masonry, $html_output_masonry, 5 * MINUTE_IN_SECONDS );
    echo $html_output_masonry; // Echo the final output for this request
    return;
}

$wrapper_classes = array(
    'wp-block-milliondollartheme-masonry-portfolio-gallery',
    'portfolio-gallery-masonry',
    'item-style-' . esc_attr($attr['itemStyle']),
    'hover-effect-' . esc_attr($attr['hoverEffect'])
);
if ( !empty($attr['align']) ){
  $wrapper_classes[] = 'align' . esc_attr($attr['align']);
}

$wrapper_style = sprintf(
    '--masonry-gap: %dpx; --masonry-column-min-width: %dpx;',
    intval($attr['gap']),
    intval($attr['columnMinWidth'])
);

?>
<div class="<?php echo esc_attr( implode(' ', $wrapper_classes) ); ?>" style="<?php echo esc_attr($wrapper_style); ?>">
    <div class="masonry-grid-sizer"></div>
    <?php while ( $query->have_posts() ) : $query->the_post(); ?>
        <?php
        $item_classes = get_post_class( 'portfolio-item masonry-item', get_the_ID() );
        $item_link = get_permalink();
        ?>
        <article class="<?php echo esc_attr(implode(' ', $item_classes)); ?>">
            <div class="portfolio-item-inner-wrapper">
                <?php if ( has_post_thumbnail() ) : ?>
                    <div class="portfolio-item-thumbnail aspect-ratio-<?php echo esc_attr(str_replace('/', '-', $attr['imageAspectRatio'])); ?>"
                         style="<?php if ($attr['imageAspectRatio'] === 'auto') { echo 'aspect-ratio: auto;'; } else { echo 'aspect-ratio: ' . esc_attr($attr['imageAspectRatio']) . ';'; } ?>">
                        <a href="<?php echo esc_url($item_link); ?>">
                            <?php the_post_thumbnail( get_the_ID(), esc_attr($attr['imageSize']) ); ?>
                            <?php if ( $attr['showPostTitleOnHover'] ) : ?>
                                <div class="portfolio-item-overlay">
                                    <div class="portfolio-item-overlay-content">
                                        <h3 class="portfolio-item-title"><?php the_title(); ?></h3>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </a>
                    </div>
                <?php else : ?>
                    <div class="portfolio-item-thumbnail is-placeholder aspect-ratio-<?php echo esc_attr(str_replace('/', '-', $attr['imageAspectRatio'])); ?>"
                         style="<?php if ($attr['imageAspectRatio'] === 'auto') { echo 'aspect-ratio: auto;'; } else { echo 'aspect-ratio: ' . esc_attr($attr['imageAspectRatio']) . ';'; } ?>">
                         <a href="<?php echo esc_url($item_link); ?>">
                            <span class="placeholder-icon dashicons dashicons-format-image"></span>
                             <?php if ( $attr['showPostTitleOnHover'] ) : ?>
                                <div class="portfolio-item-overlay">
                                     <div class="portfolio-item-overlay-content">
                                        <h3 class="portfolio-item-title"><?php the_title(); ?></h3>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </article>
    <?php endwhile; ?>
</div>
<?php
wp_reset_postdata();

$html_output_masonry = ob_get_clean();
set_transient( $transient_key_masonry, $html_output_masonry, 5 * MINUTE_IN_SECONDS ); // Cache for 5 minutes
echo $html_output_masonry; // WordPress captures this echoed output

?>
