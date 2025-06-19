/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InspectorControls, URLInputButton } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, SelectControl, ColorPalette, FontSizePicker } from '@wordpress/components'; // Placeholder for IconPicker

/**
 * Internal dependencies
 */
import metadata from './block.json';
import './style-index.css';
import './index.css';

const { name, title, attributes } = metadata;

// Placeholder for an Icon component (e.g., using Feather Icons)
const IconComponent = ({ iconName, size, customSize, color, style }) => { // Added customSize and style to props
    if (!iconName) return null;
    const effectiveStyle = {
        ...style, // Pass through existing style prop
        width: size === 'custom' && customSize ? `${customSize}px` : (size === 'large' ? '48px' : (size === 'small' ? '24px' : '32px')),
        height: size === 'custom' && customSize ? `${customSize}px` : (size === 'large' ? '48px' : (size === 'small' ? '24px' : '32px')),
        color: color || 'inherit',
    };
    return <span className="icon-box-icon-placeholder" style={effectiveStyle}>{`[ICON: ${iconName}]`}</span>;
};


registerBlockType(name, {
    title: title,
    attributes: attributes,

    edit: ({ attributes, setAttributes, isSelected }) => {
        const {
            icon, iconSize, iconCustomSize, iconColor, iconPosition, iconVerticalAlignment,
            title, titleTag, titleColor, text, textColor,
            boxStyle, boxBackgroundColor, boxBorderColor, boxPadding, borderRadius, textAlign,
            enableLink, url, target // Added target here
        } = attributes;

        const blockProps = useBlockProps({
            className: `is-style-${boxStyle} icon-pos-${iconPosition} text-align-${textAlign} ${iconPosition === 'left' ? 'icon-valign-' + iconVerticalAlignment : ''}`,
            style: {
                padding: boxPadding,
                borderRadius: borderRadius,
                backgroundColor: (boxStyle === 'default' || boxStyle === 'custom') ? boxBackgroundColor : undefined,
                borderColor: (boxStyle === 'outline' || boxStyle === 'custom') ? boxBorderColor : undefined,
                borderStyle: (boxStyle === 'outline' || (boxStyle === 'custom' && boxBorderColor)) ? 'solid' : undefined,
                borderWidth: (boxStyle === 'outline' || (boxStyle === 'custom' && boxBorderColor)) ? '2px' : undefined, // Default border width for these styles
            }
        });

        const iconPreviewStyles = {
            // fontSize is more appropriate for font icons, width/height for SVG containers
            // For span placeholder, fontSize might work if icon is text, but width/height is better for SVG-like placeholder
            // Using width/height as per original IconComponent logic
            color: iconColor,
        };

        const titlePreviewStyles = { color: titleColor };
        const textPreviewStyles = { color: textColor };

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Icon', 'milliondollartheme')}>
                        <TextControl /* TODO: Replace with IconPicker */
                            label={__('Icon Name (e.g., check-circle)', 'milliondollartheme')}
                            value={icon}
                            onChange={(val) => setAttributes({ icon: val })}
                        />
                        <SelectControl
                            label={__('Icon Size', 'milliondollartheme')}
                            value={iconSize}
                            options={[ { label: 'Small', value: 'small' }, { label: 'Medium', value: 'medium' }, { label: 'Large', value: 'large' }, { label: 'Custom', value: 'custom' } ]}
                            onChange={(val) => setAttributes({ iconSize: val })}
                        />
                        {iconSize === 'custom' && (
                            <TextControl /* RangeControl would be better */
                                label={__('Icon Custom Size (px)', 'milliondollartheme')}
                                type='number'
                                value={iconCustomSize}
                                onChange={(val) => setAttributes({ iconCustomSize: parseInt(val) })}
                            />
                        )}
                        <TextControl /* TODO: Replace with ColorPalette */
                            label={__('Icon Color', 'milliondollartheme')}
                            value={iconColor}
                            onChange={(val) => setAttributes({ iconColor: val })}
                        />
                        <SelectControl
                            label={__('Icon Position', 'milliondollartheme')}
                            value={iconPosition}
                            options={[ { label: 'Top', value: 'top' }, { label: 'Left', value: 'left' } ]}
                            onChange={(val) => setAttributes({ iconPosition: val })}
                        />
                        {iconPosition === 'left' && (
                            <SelectControl
                                label={__('Icon Vertical Alignment', 'milliondollartheme')}
                                value={iconVerticalAlignment}
                                options={[ { label: 'Top', value: 'flex-start' }, { label: 'Center', value: 'center' }, { label: 'Bottom', value: 'flex-end' } ]}
                                onChange={(val) => setAttributes({ iconVerticalAlignment: val })}
                            />
                        )}
                    </PanelBody>

                    <PanelBody title={__('Content', 'milliondollartheme')}>
                        <TextControl
                            label={__('Title', 'milliondollartheme')}
                            value={title}
                            onChange={(val) => setAttributes({ title: val })}
                        />
                        <SelectControl
                            label={__('Title HTML Tag', 'milliondollartheme')}
                            value={titleTag}
                            options={[ {label: 'H2', value: 'h2'}, {label: 'H3', value: 'h3'}, {label: 'H4', value: 'h4'}, {label: 'H5', value: 'h5'}, {label: 'H6', value: 'h6'}, {label: 'P', value: 'p'} ]}
                            onChange={(val) => setAttributes({ titleTag: val })}
                        />
                        <TextControl /* TODO: Replace with ColorPalette */
                            label={__('Title Color', 'milliondollartheme')}
                            value={titleColor}
                            onChange={(val) => setAttributes({ titleColor: val })}
                        />
                        <TextControl /* Using TextControl for simple RichText for now */
                            label={__('Text', 'milliondollartheme')}
                            value={text}
                            onChange={(val) => setAttributes({ text: val })}
                        />
                        <TextControl /* TODO: Replace with ColorPalette */
                            label={__('Text Color', 'milliondollartheme')}
                            value={textColor}
                            onChange={(val) => setAttributes({ textColor: val })}
                        />
                        <SelectControl
                            label={__('Text Align', 'milliondollartheme')}
                            value={textAlign}
                            options={[ {label: 'Left', value: 'left'}, {label: 'Center', value: 'center'}, {label: 'Right', value: 'right'} ]}
                            onChange={(val) => setAttributes({ textAlign: val })}
                        />
                    </PanelBody>

                    <PanelBody title={__('Box Style', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Style', 'milliondollartheme')}
                            value={boxStyle}
                            options={[ { label: 'Default', value: 'default' }, { label: 'Glassy', value: 'glassy' }, { label: 'Outline', value: 'outline' }, { label: 'Custom', value: 'custom' } ]}
                            onChange={(val) => setAttributes({ boxStyle: val })}
                        />
                        {(boxStyle === 'default' || boxStyle === 'custom') && (
                            <TextControl /* TODO: Replace with ColorPalette */
                                label={__('Background Color', 'milliondollartheme')}
                                value={boxBackgroundColor}
                                onChange={(val) => setAttributes({ boxBackgroundColor: val })}
                            />
                        )}
                        {(boxStyle === 'outline' || boxStyle === 'custom') && (
                            <TextControl /* TODO: Replace with ColorPalette */
                                label={__('Border Color', 'milliondollartheme')}
                                value={boxBorderColor}
                                onChange={(val) => setAttributes({ boxBorderColor: val })}
                            />
                        )}
                        <TextControl
                            label={__('Padding (e.g., 20px, var(--spacing-md))', 'milliondollartheme')}
                            value={boxPadding}
                            onChange={(val) => setAttributes({ boxPadding: val })}
                        />
                        <TextControl
                            label={__('Border Radius (e.g., 8px, 50%)', 'milliondollartheme')}
                            value={borderRadius}
                            onChange={(val) => setAttributes({ borderRadius: val })}
                        />
                         <ToggleControl
                            label={__('Enable Link on Box', 'milliondollartheme')}
                            checked={!!enableLink}
                            onChange={() => setAttributes({ enableLink: !enableLink })}
                        />
                        {enableLink && (
                            <>
                                <TextControl label={__('Link URL', 'milliondollartheme')} value={url} onChange={(val) => setAttributes({ url: val })} />
                                <ToggleControl label={__('Open in new tab', 'milliondollartheme')} checked={!!attributes.target} onChange={() => setAttributes({ target: !attributes.target, rel: !attributes.target ? 'noopener noreferrer' : '' })} />
                            </>
                        )}
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <IconComponent iconName={icon} size={iconSize} customSize={iconCustomSize} color={iconColor} style={iconPreviewStyles} />
                    <div className="icon-box-content">
                        <RichText
                            tagName={titleTag || 'h4'}
                            className="icon-box-title"
                            value={title}
                            onChange={(val) => setAttributes({ title: val })}
                            placeholder={__('Title...', 'milliondollartheme')}
                            style={titlePreviewStyles}
                        />
                        <RichText
                            tagName="p"
                            className="icon-box-text"
                            value={text}
                            onChange={(val) => setAttributes({ text: val })}
                            placeholder={__('Text...', 'milliondollartheme')}
                            style={textPreviewStyles}
                        />
                    </div>
                    {enableLink && isSelected && (
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
        const {
            icon, iconSize, iconCustomSize, iconColor, iconPosition, iconVerticalAlignment, title, titleTag, titleColor, text, textColor,
            boxStyle, boxBackgroundColor, boxBorderColor, boxPadding, borderRadius, textAlign,
            enableLink, url, target, rel
        } = attributes; // Added all relevant attributes

        const TagName = titleTag || 'h4';
        const WrapperTag = enableLink ? 'a' : 'div';

        const wrapperClassName = `is-style-${boxStyle} icon-pos-${iconPosition} text-align-${textAlign} ${iconPosition === 'left' ? 'icon-valign-' + iconVerticalAlignment : ''}`;

        const wrapperStyles = {
            padding: boxPadding,
            borderRadius: borderRadius,
            backgroundColor: (boxStyle === 'default' || boxStyle === 'custom') ? boxBackgroundColor : undefined,
            borderColor: (boxStyle === 'outline' || boxStyle === 'custom') ? boxBorderColor : undefined,
            borderStyle: (boxStyle === 'outline' || (boxStyle === 'custom' && boxBorderColor)) ? 'solid' : undefined,
            borderWidth: (boxStyle === 'outline' || (boxStyle === 'custom' && boxBorderColor)) ? '2px' : undefined,
        };

        const blockProps = useBlockProps.save({
            className: wrapperClassName,
            style: wrapperStyles,
            href: enableLink ? (url || '#') : undefined,
            target: enableLink && target ? '_blank' : undefined,
            rel: enableLink && target ? (rel || 'noopener noreferrer') : undefined,
        });

        const iconSaveStyles = {
             color: iconColor,
             // Size is handled by classes or direct SVG attributes in a real component
        };

        const titleSaveStyles = { color: titleColor };
        const textSaveStyles = { color: textColor };


        return (
            <WrapperTag {...blockProps}>
                <IconComponent iconName={icon} size={iconSize} customSize={iconCustomSize} color={iconColor} style={iconSaveStyles}/>
                <div className="icon-box-content">
                    <RichText.Content
                        tagName={TagName}
                        className="icon-box-title"
                        value={title}
                        style={titleSaveStyles}
                    />
                    <RichText.Content
                        tagName="p"
                        className="icon-box-text"
                        value={text}
                        style={textSaveStyles}
                    />
                </div>
            </WrapperTag>
        );
    },
});
