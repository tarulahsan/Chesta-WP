<?php
/**
 * MillionDollarTheme Customizer
 *
 * @package MillionDollarTheme
 */

if ( ! function_exists( 'milliondollartheme_customize_register' ) ) :
    /**
     * Add postMessage support for site title and description for the Theme Customizer.
     * Also adds Theme Layout, Color, Typography, Header, Footer, WooCommerce, SEO, Single Post, and Performance Settings.
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
        $wp_customize->add_control( 'milliondollartheme_custom_font_face_css', array( 'label' => __( 'Custom @font-face CSS', 'milliondollartheme' ), 'section' => 'milliondollartheme_typography_settings', 'type' => 'textarea', 'description' => __('For advanced users. Paste complete @font-face rules here for self-hosted fonts. IMPORTANT: Ensure font file paths are correct AND include `font-display: swap;` in each rule for optimal performance and to avoid layout shifts.', 'milliondollartheme') ) );

        // --- Header Settings Panel ---
        $wp_customize->add_panel( 'milliondollartheme_header_panel', array( 'title' => __( 'Header Settings', 'milliondollartheme' ), 'priority' => 120, ) );
        $wp_customize->add_section( 'milliondollartheme_header_layout_section', array( 'title' => __( 'Header Layout & Elements', 'milliondollartheme' ), 'panel' => 'milliondollartheme_header_panel', 'priority' => 10, ) );

        // Header Layout
        $wp_customize->add_setting( 'milliondollartheme_header_layout', array(
            'default'           => 'logo_left_nav_right',
            'sanitize_callback' => 'milliondollartheme_sanitize_select',
            'transport'         => 'refresh', // Requires refresh as HTML structure might change
        ) );
        $wp_customize->add_control( 'milliondollartheme_header_layout', array(
            'label'   => __( 'Header Layout', 'milliondollartheme' ),
            'section' => 'milliondollartheme_header_layout_section',
            'type'    => 'select',
            'choices' => array(
                'logo_left_nav_right' => __( 'Logo Left - Nav Right', 'milliondollartheme' ),
                'logo_center_nav_below' => __( 'Logo Center - Nav Below', 'milliondollartheme' ),
                // Add more layouts later if needed
            ),
        ) );

        // Sticky Header
        $wp_customize->add_setting( 'milliondollartheme_sticky_header_enabled', array(
            'default'           => false,
            'sanitize_callback' => 'milliondollartheme_sanitize_checkbox',
            'transport'         => 'refresh', // Refresh to apply body class and JS
        ) );
        $wp_customize->add_control( 'milliondollartheme_sticky_header_enabled', array(
            'label'   => __( 'Enable Sticky Header', 'milliondollartheme' ),
            'section' => 'milliondollartheme_header_layout_section',
            'type'    => 'checkbox',
        ) );

        // Show Search Icon (existing)
        $wp_customize->add_setting( 'milliondollartheme_header_show_search_icon', array( 'default' => true, 'sanitize_callback' => 'milliondollartheme_sanitize_checkbox', 'transport' => 'refresh', ) );
        $wp_customize->add_control( 'milliondollartheme_header_show_search_icon', array( 'label' => __( 'Show Search Icon in Header', 'milliondollartheme' ), 'section' => 'milliondollartheme_header_layout_section', 'type' => 'checkbox', ) );

        // Social Links Section (existing)
        $wp_customize->add_section( 'milliondollartheme_header_social_links_section', array( 'title' => __( 'Social Media Links (Header)', 'milliondollartheme' ), 'panel' => 'milliondollartheme_header_panel', 'priority' => 20, 'description' => __( 'Enter full URLs for your social media profiles. Icons will appear in the header.', 'milliondollartheme'), ) );
        $social_networks_header = array( 'twitter', 'facebook', 'instagram', 'linkedin', 'youtube' );
        foreach ( $social_networks_header as $network_header ) {
            $wp_customize->add_setting( 'milliondollartheme_header_social_' . $network_header, array( 'default' => '', 'sanitize_callback' => 'esc_url_raw', 'transport' => 'refresh' ) );
            $wp_customize->add_control( 'milliondollartheme_header_social_' . $network_header, array( 'label' => sprintf( __( '%s URL (Header)', 'milliondollartheme' ), ucfirst( $network_header ) ), 'section' => 'milliondollartheme_header_social_links_section', 'type' => 'url' ) );
        }


        // --- Footer Settings Panel ---
        $wp_customize->add_panel( 'milliondollartheme_footer_panel', array( 'title' => __( 'Footer Settings', 'milliondollartheme' ), 'priority' => 130, ) );

        // Footer Layout Section
        $wp_customize->add_section( 'milliondollartheme_footer_layout_section', array(
            'title'       => __( 'Footer Layout & Widgets', 'milliondollartheme' ),
            'panel'       => 'milliondollartheme_footer_panel',
            'priority'    => 5,
        ) );

        $wp_customize->add_setting( 'milliondollartheme_footer_widget_columns', array(
            'default'           => 3,
            'sanitize_callback' => 'milliondollartheme_sanitize_select',
            'transport'         => 'refresh',
        ) );
        $wp_customize->add_control( 'milliondollartheme_footer_widget_columns', array(
            'label'   => __( 'Footer Widget Columns', 'milliondollartheme' ),
            'section' => 'milliondollartheme_footer_layout_section',
            'type'    => 'select',
            'choices' => array(
                '1' => __( '1 Column', 'milliondollartheme' ),
                '2' => __( '2 Columns', 'milliondollartheme' ),
                '3' => __( '3 Columns', 'milliondollartheme' ),
                '4' => __( '4 Columns', 'milliondollartheme' ),
            ),
        ) );

        // Scroll to Top Button
        $wp_customize->add_setting( 'milliondollartheme_scroll_to_top_enabled', array(
            'default'           => true,
            'sanitize_callback' => 'milliondollartheme_sanitize_checkbox',
            'transport'         => 'refresh',
        ) );
        $wp_customize->add_control( 'milliondollartheme_scroll_to_top_enabled', array(
            'label'   => __( 'Enable "Scroll to Top" Button', 'milliondollartheme' ),
            'section' => 'milliondollartheme_footer_layout_section', // Or a general 'Extras' section
            'type'    => 'checkbox',
        ) );

        // Copyright Section (existing)
        $wp_customize->add_section( 'milliondollartheme_footer_copyright_section', array( 'title' => __( 'Copyright Text', 'milliondollartheme' ), 'panel' => 'milliondollartheme_footer_panel', 'priority' => 10, ) );
        $wp_customize->add_setting( 'milliondollartheme_footer_copyright_text', array( 'default' => sprintf( __( 'Copyright [year] %s. All rights reserved.', 'milliondollartheme' ), get_bloginfo( 'name', 'display' ) ), 'sanitize_callback' => 'wp_kses_post', 'transport' => 'postMessage', ) );
        $wp_customize->add_control( 'milliondollartheme_footer_copyright_text', array( 'label' => __( 'Copyright Text', 'milliondollartheme' ), 'description' => __( 'Use [year] to display current year automatically. HTML is allowed.', 'milliondollartheme' ), 'section' => 'milliondollartheme_footer_copyright_section', 'type' => 'textarea', ) );

        // Footer Social Links Section (existing)
        $wp_customize->add_section( 'milliondollartheme_footer_social_links_section', array( 'title' => __( 'Social Media Links (Footer)', 'milliondollartheme' ), 'panel' => 'milliondollartheme_footer_panel', 'priority' => 20, ) );
        $social_networks_footer = array( 'twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'github', 'pinterest', 'rss' );
        foreach ( $social_networks_footer as $network_footer ) {
            $wp_customize->add_setting( 'milliondollartheme_footer_social_' . $network_footer, array( 'default' => '', 'sanitize_callback' => 'esc_url_raw', 'transport' => 'refresh', ) );
            $wp_customize->add_control( 'milliondollartheme_footer_social_' . $network_footer, array( 'label' => sprintf( __( '%s URL', 'milliondollartheme' ), ucfirst( $network_footer ) ), 'section' => 'milliondollartheme_footer_social_links_section', 'type' => 'url' ) );
        }

        // --- WooCommerce Settings Panel ---
        if ( class_exists( 'WooCommerce' ) ) {
            $wp_customize->add_panel( 'milliondollartheme_woocommerce_panel', array(
                'title'    => __( 'WooCommerce Shop', 'milliondollartheme' ),
                'priority' => 140,
            ) );

            // Shop Page Settings Section
            $wp_customize->add_section( 'milliondollartheme_woo_shop_page_section', array(
                'title'    => __( 'Shop / Product Archives', 'milliondollartheme' ),
                'panel'    => 'milliondollartheme_woocommerce_panel',
                'priority' => 10,
            ) );
            $wp_customize->add_setting( 'milliondollartheme_woo_shop_columns', array( 'default' => 3, 'sanitize_callback' => 'absint', 'transport' => 'refresh' ) ); // transport refresh for class change
            $wp_customize->add_control( 'milliondollartheme_woo_shop_columns', array(
                'label' => __( 'Products per Row (Desktop)', 'milliondollartheme' ), 'section' => 'milliondollartheme_woo_shop_page_section', 'type' => 'select',
                'choices' => array( '2' => __( '2 Columns', 'milliondollartheme' ), '3' => __( '3 Columns', 'milliondollartheme' ), '4' => __( '4 Columns', 'milliondollartheme' ) )
            ) );

            // Enhanced Product Card Style
            $wp_customize->add_setting( 'milliondollartheme_woo_product_card_style', array(
                'default' => 'default',
                'sanitize_callback' => 'sanitize_key',
                'transport' => 'refresh' // Refresh needed for body class change potentially
            ) );
            $wp_customize->add_control( 'milliondollartheme_woo_product_card_style', array(
                'label' => __( 'Product Card Style', 'milliondollartheme' ), 'section' => 'milliondollartheme_woo_shop_page_section', 'type' => 'select',
                'choices' => array(
                    'default'         => __( 'Default (Glassy)', 'milliondollartheme' ),
                    'minimal'         => __( 'Minimal Card', 'milliondollartheme' ),
                    'outline'         => __( 'Outline Card', 'milliondollartheme' ),
                    'modern-overlay'  => __( 'Modern (Image Overlay on Hover)', 'milliondollartheme' )
                )
            ) );

            // Show Sale Badge
            $wp_customize->add_setting( 'milliondollartheme_woo_show_sale_badge', array(
                'default'           => true,
                'sanitize_callback' => 'milliondollartheme_sanitize_checkbox',
                'transport'         => 'refresh', // May need refresh if hooks are conditional
            ) );
            $wp_customize->add_control( 'milliondollartheme_woo_show_sale_badge', array(
                'label'   => __( 'Show "Sale!" Badge', 'milliondollartheme' ),
                'section' => 'milliondollartheme_woo_shop_page_section',
                'type'    => 'checkbox',
            ) );

            // Show Quick View Button (Placeholder)
            $wp_customize->add_setting( 'milliondollartheme_woo_show_quick_view_button', array(
                'default'           => false,
                'sanitize_callback' => 'milliondollartheme_sanitize_checkbox',
                'transport'         => 'refresh',
            ) );
            $wp_customize->add_control( 'milliondollartheme_woo_show_quick_view_button', array(
                'label'       => __( 'Show "Quick View" Button (Placeholder)', 'milliondollartheme' ),
                'section'     => 'milliondollartheme_woo_shop_page_section',
                'type'        => 'checkbox',
                'description' => __( 'Note: Actual Quick View functionality requires a compatible plugin or further custom development.', 'milliondollartheme' ),
            ) );

            // Single Product Page Settings Section
            $wp_customize->add_section( 'milliondollartheme_woo_single_product_section', array(
                'title'    => __( 'Single Product Page', 'milliondollartheme' ),
                'panel'    => 'milliondollartheme_woocommerce_panel',
                'priority' => 20,
            ) );
            $wp_customize->add_setting( 'milliondollartheme_woo_related_products_columns', array( 'default' => 4, 'sanitize_callback' => 'absint' ) );
            $wp_customize->add_control( 'milliondollartheme_woo_related_products_columns', array(
                'label' => __( 'Related/Up-Sell Products per Row', 'milliondollartheme' ), 'section' => 'milliondollartheme_woo_single_product_section', 'type' => 'select',
                'choices' => array( '2' => __( '2 Columns', 'milliondollartheme' ), '3' => __( '3 Columns', 'milliondollartheme' ), '4' => __( '4 Columns', 'milliondollartheme' ) )
            ) );

            // Product Gallery Layout
            $wp_customize->add_setting( 'milliondollartheme_woo_single_gallery_layout', array(
                'default'           => 'default',
                'sanitize_callback' => 'milliondollartheme_sanitize_select',
                'transport'         => 'refresh', // Requires refresh for structural changes / class changes
            ) );
            $wp_customize->add_control( 'milliondollartheme_woo_single_gallery_layout', array(
                'label'   => __( 'Product Gallery Layout', 'milliondollartheme' ),
                'section' => 'milliondollartheme_woo_single_product_section',
                'type'    => 'select',
                'choices' => array(
                    'default'           => __( 'Default (WooCommerce)', 'milliondollartheme' ),
                    'thumbnails_left'   => __( 'Thumbnails Left', 'milliondollartheme' ),
                    'thumbnails_bottom' => __( 'Thumbnails Bottom (Horizontal Strip)', 'milliondollartheme' ),
                    // 'stacked'        => __( 'Stacked Images (No Thumbnails)', 'milliondollartheme' ),
                ),
            ) );

            // Show Upsells
            $wp_customize->add_setting( 'milliondollartheme_woo_show_upsells', array(
                'default'           => true,
                'sanitize_callback' => 'milliondollartheme_sanitize_checkbox',
                'transport'         => 'refresh',
            ) );
            $wp_customize->add_control( 'milliondollartheme_woo_show_upsells', array(
                'label'   => __( 'Show Up-sell Products', 'milliondollartheme' ),
                'section' => 'milliondollartheme_woo_single_product_section',
                'type'    => 'checkbox',
            ) );

            // Show Related Products (control visibility - already have column control)
            $wp_customize->add_setting( 'milliondollartheme_woo_show_related_products', array(
                'default'           => true,
                'sanitize_callback' => 'milliondollartheme_sanitize_checkbox',
                'transport'         => 'refresh',
            ) );
            $wp_customize->add_control( 'milliondollartheme_woo_show_related_products', array(
                'label'   => __( 'Show Related Products', 'milliondollartheme' ),
                'section' => 'milliondollartheme_woo_single_product_section',
                'type'    => 'checkbox',
            ) );


            $wp_customize->add_setting( 'milliondollartheme_woo_show_sku', array( 'default' => false, 'sanitize_callback' => 'milliondollartheme_sanitize_checkbox' ) );
            $wp_customize->add_control( 'milliondollartheme_woo_show_sku', array( 'label' => __( 'Show Product SKU', 'milliondollartheme' ), 'section' => 'milliondollartheme_woo_single_product_section', 'type' => 'checkbox' ) );
            $wp_customize->add_setting( 'milliondollartheme_woo_show_categories', array( 'default' => true, 'sanitize_callback' => 'milliondollartheme_sanitize_checkbox' ) );
            $wp_customize->add_control( 'milliondollartheme_woo_show_categories', array( 'label' => __( 'Show Product Categories', 'milliondollartheme' ), 'section' => 'milliondollartheme_woo_single_product_section', 'type' => 'checkbox' ) );
            $wp_customize->add_setting( 'milliondollartheme_woo_show_tags', array( 'default' => true, 'sanitize_callback' => 'milliondollartheme_sanitize_checkbox' ) );
            $wp_customize->add_control( 'milliondollartheme_woo_show_tags', array( 'label' => __( 'Show Product Tags', 'milliondollartheme' ), 'section' => 'milliondollartheme_woo_single_product_section', 'type' => 'checkbox' ) );
        } // End if class_exists WooCommerce

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

        // Show/Hide Social Share Buttons
        $wp_customize->add_setting( 'milliondollartheme_show_social_share_buttons', array( 'default'   => true, 'sanitize_callback' => 'milliondollartheme_sanitize_checkbox', 'transport' => 'refresh', ) );
        $wp_customize->add_control( 'milliondollartheme_show_social_share_buttons', array( 'label' => __( 'Show Social Share Buttons', 'milliondollartheme' ), 'section' => 'milliondollartheme_single_post_settings', 'type' => 'checkbox', ) );

        // Show/Hide Publish Date
        $wp_customize->add_setting( 'milliondollartheme_single_show_publish_date', array( 'default'   => true, 'sanitize_callback' => 'milliondollartheme_sanitize_checkbox', 'transport' => 'refresh', ) );
        $wp_customize->add_control( 'milliondollartheme_single_show_publish_date', array( 'label' => __( 'Show Publish Date', 'milliondollartheme' ), 'section' => 'milliondollartheme_single_post_settings', 'type' => 'checkbox', ) );

        // Show/Hide Post Author Name
        $wp_customize->add_setting( 'milliondollartheme_single_show_author_name', array( 'default'   => true, 'sanitize_callback' => 'milliondollartheme_sanitize_checkbox', 'transport' => 'refresh', ) );
        $wp_customize->add_control( 'milliondollartheme_single_show_author_name', array( 'label' => __( 'Show Post Author Name', 'milliondollartheme' ), 'section' => 'milliondollartheme_single_post_settings', 'type' => 'checkbox', ) );

        // Show/Hide Categories
        $wp_customize->add_setting( 'milliondollartheme_single_show_categories', array( 'default'   => true, 'sanitize_callback' => 'milliondollartheme_sanitize_checkbox', 'transport' => 'refresh', ) );
        $wp_customize->add_control( 'milliondollartheme_single_show_categories', array( 'label' => __( 'Show Categories Link', 'milliondollartheme' ), 'section' => 'milliondollartheme_single_post_settings', 'type' => 'checkbox', ) );

        // Show/Hide Tags
        $wp_customize->add_setting( 'milliondollartheme_single_show_tags', array( 'default'   => true, 'sanitize_callback' => 'milliondollartheme_sanitize_checkbox', 'transport' => 'refresh', ) );
        $wp_customize->add_control( 'milliondollartheme_single_show_tags', array( 'label' => __( 'Show Tags Link', 'milliondollartheme' ), 'section' => 'milliondollartheme_single_post_settings', 'type' => 'checkbox', ) );

        // Featured Image Position
        $wp_customize->add_setting( 'milliondollartheme_single_featured_image_pos', array(
            'default'           => 'above_title',
            'sanitize_callback' => 'milliondollartheme_sanitize_select',
            'transport'         => 'refresh',
        ) );
        $wp_customize->add_control( 'milliondollartheme_single_featured_image_pos', array(
            'label'   => __( 'Featured Image Position', 'milliondollartheme' ),
            'section' => 'milliondollartheme_single_post_settings',
            'type'    => 'select',
            'choices' => array(
                'above_title' => __( 'Above Content & Title', 'milliondollartheme' ),
                'below_title' => __( 'Below Title, Above Content', 'milliondollartheme' ),
                'hidden'      => __( 'Hidden', 'milliondollartheme' ),
            ),
        ) );

        // Author Bio Box
        $wp_customize->add_setting( 'milliondollartheme_single_show_author_bio', array(
            'default'           => true,
            'sanitize_callback' => 'milliondollartheme_sanitize_checkbox',
            'transport'         => 'refresh',
        ) );
        $wp_customize->add_control( 'milliondollartheme_single_show_author_bio', array(
            'label'   => __( 'Show Author Bio Box', 'milliondollartheme' ),
            'section' => 'milliondollartheme_single_post_settings',
            'type'    => 'checkbox',
            'description' => __( 'Displays a box with the author\'s biographical info if available.', 'milliondollartheme' ),
        ) );

        // Related Posts Section
        $wp_customize->add_setting( 'milliondollartheme_single_show_related_posts', array(
            'default'           => true,
            'sanitize_callback' => 'milliondollartheme_sanitize_checkbox',
            'transport'         => 'refresh',
        ) );
        $wp_customize->add_control( 'milliondollartheme_single_show_related_posts', array(
            'label'   => __( 'Show Related Posts Section', 'milliondollartheme' ),
            'section' => 'milliondollartheme_single_post_settings',
            'type'    => 'checkbox',
            'description' => __( 'Displays a section of related posts based on categories or tags.', 'milliondollartheme' ),
        ) );

        // Blockquote Style
        $wp_customize->add_setting( 'milliondollartheme_single_blockquote_style', array(
            'default'           => 'default',
            'sanitize_callback' => 'milliondollartheme_sanitize_select',
            'transport'         => 'postMessage', // CSS change can be live previewed
        ) );
        $wp_customize->add_control( 'milliondollartheme_single_blockquote_style', array(
            'label'   => __( 'Blockquote Style', 'milliondollartheme' ),
            'section' => 'milliondollartheme_single_post_settings',
            'type'    => 'select',
            'choices' => array(
                'default'         => __( 'Default (Simple Left Border)', 'milliondollartheme' ),
                'enhanced-quote'  => __( 'Enhanced (e.g., Centered, Larger Quote Marks)', 'milliondollartheme' ),
            ),
        ) );

        // --- Page Settings Section ---
        $wp_customize->add_section( 'milliondollartheme_page_settings', array(
            'title'       => __( 'Page Settings', 'milliondollartheme' ),
            'priority'    => 162, // After Single Post, Before Blog/Archive
        ) );

        // Show/Hide Page Title
        $wp_customize->add_setting( 'milliondollartheme_page_show_title', array(
            'default'           => true,
            'sanitize_callback' => 'milliondollartheme_sanitize_checkbox',
            'transport'         => 'refresh',
        ) );
        $wp_customize->add_control( 'milliondollartheme_page_show_title', array(
            'label'   => __( 'Show Page Title', 'milliondollartheme' ),
            'section' => 'milliondollartheme_page_settings',
            'type'    => 'checkbox',
        ) );

        // --- Blog / Archive Settings Section ---
        $wp_customize->add_section( 'milliondollartheme_blog_archive_settings', array(
            'title'       => __( 'Blog / Archive Settings', 'milliondollartheme' ),
            'priority'    => 165, // After Single Post Settings
        ) );

        // Archive Layout
        $wp_customize->add_setting( 'milliondollartheme_archive_layout', array(
            'default'           => 'list',
            'sanitize_callback' => 'milliondollartheme_sanitize_select',
            'transport'         => 'refresh',
        ) );
        $wp_customize->add_control( 'milliondollartheme_archive_layout', array(
            'label'   => __( 'Archive Layout', 'milliondollartheme' ),
            'section' => 'milliondollartheme_blog_archive_settings',
            'type'    => 'select',
            'choices' => array(
                'list' => __( 'List', 'milliondollartheme' ),
                'grid' => __( 'Grid', 'milliondollartheme' ),
            ),
        ) );

        // Grid Columns
        $wp_customize->add_setting( 'milliondollartheme_archive_grid_columns', array(
            'default'           => 3,
            'sanitize_callback' => 'milliondollartheme_sanitize_select',
            'transport'         => 'refresh',
        ) );
        $wp_customize->add_control( 'milliondollartheme_archive_grid_columns', array(
            'label'   => __( 'Grid Columns', 'milliondollartheme' ),
            'section' => 'milliondollartheme_blog_archive_settings',
            'type'    => 'select',
            'choices' => array(
                '2' => __( '2 Columns', 'milliondollartheme' ),
                '3' => __( '3 Columns', 'milliondollartheme' ),
                '4' => __( '4 Columns', 'milliondollartheme' ),
            ),
            'active_callback' => function() use ($wp_customize) {
                return 'grid' === $wp_customize->get_setting('milliondollartheme_archive_layout')->value();
            },
        ) );

        // Excerpt Length
        $wp_customize->add_setting( 'milliondollartheme_archive_excerpt_length', array(
            'default'           => 25,
            'sanitize_callback' => 'absint',
            'transport'         => 'refresh',
        ) );
        $wp_customize->add_control( 'milliondollartheme_archive_excerpt_length', array(
            'label'   => __( 'Excerpt Length (number of words)', 'milliondollartheme' ),
            'section' => 'milliondollartheme_blog_archive_settings',
            'type'    => 'number',
            'input_attrs' => array( 'min' => 10, 'max' => 100, 'step' => 1 ),
        ) );

        // Show Post Date on Archives
        $wp_customize->add_setting( 'milliondollartheme_archive_show_date', array( 'default' => true, 'sanitize_callback' => 'milliondollartheme_sanitize_checkbox', 'transport' => 'refresh' ) );
        $wp_customize->add_control( 'milliondollartheme_archive_show_date', array( 'label' => __( 'Show Post Date', 'milliondollartheme' ), 'section' => 'milliondollartheme_blog_archive_settings', 'type' => 'checkbox' ) );

        // Show Author on Archives
        $wp_customize->add_setting( 'milliondollartheme_archive_show_author', array( 'default' => true, 'sanitize_callback' => 'milliondollartheme_sanitize_checkbox', 'transport' => 'refresh' ) );
        $wp_customize->add_control( 'milliondollartheme_archive_show_author', array( 'label' => __( 'Show Post Author', 'milliondollartheme' ), 'section' => 'milliondollartheme_blog_archive_settings', 'type' => 'checkbox' ) );

        // Show Categories on Archives
        $wp_customize->add_setting( 'milliondollartheme_archive_show_categories', array( 'default' => true, 'sanitize_callback' => 'milliondollartheme_sanitize_checkbox', 'transport' => 'refresh' ) );
        $wp_customize->add_control( 'milliondollartheme_archive_show_categories', array( 'label' => __( 'Show Categories Link', 'milliondollartheme' ), 'section' => 'milliondollartheme_blog_archive_settings', 'type' => 'checkbox' ) );

        // Show Tags on Archives
        $wp_customize->add_setting( 'milliondollartheme_archive_show_tags', array( 'default' => false, 'sanitize_callback' => 'milliondollartheme_sanitize_checkbox', 'transport' => 'refresh' ) );
        $wp_customize->add_control( 'milliondollartheme_archive_show_tags', array( 'label' => __( 'Show Tags Link', 'milliondollartheme' ), 'section' => 'milliondollartheme_blog_archive_settings', 'type' => 'checkbox' ) );

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

            <?php
            // Blockquote Style specific CSS
            $blockquote_style = get_theme_mod( 'milliondollartheme_single_blockquote_style', 'default' );
            if ( 'enhanced-quote' === $blockquote_style ) : ?>
            .entry-content blockquote {
                border-left: none;
                padding: var(--spacing-md) var(--spacing-lg);
                margin-left: 0;
                margin-right: 0;
                text-align: center;
                background-color: rgba(var(--primary-color-rgb), 0.05);
                border-radius: var(--border-radius-md);
                position: relative;
            }
            .entry-content blockquote::before,
            .entry-content blockquote::after {
                font-family: serif; /* Or a specific quote font */
                font-size: 3em; /* Larger quote marks */
                color: rgba(var(--primary-color-rgb), 0.2);
                position: absolute;
                line-height: 1;
            }
            .entry-content blockquote::before {
                content: "\201C"; /* Left double quote */
                top: 0.1em;
                left: var(--spacing-sm);
            }
            .entry-content blockquote::after {
                content: "\201D"; /* Right double quote */
                bottom: -0.1em; /* Adjust for visual centering */
                right: var(--spacing-sm);
            }
            .entry-content blockquote p {
                font-size: 1.2em; /* Slightly larger text for enhanced quotes */
                font-style: italic;
                margin-bottom: var(--spacing-sm);
            }
            .entry-content blockquote cite,
            .entry-content blockquote footer {
                font-size: 0.9em;
                font-style: normal;
                color: var(--text-color-muted-darker);
                display: block;
                margin-top: var(--spacing-sm);
            }
            <?php endif; ?>
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
if ( ! function_exists( 'milliondollartheme_customizer_body_classes' ) ) :
    function milliondollartheme_customizer_body_classes( $classes ) {
        // Sidebar position
        $sidebar_pos = get_theme_mod( 'milliondollartheme_default_sidebar_position', 'right' );
        if ( $sidebar_pos === 'left' ) {
            $classes[] = 'has-sidebar-left';
        } elseif ( $sidebar_pos === 'right' ) {
            $classes[] = 'has-sidebar-right';
        } else {
            $classes[] = 'no-sidebar';
            $classes[] = 'full-width-content';
        }

        // Sticky Header
        if ( get_theme_mod( 'milliondollartheme_sticky_header_enabled', false ) ) {
            $classes[] = 'sticky-header-enabled-body'; // Used by js/main.js to activate sticky logic
        }

        // Header Layout
        $header_layout = get_theme_mod( 'milliondollartheme_header_layout', 'logo_left_nav_right' );
        $classes[] = 'header-style-' . sanitize_html_class( $header_layout );


        return $classes;
    }
endif;
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
