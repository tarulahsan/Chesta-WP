<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package MillionDollarTheme
 */

?>
    </div><!-- #content -->

    <?php
    // Elementor Pro footer integration
    if ( ! function_exists( 'elementor_theme_do_location' ) || ! elementor_theme_do_location( 'footer' ) ) :
        $footer_widget_columns = get_theme_mod( 'milliondollartheme_footer_widget_columns', 3 );
        $footer_classes = ['site-footer'];
        $footer_classes[] = 'footer-widgets-cols-' . $footer_widget_columns;
    ?>
    <footer id="colophon" class="<?php echo esc_attr( implode( ' ', $footer_classes ) ); ?>">
        <?php // Optional: Add a footer widget area that respects the column setting
        if ( is_active_sidebar( 'footer-widgets' ) && $footer_widget_columns > 0 ) : ?>
            <div class="footer-widgets-wrapper">
                <div class="container footer-widgets-inner footer-widgets-cols-<?php echo esc_attr( $footer_widget_columns ); ?>">
                    <?php dynamic_sidebar( 'footer-widgets' ); ?>
                </div>
            </div>
        <?php endif; ?>

        <div class="site-info"> <?php // This usually contains copyright, credits ?>
            <div class="container site-info-inner"> <?php // Added container ?>
                <div class="copyright-text">
                    <?php
                $copyright_text = get_theme_mod( 'milliondollartheme_footer_copyright_text', sprintf( __( 'Copyright [year] %s. All rights reserved.', 'milliondollartheme' ), get_bloginfo( 'name', 'display' ) ) );
                echo do_shortcode( wp_kses_post( $copyright_text ) ); // Apply shortcodes and sanitize
                ?>
            </div>

            <?php
            // Display social media icons from footer settings
            if ( function_exists('milliondollartheme_get_social_media_icons') ) {
                echo milliondollartheme_get_social_media_icons('footer');
            }
            ?>

            <?php // Original WordPress and Theme credits - can be kept or removed based on preference ?>
            <?php /*
            <a href="<?php echo esc_url( __( 'https://wordpress.org/', 'milliondollartheme' ) ); ?>">
                <?php
                /* translators: %s: CMS name, i.e. WordPress. */
                printf( esc_html__( 'Proudly powered by %s', 'milliondollartheme' ), 'WordPress' );
                ?>
            </a>
            <span class="sep"> | </span>
            <?php
            /* translators: 1: Theme name, 2: Theme author. */
            printf( esc_html__( 'Theme: %1$s by %2$s.', 'milliondollartheme' ), 'MillionDollarTheme', '<a href="https://example.com/">AI Developer & User</a>' );
            ?>
            */ ?>
                </div><!-- .copyright-text -->
                <?php
                // Social icons can remain here or be part of a widget
                if ( function_exists('milliondollartheme_get_social_media_icons') ) {
                    echo milliondollartheme_get_social_media_icons('footer');
                }
                ?>
            </div><!-- .site-info-inner -->
        </div><!-- .site-info -->
    </footer><!-- #colophon -->
    <?php
    endif; // End Elementor footer check
    ?>

    <?php
    // Scroll to Top Button
    if ( get_theme_mod( 'milliondollartheme_scroll_to_top_enabled', true ) ) : ?>
        <button id="scroll-to-top" class="scroll-to-top-button" title="<?php esc_attr_e( 'Scroll to top', 'milliondollartheme' ); ?>">
            <span class="dashicons dashicons-arrow-up-alt2" aria-hidden="true"></span>
        </button>
    <?php endif; ?>

</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
EOF
