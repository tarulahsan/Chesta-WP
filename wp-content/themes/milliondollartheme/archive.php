<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MillionDollarTheme
 */

get_header();
?>

    <div class="main-content-area-wrapper">
        <main id="primary" class="site-main">

            <?php if ( have_posts() ) : ?>

                <header class="page-header">
                    <?php
                    the_archive_title( '<h1 class="page-title">', '</h1>' );
                    the_archive_description( '<div class="archive-description">', '</div>' );
                    ?>
                </header><!-- .page-header -->

                <?php
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
