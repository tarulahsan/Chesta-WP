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
    // Enqueue Google Fonts
    wp_enqueue_style( 'milliondollartheme-google-fonts', 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&family=Inter:wght@400;700&display=swap', array(), null );

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
            'icon'  => 'star-filled', // Or a custom SVG icon URL
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
                // error_log("Registered block: " . $block_folder); // For debugging
            }
        }
    }
}
add_action( 'init', 'milliondollartheme_register_blocks' );

/**
 * Render callback for the Posts Display block.
 *
 * @param array $attributes Block attributes.
 * @return string HTML content for the block.
 */
function milliondollartheme_render_posts_display_block( $attributes ) {
    $args = array(
        'post_type'      => 'post',
        'posts_per_page' => isset( $attributes['numberOfPosts'] ) ? intval( $attributes['numberOfPosts'] ) : 3,
        'orderby'        => isset( $attributes['orderBy'] ) ? sanitize_text_field( $attributes['orderBy'] ) : 'date',
        'order'          => isset( $attributes['order'] ) ? sanitize_text_field( $attributes['order'] ) : 'DESC',
        'post_status'    => 'publish',
    );

    if ( ! empty( $attributes['categories'] ) ) {
        $args['category_name'] = sanitize_text_field( $attributes['categories'] ); // Accepts comma-separated slugs
    }

    $query = new WP_Query( $args );

    if ( ! $query->have_posts() ) {
        return '<p>' . esc_html__( 'No posts found.', 'milliondollartheme' ) . '</p>';
    }

    $layout = isset( $attributes['layout'] ) ? $attributes['layout'] : 'grid';
    $columns = isset( $attributes['columns'] ) ? intval( $attributes['columns'] ) : 3;
    $display_image = isset( $attributes['displayFeaturedImage'] ) ? $attributes['displayFeaturedImage'] : true;
    $display_title = isset( $attributes['displayPostTitle'] ) ? $attributes['displayPostTitle'] : true;
    $display_date = isset( $attributes['displayPostDate'] ) ? $attributes['displayPostDate'] : true;
    $display_excerpt = isset( $attributes['displayPostExcerpt'] ) ? $attributes['displayPostExcerpt'] : true;
    $excerpt_length = isset( $attributes['excerptLength'] ) ? intval( $attributes['excerptLength'] ) : 25;
    $item_style = isset( $attributes['postsDisplayStyle'] ) ? $attributes['postsDisplayStyle'] : 'default';


    $classes = array(
        'wp-block-milliondollartheme-posts-display',
        'layout-' . esc_attr( $layout ),
        'item-style-' . esc_attr( $item_style )
    );
    if ( $layout === 'grid' ) {
        $classes[] = 'columns-' . esc_attr( $columns );
    }
    if ( isset($attributes['align']) && $attributes['align']){
      $classes[] = 'align' . esc_attr($attributes['align']);
    }


    $output = '<div class="' . esc_attr( implode( ' ', $classes ) ) . '">';

    while ( $query->have_posts() ) {
        $query->the_post();
        $output .= '<article class="post-item">'; // Individual post item

        if ( $display_image && has_post_thumbnail() ) {
            $output .= '<div class="post-item-thumbnail">';
            $output .= '<a href="' . esc_url( get_permalink() ) . '">' . get_the_post_thumbnail( get_the_ID(), 'medium_large' ) . '</a>'; // Use appropriate image size
            $output .= '</div>';
        }

        $output .= '<div class="post-item-content">';
        if ( $display_title ) {
            $output .= '<h3 class="post-item-title"><a href="' . esc_url( get_permalink() ) . '">' . get_the_title() . '</a></h3>';
        }

        if ( $display_date ) {
            $output .= '<p class="post-item-date">' . get_the_date() . '</p>';
        }

        if ( $display_excerpt ) {
            $excerpt = get_the_excerpt();
            $trimmed_excerpt = wp_trim_words( $excerpt, $excerpt_length, ' &hellip;' );
            $output .= '<div class="post-item-excerpt">' . wpautop( $trimmed_excerpt ) . '</div>';
        }
        $output .= '</div>'; // .post-item-content

        $output .= '</article>';
    }
    wp_reset_postdata();

    $output .= '</div>'; // .wp-block-milliondollartheme-posts-display

    return $output;
}

EOF
