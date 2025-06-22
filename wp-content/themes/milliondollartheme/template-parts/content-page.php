<?php
/**
 * Template part for displaying page content in page.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MillionDollarTheme
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <?php if ( get_theme_mod( 'milliondollartheme_page_show_title', true ) ) : ?>
    <header class="entry-header">
        <?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
    </header><!-- .entry-header -->
    <?php endif; ?>

    <?php
    // Standard thumbnail display for pages, could be enhanced with Customizer options later if needed
    // For now, respecting the general post_thumbnail logic (which includes its own checks like has_post_thumbnail())
    milliondollartheme_post_thumbnail();
    ?>

    <div class="entry-content">
        <?php
        the_content();

        wp_link_pages( array(
            'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'milliondollartheme' ),
            'after'  => '</div>',
        ) );
        ?>
    </div><!-- .entry-content -->

    <?php if ( get_edit_post_link() ) : ?>
        <footer class="entry-footer">
            <?php
            edit_post_link(
                sprintf(
                    wp_kses(
                        /* translators: %s: Name of current post. Only visible to screen readers */
                        __( 'Edit <span class="screen-reader-text">%s</span>', 'milliondollartheme' ),
                        array(
                            'span' => array(
                                'class' => array(),
                            ),
                        )
                    ),
                    get_the_title()
                ),
                '<span class="edit-link">',
                '</span>'
            );
            ?>
        </footer><!-- .entry-footer -->
    <?php endif; ?>
</article><!-- #post-<?php the_ID(); ?> -->
EOF
