<?php
/**
 * The template for displaying all WooCommerce pages.
 *
 * This is the template that WooCommerce will use for its archive and single product pages.
 * It ensures that the theme's header, footer, and sidebar (if active) are used.
 *
 * @link https://woocommerce.com/document/template-structure/
 * @package MillionDollarTheme
 */

get_header();

// Determine sidebar position based on Customizer settings
$sidebar_position = get_theme_mod( 'milliondollartheme_default_sidebar_position', 'right' );
$main_content_class = 'site-main';

// Note: The actual class that defines content width with sidebar (e.g., 70%)
// is typically on #primary or its parent, controlled by body classes like 'has-sidebar-left/right'.
// The .main-content-area-wrapper handles the flex layout.
// No specific class needed here for width adjustment if structure is consistent.

?>
    <?php
    // Re-add breadcrumbs container if not in header for Woo pages, or if different breadcrumbs are needed.
    // The current header.php adds breadcrumbs universally after the header.
    // If WooCommerce has its own breadcrumb logic that should take precedence on Woo pages,
    // we might need to conditionally hide the theme's default breadcrumbs here or in header.php.
    // For now, assume theme breadcrumbs are desired, or WooCommerce breadcrumbs will be hooked.
    // If you want to ensure WooCommerce breadcrumbs are used if available:
    if ( function_exists( 'woocommerce_breadcrumb' ) && !function_exists('milliondollartheme_breadcrumbs') ) { // Only if theme breadcrumbs don't exist
        echo '<div class="breadcrumb-container site-section-padding">';
        woocommerce_breadcrumb();
        echo '</div>';
    } elseif ( !function_exists( 'woocommerce_breadcrumb' ) && function_exists('milliondollartheme_breadcrumbs') && !is_front_page() ) {
        // If theme breadcrumbs exist AND woo doesn't, and not front page (handled by breadcrumbs func)
        // This case is already handled by header.php's call to milliondollartheme_breadcrumbs()
        // No need to call it again here unless header.php's call is made conditional.
    } elseif ( function_exists( 'woocommerce_breadcrumb' ) && function_exists('milliondollartheme_breadcrumbs') ) {
        // Both exist - theme's breadcrumbs are already called in header.php.
        // If you prefer WooCommerce breadcrumbs on these pages, you'd need to:
        // 1. Conditionally prevent theme breadcrumbs in header.php for WooCommerce pages.
        // 2. Call woocommerce_breadcrumb() here.
        // For now, we assume theme's breadcrumbs from header.php are sufficient.
        // If specific Woo breadcrumbs are desired here, and theme ones are also in header, there might be duplication.
        // The header.php already calls milliondollartheme_breadcrumbs universally.
        // So, we might not need to output breadcrumbs here at all unless we make the header.php one conditional.
    }
    ?>

    <div class="main-content-area-wrapper site-section-padding"> <?php // Same wrapper as other templates ?>
        <main id="primary" class="<?php echo esc_attr($main_content_class); ?> woocommerce-main-content">
            <?php
            /**
             * Hook: woocommerce_before_main_content.
             *
             * WooCommerce's default callback for woocommerce_output_content_wrapper is hooked at 10.
             * WooCommerce's default callback for woocommerce_breadcrumb is hooked at 20.
             * We are providing our own wrappers and breadcrumb handling (via header.php).
             * So, we should remove these default WooCommerce actions.
             */
            // remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
            // remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );
            // do_action( 'woocommerce_before_main_content' ); // Call remaining actions if any

            // It's common to add a function in functions.php to remove these actions globally for the theme.
            // For example:
            // add_action('after_setup_theme', 'milliondollartheme_remove_wc_default_wrappers');
            // function milliondollartheme_remove_wc_default_wrappers() {
            //     remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
            //     remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );
            //     remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );
            // }
            // And then ensure this function is called.
            // For this file, we assume those are handled or we just call woocommerce_content().
            ?>

            <?php woocommerce_content(); ?>

            <?php
            /**
             * Hook: woocommerce_after_main_content.
             *
             * @hooked woocommerce_output_content_wrapper_end - 10 (outputs closing divs for content)
             */
            // remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );
            // do_action( 'woocommerce_after_main_content' );
            ?>
        </main><!-- #primary -->

        <?php
        if ( $sidebar_position !== 'none' ) {
            // Conditionally display sidebar on WooCommerce pages.
            // Example: Show on shop, product categories/tags, and single product pages.
            // Exclude from cart, checkout, and account pages.
            if ( is_woocommerce() && ( is_shop() || is_product_category() || is_product_tag() || is_product() ) && !is_cart() && !is_checkout() && !is_account_page() ) {
                 get_sidebar();
            }
        }
        ?>
    </div><!-- .main-content-area-wrapper -->

<?php
get_footer();
?>
