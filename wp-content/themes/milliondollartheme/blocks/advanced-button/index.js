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
        const blockProps = useBlockProps({
            className: `is-style-${attributes.buttonStyle} is-size-${attributes.size} is-width-${attributes.width}`,
        });
        const { text, url, target, buttonStyle, size, width, icon, iconPosition } = attributes;

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Settings', 'milliondollartheme')}>
                        <TextControl
                            label={__('Button Text', 'milliondollartheme')}
                            value={text}
                            onChange={(val) => setAttributes({ text: val })}
                        />
                        <TextControl
                            label={__('Link URL', 'milliondollartheme')}
                            value={url}
                            onChange={(val) => setAttributes({ url: val })}
                        />
                         <ToggleControl
                            label={__('Open in new tab', 'milliondollartheme')}
                            checked={!!target}
                            onChange={() => setAttributes({ target: !target })}
                        />
                        <SelectControl
                            label={__('Style', 'milliondollartheme')}
                            value={buttonStyle}
                            options={[
                                { label: 'Primary', value: 'primary' },
                                { label: 'Outline', value: 'outline' },
                                { label: 'Glassy', value: 'glassy' },
                                // Add 'secondary', 'custom' later
                            ]}
                            onChange={(val) => setAttributes({ buttonStyle: val })}
                        />
                        <SelectControl
                            label={__('Size', 'milliondollartheme')}
                            value={size}
                            options={[
                                { label: 'Small', value: 'small' },
                                { label: 'Medium', value: 'medium' },
                                { label: 'Large', value: 'large' },
                            ]}
                            onChange={(val) => setAttributes({ size: val })}
                        />
                        <SelectControl
                            label={__('Width', 'milliondollartheme')}
                            value={width}
                            options={[
                                { label: 'Auto', value: 'auto' },
                                { label: 'Full', value: 'full' },
                            ]}
                            onChange={(val) => setAttributes({ width: val })}
                        />
                        <TextControl // Placeholder for IconPicker
                            label={__('Icon (e.g., "check-circle")', 'milliondollartheme')}
                            value={icon}
                            onChange={(val) => setAttributes({ icon: val })}
                        />
                        {icon && (
                            <SelectControl
                                label={__('Icon Position', 'milliondollartheme')}
                                value={iconPosition}
                                options={[
                                    { label: 'Left', value: 'left' },
                                    { label: 'Right', value: 'right' },
                                ]}
                                onChange={(val) => setAttributes({ iconPosition: val })}
                            />
                        )}
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    {/* In editor, render RichText directly on a button-like structure */}
                    <span className="adv-button-link-wrapper"> {/* Using span as wrapper for inline-block behavior by default */}
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
