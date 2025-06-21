<?php
/**
 * MillionDollarTheme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package MillionDollarTheme
 */

if ( ! defined( 'MILLIONDOLLARTHEME_VERSION' ) ) {
    // Replace the version number of the theme on each release.
    define( 'MILLIONDOLLARTHEME_VERSION', '0.0.1' );
}

if ( ! function_exists( 'milliondollartheme_setup' ) ) :
    /**
     * Sets up theme defaults and registers support for various WordPress features.
     *
     * Note that this function is hooked into the after_setup_theme hook, which
     * runs before the init hook. The init hook is too late for some features, such
     * as indicating support for post thumbnails.
     */
    function milliondollartheme_setup() {
        /*
         * Make theme available for translation.
         * Translations can be filed in the /languages/ directory.
         * If you're building a theme based on MillionDollarTheme, use a find and replace
         * to change 'milliondollartheme' to the name of your theme in all the template files.
         */
        load_theme_textdomain( 'milliondollartheme', get_template_directory() . '/languages' );

        // Add default posts and comments RSS feed links to head.
        add_theme_support( 'automatic-feed-links' );

        /*
         * Let WordPress manage the document title.
         * By adding theme support, we declare that this theme does not use a
         * hard-coded <title> tag in the document head, and expect WordPress to
         * provide it for us.
         */
        add_theme_support( 'title-tag' );

        /*
         * Enable support for Post Thumbnails on posts and pages.
         *
         * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
         */
        add_theme_support( 'post-thumbnails' );

        // This theme uses wp_nav_menu() in one location.
        register_nav_menus(
            array(
                'menu-1' => esc_html__( 'Primary', 'milliondollartheme' ),
            )
        );

        /*
         * Switch default core markup for search form, comment form, and comments
         * to output valid HTML5.
         */
        add_theme_support(
            'html5',
            array(
                'search-form',
                'comment-form',
                'comment-list',
                'gallery',
                'caption',
                'style',
                'script',
            )
        );

        // Set up the WordPress core custom background feature.
        add_theme_support(
            'custom-background',
            apply_filters(
                'milliondollartheme_custom_background_args',
                array(
                    'default-color' => 'ffffff',
                    'default-image' => '',
                )
            )
        );

        // Add theme support for selective refresh for widgets.
        add_theme_support( 'customize-selective-refresh-widgets' );

        /**
         * Add support for core custom logo.
         *
         * @link https://codex.wordpress.org/Theme_Logo
         */
        add_theme_support(
            'custom-logo',
            array(
                'height'      => 250,
                'width'       => 250,
                'flex-width'  => true,
                'flex-height' => true,
            )
        );

        // Gutenberg Support
        add_theme_support( 'wp-block-styles' );
        add_theme_support( 'align-wide' );
        add_theme_support( 'editor-styles' ); // Enables add_editor_style()
        add_editor_style( 'editor-style.css' ); // Path to your editor styles

        // Define editor color palette
        add_theme_support( 'editor-color-palette', array(
            array(
                'name'  => esc_html__( 'Primary Color', 'milliondollartheme' ),
                'slug'  => 'primary',
                'color' => 'var(--primary-color)',
            ),
            array(
                'name'  => esc_html__( 'Secondary Color', 'milliondollartheme' ),
                'slug'  => 'secondary',
                'color' => 'var(--secondary-color)',
            ),
            array(
                'name'  => esc_html__( 'Accent Color', 'milliondollartheme' ),
                'slug'  => 'accent',
                'color' => 'var(--accent-color)',
            ),
            array(
                'name'  => esc_html__( 'Text Dark', 'milliondollartheme' ),
                'slug'  => 'text-dark',
                'color' => 'var(--text-color-dark)',
            ),
            array(
                'name'  => esc_html__( 'Text Light', 'milliondollartheme' ),
                'slug'  => 'text-light',
                'color' => 'var(--text-color-light)',
            ),
        ) );

        // Define editor font sizes
        add_theme_support( 'editor-font-sizes', array(
            array(
                'name' => esc_html__( 'Small', 'milliondollartheme' ),
                'size' => 12,
                'slug' => 'small'
            ),
            array(
                'name' => esc_html__( 'Normal', 'milliondollartheme' ),
                'size' => 16,
                'slug' => 'normal'
            ),
            array(
                'name' => esc_html__( 'Medium', 'milliondollartheme' ),
                'size' => 20,
                'slug' => 'medium'
            ),
            array(
                'name' => esc_html__( 'Large', 'milliondollartheme' ),
                'size' => 24,
                'slug' => 'large'
            ),
            array(
                'name' => esc_html__( 'Huge', 'milliondollartheme' ),
                'size' => 32,
                'slug' => 'huge'
            ),
        ) );

    }
endif;
add_action( 'after_setup_theme', 'milliondollartheme_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function milliondollartheme_content_width() {
    $GLOBALS['content_width'] = apply_filters( 'milliondollartheme_content_width', 640 );
}
add_action( 'after_setup_theme', 'milliondollartheme_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function milliondollartheme_widgets_init() {
    register_sidebar(
        array(
            'name'          => esc_html__( 'Sidebar', 'milliondollartheme' ),
            'id'            => 'sidebar-1',
            'description'   => esc_html__( 'Add widgets here.', 'milliondollartheme' ),
            'before_widget' => '<section id="%1$s" class="widget %2$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        )
    );
}
add_action( 'widgets_init', 'milliondollartheme_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function milliondollartheme_scripts() {
    // Enqueue Google Fonts (base set, can be overridden by Customizer font choices via CSS variables)
    wp_enqueue_style( 'milliondollartheme-google-fonts', 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&family=Inter:wght@400;700&display=swap', array(), null );

    // Conditionally Enqueue Font Awesome from CDN
    if ( get_theme_mod( 'milliondollartheme_enable_fontawesome', false ) ) {
        wp_enqueue_style( 'fontawesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css', array(), '5.15.4' );
    }

    // Enqueue Alpine.js from CDN, defer loading
    wp_enqueue_script( 'alpinejs', 'https://cdn.jsdelivr.net/npm/alpinejs@3.14.9/dist/cdn.min.js', array(), MILLIONDOLLARTHEME_VERSION, true ); // true for in_footer

    wp_enqueue_style( 'milliondollartheme-style', get_stylesheet_uri(), array(), MILLIONDOLLARTHEME_VERSION );
    wp_style_add_data( 'milliondollartheme-style', 'rtl', 'replace' );

    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }
}
add_action( 'wp_enqueue_scripts', 'milliondollartheme_scripts' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
    require get_template_directory() . '/inc/jetpack.php';
}

/**
 * Breadcrumbs functionality.
 */
require get_template_directory() . '/inc/breadcrumbs.php';

/**
 * Add defer attribute to the Alpine.js script tag.
 */
function milliondollartheme_add_defer_to_alpinejs( $tag, $handle, $src ) {
    if ( 'alpinejs' === $handle ) {
        $tag = str_replace( ' src=', ' defer src=', $tag );
    }
    return $tag;
}
add_filter( 'script_loader_tag', 'milliondollartheme_add_defer_to_alpinejs', 10, 3 );

/**
 * Register custom Gutenberg blocks.
 */
function milliondollartheme_register_blocks() {
    // Define a custom block category
    add_filter( 'block_categories_all', function( $categories ) {
        $categories[] = array(
            'slug'  => 'milliondollartheme-blocks',
            'title' => __( 'MillionDollarTheme Blocks', 'milliondollartheme' ),
            'icon'  => 'star-filled',
        );
        return $categories;
    }, 10, 1 );

    // Register blocks by iterating over directories in the /blocks/ folder
    $theme_blocks_dir = get_template_directory() . '/blocks/';
    if ( file_exists( $theme_blocks_dir ) ) {
        $block_folders = scandir( $theme_blocks_dir );
        foreach ( $block_folders as $block_folder ) {
            if ( $block_folder === '.' || $block_folder === '..' ) {
                continue;
            }
            $block_json_file = $theme_blocks_dir . $block_folder . '/block.json';
            if ( file_exists( $block_json_file ) ) {
                register_block_type( $theme_blocks_dir . $block_folder );
            }
        }
    }
}
add_action( 'init', 'milliondollartheme_register_blocks' );

/**
 * Render callback for the Posts Display block.
 */
function milliondollartheme_render_posts_display_block( $attributes ) {
    $default_attrs = array(
        'numberOfPosts' => 3, 'layout' => 'grid', 'columns' => 3,
        'displayFeaturedImage' => true, 'featuredImageSize' => 'medium_large',
        'displayPostTitle' => true, 'titleTag' => 'h3',
        'displayPostDate' => true, 'displayPostExcerpt' => true, 'excerptLength' => 25,
        'displayReadMoreLink' => false, 'readMoreText' => __('Read More', 'milliondollartheme'),
        'categories' => '', 'orderBy' => 'date', 'order' => 'DESC',
        'postsDisplayStyle' => 'default', 'align' => '',
    );
    $attr = array_merge( $default_attrs, $attributes );
    $args = array(
        'post_type'      => 'post', 'posts_per_page' => intval( $attr['numberOfPosts'] ),
        'orderby'        => sanitize_text_field( $attr['orderBy'] ), 'order' => sanitize_text_field( $attr['order'] ),
        'post_status'    => 'publish',
    );
    if ( ! empty( $attr['categories'] ) ) { $args['category_name'] = sanitize_text_field( $attr['categories'] ); }
    $query = new WP_Query( $args );
    if ( ! $query->have_posts() ) { return '<p class="no-posts-found">' . esc_html__( 'No posts found matching your criteria.', 'milliondollartheme' ) . '</p>'; }
    $wrapper_classes = array( 'wp-block-milliondollartheme-posts-display', 'layout-' . esc_attr( $attr['layout'] ), 'item-style-' . esc_attr( $attr['postsDisplayStyle'] ) );
    if ( $attr['layout'] === 'grid' ) { $wrapper_classes[] = 'columns-' . esc_attr( $attr['columns'] ); }
    if ( !empty($attr['align']) ){ $wrapper_classes[] = 'align' . esc_attr($attr['align']); }
    $title_tag = tag_escape( $attr['titleTag'] );
    ob_start(); ?>
    <div class="<?php echo esc_attr( implode( ' ', $wrapper_classes ) ); ?>">
        <?php while ( $query->have_posts() ) : $query->the_post(); ?>
            <article <?php post_class( 'post-item' ); ?>>
                <?php if ( $attr['displayFeaturedImage'] && has_post_thumbnail() ) : ?>
                    <div class="post-item-thumbnail">
                        <a href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
                            <?php the_post_thumbnail( get_the_ID(), esc_attr($attr['featuredImageSize']) ); ?>
                        </a>
                    </div>
                <?php endif; ?>
                <div class="post-item-content-wrapper">
                    <?php if ( $attr['displayPostTitle'] ) : ?>
                        <<?php echo $title_tag; ?> class="post-item-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></<?php echo $title_tag; ?>>
                    <?php endif; ?>
                    <div class="post-item-meta">
                       <?php if ( $attr['displayPostDate'] ) : ?><span class="post-item-date"><?php echo get_the_date(); ?></span><?php endif; ?>
                    </div>
                    <?php if ( $attr['displayPostExcerpt'] ) : ?>
                        <div class="post-item-excerpt"><?php echo wpautop( wp_trim_words( get_the_excerpt(), intval( $attr['excerptLength'] ), ' &hellip;' ) ); ?></div>
                    <?php endif; ?>
                    <?php if ( $attr['displayReadMoreLink'] ) : ?>
                        <p class="post-item-read-more"><a href="<?php the_permalink(); ?>" class="cta-button is-style-outline is-size-small"><?php echo esc_html( $attr['readMoreText'] ); ?></a></p>
                    <?php endif; ?>
                </div>
            </article>
        <?php endwhile; ?>
    </div>
    <?php wp_reset_postdata(); return ob_get_clean();
}

/**
 * Specific registration for dynamic blocks that require a PHP render_callback.
 */
function milliondollartheme_register_dynamic_block_callbacks() {
    if ( function_exists('milliondollartheme_render_posts_display_block') && class_exists('WP_Block_Type_Registry') && WP_Block_Type_Registry::get_instance()->is_registered('milliondollartheme/posts-display') ) {
        unregister_block_type('milliondollartheme/posts-display');
    }
    if ( function_exists('milliondollartheme_render_posts_display_block') ) {
        register_block_type( 'milliondollartheme/posts-display', array( 'render_callback' => 'milliondollartheme_render_posts_display_block', ) );
    }
}
add_action( 'init', 'milliondollartheme_register_dynamic_block_callbacks', 11 );

/**
 * [year] shortcode
 * Returns the current year.
 */
if ( ! function_exists( 'milliondollartheme_year_shortcode' ) ) {
    function milliondollartheme_year_shortcode() {
        return date('Y');
    }
    add_shortcode( 'year', 'milliondollartheme_year_shortcode' );
}

/**
 * Helper function to render social media icons from Customizer settings.
 */
if ( ! function_exists( 'milliondollartheme_get_social_media_icons' ) ) {
    function milliondollartheme_get_social_media_icons( $context = 'footer' ) {
        $social_networks = array( 'twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'github', 'pinterest', 'rss' );
        if ($context === 'header') {
             $social_networks = array( 'twitter', 'facebook', 'instagram', 'linkedin', 'youtube' );
        }
        $output = '<div class="social-media-links social-links-' . esc_attr($context) . '">';
        $has_links = false;
        foreach ( $social_networks as $network ) {
            $url = get_theme_mod( 'milliondollartheme_' . $context . '_social_' . $network, '' );
            if ( ! empty( $url ) ) {
                $has_links = true;
                $icon_slug = $network;
                if ($network === 'facebook') $icon_slug = 'facebook-f';
                $output .= sprintf(
                    '<a href="%1$s" class="social-link social-link-%2$s" target="_blank" rel="noopener noreferrer" aria-label="%3$s"><span class="dashicons dashicons-%4$s" title="%5$s"></span></a>',
                    esc_url( $url ),
                    esc_attr( $network ),
                    sprintf(esc_attr__('Follow us on %s', 'milliondollartheme'), ucfirst($network)),
                    esc_attr($icon_slug),
                    ucfirst(esc_attr($network))
                );
            }
        }
        $output .= '</div>';
        return $has_links ? $output : '';
    }
}

/**
 * Output JSON-LD Schema for Organization and WebSite.
 */
if ( ! function_exists( 'milliondollartheme_output_base_schema' ) ) {
    function milliondollartheme_output_base_schema() {
        if ( is_admin() ) {
            return;
        }

        $site_name = get_bloginfo( 'name' );
        $site_url = home_url( '/' );
        $site_description = get_bloginfo( 'description' );

        $org_name = get_theme_mod( 'milliondollartheme_org_name', $site_name );
        $org_logo_url = get_theme_mod( 'milliondollartheme_org_logo_url', '' );

        if ( empty($org_logo_url) && function_exists('get_custom_logo') ) {
            $custom_logo_id = get_theme_mod( 'custom_logo' );
            if ( $custom_logo_id ) {
                $image_data = wp_get_attachment_image_src( $custom_logo_id, 'full' );
                if ($image_data && isset($image_data[0])) { // Check if $image_data is valid and has URL
                    $org_logo_url = $image_data[0];
                }
            }
        }

        $schema = array(
            '@context' => 'https://schema.org',
            '@graph'   => array()
        );

        $website_schema = array(
            '@type' => 'WebSite',
            '@id'   => $site_url . '#website',
            'url'   => $site_url,
            'name'  => $site_name,
            'description' => $site_description,
        );
        $website_alternate_name = get_theme_mod('milliondollartheme_website_alternate_name', '');
        if (!empty($website_alternate_name)) {
            $website_schema['alternateName'] = $website_alternate_name;
        }
        // Example SearchAction
        // $website_schema['potentialAction'] = array(
        //     '@type' => 'SearchAction',
        //     'target' => array(
        //          '@type' => 'EntryPoint',
        //          'urlTemplate' => $site_url . '?s={search_term_string}'
        //      ),
        //     'query-input' => 'required name=search_term_string',
        // );
        $schema['@graph'][] = $website_schema;

        $organization_schema = array(
            '@type' => 'Organization',
            '@id'   => $site_url . '#organization',
            'name'  => $org_name,
            'url'   => $site_url,
        );
        if ( ! empty( $org_logo_url ) ) {
            $logo_data = array(
                '@type' => 'ImageObject',
                'url' => esc_url($org_logo_url),
            );
            $logo_id = attachment_url_to_postid($org_logo_url);
            if ($logo_id) {
                $logo_meta = wp_get_attachment_metadata($logo_id);
                if (isset($logo_meta['width'])) $logo_data['width'] = $logo_meta['width'];
                if (isset($logo_meta['height'])) $logo_data['height'] = $logo_meta['height'];
            }
            $organization_schema['logo'] = $logo_data;
        }
        // Example of adding social links to Organization schema (sameAs)
        // $social_links_for_schema = array();
        // $defined_socials = array('twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'github'); // Match Customizer
        // foreach ($defined_socials as $social_network) {
        //     $social_url = get_theme_mod('milliondollartheme_footer_social_' . $social_network, ''); // Assuming footer for main org links
        //     if (!empty($social_url)) {
        //         $social_links_for_schema[] = $social_url;
        //     }
        // }
        // if (!empty($social_links_for_schema)) { $organization_schema['sameAs'] = array_unique($social_links_for_schema); }

        $schema['@graph'][] = $organization_schema;

        if ( ! empty( $schema['@graph'] ) ) {
            echo "\n" . '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT ) . '</script>' . "\n";
        }
    }
}
add_action( 'wp_head', 'milliondollartheme_output_base_schema', 5 );
