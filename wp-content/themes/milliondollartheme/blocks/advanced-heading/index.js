/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InspectorControls, AlignmentControl, BlockControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl, ToolbarGroup, ToolbarButton, TextareaControl } from '@wordpress/components'; // Added TextareaControl

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

    edit: ({ attributes, setAttributes }) => {
        const {
            content, level, textAlign, colorType, textColor, gradient,
            enableTextShadow, textShadowOffsetX, textShadowOffsetY, textShadowBlur, textShadowColor,
            showSubHeading, subHeadingContent, subHeadingPosition, subHeadingColor, subHeadingSize,
            showDecorativeElement, decorativeElementType, decorativeElementColor, decorativeElementThickness, decorativeElementWidth
        } = attributes;

        const blockProps = useBlockProps({
            className: `text-align-${textAlign || 'left'}`
        });

        const TagName = 'h' + level;

        const mainHeadingPreviewStyles = {};
        if (colorType === 'solid') {
            mainHeadingPreviewStyles.color = textColor;
        } else if (colorType === 'gradient') {
            mainHeadingPreviewStyles.background = gradient; // For preview, actual gradient text is CSS
            mainHeadingPreviewStyles.WebkitBackgroundClip = 'text';
            mainHeadingPreviewStyles.backgroundClip = 'text';
            mainHeadingPreviewStyles.color = 'transparent';
        }
        if (enableTextShadow) {
            mainHeadingPreviewStyles.textShadow = `${textShadowOffsetX || '0px'} ${textShadowOffsetY || '0px'} ${textShadowBlur || '0px'} ${textShadowColor || 'rgba(0,0,0,0.3)'}`;
        }

        const subHeadingPreviewStyles = {
            color: subHeadingColor,
            fontSize: subHeadingSize,
        };

        const decoratorPreviewStyles = {
            backgroundColor: decorativeElementColor,
            height: decorativeElementType !== 'accent-shape' ? (decorativeElementThickness || '3px') : 'auto',
            width: decorativeElementType !== 'accent-shape' ? (decorativeElementWidth || '50px') : 'auto',
            // Add more specific styles for different decorator types if needed for preview
        };

        return (
            <>
                <BlockControls>
                    <AlignmentControl
                        value={textAlign}
                        onChange={(val) => setAttributes({ textAlign: val })}
                    />
                </BlockControls>
                <InspectorControls>
                    <PanelBody title={__('Main Heading', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Level (H1-H6)', 'milliondollartheme')}
                            value={level}
                            options={[1,2,3,4,5,6].map(l => ({label: 'H'+l, value: l}))}
                            onChange={(val) => setAttributes({ level: parseInt(val) })}
                        />
                        {/* Text Alignment is now in BlockControls */}
                    </PanelBody>

                    <PanelBody title={__('Color & Appearance', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Color Type', 'milliondollartheme')}
                            value={colorType}
                            options={[ { label: 'Solid', value: 'solid' }, { label: 'Gradient', value: 'gradient' } ]}
                            onChange={(val) => setAttributes({ colorType: val })}
                        />
                        {colorType === 'solid' && (
                            <TextControl /* TODO: Replace with ColorPalette */
                                label={__('Text Color', 'milliondollartheme')}
                                value={textColor}
                                onChange={(val) => setAttributes({ textColor: val })}
                            />
                        )}
                        {colorType === 'gradient' && (
                            <TextareaControl /* TODO: Replace with GradientPicker */
                                label={__('Gradient CSS', 'milliondollartheme')}
                                value={gradient}
                                onChange={(val) => setAttributes({ gradient: val })}
                            />
                        )}
                    </PanelBody>

                    <PanelBody title={__('Text Shadow', 'milliondollartheme')} initialOpen={false}>
                        <ToggleControl
                            label={__('Enable Text Shadow', 'milliondollartheme')}
                            checked={!!enableTextShadow}
                            onChange={() => setAttributes({ enableTextShadow: !enableTextShadow })}
                        />
                        {enableTextShadow && (
                            <>
                                <TextControl label={__('Offset X', 'milliondollartheme')} value={textShadowOffsetX} onChange={(val) => setAttributes({ textShadowOffsetX: val })} />
                                <TextControl label={__('Offset Y', 'milliondollartheme')} value={textShadowOffsetY} onChange={(val) => setAttributes({ textShadowOffsetY: val })} />
                                <TextControl label={__('Blur Radius', 'milliondollartheme')} value={textShadowBlur} onChange={(val) => setAttributes({ textShadowBlur: val })} />
                                <TextControl /* TODO: Replace with ColorPalette */ label={__('Shadow Color', 'milliondollartheme')} value={textShadowColor} onChange={(val) => setAttributes({ textShadowColor: val })} />
                            </>
                        )}
                    </PanelBody>

                    <PanelBody title={__('Sub Heading', 'milliondollartheme')} initialOpen={false}>
                        <ToggleControl
                            label={__('Show Sub Heading', 'milliondollartheme')}
                            checked={!!showSubHeading}
                            onChange={() => setAttributes({ showSubHeading: !showSubHeading })}
                        />
                        {showSubHeading && (
                            <>
                                <TextControl /* RichText in block, this for attribute */ label={__('Sub Heading Text', 'milliondollartheme')} value={subHeadingContent} onChange={(val) => setAttributes({ subHeadingContent: val })} />
                                <SelectControl label={__('Position', 'milliondollartheme')} value={subHeadingPosition} options={[ {label: 'Above', value: 'above'}, {label: 'Below', value: 'below'} ]} onChange={(val) => setAttributes({ subHeadingPosition: val })} />
                                <TextControl /* TODO: Replace with ColorPalette */ label={__('Sub Heading Color', 'milliondollartheme')} value={subHeadingColor} onChange={(val) => setAttributes({ subHeadingColor: val })} />
                                <TextControl label={__('Sub Heading Size (e.g., 0.8em, 1rem)', 'milliondollartheme')} value={subHeadingSize} onChange={(val) => setAttributes({ subHeadingSize: val })} />
                            </>
                        )}
                    </PanelBody>

                    <PanelBody title={__('Decorative Element', 'milliondollartheme')} initialOpen={false}>
                        <ToggleControl
                            label={__('Show Decorative Element', 'milliondollartheme')}
                            checked={!!showDecorativeElement}
                            onChange={() => setAttributes({ showDecorativeElement: !showDecorativeElement })}
                        />
                        {showDecorativeElement && (
                            <>
                                <SelectControl label={__('Type', 'milliondollartheme')} value={decorativeElementType} options={[ {label: 'Underline', value: 'underline'}, {label: 'Overline', value: 'overline'} /* more later */ ]} onChange={(val) => setAttributes({ decorativeElementType: val })} />
                                <TextControl /* TODO: Replace with ColorPalette */ label={__('Decorator Color', 'milliondollartheme')} value={decorativeElementColor} onChange={(val) => setAttributes({ decorativeElementColor: val })} />
                                <TextControl label={__('Decorator Thickness (e.g., 3px)', 'milliondollartheme')} value={decorativeElementThickness} onChange={(val) => setAttributes({ decorativeElementThickness: val })} />
                                <TextControl label={__('Decorator Width (e.g., 50px, 100%)', 'milliondollartheme')} value={decorativeElementWidth} onChange={(val) => setAttributes({ decorativeElementWidth: val })} />
                            </>
                        )}
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    {showSubHeading && subHeadingPosition === 'above' && (
                        <RichText
                            tagName="p"
                            className="adv-heading-sub is-position-above"
                            value={subHeadingContent}
                            onChange={(val) => setAttributes({ subHeadingContent: val })}
                            placeholder={__('Sub-heading...', 'milliondollartheme')}
                            style={subHeadingPreviewStyles}
                        />
                    )}
                    <RichText
                        tagName={TagName}
                        className={`adv-heading-main ${colorType === 'gradient' ? 'has-gradient-text' : ''}`}
                        style={mainHeadingPreviewStyles}
                        value={content}
                        onChange={(val) => setAttributes({ content: val })}
                        placeholder={__('Heading...', 'milliondollartheme')}
                        allowedFormats={['core/bold', 'core/italic', 'core/link']}
                    />
                    {showSubHeading && subHeadingPosition === 'below' && (
                        <RichText
                            tagName="p"
                            className="adv-heading-sub is-position-below"
                            value={subHeadingContent}
                            onChange={(val) => setAttributes({ subHeadingContent: val })}
                            placeholder={__('Sub-heading...', 'milliondollartheme')}
                            style={subHeadingPreviewStyles}
                        />
                    )}
                    {showDecorativeElement && (
                        <div className={`adv-heading-decorator is-type-${decorativeElementType}`} style={decoratorPreviewStyles}></div>
                    )}
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const {
            content, level, textAlign, colorType, textColor, gradient,
            showSubHeading, subHeadingContent, subHeadingPosition, subHeadingColor, subHeadingSize,
            enableTextShadow, textShadowOffsetX, textShadowOffsetY, textShadowBlur, textShadowColor,
            showDecorativeElement, decorativeElementType, decorativeElementColor, decorativeElementThickness, decorativeElementWidth
        } = attributes;

        const TagName = 'h' + (level || 2);
        const blockProps = useBlockProps.save({
            className: `text-align-${textAlign || 'left'}`
            // style: { textAlign: textAlign || undefined } // textAlign handled by class
        });

        const mainHeadingClasses = ['adv-heading-main'];
        const mainHeadingStyles = {};
        if (colorType === 'solid') {
            mainHeadingStyles.color = textColor;
        } else if (colorType === 'gradient') {
            mainHeadingClasses.push('has-gradient-text');
            mainHeadingStyles['--heading-gradient'] = gradient;
        }
        if (enableTextShadow) {
            mainHeadingStyles.textShadow = `${textShadowOffsetX} ${textShadowOffsetY} ${textShadowBlur} ${textShadowColor}`;
        }

        const subHeadingStyles = {
            color: subHeadingColor || undefined,
            fontSize: subHeadingSize || undefined,
        };

        const decoratorStyles = {
            backgroundColor: decorativeElementColor,
            height: decorativeElementType !== 'accent-shape' ? (decorativeElementThickness || undefined) : undefined,
            width: decorativeElementType !== 'accent-shape' ? (decorativeElementWidth || undefined) : undefined,
        };


        return (
            <div {...blockProps}>
                {showSubHeading && subHeadingPosition === 'above' && (
                    <RichText.Content tagName="p" className="adv-heading-sub is-position-above" style={subHeadingStyles} value={subHeadingContent} />
                )}
                <RichText.Content tagName={TagName} className={mainHeadingClasses.join(' ')} style={mainHeadingStyles} value={content} />
                {showSubHeading && subHeadingPosition === 'below' && (
                    <RichText.Content tagName="p" className="adv-heading-sub is-position-below" style={subHeadingStyles} value={subHeadingContent} />
                )}
                {showDecorativeElement && (
                    <div className={`adv-heading-decorator is-type-${decorativeElementType}`} style={decoratorStyles}></div>
                )}
            </div>
        );
    },
});
