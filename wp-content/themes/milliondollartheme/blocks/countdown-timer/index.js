/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, RichText, BlockControls, AlignmentControl } from '@wordpress/block-editor';
import { PanelBody, DateTimePicker, ToggleControl, TextControl, SelectControl, TextareaControl, RangeControl } from '@wordpress/components'; // Added RangeControl, TextareaControl

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
            eventDateTime, showDays, showHours, showMinutes, showSeconds,
            labelDays, labelHours, labelMinutes, labelSeconds,
            numberFontSize, numberColor, labelFontSize, labelColor,
            digitBlockStyle, expiredMessage, hideWhenExpired, alignment, gapBetweenBlocks,
            digitBlockBackgroundColor, digitBlockBorderColor, digitBlockBorderRadius, digitBlockPadding
        } = attributes;

        const blockProps = useBlockProps({
            className: `is-style-${digitBlockStyle} has-text-align-${alignment} label-pos-${labelPosition}`, // labelPosition was used here before, but it's not in current destructure, assuming it's for the wrapper based on context
            style: { '--countdown-gap': gapBetweenBlocks }
        });

        const titlePreviewStyles = { color: titleColor }; // titleColor was from previous iteration, but not in current destructure. Assuming it's a typo and not used for now.
                                                        // Re-evaluating based on block.json: titleColor is an attribute.

        const renderDigitBlockPreview = (unitValue, unitLabel, unitShowFlag) => {
            if (!unitShowFlag) return null;
            const digitBlockStyles = {
                padding: digitBlockPadding,
                borderRadius: digitBlockBorderRadius,
            };
            if (digitBlockStyle === 'boxed' || digitBlockStyle === 'glassy-box' || digitBlockStyle === 'custom') {
                digitBlockStyles.backgroundColor = digitBlockBackgroundColor;
                if (digitBlockBorderColor) {
                    digitBlockStyles.border = `1px solid ${digitBlockBorderColor}`;
                }
            }
            return (
                <div className={`countdown-digit-block preview-style-${digitBlockStyle}`} style={digitBlockStyles}>
                    <span className="number" style={{fontSize: numberFontSize, color: numberColor}}>{unitValue}</span>
                    <span className="label" style={{fontSize: labelFontSize, color: labelColor}}>{unitLabel}</span>
                </div>
            );
        };

        const staticPreview = (
            <div className="countdown-timer-preview" style={{gap: gapBetweenBlocks}}> {/* Apply gap here too */}
                {renderDigitBlockPreview('00', labelDays, showDays)}
                {renderDigitBlockPreview('00', labelHours, showHours)}
                {renderDigitBlockPreview('00', labelMinutes, showMinutes)}
                {renderDigitBlockPreview('00', labelSeconds, showSeconds)}
            </div>
        );
        // Resolve labelPosition from attributes for title logic
        const { labelPosition } = attributes;


        return (
            <>
                <BlockControls>
                    <AlignmentControl value={alignment} onChange={val => setAttributes({alignment: val})} />
                </BlockControls>
                <InspectorControls>
                    <PanelBody title={__('Countdown Settings', 'milliondollartheme')}>
                        <DateTimePicker currentDate={eventDateTime} onChange={(val) => setAttributes({ eventDateTime: val })} is12Hour={false} __nextRemoveHelpButton __nextRemoveResetButton />
                        <p style={{fontStyle: 'italic', fontSize: '0.9em'}}>{__('Target: ', 'milliondollartheme')} {eventDateTime ? new Date(eventDateTime).toLocaleString() : __('Not set', 'milliondollartheme')}</p>
                    </PanelBody>
                    <PanelBody title={__('Display Options', 'milliondollartheme')}>
                        <ToggleControl label={__('Show Days', 'milliondollartheme')} checked={!!showDays} onChange={() => setAttributes({showDays: !showDays})} />
                        {showDays && <TextControl label={__('Days Label', 'milliondollartheme')} value={labelDays} onChange={val => setAttributes({labelDays: val})} />}
                        <ToggleControl label={__('Show Hours', 'milliondollartheme')} checked={!!showHours} onChange={() => setAttributes({showHours: !showHours})} />
                        {showHours && <TextControl label={__('Hours Label', 'milliondollartheme')} value={labelHours} onChange={val => setAttributes({labelHours: val})} />}
                        <ToggleControl label={__('Show Minutes', 'milliondollartheme')} checked={!!showMinutes} onChange={() => setAttributes({showMinutes: !showMinutes})} />
                        {showMinutes && <TextControl label={__('Minutes Label', 'milliondollartheme')} value={labelMinutes} onChange={val => setAttributes({labelMinutes: val})} />}
                        <ToggleControl label={__('Show Seconds', 'milliondollartheme')} checked={!!showSeconds} onChange={() => setAttributes({showSeconds: !showSeconds})} />
                        {showSeconds && <TextControl label={__('Seconds Label', 'milliondollartheme')} value={labelSeconds} onChange={val => setAttributes({labelSeconds: val})} />}
                    </PanelBody>

                    <PanelBody title={__('Appearance & Styling', 'milliondollartheme')}>
                        <TextControl label={__('Number Font Size (e.g., 2.5em)', 'milliondollartheme')} value={numberFontSize} onChange={val => setAttributes({numberFontSize: val})} />
                        <TextControl /*TODO: ColorPalette for numberColor */ label={__('Number Color', 'milliondollartheme')} value={numberColor || ''} onChange={val => setAttributes({numberColor: val})} />
                        <TextControl label={__('Label Font Size (e.g., 0.8em)', 'milliondollartheme')} value={labelFontSize} onChange={val => setAttributes({labelFontSize: val})} />
                        <TextControl /*TODO: ColorPalette for labelColor */ label={__('Label Color', 'milliondollartheme')} value={labelColor || ''} onChange={val => setAttributes({labelColor: val})} />
                        <TextControl label={__('Gap Between Digit Blocks (e.g., var(--spacing-md))', 'milliondollartheme')} value={gapBetweenBlocks} onChange={val => setAttributes({gapBetweenBlocks: val})} />
                        <SelectControl label={__('Digit Block Style', 'milliondollartheme')} value={digitBlockStyle} options={[{label:'Default', value:'default'}, {label:'Boxed', value:'boxed'}, {label:'Glassy Box', value:'glassy-box'}, {label:'Custom', value:'custom'}]} onChange={val => setAttributes({digitBlockStyle: val})} />
                        {(digitBlockStyle === 'boxed' || digitBlockStyle === 'custom' || digitBlockStyle === 'glassy-box') && (
                            <>
                                <TextControl /*TODO: ColorPalette*/ label={__('Digit Block Background', 'milliondollartheme')} value={attributes.digitBlockBackgroundColor || ''} onChange={val => setAttributes({digitBlockBackgroundColor: val})} />
                                <TextControl /*TODO: ColorPalette*/ label={__('Digit Block Border Color', 'milliondollartheme')} value={attributes.digitBlockBorderColor || ''} onChange={val => setAttributes({digitBlockBorderColor: val})} />
                                <TextControl label={__('Digit Block Padding (e.g., 10px)', 'milliondollartheme')} value={attributes.digitBlockPadding || ''} onChange={val => setAttributes({digitBlockPadding: val})} />
                                <TextControl label={__('Digit Block Border Radius (e.g., 4px)', 'milliondollartheme')} value={attributes.digitBlockBorderRadius || ''} onChange={val => setAttributes({digitBlockBorderRadius: val})} />
                            </>
                        )}
                        <TextControl /* TODO: ColorPalette for titleColor, this was for main block title, not digit title if any */
                            label={__('Overall Title Color (If title added)', 'milliondollartheme')}
                            value={attributes.titleColor || ''} // titleColor from attributes
                            onChange={(val) => setAttributes({ titleColor: val })}
                        />
                    </PanelBody>
                    <PanelBody title={__('Label Position (for all units)', 'milliondollartheme')}>
                         <SelectControl
                            label={__('Label Position', 'milliondollartheme')}
                            value={labelPosition} // labelPosition from attributes
                            options={[ {label:'Inside Bar End', value:'inside'}, {label:'Right of Bar', value:'outside-right'}, {label:'Above Bar', value:'outside-above'} ]}
                            onChange={(val) => setAttributes({ labelPosition: val })}
                        />
                    </PanelBody>
                    <PanelBody title={__('On Expiry', 'milliondollartheme')}>
                        <TextareaControl label={__('Expired Message', 'milliondollartheme')} value={expiredMessage} onChange={val => setAttributes({expiredMessage: val})} rows={2} />
                        <ToggleControl label={__('Hide Timer When Expired', 'milliondollartheme')} checked={!!hideWhenExpired} onChange={() => setAttributes({hideWhenExpired: !hideWhenExpired})} />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    {/* Title attribute is for the block itself, not displayed per digit block in this setup */}
                    {staticPreview}
                    <div className="countdown-expired-message-editor-preview" style={{marginTop: '10px', fontStyle: 'italic'}}>
                        {__('Expired message preview:', 'milliondollartheme')} <RichText.Content tagName="span" value={expiredMessage} />
                    </div>
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const {
            eventDateTime, showDays, showHours, showMinutes, showSeconds,
            labelDays, labelHours, labelMinutes, labelSeconds,
            numberFontSize, numberColor, labelFontSize, labelColor,
            digitBlockStyle, expiredMessage, hideWhenExpired, alignment, gapBetweenBlocks,
            digitBlockBackgroundColor, digitBlockBorderColor, digitBlockBorderRadius, digitBlockPadding, // Added these
            titleColor // This is overall block title color, not used per digit in save for now
        } = attributes;

        const blockProps = useBlockProps.save({
            className: `is-style-${digitBlockStyle} has-text-align-${alignment} label-pos-${labelPosition}`, // Added label-pos
            'data-event-datetime': eventDateTime,
            'data-show-days': showDays ? 'true' : 'false',
            'data-show-hours': showHours ? 'true' : 'false',
            'data-show-minutes': showMinutes ? 'true' : 'false',
            'data-show-seconds': showSeconds ? 'true' : 'false',
            'data-label-days': labelDays,
            'data-label-hours': labelHours,
            'data-label-minutes': labelMinutes,
            'data-label-seconds': labelSeconds,
            'data-hide-when-expired': hideWhenExpired ? 'true' : 'false',
            style: {
                '--countdown-number-fs': numberFontSize,
                '--countdown-number-color': numberColor,
                '--countdown-label-fs': labelFontSize,
                '--countdown-label-color': labelColor,
                '--countdown-gap': gapBetweenBlocks,
                // Global block text color can be set via core supports, will affect title if it exists
                // No specific title element rendered by this save function directly unless part of expired message
            }
        });

        // Individual digit block styles will be applied by CSS based on attributes or global CSS vars
        // For custom styles per block, they could also be passed as CSS variables if needed.
        // e.g. style: { '--digit-bg': digitBlockBackgroundColor, ... } on each .countdown-digit-block

        return (
            <div {...blockProps}>
                <div className="countdown-timer-dynamic-wrapper">
                    {showDays && <div className="countdown-digit-block" data-unit="days" style={{padding:digitBlockPadding, borderRadius:digitBlockBorderRadius, backgroundColor:digitBlockBackgroundColor, borderColor:digitBlockBorderColor, borderStyle: digitBlockBorderColor ? 'solid' : undefined, borderWidth: digitBlockBorderColor ? '1px' : undefined}}><span className="countdown-number">00</span><span className="countdown-label">{labelDays}</span></div>}
                    {showHours && <div className="countdown-digit-block" data-unit="hours" style={{padding:digitBlockPadding, borderRadius:digitBlockBorderRadius, backgroundColor:digitBlockBackgroundColor, borderColor:digitBlockBorderColor, borderStyle: digitBlockBorderColor ? 'solid' : undefined, borderWidth: digitBlockBorderColor ? '1px' : undefined}}><span className="countdown-number">00</span><span className="countdown-label">{labelHours}</span></div>}
                    {showMinutes && <div className="countdown-digit-block" data-unit="minutes" style={{padding:digitBlockPadding, borderRadius:digitBlockBorderRadius, backgroundColor:digitBlockBackgroundColor, borderColor:digitBlockBorderColor, borderStyle: digitBlockBorderColor ? 'solid' : undefined, borderWidth: digitBlockBorderColor ? '1px' : undefined}}><span className="countdown-number">00</span><span className="countdown-label">{labelMinutes}</span></div>}
                    {showSeconds && <div className="countdown-digit-block" data-unit="seconds" style={{padding:digitBlockPadding, borderRadius:digitBlockBorderRadius, backgroundColor:digitBlockBackgroundColor, borderColor:digitBlockBorderColor, borderStyle: digitBlockBorderColor ? 'solid' : undefined, borderWidth: digitBlockBorderColor ? '1px' : undefined}}><span className="countdown-number">00</span><span className="countdown-label">{labelSeconds}</span></div>}
                </div>
                <div className="countdown-expired-message-placeholder" style={{display: 'none'}}>
                    <RichText.Content tagName="div" className="countdown-expired-message-content" value={expiredMessage} />
                </div>
            </div>
        );
    },
});
