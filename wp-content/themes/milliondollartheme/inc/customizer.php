<?php
/**
 * MillionDollarTheme Customizer
 *
 * @package MillionDollarTheme
 */

if ( ! function_exists( 'milliondollartheme_customize_register' ) ) :
    /**
     * Add postMessage support for site title and description for the Theme Customizer.
     * Also adds Theme Layout, Color, Typography, Header, Footer, Single Post, and Performance Settings.
     *
     * @param WP_Customize_Manager $wp_customize Theme Customizer object.
     */
    function milliondollartheme_customize_register( $wp_customize ) {
        // Default Customizer settings
        $wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
        $wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';

        if ( isset( $wp_customize->selective_refresh ) ) {
            $wp_customize->selective_refresh->add_partial( 'blogname', array(
                'selector'        => '.site-title a',
                'render_callback' => 'milliondollartheme_customize_partial_blogname',
            ) );
            $wp_customize->selective_refresh->add_partial( 'blogdescription', array(
                'selector'        => '.site-description',
                'render_callback' => 'milliondollartheme_customize_partial_blogdescription',
            ) );
        }

        // --- Theme Layout Settings Section ---
        $wp_customize->add_section( 'milliondollartheme_layout_settings', array( 'title' => __( 'Theme Layout Settings', 'milliondollartheme' ), 'priority' => 30, ) );
        $wp_customize->add_setting( 'milliondollartheme_default_sidebar_position', array( 'default'   => 'right', 'sanitize_callback' => 'milliondollartheme_sanitize_select', 'transport' => 'refresh', ) );
        $wp_customize->add_control( 'milliondollartheme_default_sidebar_position', array( 'label' => __( 'Default Sidebar Position', 'milliondollartheme' ), 'section' => 'milliondollartheme_layout_settings', 'type' => 'select', 'choices' => array( 'right' => __( 'Right Sidebar', 'milliondollartheme' ), 'left'  => __( 'Left Sidebar', 'milliondollartheme' ), 'none'  => __( 'No Sidebar (Full Width Content)', 'milliondollartheme' ), ), ) );
        $wp_customize->add_setting( 'milliondollartheme_container_width', array( 'default'   => '1200px', 'sanitize_callback' => 'sanitize_text_field', 'transport' => 'postMessage', ) );
        $wp_customize->add_control( 'milliondollartheme_container_width', array( 'label' => __( 'Site Content Max Width', 'milliondollartheme' ), 'section' => 'milliondollartheme_layout_settings', 'type' => 'select', 'choices' => array( '1140px' => __( '1140px', 'milliondollartheme' ), '1200px' => __( '1200px', 'milliondollartheme' ), '1320px' => __( '1320px', 'milliondollartheme' ), '1440px' => __( '1440px', 'milliondollartheme' ), 'fluid-full' => __( 'Fluid Full Width', 'milliondollartheme' ), ), ) );
        $wp_customize->add_setting( 'milliondollartheme_content_sidebar_ratio', array( 'default'   => '70/30', 'sanitize_callback' => 'milliondollartheme_sanitize_select', 'transport' => 'postMessage', ) );
        $wp_customize->add_control( 'milliondollartheme_content_sidebar_ratio', array( 'label' => __( 'Content/Sidebar Width Ratio (if sidebar active)', 'milliondollartheme' ), 'section' => 'milliondollartheme_layout_settings', 'type' => 'select', 'choices' => array( '70/30' => __( '70% Content / 30% Sidebar', 'milliondollartheme' ), '66/33' => __( '66% Content / 33% Sidebar', 'milliondollartheme' ), '75/25' => __( '75% Content / 25% Sidebar', 'milliondollartheme' ), ), 'active_callback' => 'milliondollartheme_is_sidebar_active_globally_callback', ) );

        // --- Theme Color Settings Section ---
        $wp_customize->add_section( 'milliondollartheme_color_settings', array( 'title' => __( 'Theme Colors', 'milliondollartheme' ), 'priority' => 40, ) );
        $default_colors = array( 'primary_color' => '#0052D4', 'secondary_color' => '#C837C8', 'accent_color' => '#00C6AD', 'text_color_dark' => '#1A1A1A', 'text_color_light' => '#F0F0F0', 'background_color_light'  => '#FFFFFF', );
        $wp_customize->add_setting( 'milliondollartheme_primary_color', array( 'default' => $default_colors['primary_color'], 'sanitize_callback' => 'sanitize_hex_color', 'transport' => 'postMessage' ) );
        $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'milliondollartheme_primary_color', array( 'label' => __( 'Primary Color', 'milliondollartheme' ), 'section' => 'milliondollartheme_color_settings' ) ) );
        $wp_customize->add_setting( 'milliondollartheme_secondary_color', array( 'default' => $default_colors['secondary_color'], 'sanitize_callback' => 'sanitize_hex_color', 'transport' => 'postMessage' ) );
        $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'milliondollartheme_secondary_color', array( 'label' => __( 'Secondary Color', 'milliondollartheme' ), 'section' => 'milliondollartheme_color_settings' ) ) );
        $wp_customize->add_setting( 'milliondollartheme_accent_color', array( 'default' => $default_colors['accent_color'], 'sanitize_callback' => 'sanitize_hex_color', 'transport' => 'postMessage' ) );
        $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'milliondollartheme_accent_color', array( 'label' => __( 'Accent Color', 'milliondollartheme' ), 'section' => 'milliondollartheme_color_settings' ) ) );
        $wp_customize->add_setting( 'milliondollartheme_text_color_dark', array( 'default' => $default_colors['text_color_dark'], 'sanitize_callback' => 'sanitize_hex_color', 'transport' => 'postMessage' ) );
        $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'milliondollartheme_text_color_dark', array( 'label' => __( 'Main Text Color (on Light BG)', 'milliondollartheme' ), 'section' => 'milliondollartheme_color_settings' ) ) );
        $wp_customize->add_setting( 'milliondollartheme_text_color_light', array( 'default' => $default_colors['text_color_light'], 'sanitize_callback' => 'sanitize_hex_color', 'transport' => 'postMessage' ) );
        $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'milliondollartheme_text_color_light', array( 'label' => __( 'Main Text Color (on Dark BG)', 'milliondollartheme' ), 'section' => 'milliondollartheme_color_settings' ) ) );
        $wp_customize->add_setting( 'milliondollartheme_background_color_light', array( 'default' => $default_colors['background_color_light'], 'sanitize_callback' => 'sanitize_hex_color', 'transport' => 'postMessage' ) );
        $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'milliondollartheme_background_color_light', array( 'label' => __( 'Site Background Color (Light Theme)', 'milliondollartheme' ), 'section' => 'milliondollartheme_color_settings' ) ) );

        // --- Typography Settings Section ---
        $wp_customize->add_section( 'milliondollartheme_typography_settings', array( 'title' => __( 'Typography', 'milliondollartheme' ), 'priority' => 50, ) );
        $google_font_choices = array( 'System Stack' => __('System Default', 'milliondollartheme'), 'Roboto' => __('Roboto', 'milliondollartheme'), 'Open Sans' => __('Open Sans', 'milliondollartheme'), 'Lato' => __('Lato', 'milliondollartheme'), 'Montserrat' => __('Montserrat', 'milliondollartheme'), 'Poppins' => __('Poppins', 'milliondollartheme'), 'Inter' => __('Inter', 'milliondollartheme'), 'Nunito Sans' => __('Nunito Sans', 'milliondollartheme'), 'Merriweather' => __('Merriweather (Serif)', 'milliondollartheme'), 'Playfair Display' => __('Playfair Display (Serif)', 'milliondollartheme'), );
        $wp_customize->add_setting( 'milliondollartheme_body_font', array( 'default' => 'Inter', 'sanitize_callback' => 'sanitize_text_field', 'transport' => 'postMessage' ) );
        $wp_customize->add_control( 'milliondollartheme_body_font', array( 'label' => __( 'Body Font Family', 'milliondollartheme' ), 'section' => 'milliondollartheme_typography_settings', 'type' => 'select', 'choices' => $google_font_choices ) );
        $wp_customize->add_setting( 'milliondollartheme_headings_font', array( 'default' => 'Montserrat', 'sanitize_callback' => 'sanitize_text_field', 'transport' => 'postMessage' ) );
        $wp_customize->add_control( 'milliondollartheme_headings_font', array( 'label' => __( 'Headings Font Family', 'milliondollartheme' ), 'section' => 'milliondollartheme_typography_settings', 'type' => 'select', 'choices' => $google_font_choices ) );
        $wp_customize->add_setting( 'milliondollartheme_body_font_size', array( 'default' => '16px', 'sanitize_callback' => 'sanitize_text_field', 'transport' => 'postMessage' ) );
        $wp_customize->add_control( 'milliondollartheme_body_font_size', array( 'label' => __( 'Base Body Font Size (e.g., 16px, 1rem)', 'milliondollartheme' ), 'section' => 'milliondollartheme_typography_settings', 'type' => 'text' ) );
        $wp_customize->add_setting( 'milliondollartheme_body_line_height', array( 'default' => '1.7', 'sanitize_callback' => 'sanitize_text_field', 'transport' => 'postMessage' ) );
        $wp_customize->add_control( 'milliondollartheme_body_line_height', array( 'label' => __( 'Base Body Line Height (e.g., 1.7)', 'milliondollartheme' ), 'section' => 'milliondollartheme_typography_settings', 'type' => 'text' ) );
        $wp_customize->add_setting( 'milliondollartheme_enable_fontawesome', array( 'default' => false, 'sanitize_callback' => 'milliondollartheme_sanitize_checkbox', 'transport' => 'refresh' ) );
        $wp_customize->add_control( 'milliondollartheme_enable_fontawesome', array( 'label' => __( 'Enable Font Awesome 5 (CDN)', 'milliondollartheme' ), 'section' => 'milliondollartheme_typography_settings', 'type' => 'checkbox', 'description' => __('Loads Font Awesome Free from CDN.', 'milliondollartheme') ) );
        $wp_customize->add_setting( 'milliondollartheme_custom_font_face_css', array( 'default' => '', 'sanitize_callback' => 'wp_strip_all_tags', 'transport' => 'refresh' ) );
        $wp_customize->add_control( 'milliondollartheme_custom_font_face_css', array(
            'label' => __( 'Custom @font-face CSS', 'milliondollartheme' ),
            'section' => 'milliondollartheme_typography_settings',
            'type' => 'textarea',
            'description' => __('For advanced users. Paste complete @font-face rules here for self-hosted fonts. IMPORTANT: Ensure font file paths are correct AND include `font-display: swap;` in each rule for optimal performance and to avoid layout shifts.', 'milliondollartheme')
        ) );

        // --- Header Settings Panel ---
        $wp_customize->add_panel( 'milliondollartheme_header_panel', array( 'title' => __( 'Header Settings', 'milliondollartheme' ), 'priority' => 120, ) );
        $wp_customize->add_section( 'milliondollartheme_header_layout_section', array( 'title' => __( 'Header Elements', 'milliondollartheme' ), 'panel' => 'milliondollartheme_header_panel', 'priority' => 10, ) );
        $wp_customize->add_setting( 'milliondollartheme_header_show_search_icon', array( 'default' => true, 'sanitize_callback' => 'milliondollartheme_sanitize_checkbox', 'transport' => 'refresh', ) );
        $wp_customize->add_control( 'milliondollartheme_header_show_search_icon', array( 'label' => __( 'Show Search Icon in Header', 'milliondollartheme' ), 'section' => 'milliondollartheme_header_layout_section', 'type' => 'checkbox', ) );
        $wp_customize->add_section( 'milliondollartheme_header_social_links_section', array( 'title' => __( 'Social Media Links (Header)', 'milliondollartheme' ), 'panel' => 'milliondollartheme_header_panel', 'priority' => 20, 'description' => __( 'Enter full URLs for your social media profiles. Icons will appear in the header.', 'milliondollartheme'), ) );
        $social_networks_header = array( 'twitter', 'facebook', 'instagram', 'linkedin', 'youtube' );
        foreach ( $social_networks_header as $network_header ) {
            $wp_customize->add_setting( 'milliondollartheme_header_social_' . $network_header, array( 'default' => '', 'sanitize_callback' => 'esc_url_raw', 'transport' => 'refresh' ) );
            $wp_customize->add_control( 'milliondollartheme_header_social_' . $network_header, array( 'label' => sprintf( __( '%s URL (Header)', 'milliondollartheme' ), ucfirst( $network_header ) ), 'section' => 'milliondollartheme_header_social_links_section', 'type' => 'url' ) );
        }

        // --- Footer Settings Panel ---
        $wp_customize->add_panel( 'milliondollartheme_footer_panel', array( 'title' => __( 'Footer Settings', 'milliondollartheme' ), 'priority' => 130, ) );
        $wp_customize->add_section( 'milliondollartheme_footer_copyright_section', array( 'title' => __( 'Copyright Text', 'milliondollartheme' ), 'panel' => 'milliondollartheme_footer_panel', 'priority' => 10, ) );
        $wp_customize->add_setting( 'milliondollartheme_footer_copyright_text', array( 'default' => sprintf( __( 'Copyright [year] %s. All rights reserved.', 'milliondollartheme' ), get_bloginfo( 'name', 'display' ) ), 'sanitize_callback' => 'wp_kses_post', 'transport' => 'postMessage', ) );
        $wp_customize->add_control( 'milliondollartheme_footer_copyright_text', array( 'label' => __( 'Copyright Text', 'milliondollartheme' ), 'description' => __( 'Use [year] to display current year automatically. HTML is allowed.', 'milliondollartheme' ), 'section' => 'milliondollartheme_footer_copyright_section', 'type' => 'textarea', ) );
        $wp_customize->add_section( 'milliondollartheme_footer_social_links_section', array( 'title' => __( 'Social Media Links (Footer)', 'milliondollartheme' ), 'panel' => 'milliondollartheme_footer_panel', 'priority' => 20, ) );
        $social_networks_footer = array( 'twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'github', 'pinterest', 'rss' );
        foreach ( $social_networks_footer as $network_footer ) {
            $wp_customize->add_setting( 'milliondollartheme_footer_social_' . $network_footer, array( 'default' => '', 'sanitize_callback' => 'esc_url_raw', 'transport' => 'refresh', ) );
            $wp_customize->add_control( 'milliondollartheme_footer_social_' . $network_footer, array( 'label' => sprintf( __( '%s URL', 'milliondollartheme' ), ucfirst( $network_footer ) ), 'section' => 'milliondollartheme_footer_social_links_section', 'type' => 'url' ) );
        }

        // --- SEO Schema Settings Section ---
        $wp_customize->add_section( 'milliondollartheme_seo_schema_settings', array( 'title' => __( 'SEO: Schema Markup', 'milliondollartheme' ), 'priority' => 150, 'description' => __( 'Settings for Organization and WebSite schema.org markup. Ensure your site name and tagline are set correctly under Site Identity.', 'milliondollartheme' ), ) );
        $wp_customize->add_setting( 'milliondollartheme_org_name', array( 'default' => get_bloginfo( 'name' ), 'sanitize_callback' => 'sanitize_text_field', 'transport' => 'postMessage', ) );
        $wp_customize->add_control( 'milliondollartheme_org_name', array( 'label' => __( 'Organization Name (for Schema)', 'milliondollartheme' ), 'section' => 'milliondollartheme_seo_schema_settings', 'type' => 'text', 'description' => __( 'Defaults to Site Title. Used for Organization schema.', 'milliondollartheme' ), ) );
        $wp_customize->add_setting( 'milliondollartheme_org_logo_url', array( 'default' => '', 'sanitize_callback' => 'esc_url_raw', 'transport' => 'postMessage', ) );
        $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'milliondollartheme_org_logo_url', array( 'label' => __( 'Organization Logo (for Schema)', 'milliondollartheme' ), 'section' => 'milliondollartheme_seo_schema_settings', 'description' => __( 'Upload or select your official organization logo. Recommended dimensions: at least 112x112px. Use a clear, identifiable image.', 'milliondollartheme' ), ) ) );
        $wp_customize->add_setting( 'milliondollartheme_website_alternate_name', array( 'default' => '', 'sanitize_callback' => 'sanitize_text_field', ) );
        $wp_customize->add_control( 'milliondollartheme_website_alternate_name', array( 'label' => __( 'Website Alternate Name (Optional)', 'milliondollartheme' ), 'section' => 'milliondollartheme_seo_schema_settings', 'type' => 'text', 'description' => __( 'An alternate name for your website, if applicable (e.g., an acronym).', 'milliondollartheme' ), ) );

        // --- Single Post Settings Section ---
        $wp_customize->add_section( 'milliondollartheme_single_post_settings', array( 'title' => __( 'Single Post Settings', 'milliondollartheme' ), 'priority' => 160, ) );
        $wp_customize->add_setting( 'milliondollartheme_show_social_share_buttons', array( 'default'   => true, 'sanitize_callback' => 'milliondollartheme_sanitize_checkbox', 'transport' => 'refresh', ) );
        $wp_customize->add_control( 'milliondollartheme_show_social_share_buttons', array( 'label' => __( 'Show Social Share Buttons on Single Posts', 'milliondollartheme' ), 'section' => 'milliondollartheme_single_post_settings', 'type' => 'checkbox', ) );

        // --- Performance Settings Panel ---
        $wp_customize->add_panel( 'milliondollartheme_performance_panel', array( 'title'    => __( 'Performance', 'milliondollartheme' ), 'priority' => 170, ) );
        $wp_customize->add_section( 'milliondollartheme_critical_css_section', array( 'title' => __( 'Critical CSS', 'milliondollartheme' ), 'panel' => 'milliondollartheme_performance_panel', 'priority' => 10, 'description' => __( 'For optimal Time to First Paint and Largest Contentful Paint, it is highly recommended to use a dedicated caching/optimization plugin that can generate and inline critical CSS for your pages. This theme is designed to be compatible with such plugins (e.g., WP Rocket, LiteSpeed Cache, Perfmatters). Manually implementing critical CSS is an advanced task and typically requires per-page generation.', 'milliondollartheme' ), ) );
        $wp_customize->add_setting( 'milliondollartheme_critical_css_info', array( 'default' => '', 'sanitize_callback' => '__return_empty_string' ) );
        $wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'milliondollartheme_critical_css_info', array( 'label' => __( 'Recommendation', 'milliondollartheme'), 'section' => 'milliondollartheme_critical_css_section', 'type' => 'hidden', 'description' => __( 'This section is for informational purposes. Please refer to plugin documentation for critical CSS setup.', 'milliondollartheme' ), ) ) );

    } // End function milliondollartheme_customize_register
endif;
add_action( 'customize_register', 'milliondollartheme_customize_register' );

// Default partial render callbacks
if ( ! function_exists( 'milliondollartheme_customize_partial_blogname' ) ) : /* ... */ endif;
if ( ! function_exists( 'milliondollartheme_customize_partial_blogdescription' ) ) : /* ... */ endif;
function milliondollartheme_customize_partial_blogname() { bloginfo( 'name' ); }
function milliondollartheme_customize_partial_blogdescription() { bloginfo( 'description' ); }


// Function to output customizer CSS
if ( ! function_exists( 'milliondollartheme_customizer_css' ) ) :
    function milliondollartheme_customizer_css() {
        $default_colors = array( 'primary_color' => '#0052D4', 'secondary_color' => '#C837C8', 'accent_color' => '#00C6AD', 'text_color_dark' => '#1A1A1A', 'text_color_light' => '#F0F0F0', 'background_color_light'  => '#FFFFFF', );
        ?>
        <style type="text/css" id="milliondollartheme-customizer-css">
            :root {
                /* Layout Variables */
                <?php
                $container_width = get_theme_mod( 'milliondollartheme_container_width', '1200px' );
                if ( $container_width === 'fluid-full' ) { echo '--site-content-max-width: 100%;'; } else { echo '--site-content-max-width: ' . esc_attr( $container_width ) . ';'; } echo "\n";
                $sidebar_pos_for_ratio = get_theme_mod( 'milliondollartheme_default_sidebar_position', 'right' );
                if ($sidebar_pos_for_ratio !== 'none') {
                    $ratio = get_theme_mod( 'milliondollartheme_content_sidebar_ratio', '70/30' );
                    $parts = explode('/', $ratio);
                    if (count($parts) === 2) { echo '                --content-width-percentage: ' . intval($parts[0]) . '%;' . "\n"; echo '                --sidebar-width-percentage: ' . intval($parts[1]) . '%;' . "\n"; }
                } else { echo '                --content-width-percentage: 100%;' . "\n"; echo '                --sidebar-width-percentage: 0%;' . "\n"; }
                ?>

                /* Color Variables */
                <?php $primary_color = get_theme_mod('milliondollartheme_primary_color', $default_colors['primary_color']); ?>
                --primary-color: <?php echo esc_attr( $primary_color ); ?>;
                --primary-color-rgb: <?php echo milliondollartheme_hex_to_rgb_str_customizer( $primary_color ); ?>;
                <?php $secondary_color = get_theme_mod('milliondollartheme_secondary_color', $default_colors['secondary_color']); ?>
                --secondary-color: <?php echo esc_attr( $secondary_color ); ?>;
                --secondary-color-rgb: <?php echo milliondollartheme_hex_to_rgb_str_customizer( $secondary_color ); ?>;
                <?php $accent_color = get_theme_mod('milliondollartheme_accent_color', $default_colors['accent_color']); ?>
                --accent-color: <?php echo esc_attr( $accent_color ); ?>;
                --accent-color-rgb: <?php echo milliondollartheme_hex_to_rgb_str_customizer( $accent_color ); ?>;
                <?php $text_color_dark = get_theme_mod('milliondollartheme_text_color_dark', $default_colors['text_color_dark']); ?>
                --text-color-dark: <?php echo esc_attr( $text_color_dark ); ?>;
                --text-color-dark-rgb: <?php echo milliondollartheme_hex_to_rgb_str_customizer( $text_color_dark ); ?>;
                <?php $text_color_light = get_theme_mod('milliondollartheme_text_color_light', $default_colors['text_color_light']); ?>
                --text-color-light: <?php echo esc_attr( $text_color_light ); ?>;
                --text-color-light-rgb: <?php echo milliondollartheme_hex_to_rgb_str_customizer( $text_color_light ); ?>;
                <?php $background_color_light = get_theme_mod('milliondollartheme_background_color_light', $default_colors['background_color_light']); ?>
                --background-color-light: <?php echo esc_attr( $background_color_light ); ?>;
                --background-color-light-rgb: <?php echo milliondollartheme_hex_to_rgb_str_customizer( $background_color_light ); ?>;

                /* Typography Variables */
                <?php
                $body_font_choice = get_theme_mod('milliondollartheme_body_font', 'Inter');
                $headings_font_choice = get_theme_mod('milliondollartheme_headings_font', 'Montserrat');
                $body_font_stack = function_exists('milliondollartheme_get_font_stack') ? milliondollartheme_get_font_stack($body_font_choice) : '-apple-system, sans-serif';
                $headings_font_stack = function_exists('milliondollartheme_get_font_stack') ? milliondollartheme_get_font_stack($headings_font_choice) : '-apple-system, sans-serif';
                ?>
                --font-family-body: <?php echo esc_attr( $body_font_stack ); ?>;
                --font-family-heading: <?php echo esc_attr( $headings_font_stack ); ?>;
                --global-font-size: <?php echo esc_attr( get_theme_mod('milliondollartheme_body_font_size', '16px') ); ?>;
                --global-line-height: <?php echo esc_attr( get_theme_mod('milliondollartheme_body_line_height', '1.7') ); ?>;
            } /* End :root */
        </style>
        <?php
        // Custom @font-face CSS
        $custom_font_face_css = get_theme_mod( 'milliondollartheme_custom_font_face_css', '' );
        if ( ! empty( $custom_font_face_css ) ) {
            echo '<style type="text/css" id="milliondollartheme-custom-font-face">' . wp_strip_all_tags( stripslashes( $custom_font_face_css ) ) . '</style>';
        }
        ?>
        <?php
    }
    add_action( 'wp_head', 'milliondollartheme_customizer_css' );
endif;

// Function to filter body classes
if ( ! function_exists( 'milliondollartheme_customizer_body_classes' ) ) : /* ... */ endif;
function milliondollartheme_customizer_body_classes( $classes ) { $sidebar_pos = get_theme_mod( 'milliondollartheme_default_sidebar_position', 'right' ); if ( $sidebar_pos === 'left' ) { $classes[] = 'has-sidebar-left'; } elseif ( $sidebar_pos === 'right' ) { $classes[] = 'has-sidebar-right'; } else { $classes[] = 'no-sidebar'; $classes[] = 'full-width-content'; } return $classes; }
add_filter( 'body_class', 'milliondollartheme_customizer_body_classes' );

// Sanitize select choices
if ( ! function_exists( 'milliondollartheme_sanitize_select' ) ) : /* ... */ endif;
function milliondollartheme_sanitize_select( $input, $setting ) { $input = sanitize_key( $input ); $choices = $setting->manager->get_control( $setting->id )->choices; return ( array_key_exists( $input, $choices ) ? $input : $setting->default ); }

// Sanitize checkbox
if ( ! function_exists( 'milliondollartheme_sanitize_checkbox' ) ) :
    function milliondollartheme_sanitize_checkbox( $checked ) {
        return ( ( isset( $checked ) && true == $checked ) ? true : false );
    }
endif;

// Example active_callback
if ( ! function_exists( 'milliondollartheme_is_sidebar_active_globally_callback' ) ) : /* ... */ endif;
function milliondollartheme_is_sidebar_active_globally_callback() { return get_theme_mod( 'milliondollartheme_default_sidebar_position', 'right' ) !== 'none'; }

// Helper function for hex to rgb
if ( ! function_exists( 'milliondollartheme_hex_to_rgb_str_customizer' ) ) : /* ... */ endif;
function milliondollartheme_hex_to_rgb_str_customizer( $hex ) { $hex = str_replace( '#', '', $hex ); if ( strlen( $hex ) == 3 ) { $r = hexdec( substr( $hex, 0, 1 ) . substr( $hex, 0, 1 ) ); $g = hexdec( substr( $hex, 1, 1 ) . substr( $hex, 1, 1 ) ); $b = hexdec( substr( $hex, 2, 1 ) . substr( $hex, 2, 1 ) ); } elseif ( strlen( $hex ) == 6 ) { $r = hexdec( substr( $hex, 0, 2 ) ); $g = hexdec( substr( $hex, 2, 2 ) ); $b = hexdec( substr( $hex, 4, 2 ) ); } else { return '0,0,0'; } return $r . ',' . $g . ',' . $b; }

// Helper function to get font stack from font name
if ( ! function_exists( 'milliondollartheme_get_font_stack' ) ) :
    function milliondollartheme_get_font_stack( $font_name ) {
        $google_fonts_map = array( 'Roboto' => '"Roboto", sans-serif', 'Open Sans' => '"Open Sans", sans-serif', 'Lato' => '"Lato", sans-serif', 'Montserrat' => '"Montserrat", sans-serif', 'Poppins' => '"Poppins", sans-serif', 'Inter' => '"Inter", sans-serif', 'Nunito Sans' => '"Nunito Sans", sans-serif', 'Merriweather' => '"Merriweather", serif', 'Playfair Display' => '"Playfair Display", serif', 'System Stack' => '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' );
        return isset( $google_fonts_map[$font_name] ) ? $google_fonts_map[$font_name] : $google_fonts_map['System Stack'];
    }
endif;

?>

[end of wp-content/themes/milliondollartheme/inc/customizer.php]
