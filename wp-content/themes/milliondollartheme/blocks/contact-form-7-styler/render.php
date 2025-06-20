<?php
/**
 * Contact Form 7 Styler Block Render Callback.
 *
 * @param array $attributes Block attributes.
 * @return string HTML content for the block.
 */

$defaults = array(
    'formId' => 0,
    'formStyle' => 'default', // default, glassy-fields, minimal
    'hideLabels' => false,
    'usePlaceholders' => true, // Assumes CF7 fields have placeholders for this to be effective
    'fieldTextColor' => null,
    'fieldBgColor' => null,
    'fieldBorderColor' => null,
    'fieldFocusBorderColor' => null,
    'fieldBorderRadius' => 'var(--border-radius-sm)',
    'fieldPadding' => 'var(--spacing-sm)',
    'buttonStyle' => 'primary', // primary, secondary, outline, glassy
    'buttonFullWidth' => false,
    'buttonAlignment' => 'left', // left, center, right
    'align' => '', // Block alignment
);
$attr = array_merge($defaults, $attributes);

$wrapper_classes = array(
    'wp-block-milliondollartheme-contact-form-7-styler',
    'cf7-style-' . esc_attr($attr['formStyle']),
    $attr['hideLabels'] ? 'cf7-labels-hidden' : '',
    $attr['usePlaceholders'] ? 'cf7-use-placeholders' : '',
    'cf7-button-style-' . esc_attr($attr['buttonStyle']),
    $attr['buttonFullWidth'] ? 'cf7-button-full-width' : '',
    'cf7-button-align-' . esc_attr($attr['buttonAlignment'])
);
if ( !empty($attr['align']) ){
  $wrapper_classes[] = 'align' . esc_attr($attr['align']);
}
// Remove empty class names
$wrapper_classes = array_filter($wrapper_classes);


// Prepare inline styles for CSS variables
$inline_styles = '';
if ( !empty($attr['fieldTextColor']) ) {
    $inline_styles .= '--cf7-field-text-color:' . esc_attr($attr['fieldTextColor']) . ';';
}
if ( !empty($attr['fieldBgColor']) ) {
    $inline_styles .= '--cf7-field-bg-color:' . esc_attr($attr['fieldBgColor']) . ';';
}
if ( !empty($attr['fieldBorderColor']) ) {
    $inline_styles .= '--cf7-field-border-color:' . esc_attr($attr['fieldBorderColor']) . ';';
}
if ( !empty($attr['fieldFocusBorderColor']) ) {
    $inline_styles .= '--cf7-field-focus-border-color:' . esc_attr($attr['fieldFocusBorderColor']) . ';';
}
if ( !empty($attr['fieldBorderRadius']) ) {
    $inline_styles .= '--cf7-field-border-radius:' . esc_attr($attr['fieldBorderRadius']) . ';';
}
if ( !empty($attr['fieldPadding']) ) {
    $inline_styles .= '--cf7-field-padding:' . esc_attr($attr['fieldPadding']) . ';';
}
// Add more CSS variables for button colors if 'buttonStyle' is 'custom' in future

ob_start();
?>
<div class="<?php echo esc_attr(implode(' ', $wrapper_classes)); ?>" style="<?php echo esc_attr($inline_styles); ?>">
    <?php
    if ( ! function_exists( 'wpcf7_contact_form' ) ) {
        echo '<p class="cf7-error-message">' . esc_html__( 'Please install and activate Contact Form 7 plugin.', 'milliondollartheme' ) . '</p>';
    } else {
        $form_id = intval($attr['formId']);
        if ( $form_id > 0 ) {
            $form = get_post($form_id);
            if ($form && $form->post_type === 'wpcf7_contact_form') {
                echo do_shortcode( '[contact-form-7 id="' . esc_attr($form_id) . '" html_class="theme-styled-cf7"]' );
            } else {
                echo '<p class="cf7-error-message">' . esc_html__( 'Selected form is not valid or does not exist.', 'milliondollartheme' ) . '</p>';
            }
        } else {
            if ( (defined( 'REST_REQUEST' ) && REST_REQUEST) || is_admin() ) {
                 echo '<p class="cf7-editor-message">' . esc_html__( 'Please select a Contact Form 7 form from the block settings in the Inspector panel.', 'milliondollartheme') . '</p>';
            } else {
                 echo '<p class="cf7-error-message">' . esc_html__( 'No Contact Form 7 form selected.', 'milliondollartheme') . '</p>';
            }
        }
    }
    ?>
</div>
<?php
$html_output = ob_get_clean();
echo $html_output;
