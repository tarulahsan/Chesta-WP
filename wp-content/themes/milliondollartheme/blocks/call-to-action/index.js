/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps, RichText, InspectorControls, MediaUpload, MediaUploadCheck,
    BlockControls, AlignmentToolbar, URLInputButton
} from '@wordpress/block-editor';
import {
    PanelBody, TextControl, TextareaControl, SelectControl, ToggleControl,
    Button, RangeControl, FontSizePicker, ColorPalette
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import './style-index.css';
import './index.css';

const { name, title, attributes } = metadata;

registerBlockType(name, {
    title: title,
    attributes: attributes,

    edit: ({ attributes, setAttributes, isSelected }) => {
        const {
            heading, headingTag, headingColor, text, textColor, layout, ctaStyle,
            backgroundColor, gradient, backgroundImageUrl, backgroundImageId, overlayColor, overlayOpacity,
            padding, borderRadius, showButton1, button1Text, button1Url, button1Style, button1NewTab,
            showButton2, button2Text, button2Url, button2Style, button2NewTab
        } = attributes;

        const blockProps = useBlockProps({
            className: `is-style-${ctaStyle} layout-${layout}`,
            style: {
                padding: padding,
                borderRadius: borderRadius,
                backgroundColor: (ctaStyle === 'default' && !backgroundImageUrl && (!gradient || ctaStyle !== 'gradient-bg')) ? backgroundColor : undefined,
                backgroundImage: (ctaStyle === 'gradient-bg' && !backgroundImageUrl) ? gradient : (backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined),
                backgroundSize: backgroundImageUrl ? 'cover' : undefined,
                backgroundPosition: backgroundImageUrl ? 'center center' : undefined,
                position: 'relative',
            }
        });

        const HeadingTag = headingTag || 'h2';
        const overlayStyles = {
            backgroundColor: overlayColor,
            opacity: backgroundImageUrl && overlayOpacity > 0 ? (overlayOpacity / 100) : 0,
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1,
            borderRadius: borderRadius,
            pointerEvents: 'none'
        };
        const contentWrapperStyles = { position: 'relative', zIndex: 2 };
        const headingPreviewStyles = { color: headingColor };
        const textPreviewStyles = { color: textColor };

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Content', 'milliondollartheme')}>
                        <TextControl label={__('Heading', 'milliondollartheme')} value={heading} onChange={(val) => setAttributes({ heading: val })} />
                        <SelectControl label={__('Heading Tag', 'milliondollartheme')} value={headingTag} options={[ {label:'H1',value:'h1'},{label:'H2',value:'h2'},{label:'H3',value:'h3'},{label:'H4',value:'h4'} ]} onChange={val => setAttributes({headingTag: val})} />
                        <TextareaControl label={__('Text', 'milliondollartheme')} value={text} onChange={(val) => setAttributes({ text: val })} rows={3} />
                    </PanelBody>
                    <PanelBody title={__('Layout & Style', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Layout', 'milliondollartheme')}
                            value={layout}
                            options={[
                                { label: 'Text Left, Button Right', value: 'text-left-button-right' },
                                { label: 'Text Center (buttons below)', value: 'text-center-button-center' },
                                { label: 'Text Above, Button Center', value: 'text-above-button-center' },
                            ]}
                            onChange={(val) => setAttributes({ layout: val })}
                        />
                        <SelectControl
                            label={__('CTA Style', 'milliondollartheme')}
                            value={ctaStyle}
                            options={[ {label: 'Default', value: 'default'}, {label: 'Glassy', value: 'glassy'}, {label: 'Gradient Background', value: 'gradient-bg'}, {label: 'Image Background', value: 'image-bg'} ]}
                            onChange={(val) => setAttributes({ ctaStyle: val })}
                        />
                    </PanelBody>
                    <PanelBody title={__('Background Options', 'milliondollartheme')}>
                        {(ctaStyle === 'default' || ctaStyle === 'custom') && <TextControl /*TODO: ColorPalette for backgroundColor */ label={__('Background Color (for Default/Custom style)', 'milliondollartheme')} value={backgroundColor || ''} onChange={val => setAttributes({backgroundColor: val})} />}
                        {(ctaStyle === 'gradient-bg') && <TextareaControl /*TODO: GradientPicker */ label={__('Background Gradient (for Gradient style)', 'milliondollartheme')} value={gradient || ''} onChange={val => setAttributes({gradient: val})} />}
                        {(ctaStyle === 'image-bg' || backgroundImageUrl) && ( // Show MediaUpload if style is image-bg OR if an image is already selected
                            <>
                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={(media) => setAttributes({ backgroundImageUrl: media.url, backgroundImageId: media.id })}
                                        allowedTypes={['image']} value={backgroundImageId}
                                        render={({ open }) => (<Button onClick={open} isSecondary>{!backgroundImageUrl ? __('Upload BG Image', 'milliondollartheme') : __('Replace BG Image', 'milliondollartheme')}</Button>)}
                                    />
                                </MediaUploadCheck>
                                {backgroundImageUrl && <>
                                    <Button onClick={() => setAttributes({ backgroundImageUrl: '', backgroundImageId: null })} isLink isDestructive style={{marginLeft:'10px'}}>{__('Remove BG Image', 'milliondollartheme')}</Button>
                                    <TextControl /*TODO: ColorPalette for overlayColor */ label={__('Overlay Color', 'milliondollartheme')} value={overlayColor} onChange={val => setAttributes({overlayColor: val})} />
                                    <RangeControl label={__('Overlay Opacity (%)', 'milliondollartheme')} value={overlayOpacity} onChange={val => setAttributes({overlayOpacity: val})} min={0} max={100} />
                                </>}
                            </>
                        )}
                    </PanelBody>
                    <PanelBody title={__('Text Colors', 'milliondollartheme')}>
                        <TextControl /*TODO: ColorPalette for headingColor */ label={__('Heading Color', 'milliondollartheme')} value={headingColor || ''} onChange={val => setAttributes({headingColor: val})} />
                        <TextControl /*TODO: ColorPalette for textColor */ label={__('Text Color', 'milliondollartheme')} value={textColor || ''} onChange={val => setAttributes({textColor: val})} />
                    </PanelBody>
                    <PanelBody title={__('Button 1', 'milliondollartheme')}>
                        <ToggleControl label={__('Show Button 1', 'milliondollartheme')} checked={!!showButton1} onChange={() => setAttributes({showButton1: !showButton1})} />
                        {showButton1 && <>
                            <TextControl label={__('Button 1 Text', 'milliondollartheme')} value={button1Text} onChange={val => setAttributes({button1Text: val})} />
                            <TextControl label={__('Button 1 URL', 'milliondollartheme')} value={button1Url} onChange={val => setAttributes({button1Url: val})} />
                            <SelectControl label={__('Button 1 Style', 'milliondollartheme')} value={button1Style} options={[{label: 'Primary', value: 'primary'}, {label: 'Secondary', value: 'secondary'}, {label: 'Outline', value: 'outline'}, {label: 'Glassy', value: 'glassy'}]} onChange={val => setAttributes({button1Style: val})} />
                            <ToggleControl label={__('Open in new tab', 'milliondollartheme')} checked={!!button1NewTab} onChange={() => setAttributes({button1NewTab: !button1NewTab, button1Rel: !button1NewTab ? 'noopener noreferrer' : ''})} />
                        </>}
                    </PanelBody>
                    <PanelBody title={__('Button 2 (Optional)', 'milliondollartheme')}>
                        <ToggleControl label={__('Show Button 2', 'milliondollartheme')} checked={!!showButton2} onChange={() => setAttributes({showButton2: !showButton2})} />
                        {showButton2 && <>
                            <TextControl label={__('Button 2 Text', 'milliondollartheme')} value={button2Text} onChange={val => setAttributes({button2Text: val})} />
                            <TextControl label={__('Button 2 URL', 'milliondollartheme')} value={button2Url} onChange={val => setAttributes({button2Url: val})} />
                            <SelectControl label={__('Button 2 Style', 'milliondollartheme')} value={button2Style} options={[{label: 'Primary', value: 'primary'}, {label: 'Secondary', value: 'secondary'}, {label: 'Outline', value: 'outline'}, {label: 'Glassy', value: 'glassy'}]} onChange={val => setAttributes({button2Style: val})} />
                            <ToggleControl label={__('Open in new tab', 'milliondollartheme')} checked={!!button2NewTab} onChange={() => setAttributes({button2NewTab: !button2NewTab, button2Rel: !button2NewTab ? 'noopener noreferrer' : ''})} />
                        </>}
                    </PanelBody>
                     <PanelBody title={__('Spacing & Border', 'milliondollartheme')}>
                        <TextControl label={__('Padding (e.g., var(--spacing-xl))', 'milliondollartheme')} value={padding} onChange={val => setAttributes({padding: val})} />
                        <TextControl label={__('Border Radius (e.g., var(--border-radius-md))', 'milliondollartheme')} value={borderRadius} onChange={val => setAttributes({borderRadius: val})} />
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    {backgroundImageUrl && overlayOpacity > 0 && <div className="cta-overlay" style={overlayStyles}></div>}
                    <div className="cta-content-wrapper" style={contentWrapperStyles}>
                        <div className="cta-text-content">
                            <RichText tagName={HeadingTag} className="cta-heading" value={heading} onChange={(val) => setAttributes({ heading: val })} placeholder={__('Enter Heading...','milliondollartheme')} style={headingPreviewStyles} />
                            <RichText tagName="p" className="cta-text" value={text} onChange={(val) => setAttributes({ text: val })} placeholder={__('Enter text...','milliondollartheme')} style={textPreviewStyles} />
                        </div>
                        {(showButton1 || showButton2) && (
                            <div className="cta-buttons">
                                {showButton1 && (
                                    <span className={`cta-button is-style-${button1Style}`}> {/* Use span for editor preview of button */}
                                        {button1Text}
                                        {isSelected && <URLInputButton url={button1Url} onChange={(url) => setAttributes({ button1Url: url })} />}
                                    </span>
                                )}
                                {showButton2 && (
                                    <span className={`cta-button is-style-${button2Style}`}> {/* Use span for editor preview */}
                                        {button2Text}
                                        {isSelected && <URLInputButton url={button2Url} onChange={(url) => setAttributes({ button2Url: url })} />}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const {
            heading, headingTag, headingColor, text, textColor, layout, ctaStyle,
            backgroundColor, gradient, backgroundImageUrl, overlayColor, overlayOpacity,
            padding, borderRadius, showButton1, button1Text, button1Url, button1Style, button1NewTab,
            showButton2, button2Text, button2Url, button2Style, button2NewTab
        } = attributes;

        const blockProps = useBlockProps.save({
            className: `is-style-${ctaStyle} layout-${layout}`,
            style: {
                padding: padding,
                borderRadius: borderRadius,
                backgroundColor: (ctaStyle === 'default' && !backgroundImageUrl && (!gradient || ctaStyle !== 'gradient-bg')) ? backgroundColor : undefined,
                backgroundImage: (ctaStyle === 'gradient-bg' && !backgroundImageUrl) ? gradient : (backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined),
                backgroundSize: backgroundImageUrl ? 'cover' : undefined,
                backgroundPosition: backgroundImageUrl ? 'center center' : undefined,
                position: 'relative',
            }
        });
        const HeadingTag = headingTag || 'h2';
        const overlayStyles = {
            backgroundColor: overlayColor,
            opacity: backgroundImageUrl && overlayOpacity > 0 ? (overlayOpacity / 100) : 0,
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1,
            borderRadius: borderRadius,
            pointerEvents: 'none'
        };
        const contentWrapperStyles = { position: 'relative', zIndex: 2 };
        const headingStyles = { color: headingColor };
        const textStyles = { color: textColor };

        return (
            <div {...blockProps}>
                {backgroundImageUrl && overlayOpacity > 0 && <div className="cta-overlay" style={overlayStyles}></div>}
                <div className="cta-content-wrapper" style={contentWrapperStyles}>
                    <div className="cta-text-content">
                        <RichText.Content tagName={HeadingTag} className="cta-heading" value={heading} style={headingStyles} />
                        <RichText.Content tagName="p" className="cta-text" value={text} style={textStyles} />
                    </div>
                    {(showButton1 || showButton2) && (
                        <div className="cta-buttons">
                            {showButton1 && (
                                <a
                                    href={button1Url || '#'}
                                    className={`cta-button is-style-${button1Style}`}
                                    target={button1NewTab ? '_blank' : undefined}
                                    rel={button1NewTab ? 'noopener noreferrer' : undefined}
                                >
                                    <RichText.Content value={button1Text} />
                                </a>
                            )}
                            {showButton2 && (
                                <a
                                    href={button2Url || '#'}
                                    className={`cta-button is-style-${button2Style}`}
                                    target={button2NewTab ? '_blank' : undefined}
                                    rel={button2NewTab ? 'noopener noreferrer' : undefined}
                                >
                                    <RichText.Content value={button2Text} />
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    },
});
