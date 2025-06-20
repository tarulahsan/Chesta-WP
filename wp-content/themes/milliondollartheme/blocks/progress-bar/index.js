/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, RangeControl, ToggleControl, SelectControl, TextareaControl } from '@wordpress/components';

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
            title: barTitle, percentage, barColor, barGradient, barBackgroundColor, barHeight, borderRadius,
            showLabel, labelPosition, labelColor, titleColor, animateOnScroll, barStyle
        } = attributes;

        const blockProps = useBlockProps({
            className: `is-style-${barStyle} label-pos-${labelPosition}` // Added label-pos class to wrapper
        });

        const titlePreviewStyles = { color: titleColor };
        const barWrapperPreviewStyles = {
            height: barHeight,
            backgroundColor: barBackgroundColor,
            borderRadius: borderRadius,
            position: 'relative',
            overflow: 'hidden'
        };
        const barFillPreviewStyles = {
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: barColor && !barGradient ? barColor : undefined,
            backgroundImage: barGradient || undefined,
            borderRadius: borderRadius,
            transition: 'width 0.3s ease-out', // For live update in editor
            display: 'flex', alignItems: 'center', justifyContent: labelPosition === 'inside' ? 'flex-end' : 'flex-start' // For label
        };
        const labelPreviewStyles = { color: labelColor };

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Bar Settings', 'milliondollartheme')}>
                        <TextControl label={__('Title/Skill Name', 'milliondollartheme')} value={barTitle} onChange={(val) => setAttributes({ title: val })} />
                        <RangeControl label={__('Percentage', 'milliondollartheme')} value={percentage} onChange={(val) => setAttributes({ percentage: val })} min={0} max={100} />
                        <TextControl label={__('Bar Height (e.g., 24px, 1.5em)', 'milliondollartheme')} value={barHeight} onChange={(val) => setAttributes({ barHeight: val })} />
                        <TextControl label={__('Border Radius (e.g., 4px, 50px)', 'milliondollartheme')} value={borderRadius} onChange={(val) => setAttributes({ borderRadius: val })} />
                    </PanelBody>
                    <PanelBody title={__('Colors & Style', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Bar Style', 'milliondollartheme')}
                            value={barStyle}
                            options={[ {label:'Default', value:'default'}, {label:'Striped', value:'striped'}, {label:'Glassy Fill', value:'glassy-fill'} ]}
                            onChange={val => setAttributes({barStyle: val})}
                        />
                        <TextControl /* TODO: ColorPalette for barColor */
                            label={__('Bar Color (Solid)', 'milliondollartheme')}
                            value={barColor || ''}
                            onChange={(val) => setAttributes({ barColor: val })}
                        />
                        <TextareaControl /* TODO: GradientPicker for barGradient */
                            label={__('Bar Gradient (CSS)', 'milliondollartheme')}
                            value={barGradient || ''}
                            onChange={(val) => setAttributes({ barGradient: val })}
                            help={__('Overrides solid color if set.', 'milliondollartheme')}
                        />
                        <TextControl /* TODO: ColorPalette for barBackgroundColor */
                            label={__('Bar Background Color (Track)', 'milliondollartheme')}
                            value={barBackgroundColor}
                            onChange={(val) => setAttributes({ barBackgroundColor: val })}
                        />
                        <TextControl /* TODO: ColorPalette for titleColor */
                            label={__('Title Color', 'milliondollartheme')}
                            value={titleColor || ''}
                            onChange={(val) => setAttributes({ titleColor: val })}
                        />
                    </PanelBody>
                    <PanelBody title={__('Label', 'milliondollartheme')}>
                        <ToggleControl label={__('Show Percentage Label', 'milliondollartheme')} checked={!!showLabel} onChange={() => setAttributes({ showLabel: !showLabel })} />
                        {showLabel && (
                            <>
                                <SelectControl
                                    label={__('Label Position', 'milliondollartheme')}
                                    value={labelPosition}
                                    options={[ {label:'Inside Bar (End)', value:'inside'}, {label:'Right of Bar', value:'outside-right'}, {label:'Above Bar', value:'outside-above'} ]}
                                    onChange={(val) => setAttributes({ labelPosition: val })}
                                />
                                <TextControl /* TODO: ColorPalette for labelColor */
                                    label={__('Label Color', 'milliondollartheme')}
                                    value={labelColor || ''}
                                    onChange={(val) => setAttributes({ labelColor: val })}
                                />
                            </>
                        )}
                    </PanelBody>
                    <PanelBody title={__('Animation', 'milliondollartheme')}>
                        <ToggleControl label={__('Animate on Scroll (Front-end)', 'milliondollartheme')} checked={!!animateOnScroll} onChange={() => setAttributes({ animateOnScroll: !animateOnScroll })} />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    {barTitle && (labelPosition === 'outside-above' || !showLabel) && (
                        <RichText tagName="p" className="progress-bar-title is-position-above" value={barTitle} onChange={(val) => setAttributes({ title: val })} style={titlePreviewStyles} />
                    )}
                    <div className={`progress-bar-wrapper label-pos-${labelPosition}`}>
                        <div className="progress-bar-track" style={barWrapperPreviewStyles}>
                            <div className="progress-bar-fill" style={barFillPreviewStyles}>
                                {showLabel && labelPosition === 'inside' && (
                                    <span className="progress-bar-label is-inside" style={labelPreviewStyles}>{percentage}%</span>
                                )}
                            </div>
                        </div>
                        {showLabel && labelPosition === 'outside-right' && (
                            <span className="progress-bar-label is-outside-right" style={labelPreviewStyles}>{percentage}%</span>
                        )}
                    </div>
                     {barTitle && labelPosition !== 'outside-above' && showLabel && (
                        <RichText tagName="p" className="progress-bar-title is-position-below" value={barTitle} onChange={(val) => setAttributes({ title: val })} style={titlePreviewStyles} />
                    )}

                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const {
            title: barTitle, percentage, barColor, barGradient, barBackgroundColor, barHeight, borderRadius,
            showLabel, labelPosition, labelColor, titleColor, animateOnScroll, barStyle
        } = attributes;

        const blockProps = useBlockProps.save({
            className: `is-style-${barStyle} ${animateOnScroll ? 'animate-on-scroll' : ''}`,
            'data-percentage': percentage // For view.js animation
        });

        const barWrapperStyles = {
            height: barHeight,
            backgroundColor: barBackgroundColor,
            borderRadius: borderRadius,
            position: 'relative',
            overflow: 'hidden'
        };
        // Initial width for fill is 0 if animating, otherwise full percentage
        const initialFillWidth = animateOnScroll ? '0%' : `${percentage}%`;
        const barFillStyles = {
            width: initialFillWidth,
            height: '100%',
            backgroundColor: barColor && !barGradient ? barColor : undefined,
            backgroundImage: barGradient || undefined,
            borderRadius: borderRadius,
            transition: animateOnScroll ? 'width 1s ease-out' : undefined // CSS transition if JS sets width
        };
        const labelStyles = { color: labelColor };
        const titleStyles = { color: titleColor };

        return (
            <div {...blockProps}>
                {barTitle && (labelPosition === 'outside-above' || !showLabel || (showLabel && labelPosition !== 'inside' && labelPosition !== 'outside-right')) && (
                     <RichText.Content tagName="p" className="progress-bar-title is-position-above" value={barTitle} style={titleStyles} />
                )}
                <div className={`progress-bar-wrapper label-pos-${labelPosition}`}>
                    <div
                        className="progress-bar-track"
                        style={barWrapperStyles}
                        role="progressbar"
                        aria-valuenow={percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-label={barTitle ? `${barTitle} ${__('progress', 'milliondollartheme')}` : __('Progress bar', 'milliondollartheme')}
                    >
                        <div className="progress-bar-fill" style={barFillStyles}>
                            {showLabel && labelPosition === 'inside' && (
                                <span className="progress-bar-label is-inside" style={labelStyles}>{percentage}%</span>
                            )}
                        </div>
                    </div>
                    {showLabel && labelPosition === 'outside-right' && (
                        <span className="progress-bar-label is-outside-right" style={labelStyles}>{percentage}%</span>
                    )}
                </div>
                {barTitle && labelPosition !== 'outside-above' && (showLabel && (labelPosition === 'inside' || labelPosition === 'outside-right')) && (
                     <RichText.Content tagName="p" className="progress-bar-title is-position-below" value={barTitle} style={titleStyles} />
                )}
            </div>
        );
    },
});
