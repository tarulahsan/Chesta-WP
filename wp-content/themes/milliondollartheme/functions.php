<?php
/**
 * MillionDollarTheme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package MillionDollarTheme
 */

if ( ! defined( 'MILLIONDOLLARTHEME_VERSION' ) ) {
    define( 'MILLIONDOLLARTHEME_VERSION', '0.0.1' );
}

if ( ! function_exists( 'milliondollartheme_setup' ) ) :
    function milliondollartheme_setup() {
        load_theme_textdomain( 'milliondollartheme', get_template_directory() . '/languages' );
        add_theme_support( 'automatic-feed-links' );
        add_theme_support( 'title-tag' );
        add_theme_support( 'post-thumbnails' );
        register_nav_menus( array( 'menu-1' => esc_html__( 'Primary', 'milliondollartheme' ) ) );
        add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script', ) );
        add_theme_support( 'custom-background', apply_filters( 'milliondollartheme_custom_background_args', array( 'default-color' => 'ffffff', 'default-image' => '', ) ) );
        add_theme_support( 'customize-selective-refresh-widgets' );
        add_theme_support( 'custom-logo', array( 'height' => 250, 'width' => 250, 'flex-width'  => true, 'flex-height' => true, ) );
        add_theme_support( 'wp-block-styles' );
        add_theme_support( 'align-wide' );
        add_theme_support( 'editor-styles' );
        add_editor_style( 'editor-style.css' );
        // Color Palette and Font Sizes are intentionally omitted here for brevity as they were long. Assume they are correctly in place.
    }
endif;
add_action( 'after_setup_theme', 'milliondollartheme_setup' );

function milliondollartheme_content_width() { $GLOBALS['content_width'] = apply_filters( 'milliondollartheme_content_width', 640 ); }
add_action( 'after_setup_theme', 'milliondollartheme_content_width', 0 );

function milliondollartheme_widgets_init() { register_sidebar( array( 'name' => esc_html__( 'Sidebar', 'milliondollartheme' ), 'id' => 'sidebar-1', 'description' => esc_html__( 'Add widgets here.', 'milliondollartheme' ), 'before_widget' => '<section id="%1$s" class="widget %2$s">', 'after_widget'  => '</section>', 'before_title'  => '<h2 class="widget-title">', 'after_title' => '</h2>', ) ); }
add_action( 'widgets_init', 'milliondollartheme_widgets_init' );

function milliondollartheme_scripts() {
    wp_enqueue_style( 'milliondollartheme-google-fonts', 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&family=Inter:wght@400;700&display=swap', array(), null );
    if ( get_theme_mod( 'milliondollartheme_enable_fontawesome', false ) ) {
        wp_enqueue_style( 'fontawesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css', array(), '5.15.4' );
    }
    wp_enqueue_script( 'alpinejs', 'https://cdn.jsdelivr.net/npm/alpinejs@3.14.9/dist/cdn.min.js', array(), MILLIONDOLLARTHEME_VERSION, true );
    wp_enqueue_style( 'swiper-css', 'https://unpkg.com/swiper@8/swiper-bundle.min.css', array(), '8.4.7' );
    wp_enqueue_script( 'swiper-js', 'https://unpkg.com/swiper@8/swiper-bundle.min.js', array(), '8.4.7', true );
    wp_enqueue_script( 'imagesloaded', 'https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js', array(), '5.0.0', true );
    wp_enqueue_script( 'masonry-layout', 'https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js', array('imagesloaded'), '4.2.2', true );
    wp_enqueue_style( 'milliondollartheme-style', get_stylesheet_uri(), array(), MILLIONDOLLARTHEME_VERSION );
    wp_style_add_data( 'milliondollartheme-style', 'rtl', 'replace' );
    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }
}
add_action( 'wp_enqueue_scripts', 'milliondollartheme_scripts' );

require get_template_directory() . '/inc/custom-header.php';
require get_template_directory() . '/inc/template-tags.php';
require get_template_directory() . '/inc/template-functions.php';
require get_template_directory() . '/inc/customizer.php';
if ( defined( 'JETPACK__VERSION' ) ) { require get_template_directory() . '/inc/jetpack.php'; }
require get_template_directory() . '/inc/breadcrumbs.php';

function milliondollartheme_add_defer_to_alpinejs( $tag, $handle, $src ) { if ( 'alpinejs' === $handle ) { $tag = str_replace( ' src=', ' defer src=', $tag ); } return $tag; }
add_filter( 'script_loader_tag', 'milliondollartheme_add_defer_to_alpinejs', 10, 3 );

function milliondollartheme_register_blocks() { /* ... block registration ... */ }
add_action( 'init', 'milliondollartheme_register_blocks' );

/**
 * Render callback for the Posts Display block.
 * (Optimized with no_found_rows and transient caching)
 *
 * @param array $attributes Block attributes.
 * @return string HTML content for the block.
 */
function milliondollartheme_render_posts_display_block( $attributes ) {
    // Transient Caching: Try to get cached HTML first.
    $transient_key = 'mdt_posts_display_' . md5( wp_json_encode( $attributes ) );
    $cached_html = get_transient( $transient_key );
    if ( false !== $cached_html ) {
        return $cached_html;
    }

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
        'post_type'      => 'post',
        'posts_per_page' => intval( $attr['numberOfPosts'] ),
        'orderby'        => sanitize_text_field( $attr['orderBy'] ),
        'order'          => sanitize_text_field( $attr['order'] ),
        'post_status'    => 'publish',
        'no_found_rows'  => true, // Optimization: Do not count total rows if not paginating
    );

    if ( ! empty( $attr['categories'] ) ) {
        $args['category_name'] = sanitize_text_field( $attr['categories'] );
    }

    $query = new WP_Query( $args );

    if ( ! $query->have_posts() ) {
        // Cache the "no posts found" message as well.
        $no_posts_message = '<p class="no-posts-found">' . esc_html__( 'No posts found matching your criteria.', 'milliondollartheme' ) . '</p>';
        set_transient( $transient_key, $no_posts_message, 5 * MINUTE_IN_SECONDS );
        return $no_posts_message;
    }

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
    <?php
    wp_reset_postdata();
    $output = ob_get_clean();
    set_transient( $transient_key, $output, 5 * MINUTE_IN_SECONDS ); // Cache for 5 minutes
    return $output;
}

function milliondollartheme_register_dynamic_block_callbacks() { if ( function_exists('milliondollartheme_render_posts_display_block') && class_exists('WP_Block_Type_Registry') && WP_Block_Type_Registry::get_instance()->is_registered('milliondollartheme/posts-display') ) { unregister_block_type('milliondollartheme/posts-display'); } if ( function_exists('milliondollartheme_render_posts_display_block') ) { register_block_type( 'milliondollartheme/posts-display', array( 'render_callback' => 'milliondollartheme_render_posts_display_block', ) ); } }
add_action( 'init', 'milliondollartheme_register_dynamic_block_callbacks', 11 );

if ( ! function_exists( 'milliondollartheme_year_shortcode' ) ) { function milliondollartheme_year_shortcode() { return date('Y'); } add_shortcode( 'year', 'milliondollartheme_year_shortcode' ); }
if ( ! function_exists( 'milliondollartheme_get_social_media_icons' ) ) { function milliondollartheme_get_social_media_icons( $context = 'footer' ) { /* ... social icons helper ... */ return ''; } }
if ( ! function_exists( 'milliondollartheme_output_base_schema' ) ) { function milliondollartheme_output_base_schema() { /* ... base schema ... */ } }
add_action( 'wp_head', 'milliondollartheme_output_base_schema', 5 );

/** AI Dashboard Functionality */
if ( ! function_exists( 'milliondollartheme_ai_dashboard_menu' ) ) { /* ... AI Dashboard Menu ... */ }
add_action( 'admin_menu', 'milliondollartheme_ai_dashboard_menu' );
if ( ! function_exists( 'milliondollartheme_ai_dashboard_page' ) ) { /* ... AI Dashboard Page ... */ }
function milliondollartheme_ai_dashboard_admin_styles() { /* ... placeholder ... */ }
// add_action( 'admin_enqueue_scripts', 'milliondollartheme_ai_dashboard_admin_styles' );
if ( ! function_exists( 'milliondollartheme_call_openai_api' ) ) { /* ... OpenAI API Call function ... */ }
// Shortened above functions for brevity in this view
function milliondollartheme_ai_dashboard_menu() { add_menu_page( __( 'AI Dashboard', 'milliondollartheme' ), __( 'AI Dashboard', 'milliondollartheme' ), 'manage_options', 'milliondollartheme-ai-dashboard', 'milliondollartheme_ai_dashboard_page', 'dashicons-brain', 25 ); }
function milliondollartheme_ai_dashboard_page() { if ( isset( $_POST['milliondollartheme_openai_api_key_nonce'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['milliondollartheme_openai_api_key_nonce'] ) ), 'milliondollartheme_save_openai_api_key' ) ) { if ( isset( $_POST['milliondollartheme_openai_api_key'] ) ) { $sanitized_key = sanitize_text_field( wp_unslash( $_POST['milliondollartheme_openai_api_key'] ) ); update_option( 'milliondollartheme_openai_api_key', $sanitized_key ); echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'OpenAI API Key saved.', 'milliondollartheme' ) . '</p></div>'; } } $current_openai_api_key = get_option( 'milliondollartheme_openai_api_key', '' ); $generated_meta_description = null; $meta_generator_error = null; if ( isset( $_POST['milliondollartheme_meta_desc_nonce'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash($_POST['milliondollartheme_meta_desc_nonce']) ), 'milliondollartheme_generate_meta_desc' ) ) { if ( !empty($current_openai_api_key) && isset( $_POST['mdt_source_text'] ) && function_exists('milliondollartheme_call_openai_api') ) { $source_text = sanitize_textarea_field( wp_unslash( $_POST['mdt_source_text'] ) ); if ( !empty($source_text) ) { $prompt = sprintf( esc_html__( 'Generate a concise and SEO-friendly meta description, around 150-160 characters, for the following text. Output only the meta description itself, nothing else: \n\n%s', 'milliondollartheme' ), $source_text ); $ai_args = array( 'max_tokens' => 70, 'temperature' => 0.5 ); $api_response = milliondollartheme_call_openai_api( $prompt, $ai_args ); if ( is_wp_error( $api_response ) ) { $meta_generator_error = $api_response->get_error_message(); } else { $generated_meta_description = esc_html( $api_response ); } } else { $meta_generator_error = esc_html__( 'Source text cannot be empty.', 'milliondollartheme' ); } } elseif (empty($current_openai_api_key)) { $meta_generator_error = esc_html__( 'OpenAI API Key is not set. Please configure it first.', 'milliondollartheme' ); } } ?> <div class="wrap mdt-ai-dashboard"> <h1><?php esc_html_e( 'MillionDollarTheme AI Dashboard', 'milliondollartheme' ); ?></h1> <p><?php esc_html_e( 'Welcome to the AI Dashboard. Configure your API keys and access powerful AI tools for content creation and SEO.', 'milliondollartheme' ); ?></p> <div id="dashboard-widgets-wrap"> <div id="dashboard-widgets" class="metabox-holder"> <div id="postbox-container-1" class="postbox-container"> <div class="meta-box-sortables"> <div class="postbox"> <h2 class="hndle"><span><?php esc_html_e( 'API Key Settings', 'milliondollartheme' ); ?></span></h2> <div class="inside"> <form method="POST" action=""> <?php wp_nonce_field( 'milliondollartheme_save_openai_api_key', 'milliondollartheme_openai_api_key_nonce' ); ?> <table class="form-table"> <tr valign="top"> <th scope="row"><label for="milliondollartheme_openai_api_key"><?php esc_html_e( 'OpenAI API Key', 'milliondollartheme' ); ?></label></th> <td> <input type="text" id="milliondollartheme_openai_api_key" name="milliondollartheme_openai_api_key" value="<?php echo esc_attr( $current_openai_api_key ); ?>" class="regular-text" /> <p class="description"><?php esc_html_e( 'Enter your OpenAI API key. Get it from your OpenAI account dashboard.', 'milliondollartheme' ); ?></p> </td> </tr> </table> <?php submit_button( __( 'Save OpenAI Key', 'milliondollartheme' ), 'primary', 'save_openai_key' ); ?> </form> <?php if ( !empty($current_openai_api_key) ) : ?> <p style="color: green;"><?php esc_html_e( 'OpenAI API Key is set.', 'milliondollartheme' ); ?></p> <p><small><?php printf( esc_html__( 'Current key starts with: %s', 'milliondollartheme' ), esc_html( substr( $current_openai_api_key, 0, 7 ) . '...' ) ); ?></small></p> <?php else : ?> <p style="color: red;"><?php esc_html_e( 'OpenAI API Key is NOT set.', 'milliondollartheme' ); ?></p> <?php endif; ?> <hr> <p><?php esc_html_e( 'Support for other AI services (Gemini, Anthropic, OpenRouter) will be added here.', 'milliondollartheme' ); ?></p> </div> </div> </div> </div> <div id="postbox-container-2" class="postbox-container"> <div class="meta-box-sortables"> <div class="postbox"> <h2 class="hndle"><span><?php esc_html_e( 'AI SEO Tools', 'milliondollartheme' ); ?></span></h2> <div class="inside"> <p><?php esc_html_e( 'Tools to help you optimize your content for search engines.', 'milliondollartheme' ); ?></p> <hr> <form method="POST" action="" class="mdt-ai-tool-form"> <?php wp_nonce_field( 'milliondollartheme_generate_meta_desc', 'milliondollartheme_meta_desc_nonce' ); ?> <h4><?php esc_html_e( 'Meta Description Generator', 'milliondollartheme' ); ?></h4> <p><label for="mdt_source_text"><?php esc_html_e( 'Paste your source text (e.g., blog post introduction or summary):', 'milliondollartheme' ); ?></label></p> <textarea id="mdt_source_text" name="mdt_source_text" rows="6" class="widefat"><?php echo isset($_POST['mdt_source_text']) ? esc_textarea(wp_unslash($_POST['mdt_source_text'])) : ''; ?></textarea> <p class="description"><?php esc_html_e( 'The AI will generate a concise, SEO-friendly meta description (around 155 characters) based on this text.', 'milliondollartheme' ); ?></p> <?php submit_button( __( 'Generate Meta Description', 'milliondollartheme' ), 'secondary', 'generate_meta_description' ); ?> </form> <?php if ( $meta_generator_error ) : ?> <div class="notice notice-error inline"><p><?php echo $meta_generator_error; ?></p></div> <?php endif; ?> <?php if ( $generated_meta_description ) : ?> <div class="notice notice-success inline"> <h4><?php esc_html_e( 'Suggested Meta Description:', 'milliondollartheme' ); ?></h4> <p id="generated-meta-desc"><?php echo $generated_meta_description; ?></p> <button type="button" class="button button-small" onclick="navigator.clipboard.writeText(document.getElementById('generated-meta-desc').innerText)"><?php esc_html_e( 'Copy to Clipboard', 'milliondollartheme' ); ?></button> </div> <?php endif; ?> <hr> <p><?php esc_html_e( 'More SEO tools (title generator, keyword suggestions) will be added here.', 'milliondollartheme' ); ?></p> </div> </div> </div> </div> <div id="postbox-container-3" class="postbox-container"> <div class="meta-box-sortables"> <div class="postbox"> <h2 class="hndle"><span><?php esc_html_e( 'AI Content Tools', 'milliondollartheme' ); ?></span></h2> <div class="inside"> <p><?php esc_html_e( 'Generate content ideas, outlines, or even draft paragraphs.', 'milliondollartheme' ); ?></p> <p><a href="#" class="button button-secondary"><?php esc_html_e( 'Explore Content Tools (TODO)', 'milliondollartheme' ); ?></a></p> </div> </div> </div> </div> </div> </div> <style> .mdt-ai-dashboard #dashboard-widgets.metabox-holder { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; } .mdt-ai-dashboard .postbox-container { width: 100%; } .mdt-ai-tool-form textarea { margin-bottom: 5px; } .mdt-ai-tool-form .description { margin-top: 0; margin-bottom: 15px; } .mdt-ai-dashboard .notice { margin-top: 15px; margin-bottom: 15px; padding: 10px; } .mdt-ai-dashboard .notice h4 { margin-top: 0; margin-bottom: 5px; } .mdt-ai-dashboard .notice button { margin-top: 5px; } </style> </div> <?php } }
function milliondollartheme_call_openai_api( $prompt, $args = array() ) { $api_key = get_option( 'milliondollartheme_openai_api_key', '' ); if ( empty( $api_key ) ) { return new WP_Error( 'api_key_missing', __( 'OpenAI API Key is not set.', 'milliondollartheme' ) ); } $default_args = array( 'model' => 'gpt-3.5-turbo-instruct', 'max_tokens' => 150, 'temperature' => 0.7, ); $merged_args = array_merge( $default_args, $args ); $request_body = array( 'model' => $merged_args['model'], 'prompt' => $prompt, 'max_tokens' => intval( $merged_args['max_tokens'] ), 'temperature' => floatval( $merged_args['temperature'] ), ); $api_url = 'https://api.openai.com/v1/completions'; $response = wp_remote_post( $api_url, array( 'method'  => 'POST', 'headers' => array( 'Authorization' => 'Bearer ' . $api_key, 'Content-Type'  => 'application/json', ), 'body' => json_encode( $request_body ), 'timeout' => 30, ) ); if ( is_wp_error( $response ) ) { return $response; } $response_code = wp_remote_retrieve_response_code( $response ); $response_body = wp_remote_retrieve_body( $response ); $decoded_body = json_decode( $response_body, true ); if ( $response_code !== 200 ) { $error_message = isset( $decoded_body['error']['message'] ) ? $decoded_body['error']['message'] : $response_body; return new WP_Error( 'api_http_error', sprintf(__( 'OpenAI API Error (%1$s): %2$s', 'milliondollartheme' ), $response_code, $error_message) ); } if (isset($decoded_body['choices'][0]['text'])) { return trim($decoded_body['choices'][0]['text']); } elseif (isset($decoded_body['choices'][0]['message']['content'])) { return trim($decoded_body['choices'][0]['message']['content']); } else { return new WP_Error( 'api_unexpected_response', __( 'Unexpected response format from OpenAI API.', 'milliondollartheme' ) ); } }
