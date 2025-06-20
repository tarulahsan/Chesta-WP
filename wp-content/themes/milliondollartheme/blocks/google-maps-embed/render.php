<?php
/**
 * Google Maps Embed Block Render Callback.
 *
 * @param array $attributes Block attributes.
 * @return string HTML content for the block.
 */

$defaults = array(
    'query' => 'Googleplex, Mountain View, CA',
    'zoom' => 14,
    'mapType' => 'roadmap',
    'height' => '450px',
    'preventScroll' => true,
    'showMarker' => true, // This attribute is more conceptual for the basic iframe 'place' mode.
    'mapStyle' => 'default',
    'customMapStyleJSON' => '', // Not used by iframe embed, for future JS API.
    'align' => '',
    'borderRadius' => 'var(--border-radius-md, 8px)', // Added default
);
$attr = array_merge($defaults, $attributes);

// Fetch API Key (example: from theme options)
$api_key = get_theme_mod('milliondollartheme_gmaps_api_key', '');
if (empty($api_key) && defined('MILLIONDOLLARTHEME_GMAPS_API_KEY_CONSTANT')) {
    $api_key = MILLIONDOLLARTHEME_GMAPS_API_KEY_CONSTANT;
}
// Fallback for development if no key is set - this should be removed for production.
// if (empty($api_key) && WP_DEBUG) { $api_key = "YOUR_DEV_API_KEY"; }


$wrapper_classes = array(
    'wp-block-milliondollartheme-google-maps-embed',
    'map-style-' . esc_attr($attr['mapStyle'])
);
if ( !empty($attr['align']) ){
  $wrapper_classes[] = 'align' . esc_attr($attr['align']);
}

$wrapper_styles = 'height: ' . esc_attr($attr['height']) . ';';
if ( !empty($attr['borderRadius']) ) {
   $wrapper_styles .= 'border-radius:' . esc_attr($attr['borderRadius']) . ';';
   $wrapper_styles .= 'overflow: hidden;'; // Important for border-radius to affect iframe
}


ob_start();

if ( empty($api_key) || $api_key === 'YOUR_GOOGLE_MAPS_API_KEY_HERE' ) {
    // Output wrapper so block alignment still works in editor for the message
    ?>
    <div class="<?php echo esc_attr(implode(' ', $wrapper_classes)); ?>" style="<?php echo esc_attr($wrapper_styles); ?>">
        <p class="map-api-key-error-message">
            <?php
            if ( current_user_can('edit_theme_options') ) { // Show detailed message only to users who can fix it.
                echo sprintf(
                    /* translators: %s: Link to documentation or settings page */
                    wp_kses_post( __( 'Google Maps API Key is missing or invalid. Please configure it in theme settings. <a href="%s" target="_blank">Learn More (Placeholder)</a>', 'milliondollartheme' ) ),
                    '#' // Placeholder for actual link
                );
            } else {
                esc_html_e( 'Map display is temporarily unavailable.', 'milliondollartheme' );
            }
            ?>
        </p>
    </div>
    <?php
    echo ob_get_clean(); // Use echo because this is a render file, not a callback returning a string
    return; // Must return from render file if outputted directly
}


$iframe_src_base = 'https://www.google.com/maps/embed/v1/';
$embed_mode = 'place';
$query_param = rawurlencode(sanitize_text_field($attr['query']));

$iframe_src_params = array(
    'key' => $api_key,
    'q' => $query_param,
    'maptype' => esc_attr($attr['mapType']),
    'zoom' => intval($attr['zoom'])
);

$iframe_src = $iframe_src_base . $embed_mode . '?' . http_build_query($iframe_src_params);

?>
<div class="<?php echo esc_attr(implode(' ', $wrapper_classes)); ?>" style="<?php echo esc_attr($wrapper_styles); ?>">
    <iframe
        title="<?php esc_attr_e('Google Map of', 'milliondollartheme'); ?> <?php echo esc_attr($attr['query']); ?>"
        width="100%"
        height="100%"
        style="border:0;"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
        src="<?php echo esc_url($iframe_src); ?>">
    </iframe>
    <?php if ( $attr['preventScroll'] ) : ?>
        <div class="map-scroll-blocker" onclick="this.style.display='none';" title="<?php esc_attr_e('Click to interact with map', 'milliondollartheme'); ?>"></div>
    <?php endif; ?>
</div>
<?php
$html_output = ob_get_clean();
echo $html_output; // WordPress captures this echoed output for render files
// No explicit return needed at the very end for "render": "file:..." type blocks
?>
