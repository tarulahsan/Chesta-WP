<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package MillionDollarTheme
 */

get_header();
?>

    <main id="primary" class="site-main">

        <section class="error-404 not-found">
            <header class="page-header">
                <h1 class="page-title"><?php esc_html_e( 'Oops! That page can&rsquo;t be found.', 'milliondollartheme' ); ?></h1>
            </header><!-- .page-header -->

            <div class="page-content">
                <p><?php esc_html_e( 'It looks like nothing was found at this location. Maybe try one of the links below or a search?', 'milliondollartheme' ); ?></p>

                <?php get_search_form(); ?>

                <div class="error-404-widgets-area">
                    <div class="error-404-widget-column">
                        <?php the_widget( 'WP_Widget_Recent_Posts' ); ?>
                    </div>

                    <div class="error-404-widget-column">
                        <div class="widget widget_categories">
                            <h2 class="widget-title"><?php esc_html_e( 'Most Used Categories', 'milliondollartheme' ); ?></h2>
                            <ul>
                                <?php
                                wp_list_categories( array(
                                    'orderby'    => 'count',
                                    'order'      => 'DESC',
                                    'show_count' => 1,
                                    'title_li'   => '',
                                    'number'     => 10,
                                ) );
                                ?>
                            </ul>
                        </div><!-- .widget -->
                    </div>

                    <div class="error-404-widget-column">
                        <?php
                        /* translators: %1$s: smiley */
                        $milliondollartheme_archive_content = '<p>' . sprintf( esc_html__( 'Try looking in the monthly archives. %1$s', 'milliondollartheme' ), convert_smilies( ':)' ) ) . '</p>';
                        the_widget( 'WP_Widget_Archives', array('dropdown' => 1, 'count' => 0), array('before_title' => '<h2 class="widget-title">', 'after_title' => '</h2>' . $milliondollartheme_archive_content ) );
                        ?>
                    </div>

                    <div class="error-404-widget-column">
                        <?php the_widget( 'WP_Widget_Tag_Cloud' ); ?>
                    </div>
                </div><!-- .error-404-widgets-area -->

            </div><!-- .page-content -->
        </section><!-- .error-404 -->

    </main><!-- #main -->

<?php
get_footer();
EOF
