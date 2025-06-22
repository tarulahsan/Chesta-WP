<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MillionDollarTheme
 */

get_header();
?>

    <div class="main-content-area-wrapper">
        <main id="primary" class="site-main">

            <?php
            if ( have_posts() ) :
                $archive_layout = get_theme_mod( 'milliondollartheme_archive_layout', 'list' );
                $archive_classes = ['posts-archive-wrapper', 'archive-layout-' . $archive_layout];
                if ( 'grid' === $archive_layout ) {
                    $grid_columns = get_theme_mod( 'milliondollartheme_archive_grid_columns', 3 );
                    $archive_classes[] = 'grid-cols-' . $grid_columns;
                }
            ?>
            <?php
            // This specific header for 'home' (blog page if not front page) should be outside the main content wrapper
            // or handled differently if it needs to be part of the layout selection.
            // For now, keeping it as is, and the wrapper will apply to the posts list itself.
            if ( is_home() && ! is_front_page() ) :
            ?>
                <header class="page-header-home-archive">
                    <h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
                </header>
            <?php
            endif;

            if ( have_posts() ) :
                $archive_layout = get_theme_mod( 'milliondollartheme_archive_layout', 'list' );
                $archive_classes = ['posts-archive-wrapper', 'archive-layout-' . $archive_layout];
                if ( 'grid' === $archive_layout ) {
                    $grid_columns = get_theme_mod( 'milliondollartheme_archive_grid_columns', 3 );
                    $archive_classes[] = 'grid-cols-' . $grid_columns;
                }
            ?>
            <div class="<?php echo esc_attr( implode( ' ', $archive_classes ) ); ?>">
            <?php
                /* Start the Loop */
                while ( have_posts() ) :
                    the_post();
                    /*
                     * Include the Post-Type-specific template for the content.
                     * If you want to override this in a child theme, then include a file
                     * called content-___.php (where ___ is the Post Type name) and that will be used instead.
                     * Using get_post_format() allows for format-specific templates (e.g., content-aside.php).
                     */
                    get_template_part( 'template-parts/content', get_post_format() );
                endwhile;

                the_posts_navigation();
            ?>
            </div> <!-- .posts-archive-wrapper -->
            <?php
            else :
                get_template_part( 'template-parts/content', 'none' );
            endif;
            ?>

        </main><!-- #main -->

        <?php get_sidebar(); ?>
    </div><!-- .main-content-area-wrapper -->

<?php
get_footer();
EOF
