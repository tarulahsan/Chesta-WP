import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, SelectControl, TextareaControl } from '@wordpress/components';
import metadata from './block.json';

const { name, attributes } = metadata;

registerBlockType(name, {
    title: metadata.title,
    attributes: attributes,
    edit: ({ attributes, setAttributes }) => {
        const { planName, planNameColor, price, priceColor, priceInterval, priceIntervalColor, features, featuresColor, buttonText, buttonUrl, buttonStyle, buttonTextColor, buttonBgColor, buttonBorderColor, buttonGradient, isFeatured, itemStyle, itemBackgroundColor, itemBorderColor } = attributes;
        const blockProps = useBlockProps({
            className: `is-style-${itemStyle} ${isFeatured ? 'is-featured-plan' : ''}`,
            style: { backgroundColor: itemBackgroundColor, borderColor: itemBorderColor, borderStyle: itemBorderColor ? 'solid' : undefined, borderWidth: itemBorderColor ? '1px' : undefined }
        });
        const planNameStyles = { color: planNameColor };
        const priceStyles = { color: priceColor };
        const priceIntervalStyles = { color: priceIntervalColor };
        const featuresStyles = { color: featuresColor };
        const buttonPreviewStyles = { backgroundColor: buttonBgColor, color: buttonTextColor, borderColor: buttonBorderColor, backgroundImage: buttonGradient, borderStyle: buttonBorderColor ? 'solid' : (buttonStyle === 'outline' ? 'solid' : 'none') };
        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PanelBody title={__('Plan Details', 'milliondollartheme')}>
                        <TextControl label={__('Plan Name', 'milliondollartheme')} value={planName} onChange={val => setAttributes({planName: val})} />
                        <TextControl label={__('Price (e.g., $19, €25)', 'milliondollartheme')} value={price} onChange={val => setAttributes({price: val})} />
                        <TextControl label={__('Price Interval (e.g., / month)', 'milliondollartheme')} value={priceInterval} onChange={val => setAttributes({priceInterval: val})} />
                        <TextareaControl label={__('Features (HTML list: <li>Item</li>)', 'milliondollartheme')} value={features} onChange={val => setAttributes({features: val})} rows={5} />
                    </PanelBody>
                    <PanelBody title={__('Button', 'milliondollartheme')}>
                        <TextControl label={__('Button Text', 'milliondollartheme')} value={buttonText} onChange={val => setAttributes({buttonText: val})} />
                        <TextControl label={__('Button URL', 'milliondollartheme')} value={buttonUrl} onChange={val => setAttributes({buttonUrl: val})} />
                        <SelectControl label={__('Button Style', 'milliondollartheme')} value={buttonStyle} options={[{label: 'Primary', value: 'primary'},{label: 'Secondary', value: 'secondary'},{label: 'Outline', value: 'outline'}]} onChange={val => setAttributes({buttonStyle: val})} />
                        <TextControl /* TODO: ColorPalette */ label={__('Button Text Color', 'milliondollartheme')} value={buttonTextColor || ''} onChange={val => setAttributes({buttonTextColor: val})} />
                        <TextControl /* TODO: ColorPalette for custom button style */ label={__('Button Background Color', 'milliondollartheme')} value={buttonBgColor || ''} onChange={val => setAttributes({buttonBgColor: val})} />
                        <TextControl /* TODO: ColorPalette for custom button style */ label={__('Button Border Color', 'milliondollartheme')} value={buttonBorderColor || ''} onChange={val => setAttributes({buttonBorderColor: val})} />
                        <TextareaControl /* TODO: GradientPicker */ label={__('Button Gradient', 'milliondollartheme')} value={buttonGradient || ''} onChange={val => setAttributes({buttonGradient: val})} help={__('Overrides background color.', 'milliondollartheme')} />
                    </PanelBody>
                    <PanelBody title={__('Appearance', 'milliondollartheme')}>
                        <ToggleControl label={__('Highlight as Featured Plan?', 'milliondollartheme')} checked={!!isFeatured} onChange={() => setAttributes({isFeatured: !isFeatured})} />
                        <SelectControl label={__('Item Style', 'milliondollartheme')} value={itemStyle} options={[{label:'Default', value:'default'},{label:'Glassy', value:'glassy'}]} onChange={val => setAttributes({itemStyle: val})} />
                        <TextControl /* TODO: ColorPalette */ label={__('Plan Name Color', 'milliondollartheme')} value={planNameColor || ''} onChange={val => setAttributes({planNameColor: val})} />
                        <TextControl /* TODO: ColorPalette */ label={__('Price Color', 'milliondollartheme')} value={priceColor || ''} onChange={val => setAttributes({priceColor: val})} />
                        <TextControl /* TODO: ColorPalette */ label={__('Price Interval Color', 'milliondollartheme')} value={priceIntervalColor || ''} onChange={val => setAttributes({priceIntervalColor: val})} />
                        <TextControl /* TODO: ColorPalette */ label={__('Features Text Color', 'milliondollartheme')} value={featuresColor || ''} onChange={val => setAttributes({featuresColor: val})} />
                        {(itemStyle === 'default' || itemStyle === 'custom') && <TextControl /* TODO: ColorPalette */ label={__('Background Color', 'milliondollartheme')} value={itemBackgroundColor || ''} onChange={val => setAttributes({itemBackgroundColor: val})} />}
                        {(itemStyle === 'outline' || itemStyle === 'custom') && <TextControl /* TODO: ColorPalette */ label={__('Border Color', 'milliondollartheme')} value={itemBorderColor || ''} onChange={val => setAttributes({itemBorderColor: val})} />}
                    </PanelBody>
                </InspectorControls>
                {/* Editor Preview for Plan Item */}
                <RichText tagName="h4" className="plan-name" value={planName} onChange={val => setAttributes({planName: val})} placeholder={__('Plan Name...', 'milliondollartheme')} style={planNameStyles} />
                <div className="plan-price">
                    <RichText tagName="span" className="plan-price-amount" value={price} onChange={val => setAttributes({price: val})} placeholder={__('$0', 'milliondollartheme')} style={priceStyles} />
                    <RichText tagName="span" className="plan-price-interval" value={priceInterval} onChange={val => setAttributes({priceInterval: val})} placeholder={__('/ mo', 'milliondollartheme')} style={priceIntervalStyles} />
                </div>
                <RichText tagName="ul" multiline="li" className="plan-features" value={features} onChange={val => setAttributes({features: val})} placeholder={__('Enter features as list items...', 'milliondollartheme')} style={featuresStyles} />
                {buttonText && <a href="#" className={`plan-button is-button-style-${buttonStyle}`} onClick={(e) => e.preventDefault()} style={buttonPreviewStyles}>{buttonText}</a>}
            </div>
        );
    },
    save: ({ attributes }) => {
        const { planName, planNameColor, price, priceColor, priceInterval, priceIntervalColor, features, featuresColor, buttonText, buttonUrl, buttonStyle, buttonTextColor, buttonBgColor, buttonBorderColor, buttonGradient, isFeatured, itemStyle, itemBackgroundColor, itemBorderColor } = attributes;
        const blockProps = useBlockProps.save({
            className: `is-style-${itemStyle} ${isFeatured ? 'is-featured-plan' : ''}`,
            style: { backgroundColor: itemBackgroundColor, borderColor: itemBorderColor, borderStyle: itemBorderColor ? 'solid' : undefined, borderWidth: itemBorderColor ? '1px' : undefined }
        });
        const planNameStyles = { color: planNameColor };
        const priceStyles = { color: priceColor };
        const priceIntervalStyles = { color: priceIntervalColor };
        const featuresStyles = { color: featuresColor };
        const buttonSavedStyles = { backgroundColor: buttonBgColor, color: buttonTextColor, borderColor: buttonBorderColor, backgroundImage: buttonGradient, borderStyle: buttonBorderColor ? 'solid' : (buttonStyle === 'outline' ? 'solid' : 'none') };
        return (
            <div {...blockProps}>
                <RichText.Content tagName="h4" className="plan-name" value={planName} style={planNameStyles} />
                <div className="plan-price">
                    <RichText.Content tagName="span" className="plan-price-amount" value={price} style={priceStyles} />
                    <RichText.Content tagName="span" className="plan-price-interval" value={priceInterval} style={priceIntervalStyles} />
                </div>
                <RichText.Content tagName="ul" multiline="li" className="plan-features" value={features} style={featuresStyles} />
                {buttonText && buttonUrl && (
                    <div className="plan-button-wrapper">
                        <a href={buttonUrl} className={`plan-button is-button-style-${buttonStyle}`} style={buttonSavedStyles}>
                            {buttonText}
                        </a>
                    </div>
                )}
            </div>
        );
    },
});
