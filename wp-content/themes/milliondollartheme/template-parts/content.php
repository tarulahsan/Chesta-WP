<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MillionDollarTheme
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <header class="entry-header">
        <?php
        if ( is_singular() ) :
            the_title( '<h1 class="entry-title">', '</h1>' );
        else :
            the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
        endif;

        if ( 'post' === get_post_type() ) :
            ?>
            <div class="entry-meta">
                <?php
                milliondollartheme_posted_on();
                milliondollartheme_posted_by();
                ?>
            </div><!-- .entry-meta -->
        <?php endif; ?>
    </header><!-- .entry-header -->

    <?php
    if ( is_singular() ) {
        $featured_image_pos = get_theme_mod( 'milliondollartheme_single_featured_image_pos', 'above_title' );
        if ( 'below_title' === $featured_image_pos ) {
            milliondollartheme_post_thumbnail();
        }
        // If 'above_title', it will be handled before this template part or higher up in single.php
        // If 'hidden', milliondollartheme_post_thumbnail() will return early.
    } else {
        milliondollartheme_post_thumbnail(); // Standard behavior for archives
    }
    ?>

    <div class="entry-content">
        <?php
        the_content( sprintf(
            wp_kses(
                /* translators: %s: Name of current post. Only visible to screen readers */
                __( 'Continue reading<span class="screen-reader-text"> "%s"</span>', 'milliondollartheme' ),
                array(
                    'span' => array(
                        'class' => array(),
                    ),
                )
            ),
            get_the_title()
        ) );

        wp_link_pages( array(
            'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'milliondollartheme' ),
            'after'  => '</div>',
        ) );
        ?>
    </div><!-- .entry-content -->

    <footer class="entry-footer">
        <?php milliondollartheme_entry_footer(); // We'll enable this later ?>
    </footer><!-- .entry-footer -->
</article><!-- #post-<?php the_ID(); ?> -->
EOF
