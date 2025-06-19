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
const IconComponent = ({ iconName, size, color }) => {
    if (!iconName) return null;
    const style = {
        width: size === 'custom' ? undefined : (size === 'large' ? '48px' : (size === 'small' ? '24px' : '32px')),
        height: size === 'custom' ? undefined : (size === 'large' ? '48px' : (size === 'small' ? '24px' : '32px')),
        color: color || 'inherit',
        // In a real scenario, this would render an SVG. For Feather:
        // return <svg dangerouslySetInnerHTML={{ __html: feather.icons[iconName]?.toSvg({ width: '100%', height: '100%' }) }} style={style} />;
    };
    return <span className="icon-box-icon-placeholder" style={style}>{`[ICON: ${iconName}]`}</span>;
};


registerBlockType(name, {
    title: title,
    attributes: attributes,

    edit: ({ attributes, setAttributes, isSelected }) => {
        const {
            icon, iconSize, iconColor, iconPosition, title, titleTag, text, textAlign,
            boxStyle, enableLink, url
        } = attributes;

        const blockProps = useBlockProps({
            className: `is-style-${boxStyle} icon-pos-${iconPosition} text-align-${textAlign}`,
        });

        // For simplicity, titleColor and textColor will be handled by CSS or global settings first.

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Icon', 'milliondollartheme')}>
                        <TextControl // Placeholder for actual IconPicker
                            label={__('Icon Name (e.g., check-circle)', 'milliondollartheme')}
                            value={icon}
                            onChange={(val) => setAttributes({ icon: val })}
                        />
                        <SelectControl
                            label={__('Icon Size', 'milliondollartheme')}
                            value={iconSize}
                            options={[
                                { label: 'Small', value: 'small' },
                                { label: 'Medium', value: 'medium' },
                                { label: 'Large', value: 'large' },
                                // { label: 'Custom', value: 'custom' }, // For custom px input
                            ]}
                            onChange={(val) => setAttributes({ iconSize: val })}
                        />
                        <TextControl // Placeholder for ColorPalette
                            label={__('Icon Color', 'milliondollartheme')}
                            value={iconColor}
                            onChange={(val) => setAttributes({ iconColor: val })}
                        />
                        <SelectControl
                            label={__('Icon Position', 'milliondollartheme')}
                            value={iconPosition}
                            options={[
                                { label: 'Top', value: 'top' },
                                { label: 'Left', value: 'left' },
                            ]}
                            onChange={(val) => setAttributes({ iconPosition: val })}
                        />
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
                        <TextControl /* Using TextControl for simple RichText for now */
                            label={__('Text', 'milliondollartheme')}
                            value={text}
                            onChange={(val) => setAttributes({ text: val })}
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
                            options={[
                                { label: 'Default', value: 'default' },
                                { label: 'Glassy', value: 'glassy' },
                                { label: 'Outline', value: 'outline' },
                            ]}
                            onChange={(val) => setAttributes({ boxStyle: val })}
                        />
                         <ToggleControl
                            label={__('Enable Link on Box', 'milliondollartheme')}
                            checked={!!enableLink}
                            onChange={() => setAttributes({ enableLink: !enableLink })}
                        />
                        {enableLink && (
                            <TextControl
                                label={__('Link URL', 'milliondollartheme')}
                                value={url}
                                onChange={(val) => setAttributes({ url: val })}
                            />
                        )}
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <IconComponent iconName={icon} size={iconSize} color={iconColor} />
                    <div className="icon-box-content">
                        <RichText
                            tagName={titleTag || 'h4'}
                            className="icon-box-title"
                            value={title}
                            onChange={(val) => setAttributes({ title: val })}
                            placeholder={__('Title...', 'milliondollartheme')}
                        />
                        <RichText
                            tagName="p"
                            className="icon-box-text"
                            value={text}
                            onChange={(val) => setAttributes({ text: val })}
                            placeholder={__('Text...', 'milliondollartheme')}
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
            icon, iconSize, iconColor, iconPosition, title, titleTag, text, textAlign,
            boxStyle, enableLink, url, target, rel, boxPadding, borderRadius
        } = attributes;

        const TagName = titleTag || 'h4';
        const WrapperTag = enableLink ? 'a' : 'div';

        const wrapperProps = useBlockProps.save({
            className: `is-style-${boxStyle} icon-pos-${iconPosition} text-align-${textAlign}`,
            style: {
                padding: boxPadding,
                borderRadius: borderRadius,
            },
            href: enableLink ? (url || '#') : undefined,
            target: enableLink && target ? '_blank' : undefined,
            rel: enableLink && target ? (rel || 'noopener noreferrer') : undefined,
        });


        return (
            <WrapperTag {...wrapperProps}>
                <IconComponent iconName={icon} size={iconSize} color={iconColor} />
                <div className="icon-box-content">
                    <RichText.Content
                        tagName={TagName}
                        className="icon-box-title"
                        value={title}
                    />
                    <RichText.Content
                        tagName="p"
                        className="icon-box-text"
                        value={text}
                    />
                </div>
            </WrapperTag>
        );
    },
});
