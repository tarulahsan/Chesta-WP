/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    RichText,
    InspectorControls,
    BlockControls, // For alignment toolbar
    AlignmentToolbar, // For text alignment (if needed on button text itself, less common)
    URLInputButton // For URL input
} from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    ToggleControl,
    SelectControl,
    ToolbarGroup, // For BlockControls
    ToolbarButton // For BlockControls
    // Placeholder for IconPicker, ColorPalette, GradientPicker etc.
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import './style-index.css';
import './index.css';

const { name, title, attributes } = metadata;

// Placeholder for an Icon component (e.g., using Feather Icons)
const IconComponent = ({ iconName }) => {
    if (!iconName) return null;
    // In a real scenario, this would render an SVG based on iconName
    // For now, just a placeholder. Feather icons are typically <svg>...</svg>
    // Example: <svg dangerouslySetInnerHTML={{ __html: feather.icons[iconName].toSvg() }} />
    return <span className="adv-button-icon">{`[${iconName}]`}</span>;
};


registerBlockType(name, {
    title: title,
    attributes: attributes,

    edit: ({ attributes, setAttributes, isSelected }) => {
        const blockProps = useBlockProps(); // Apply alignment classes to the outer div
        const { text, url, target, buttonStyle, size, width, icon, iconPosition, borderRadius, customBackgroundColor, customTextColor, customBorderColor, addShadow, gradient } = attributes;
        const previewStyles = {};
        if (buttonStyle === 'custom') {
            if (customBackgroundColor) previewStyles.backgroundColor = customBackgroundColor;
            if (customTextColor) previewStyles.color = customTextColor;
            if (customBorderColor) previewStyles.borderColor = customBorderColor;
            else previewStyles.borderColor = 'transparent'; // Ensure border is there if color is set
        } else if (buttonStyle === 'primary') { // Example for editor preview matching
            previewStyles.backgroundColor = 'var(--primary-color)'; // Assuming CSS vars are available
            previewStyles.color = 'var(--text-color-light)';
            previewStyles.borderColor = 'transparent';
        } else if (buttonStyle === 'secondary') {
            previewStyles.backgroundColor = 'var(--secondary-color)';
            previewStyles.color = 'var(--text-color-light)';
            previewStyles.borderColor = 'transparent';
        } else if (buttonStyle === 'outline') {
            previewStyles.backgroundColor = 'transparent';
            previewStyles.borderColor = customBorderColor || 'var(--primary-color)'; // Use custom or default
            previewStyles.color = customTextColor || 'var(--primary-color)';
        } else if (buttonStyle === 'glassy') {
            previewStyles.backgroundColor = 'rgba(50, 50, 150, 0.3)'; // From previous editor CSS
            previewStyles.color = 'var(--text-color-light)';
            previewStyles.border = '1px solid rgba(255, 255, 255, 0.2)';
        }
        if (borderRadius) previewStyles.borderRadius = borderRadius;
        if (addShadow) previewStyles.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'; // Simple preview shadow
        if (gradient && (buttonStyle === 'primary' || buttonStyle === 'secondary' || buttonStyle === 'custom')) { // Apply gradient if style allows
            previewStyles.backgroundImage = gradient;
            previewStyles.borderColor = 'transparent'; // Gradients usually dont have separate border color
        }

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Link & Text', 'milliondollartheme')}>
                        <TextControl
                            label={__('Button Text', 'milliondollartheme')}
                            value={attributes.text}
                            onChange={(val) => setAttributes({ text: val })}
                        />
                        <TextControl
                            label={__('Link URL', 'milliondollartheme')}
                            value={attributes.url}
                            onChange={(val) => setAttributes({ url: val })}
                        />
                         <ToggleControl
                            label={__('Open in new tab', 'milliondollartheme')}
                            checked={!!attributes.target}
                            onChange={() => setAttributes({ target: !attributes.target, rel: !attributes.target ? 'noopener noreferrer' : '' })}
                        />
                    </PanelBody>

                    <PanelBody title={__('Style & Appearance', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Style', 'milliondollartheme')}
                            value={attributes.buttonStyle}
                            options={[
                                { label: 'Primary', value: 'primary' },
                                { label: 'Secondary (New)', value: 'secondary' },
                                { label: 'Outline', value: 'outline' },
                                { label: 'Glassy', value: 'glassy' },
                                { label: 'Custom', value: 'custom' },
                            ]}
                            onChange={(val) => setAttributes({ buttonStyle: val })}
                        />
                        {attributes.buttonStyle === 'custom' && (
                            <> {/* TODO: Replace TextControls with ColorPalette */}
                                <TextControl label={__('Custom Background Color', 'milliondollartheme')} value={attributes.customBackgroundColor || ''} onChange={(val) => setAttributes({ customBackgroundColor: val })} />
                                <TextControl label={__('Custom Text Color', 'milliondollartheme')} value={attributes.customTextColor || ''} onChange={(val) => setAttributes({ customTextColor: val })} />
                                <TextControl label={__('Custom Border Color', 'milliondollartheme')} value={attributes.customBorderColor || ''} onChange={(val) => setAttributes({ customBorderColor: val })} />
                            </>
                        )}
                        <TextControl /* TODO: Replace with GradientPicker */
                            label={__('Gradient (CSS value, for relevant styles)', 'milliondollartheme')}
                            value={attributes.gradient || ''}
                            onChange={(val) => setAttributes({ gradient: val })}
                        />
                    </PanelBody>

                    <PanelBody title={__('Sizing & Shape', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Size', 'milliondollartheme')}
                            value={attributes.size}
                            options={[ { label: 'Small', value: 'small' }, { label: 'Medium', value: 'medium' }, { label: 'Large', value: 'large' } ]}
                            onChange={(val) => setAttributes({ size: val })}
                        />
                        <SelectControl
                            label={__('Width', 'milliondollartheme')}
                            value={attributes.width}
                            options={[ { label: 'Auto', value: 'auto' }, { label: 'Full', value: 'full' } ]}
                            onChange={(val) => setAttributes({ width: val })}
                        />
                        <TextControl
                            label={__('Border Radius (e.g., 5px, 50%)', 'milliondollartheme')}
                            value={attributes.borderRadius || ''}
                            onChange={(val) => setAttributes({ borderRadius: val })}
                        />
                    </PanelBody>

                    <PanelBody title={__('Icon', 'milliondollartheme')}>
                        <TextControl /* TODO: Replace with IconPicker */
                            label={__('Icon Name (Feather Icon Slug)', 'milliondollartheme')}
                            value={attributes.icon || ''}
                            onChange={(val) => setAttributes({ icon: val })}
                        />
                        {attributes.icon && (
                            <SelectControl
                                label={__('Icon Position', 'milliondollartheme')}
                                value={attributes.iconPosition}
                                options={[ { label: 'Left', value: 'left' }, { label: 'Right', value: 'right' } ]}
                                onChange={(val) => setAttributes({ iconPosition: val })}
                            />
                        )}
                    </PanelBody>

                    <PanelBody title={__('Effects', 'milliondollartheme')}>
                        <ToggleControl
                            label={__('Add Shadow', 'milliondollartheme')}
                            checked={!!attributes.addShadow}
                            onChange={() => setAttributes({ addShadow: !attributes.addShadow })}
                        />
                        <SelectControl
                            label={__('Hover Effect', 'milliondollartheme')}
                            value={attributes.hoverEffect}
                            options={[
                                { label: 'Lift (default)', value: 'lift' },
                                { label: 'Darken (TODO)', value: 'darken' },
                                { label: 'Lighten (TODO)', value: 'lighten' },
                                { label: 'Pulse (basic)', value: 'pulse' }
                            ]}
                            onChange={(val) => setAttributes({ hoverEffect: val })}
                        />
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    {/* In editor, render RichText directly on a button-like structure */}
                    <span className={`adv-button-link-wrapper is-style-${buttonStyle} is-size-${size} ${addShadow ? 'has-shadow' : ''} ${icon ? 'has-icon icon-pos-' + iconPosition : ''}`} style={previewStyles}> {/* Using span as wrapper for inline-block behavior by default */}
                        {icon && iconPosition === 'left' && <IconComponent iconName={icon} />}
                        <RichText
                            tagName="span" // Use span for inline text part, actual button is <a> in save
                            className="adv-button-text"
                            value={text}
                            onChange={(val) => setAttributes({ text: val })}
                            placeholder={__('Button Text...', 'milliondollartheme')}
                            allowedFormats={[]} // No formatting for button text
                            withoutInteractiveFormatting // Avoid popovers for simple text
                        />
                        {icon && iconPosition === 'right' && <IconComponent iconName={icon} />}
                    </span>
                    {isSelected && (
                        <URLInputButton
                            url={url}
                            onChange={(newUrl) => setAttributes({ url: newUrl })}
                        />
                    )}
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const { text, url, target, rel, buttonStyle, size, width, icon, iconPosition, addShadow, borderRadius } = attributes;

        const wrapperClasses = [
            'wp-block-milliondollartheme-advanced-button',
            attributes.align ? `align${attributes.align}` : '',
            width === 'full' ? 'is-width-full' : ''
        ].filter(Boolean).join(' ');

        const linkClasses = [
            'wp-block-button__link', // Core class for some base styling if available
            'adv-button-link',
            buttonStyle ? `is-style-${buttonStyle}` : 'is-style-primary',
            size ? `is-size-${size}` : 'is-size-medium',
            addShadow ? 'has-shadow' : '',
            icon && iconPosition ? `has-icon icon-pos-${iconPosition}` : ''
        ].filter(Boolean).join(' ');

        const linkStyles = {
            borderRadius: borderRadius || undefined,
            // Custom colors/gradient would be applied here if 'custom' style is chosen
        };

        // For block alignment (left, center, right on the wrapper)
        const blockProps = useBlockProps.save({ className: wrapperClasses });


        return (
            <div {...blockProps}>
                <a
                    href={url || '#'}
                    className={linkClasses}
                    target={target ? '_blank' : undefined}
                    rel={target ? (rel || 'noopener noreferrer') : undefined}
                    style={linkStyles}
                >
                    {icon && iconPosition === 'left' && <IconComponent iconName={icon} />}
                    <RichText.Content
                        tagName="span"
                        className="adv-button-text"
                        value={text}
                    />
                    {icon && iconPosition === 'right' && <IconComponent iconName={icon} />}
                </a>
            </div>
        );
    },
});
