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
        const { text, url, target, buttonStyle, size, width, icon, iconPosition, borderRadius, customBackgroundColor, customTextColor, customBorderColor, addShadow, gradient, hoverEffect, padding, borderWidth, useGradient, shadowColor, shadowHOffset, shadowVOffset, shadowBlur, shadowSpread } = attributes;

        // Editor preview styles
        const previewStyles = {
            borderRadius: borderRadius || undefined,
            borderWidth: borderWidth || undefined,
            padding: padding ? `${padding.top || '0'} ${padding.right || '0'} ${padding.bottom || '0'} ${padding.left || '0'}` : undefined,
        };

        if (buttonStyle === 'custom') {
            if (customBackgroundColor) previewStyles.backgroundColor = customBackgroundColor;
            if (customTextColor) previewStyles.color = customTextColor;
            if (customBorderColor) {
                previewStyles.borderColor = customBorderColor;
                previewStyles.borderStyle = 'solid';
                if(!borderWidth) previewStyles.borderWidth = 'var(--button-border-width, 2px)'; // Default if not set
            } else {
                previewStyles.borderStyle = 'none';
            }
            if (useGradient && gradient) {
                 previewStyles.backgroundImage = gradient;
            }
        } else if (buttonStyle === 'primary') {
            previewStyles.backgroundColor = 'var(--primary-color)';
            previewStyles.color = 'var(--text-color-light)';
            previewStyles.borderColor = 'transparent';
            if (gradient) previewStyles.backgroundImage = gradient;
        } else if (buttonStyle === 'secondary') {
            previewStyles.backgroundColor = 'var(--secondary-color)';
            previewStyles.color = 'var(--text-color-light)';
            previewStyles.borderColor = 'transparent';
            if (gradient) previewStyles.backgroundImage = gradient;
        } else if (buttonStyle === 'outline') {
            previewStyles.backgroundColor = 'transparent';
            previewStyles.borderColor = customBorderColor || attributes.textColor || 'var(--primary-color)';
            previewStyles.color = customTextColor || attributes.textColor || 'var(--primary-color)';
            previewStyles.borderStyle = 'solid';
            if(!borderWidth) previewStyles.borderWidth = 'var(--button-border-width, 2px)';
        } else if (buttonStyle === 'glassy') {
            // Glassy often implies a background (could be from theme or here)
            // And might use gradient for its effect
            previewStyles.color = customTextColor || 'var(--text-color-light)'; // Default light text on glassy
            if (gradient) {
                previewStyles.backgroundImage = gradient;
            } else {
                previewStyles.backgroundColor = 'rgba(50, 50, 150, 0.3)'; // Fallback if no gradient
            }
            previewStyles.border = `1px solid ${customBorderColor || 'rgba(255, 255, 255, 0.2)'}`;
        }

        if (addShadow && shadowColor && shadowHOffset && shadowVOffset && shadowBlur && shadowSpread) {
            previewStyles.boxShadow = `${shadowHOffset} ${shadowVOffset} ${shadowBlur} ${shadowSpread} ${shadowColor}`;
        } else if (addShadow) {
             previewStyles.boxShadow = 'var(--button-default-shadow, 0 4px 15px rgba(0,0,0,0.1))'; // Default preview shadow
        }


        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Link & Text', 'milliondollartheme')}>
                        <TextControl
                            label={__('Button Text', 'milliondollartheme')}
                            value={text}
                            onChange={(val) => setAttributes({ text: val })}
                        />
                        <TextControl
                            label={__('Link URL', 'milliondollartheme')}
                            value={url}
                            onChange={(val) => setAttributes({ url: val })}
                            type="url"
                        />
                         <ToggleControl
                            label={__('Open in new tab', 'milliondollartheme')}
                            checked={!!target}
                            onChange={() => setAttributes({ target: !target, rel: !target ? 'noopener noreferrer' : '' })}
                        />
                    </PanelBody>

                    <PanelBody title={__('Style & Appearance', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Style', 'milliondollartheme')}
                            value={buttonStyle}
                            options={[
                                { label: 'Primary', value: 'primary' },
                                { label: 'Secondary', value: 'secondary' },
                                { label: 'Outline', value: 'outline' },
                                { label: 'Glassy', value: 'glassy' },
                                { label: 'Custom', value: 'custom' },
                            ]}
                            onChange={(val) => setAttributes({ buttonStyle: val })}
                        />
                        {buttonStyle === 'custom' && (
                            <> {/* TODO: Replace TextControls with ColorPalette */}
                                <TextControl label={__('Custom Background Color', 'milliondollartheme')} value={customBackgroundColor || ''} onChange={(val) => setAttributes({ customBackgroundColor: val })} />
                                <TextControl label={__('Custom Text Color', 'milliondollartheme')} value={customTextColor || ''} onChange={(val) => setAttributes({ customTextColor: val })} />
                                <TextControl label={__('Custom Border Color', 'milliondollartheme')} value={customBorderColor || ''} onChange={(val) => setAttributes({ customBorderColor: val })} />
                                <ToggleControl label={__('Use Gradient for Custom Background?', 'milliondollartheme')} checked={!!useGradient} onChange={(val) => setAttributes({useGradient: val})} />
                            </>
                        )}
                        <TextControl /* TODO: Replace with GradientPicker */
                            label={__('Gradient (CSS value)', 'milliondollartheme')}
                            value={gradient || ''}
                            onChange={(val) => setAttributes({ gradient: val })}
                            help={__('Applied to Primary, Secondary, Glassy, or Custom (if enabled).', 'milliondollartheme')}
                        />
                    </PanelBody>

                    <PanelBody title={__('Sizing & Shape', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Size', 'milliondollartheme')}
                            value={size}
                            options={[ { label: 'Small', value: 'small' }, { label: 'Medium', value: 'medium' }, { label: 'Large', value: 'large' } ]}
                            onChange={(val) => setAttributes({ size: val })}
                        />
                        <SelectControl
                            label={__('Width', 'milliondollartheme')}
                            value={width}
                            options={[ { label: 'Auto', value: 'auto' }, { label: 'Full', value: 'full' } ]}
                            onChange={(val) => setAttributes({ width: val })}
                        />
                        <TextControl
                            label={__('Border Radius (e.g., 5px, 50%)', 'milliondollartheme')}
                            value={borderRadius || ''}
                            onChange={(val) => setAttributes({ borderRadius: val })}
                        />
                        <TextControl
                            label={__('Border Width (e.g., 2px)', 'milliondollartheme')}
                            value={borderWidth || ''}
                            onChange={(val) => setAttributes({ borderWidth: val })}
                            help={__('Relevant for Outline and Custom styles with a border color.', 'milliondollartheme')}
                        />
                        {/* TODO: Add Padding controls (e.g., BoxControl or individual TextControls) */}
                    </PanelBody>

                    <PanelBody title={__('Icon', 'milliondollartheme')}>
                        <TextControl /* TODO: Replace with IconPicker */
                            label={__('Icon Name (Feather Icon Slug)', 'milliondollartheme')}
                            value={icon || ''}
                            onChange={(val) => setAttributes({ icon: val })}
                        />
                        {icon && (
                            <SelectControl
                                label={__('Icon Position', 'milliondollartheme')}
                                value={iconPosition}
                                options={[ { label: 'Left', value: 'left' }, { label: 'Right', value: 'right' } ]}
                                onChange={(val) => setAttributes({ iconPosition: val })}
                            />
                        )}
                    </PanelBody>

                    <PanelBody title={__('Effects', 'milliondollartheme')}>
                        <ToggleControl
                            label={__('Add Shadow', 'milliondollartheme')}
                            checked={!!addShadow}
                            onChange={() => setAttributes({ addShadow: !addShadow })}
                        />
                         {addShadow && (
                            <> {/* TODO: Replace with proper color and number/slider controls */}
                                <TextControl label={__('Shadow Color','milliondollartheme')} value={shadowColor || ''} onChange={val => setAttributes({shadowColor: val})} />
                                <TextControl label={__('Shadow H-Offset','milliondollartheme')} value={shadowHOffset || ''} onChange={val => setAttributes({shadowHOffset: val})} />
                                <TextControl label={__('Shadow V-Offset','milliondollartheme')} value={shadowVOffset || ''} onChange={val => setAttributes({shadowVOffset: val})} />
                                <TextControl label={__('Shadow Blur','milliondollartheme')} value={shadowBlur || ''} onChange={val => setAttributes({shadowBlur: val})} />
                                <TextControl label={__('Shadow Spread','milliondollartheme')} value={shadowSpread || ''} onChange={val => setAttributes({shadowSpread: val})} />
                            </>
                        )}
                        <SelectControl
                            label={__('Hover Effect', 'milliondollartheme')}
                            value={hoverEffect}
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
                    <span
                        className={`adv-button-link-wrapper is-style-${buttonStyle} is-size-${size} ${addShadow ? 'has-shadow' : ''} ${icon ? 'has-icon icon-pos-' + iconPosition : ''} hover-effect-${hoverEffect || 'lift'}`}
                        style={previewStyles}
                    >
                        {icon && iconPosition === 'left' && <IconComponent iconName={icon} />}
                        <RichText
                            tagName="span"
                            className="adv-button-text"
                            value={text}
                            onChange={(val) => setAttributes({ text: val })}
                            placeholder={__('Button Text...', 'milliondollartheme')}
                            allowedFormats={[]}
                            withoutInteractiveFormatting
                        />
                        {icon && iconPosition === 'right' && <IconComponent iconName={icon} />}
                    </span>
                    {isSelected && (
                        <div style={{marginTop: '10px'}}>
                            <URLInputButton
                                url={url}
                                onChange={(newUrl, post) => setAttributes({ url: newUrl, text: post && post.title ? post.title : text })}
                            />
                        </div>
                    )}
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const {
            text, url, target, rel, buttonStyle, size, width, icon, iconPosition,
            borderRadius, // string
            customBackgroundColor, customTextColor, customBorderColor, // colors
            gradient, useGradient, // gradient string, boolean for custom
            borderWidth: bw, // string, e.g., "2px", renamed to avoid conflict
            padding, // object {top, right, bottom, left}
            addShadow, // boolean
            shadowColor, shadowHOffset, shadowVOffset, shadowBlur, shadowSpread, // strings for shadow
            hoverEffect,
            ariaLabel
        } = attributes;

        const wrapperClasses = [
            'wp-block-milliondollartheme-advanced-button',
            attributes.align ? `align${attributes.align}` : '', // Handled by getBlockProps in WP 6.2+
            width === 'full' ? 'is-width-full' : ''
        ].filter(Boolean).join(' ');

        const linkClasses = [
            'wp-block-button__link',
            'adv-button-link',
            buttonStyle ? `is-style-${buttonStyle}` : 'is-style-primary',
            size ? `is-size-${size}` : 'is-size-medium',
            addShadow ? 'has-shadow' : '',
            icon && iconPosition ? `has-icon icon-pos-${iconPosition}` : '',
            hoverEffect ? `hover-effect-${hoverEffect}` : 'hover-effect-lift'
        ].filter(Boolean).join(' ');

        const linkStyles = {
            borderRadius: borderRadius || undefined, // string like "5px"
            backgroundColor: buttonStyle === 'custom' && customBackgroundColor && !useGradient ? customBackgroundColor : undefined,
            color: buttonStyle === 'custom' && customTextColor ? customTextColor : undefined,
            borderColor: buttonStyle === 'custom' && customBorderColor ? customBorderColor : (buttonStyle === 'outline' ? (customBorderColor || attributes.textColor || 'var(--wp--preset--color--primary, currentColor)') : undefined),
            borderStyle: (buttonStyle === 'custom' && customBorderColor) || buttonStyle === 'outline' ? 'solid' : undefined,
            borderWidth: (buttonStyle === 'custom' && customBorderColor && bw) || (buttonStyle === 'outline' && bw) ? bw : ((buttonStyle === 'custom' && customBorderColor) || buttonStyle === 'outline' ? 'var(--button-border-width, 2px)' : undefined),
            backgroundImage: gradient && (buttonStyle === 'primary' || buttonStyle === 'secondary' || buttonStyle === 'glassy' || (buttonStyle === 'custom' && useGradient)) ? gradient : undefined,
            padding: padding && (padding.top || padding.right || padding.bottom || padding.left) ? `${padding.top || '0'} ${padding.right || '0'} ${padding.bottom || '0'} ${padding.left || '0'}` : undefined,
            boxShadow: addShadow && shadowColor && shadowHOffset && shadowVOffset && shadowBlur && shadowSpread ? `${shadowHOffset} ${shadowVOffset} ${shadowBlur} ${shadowSpread} ${shadowColor}` : undefined,
        };

        // Remove undefined properties from linkStyles to keep HTML clean
        Object.keys(linkStyles).forEach(key => linkStyles[key] === undefined && delete linkStyles[key]);

        const blockProps = useBlockProps.save({ className: wrapperClasses });

        return (
            <div {...blockProps}>
                <a
                    href={url || '#'}
                    className={linkClasses}
                    target={target ? '_blank' : undefined}
                    rel={target ? (rel || 'noopener noreferrer') : undefined}
                    style={Object.keys(linkStyles).length > 0 ? linkStyles : undefined}
                    aria-label={ariaLabel || undefined}
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
