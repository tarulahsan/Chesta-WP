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
        const { planName, price, priceInterval, features, buttonText, buttonUrl, buttonStyle, isFeatured, itemStyle } = attributes;
        const blockProps = useBlockProps({
            className: `is-style-${itemStyle} ${isFeatured ? 'is-featured-plan' : ''}`
        });
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
                    </PanelBody>
                    <PanelBody title={__('Appearance', 'milliondollartheme')}>
                        <ToggleControl label={__('Highlight as Featured Plan?', 'milliondollartheme')} checked={!!isFeatured} onChange={() => setAttributes({isFeatured: !isFeatured})} />
                        <SelectControl label={__('Item Style', 'milliondollartheme')} value={itemStyle} options={[{label:'Default', value:'default'},{label:'Glassy', value:'glassy'}]} onChange={val => setAttributes({itemStyle: val})} />
                    </PanelBody>
                </InspectorControls>
                {/* Editor Preview for Plan Item */}
                <RichText tagName="h4" className="plan-name" value={planName} onChange={val => setAttributes({planName: val})} placeholder={__('Plan Name...', 'milliondollartheme')} />
                <div className="plan-price">
                    <RichText tagName="span" className="plan-price-amount" value={price} onChange={val => setAttributes({price: val})} placeholder={__('$0', 'milliondollartheme')} />
                    <RichText tagName="span" className="plan-price-interval" value={priceInterval} onChange={val => setAttributes({priceInterval: val})} placeholder={__('/ mo', 'milliondollartheme')} />
                </div>
                <RichText tagName="ul" multiline="li" className="plan-features" value={features} onChange={val => setAttributes({features: val})} placeholder={__('Enter features as list items...', 'milliondollartheme')} />
                {buttonText && <a href="#" className={`plan-button is-button-style-${buttonStyle}`} onClick={(e) => e.preventDefault()}>{buttonText}</a>}
            </div>
        );
    },
    save: ({ attributes }) => {
        const { planName, price, priceInterval, features, buttonText, buttonUrl, buttonStyle, isFeatured, itemStyle } = attributes;
        const blockProps = useBlockProps.save({
            className: `is-style-${itemStyle} ${isFeatured ? 'is-featured-plan' : ''}`
        });
        return (
            <div {...blockProps}>
                <RichText.Content tagName="h4" className="plan-name" value={planName} />
                <div className="plan-price">
                    <RichText.Content tagName="span" className="plan-price-amount" value={price} />
                    <RichText.Content tagName="span" className="plan-price-interval" value={priceInterval} />
                </div>
                <RichText.Content tagName="ul" multiline="li" className="plan-features" value={features} />
                {buttonText && buttonUrl && (
                    <div className="plan-button-wrapper">
                        <a href={buttonUrl} className={`plan-button is-button-style-${buttonStyle}`}>
                            {buttonText}
                        </a>
                    </div>
                )}
            </div>
        );
    },
});
