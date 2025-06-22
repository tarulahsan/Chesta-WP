<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package MillionDollarTheme
 */

get_header();
?>

    <div class="main-content-area-wrapper">
        <main id="primary" class="site-main">

            <?php
            while ( have_posts() ) :
                the_post();

                // Handle 'Above Title' featured image position
                if ( is_singular() ) { // Double check, though it's single.php
                    $featured_image_pos = get_theme_mod( 'milliondollartheme_single_featured_image_pos', 'above_title' );
                    if ( 'above_title' === $featured_image_pos ) {
                        milliondollartheme_post_thumbnail();
                    }
                }

                get_template_part( 'template-parts/content', get_post_type() );

                the_post_navigation(
                    array(
                        'prev_text' => '<span class="nav-subtitle">' . esc_html__( 'Previous:', 'milliondollartheme' ) . '</span> <span class="nav-title">%title</span>',
                        'next_text' => '<span class="nav-subtitle">' . esc_html__( 'Next:', 'milliondollartheme' ) . '</span> <span class="nav-title">%title</span>',
                    )
                );

                // Display social share buttons
                if ( function_exists('milliondollartheme_social_share_buttons') ) {
                    milliondollartheme_social_share_buttons();
                }

                // If comments are open or we have at least one comment, load up the comment template.
                if ( comments_open() || get_comments_number() ) :
                    comments_template();
                endif;

            endwhile; // End of the loop.
            ?>

        </main><!-- #main -->

        <?php get_sidebar(); ?>
    </div><!-- .main-content-area-wrapper -->

<?php
get_footer();
EOF
