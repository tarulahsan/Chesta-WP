<?php
/**
 * Masonry Portfolio Gallery Block Render Callback.
 *
 * @param array $attributes Block attributes.
 * @return string HTML content for the block.
 */

// Directly use $attributes passed by WordPress when using "render": "file:./render.php"
// Ensure all attributes from block.json have defaults or are checked for existence.
$defaults = array(
    'selectedCategories' => '',
    'numberOfItems' => 9,
    'orderBy' => 'date',
    'order' => 'DESC',
    'columnMinWidth' => 250,
    'imageSize' => 'medium_large',
    'showPostTitleOnHover' => true,
    'gap' => 16,
    'align' => '',
    'itemStyle' => 'default',
);
$attr = array_merge($defaults, $attributes);

$query_args = array(
    'post_type'      => 'post', // Or a CPT if defined later
    'posts_per_page' => intval($attr['numberOfItems']),
    'orderby'        => sanitize_text_field($attr['orderBy']),
    'order'          => sanitize_text_field($attr['order']),
    'post_status'    => 'publish',
);

if ( ! empty($attr['selectedCategories']) ) {
    $query_args['category_name'] = sanitize_text_field($attr['selectedCategories']);
}

$query = new WP_Query( $query_args );

if ( ! $query->have_posts() ) {
    // Instead of echo, return the string for WP to handle
    return '<p class="no-posts-found">' . esc_html__( 'No items found.', 'milliondollartheme' ) . '</p>';
}

$wrapper_classes = array(
    'wp-block-milliondollartheme-masonry-portfolio-gallery',
    'portfolio-gallery-masonry', // Class for JS to target
    'item-style-' . esc_attr($attr['itemStyle'])
);
if ( !empty($attr['align']) ){
  $wrapper_classes[] = 'align' . esc_attr($attr['align']);
}

// Inline style for CSS variables used by masonry JS or CSS
$wrapper_style = sprintf(
    '--masonry-gap: %dpx; --masonry-column-min-width: %dpx;',
    intval($attr['gap']),
    intval($attr['columnMinWidth'])
);

ob_start();
?>
<div class="<?php echo esc_attr( implode(' ', $wrapper_classes) ); ?>" style="<?php echo esc_attr($wrapper_style); ?>">
    <div class="masonry-grid-sizer"></div> <?php // For Masonry JS: columnWidth sizer ?>
    <?php while ( $query->have_posts() ) : $query->the_post(); ?>
        <article <?php post_class( 'portfolio-item masonry-item' ); ?>>
            <?php if ( has_post_thumbnail() ) : ?>
                <div class="portfolio-item-thumbnail">
                    <a href="<?php the_permalink(); ?>">
                        <?php the_post_thumbnail( get_the_ID(), esc_attr($attr['imageSize']) ); ?>
                        <?php if ( $attr['showPostTitleOnHover'] ) : ?>
                            <div class="portfolio-item-overlay">
                                <h3 class="portfolio-item-title"><?php the_title(); ?></h3>
                            </div>
                        <?php endif; ?>
                    </a>
                </div>
            <?php else : // Fallback if no thumbnail ?>
                <div class="portfolio-item-thumbnail is-placeholder">
                     <a href="<?php the_permalink(); ?>">
                        <span class="placeholder-icon dashicons dashicons-format-image"></span>
                         <?php if ( $attr['showPostTitleOnHover'] ) : ?>
                            <div class="portfolio-item-overlay">
                                <h3 class="portfolio-item-title"><?php the_title(); ?></h3>
                            </div>
                        <?php endif; ?>
                    </a>
                </div>
            <?php endif; ?>
        </article>
    <?php endwhile; ?>
</div>
<?php
wp_reset_postdata();
return ob_get_clean(); // Return buffered content
?>
