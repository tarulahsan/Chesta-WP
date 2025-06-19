<?php
/**
 * Masonry Portfolio Gallery Block Render Callback.
 *
 * @param array $attributes Block attributes.
 * @return string HTML content for the block.
 */

// Ensure all attributes from block.json have defaults or are checked for existence.
$defaults = array(
    'selectedCategories' => '',
    'numberOfItems' => 9,
    'orderBy' => 'date',
    'order' => 'DESC',
    'columnMinWidth' => 250,
    'imageSize' => 'medium_large',
    'imageAspectRatio' => 'auto', // New default
    'showPostTitleOnHover' => true,
    'hoverEffect' => 'zoom', // New default
    'itemStyle' => 'default',
    'gap' => 16,
    'align' => '',
    // Attributes for future filtering/pagination are not used in query yet
    // 'showFilterBar' => false,
    // 'filterBy' => 'category',
    // 'paginationType' => 'none',
    // 'loadMoreButtonText' => __('Load More', 'milliondollartheme'),
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
    // Handle multiple categories (slugs or IDs)
    $cat_query_field = is_numeric(explode(',', $attr['selectedCategories'])[0]) ? 'category__in' : 'category_name';
    $query_args[$cat_query_field] = array_map('sanitize_text_field', explode(',', $attr['selectedCategories']));
    if ($cat_query_field === 'category__in') {
        $query_args[$cat_query_field] = array_map('intval', $query_args[$cat_query_field]);
    }
}
// TODO: Add similar logic for selectedTags if that attribute is used.

$query = new WP_Query( $query_args );

if ( ! $query->have_posts() ) {
    // It's important for ServerSideRender that the block wrapper is still output
    // so block controls (like alignment) still work in the editor.
    $no_posts_message = '<p class="no-posts-found">' . esc_html__( 'No items found matching your criteria.', 'milliondollartheme' ) . '</p>';
    // For ServerSideRender, it's often better to return the wrapper with the message inside.
    // However, if the wrapper relies on JS for layout (like Masonry), an empty wrapper might be fine.
    // For now, just the message if used directly.
    // For SSR, it might be wrapped by the component in edit() if empty.
    // Let's return the message directly for now.
    echo $no_posts_message; // render.php echoes, doesn't return (WordPress captures output)
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

// Inline style for CSS variables used by masonry JS or CSS
$wrapper_style = sprintf(
    '--masonry-gap: %dpx; --masonry-column-min-width: %dpx;',
    intval($attr['gap']),
    intval($attr['columnMinWidth'])
);

// Start output buffering
ob_start();
?>
<div class="<?php echo esc_attr( implode(' ', $wrapper_classes) ); ?>" style="<?php echo esc_attr($wrapper_style); ?>">
    <div class="masonry-grid-sizer"></div> <?php // For Masonry JS: columnWidth sizer ?>
    <?php while ( $query->have_posts() ) : $query->the_post(); ?>
        <?php
        $item_classes = get_post_class( 'portfolio-item masonry-item', get_the_ID() );
        $item_link = get_permalink();
        // TODO: Add clickAction attribute handling here (e.g., lightbox link)
        ?>
        <article class="<?php echo esc_attr(implode(' ', $item_classes)); ?>">
            <div class="portfolio-item-inner-wrapper"> <?php // New wrapper for styling individual items (e.g. card border) ?>
                <?php if ( has_post_thumbnail() ) : ?>
                    <div class="portfolio-item-thumbnail aspect-ratio-<?php echo esc_attr(str_replace('/', '-', $attr['imageAspectRatio'])); ?>"
                         style="<?php if ($attr['imageAspectRatio'] === 'auto') { echo 'aspect-ratio: auto;'; } else { echo 'aspect-ratio: ' . esc_attr($attr['imageAspectRatio']) . ';'; } ?>">
                        <a href="<?php echo esc_url($item_link); ?>">
                            <?php the_post_thumbnail( get_the_ID(), esc_attr($attr['imageSize']) ); ?>
                            <?php if ( $attr['showPostTitleOnHover'] ) : ?>
                                <div class="portfolio-item-overlay">
                                    <div class="portfolio-item-overlay-content">
                                        <h3 class="portfolio-item-title"><?php the_title(); ?></h3>
                                        <?php // TODO: Add categories/tags to overlay if attribute exists ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </a>
                    </div>
                <?php else : // Fallback if no thumbnail ?>
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
                <?php // Optionally, display title below image if not overlay hover effect or if title always visible
                if ($attr['hoverEffect'] !== 'overlay-title' && $attr['showPostTitleOnHover'] /* or a new 'showTitleAlways' attribute */ ) {
                    // echo '<h4 class="portfolio-item-title-below"><a href="' . esc_url($item_link) . '">' . get_the_title() . '</a></h4>';
                }
                ?>
            </div> <?php // .portfolio-item-inner-wrapper ?>
        </article>
    <?php endwhile; ?>
</div>
<?php
wp_reset_postdata();

// WordPress captures the echoed output when "render":"file:./render.php" is used.
// No need to explicitly return ob_get_clean(), but it doesn't hurt.
$html_output = ob_get_clean();
echo $html_output;

?>
