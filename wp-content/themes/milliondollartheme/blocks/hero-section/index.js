/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, SelectControl, RangeControl, ColorPalette } from '@wordpress/components'; // Basic controls

/**
 * Internal dependencies
 */
import metadata from './block.json'; // Import metadata from block.json
import './style-index.css'; // Front-end and shared editor styles
import './index.css';       // Editor-only styles

const { name, title, attributes } = metadata;

registerBlockType(name, {
    title: title,
    attributes: attributes,

    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps();
        const {
            title, text, textAlign, minHeight,
            backgroundType, backgroundColor, gradient, overlayColor, overlayOpacity,
            // ... other attributes for controls
        } = attributes;

        const heroStyles = {
            minHeight: minHeight || '50vh',
            // Basic background for now, will be more complex
            backgroundColor: backgroundType === 'color' ? backgroundColor : undefined,
            backgroundImage: backgroundType === 'gradient' ? gradient : undefined,
            textAlign: textAlign,
            // Padding will be handled by CSS classes or wrapper if needed for preview
        };

        const overlayStyles = {
            backgroundColor: overlayColor,
            opacity: overlayOpacity / 100,
        };

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Content', 'milliondollartheme')}>
                        <TextControl
                            label={__('Title Text', 'milliondollartheme')}
                            value={title}
                            onChange={(val) => setAttributes({ title: val })}
                        />
                        {/* TODO: Add ColorPalette for titleColor here */}
                        <TextControl label={__('Title Color (temp)','milliondollartheme')} value={attributes.titleColor || ''} onChange={(val) => setAttributes({ titleColor: val })} />
                        <TextControl /* Using TextControl for simple RichText for now */
                            label={__('Paragraph Text', 'milliondollartheme')}
                            value={text}
                            onChange={(val) => setAttributes({ text: val })}
                        />
                        {/* TODO: Add ColorPalette for textColor here */}
                        <TextControl label={__('Text Color (temp)','milliondollartheme')} value={attributes.textColor || ''} onChange={(val) => setAttributes({ textColor: val })} />
                         <SelectControl
                            label={__('Text Align', 'milliondollartheme')}
                            value={textAlign}
                            options={[
                                { label: 'Left', value: 'left' },
                                { label: 'Center', value: 'center' },
                                { label: 'Right', value: 'right' },
                            ]}
                            onChange={(val) => setAttributes({ textAlign: val })}
                        />
                    </PanelBody>
                    <PanelBody title={__('Appearance', 'milliondollartheme')}>
                        <TextControl
                            label={__('Minimum Height (e.g., 50vh, 300px)', 'milliondollartheme')}
                            value={minHeight}
                            onChange={(val) => setAttributes({ minHeight: val })}
                        />
                        <SelectControl
                            label={__('Background Type', 'milliondollartheme')}
                            value={backgroundType}
                            options={[
                                { label: 'Color', value: 'color' },
                                { label: 'Gradient', value: 'gradient' },
                                { label: 'Image (Not implemented yet)', value: 'image' },
                            ]}
                            onChange={(val) => setAttributes({ backgroundType: val })}
                        />
                                { attributes.backgroundType === 'image' && (
                                    <div>
                                        {/* TODO: Implement MediaUpload here for backgroundImage */}
                                        <TextControl label={__('Image URL (temp)','milliondollartheme')} value={attributes.backgroundImageUrl || ''} onChange={(val) => setAttributes({ backgroundImageUrl: val })} />
                                    </div>
                                )}
                        {backgroundType === 'color' && (
                            // TODO: Replace TextControl with ColorPalette for backgroundColor
                            <TextControl /* Basic ColorPicker would be better */
                                label={__('Background Color', 'milliondollartheme')}
                                value={backgroundColor}
                                onChange={(val) => setAttributes({ backgroundColor: val })}
                            />
                        )}
                        {backgroundType === 'gradient' && (
                             <TextControl
                                label={__('Gradient Value', 'milliondollartheme')}
                                value={gradient}
                                onChange={(val) => setAttributes({ gradient: val })}
                            />
                        )}
                        {/* TODO: Replace TextControl with ColorPalette for overlayColor */}
                        <TextControl /* Basic ColorPicker would be better */
                            label={__('Overlay Color', 'milliondollartheme')}
                            value={overlayColor}
                            onChange={(val) => setAttributes({ overlayColor: val })}
                        />
                        <RangeControl
                            label={__('Overlay Opacity', 'milliondollartheme')}
                            value={overlayOpacity}
                            onChange={(val) => setAttributes({ overlayOpacity: val })}
                            min={0}
                            max={100}
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps} style={heroStyles}>
                    <div className="hero-section-overlay" style={overlayStyles}></div>
                    <div className="hero-section-content-wrapper">
                        {/* Using RichText for actual block, but simple output for this iteration */}
                        <RichText
                            tagName={attributes.titleTag || 'h2'}
                            className="hero-title"
                            value={title}
                            onChange={(val) => setAttributes({ title: val })}
                            placeholder={__('Enter title...', 'milliondollartheme')}
                            allowedFormats={['core/bold', 'core/italic']}
                        />
                        <RichText
                            tagName="p"
                            className="hero-text"
                            value={text}
                            onChange={(val) => setAttributes({ text: val })}
                            placeholder={__('Enter text...', 'milliondollartheme')}
                            allowedFormats={['core/bold', 'core/italic', 'core/link']}
                        />
                        {/* Buttons will be added in a later iteration */}
                        {attributes.showButton1 && (
                            <div className="hero-buttons">
                                <a href="#" className="hero-button button-style-primary">
                                    {attributes.button1Text}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const blockProps = useBlockProps.save();
        const {
            title, text, titleTag, textAlign, minHeight,
            backgroundType, backgroundColor, gradient, overlayColor, overlayOpacity,
            paddingTop, paddingBottom, paddingLeft, paddingRight,
            // ... other attributes
        } = attributes;

        // Construct style object carefully
        const heroStyles = {
            minHeight: minHeight || undefined,
            paddingTop: paddingTop || undefined,
            paddingBottom: paddingBottom || undefined,
            paddingLeft: paddingLeft || undefined,
            paddingRight: paddingRight || undefined,
            textAlign: textAlign || undefined,
        };
        if (backgroundType === 'color') heroStyles.backgroundColor = backgroundColor;
        if (backgroundType === 'gradient') heroStyles.backgroundImage = gradient;
        // Image/video backgrounds would be more complex here (e.g., img tag or video tag or pseudo-element)

        const overlayStyles = {
            backgroundColor: overlayColor,
            opacity: overlayOpacity / 100,
        };

        const TagName = titleTag || 'h2';

        return (
            <div {...blockProps} style={heroStyles}>
                { (backgroundType === 'image' || backgroundType === 'video' || overlayOpacity > 0) &&
                    <div className="hero-section-overlay" style={overlayStyles}></div>
                }
                <div className="hero-section-content-wrapper">
                    <RichText.Content
                        tagName={TagName}
                        className="hero-title"
                        value={title}
                    />
                    <RichText.Content
                        tagName="p"
                        className="hero-text"
                        value={text}
                    />
                    {/* Buttons will be added in a later iteration */}
                     {attributes.showButton1 && (
                        <div className="hero-buttons">
                            <a
                                href={attributes.button1Url || '#'}
                                className={`hero-button button-style-${attributes.button1Style || 'primary'}`}
                                target={attributes.button1NewTab ? '_blank' : undefined}
                                rel={attributes.button1NewTab ? 'noopener noreferrer' : undefined}
                            >
                                {attributes.button1Text}
                            </a>
                        </div>
                    )}
                    {/* Placeholder for button 2 */}
                </div>
            </div>
        );
    },
});
