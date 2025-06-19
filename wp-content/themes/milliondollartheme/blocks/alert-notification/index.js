/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextareaControl, ToggleControl, SelectControl, TextControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import './style-index.css';
import './index.css';

const { name, title, attributes } = metadata;

// Helper for default icons based on type
const AlertIcon = ({ type, customIcon }) => {
    let iconSlug = customIcon || '';
    if (!customIcon) {
        switch (type) {
            case 'success': iconSlug = 'yes-alt'; break;
            case 'warning': iconSlug = 'warning'; break;
            case 'error': iconSlug = 'dismiss'; break;
            case 'info': default: iconSlug = 'info-outline'; break;
        }
    }
    if (!iconSlug) return null;
    // In a real block, this would render an SVG or a proper icon font class.
    return <span className={`dashicons dashicons-${iconSlug} alert-icon alert-icon-${type}`}></span>;
};

registerBlockType(name, {
    title: title,
    attributes: attributes,

    edit: ({ attributes, setAttributes }) => {
        const { message, alertType, isDismissible, showIcon, customIcon, alertStyle, borderRadius, padding } = attributes;
        const blockProps = useBlockProps({
            className: `is-style-${alertStyle} alert-type-${alertType}`,
            style: {
                borderRadius: borderRadius,
                padding: padding,
                // backgroundColor and color from core block supports if enabled & used
            }
        });

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Alert Settings', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Alert Type', 'milliondollartheme')}
                            value={alertType}
                            options={[
                                { label: 'Info', value: 'info' },
                                { label: 'Success', value: 'success' },
                                { label: 'Warning', value: 'warning' },
                                { label: 'Error', value: 'error' },
                            ]}
                            onChange={(val) => setAttributes({ alertType: val })}
                        />
                        <ToggleControl
                            label={__('Dismissible', 'milliondollartheme')}
                            checked={!!isDismissible}
                            onChange={() => setAttributes({ isDismissible: !isDismissible })}
                        />
                        <ToggleControl
                            label={__('Show Icon', 'milliondollartheme')}
                            checked={!!showIcon}
                            onChange={() => setAttributes({ showIcon: !showIcon })}
                        />
                        {showIcon && (
                            <TextControl /* TODO: IconPicker */
                                label={__('Custom Icon Slug (Dashicon)', 'milliondollartheme')}
                                value={customIcon || ''}
                                onChange={(val) => setAttributes({ customIcon: val })}
                                help={__('Overrides default type icon.', 'milliondollartheme')}
                            />
                        )}
                    </PanelBody>
                    <PanelBody title={__('Appearance', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Alert Style', 'milliondollartheme')}
                            value={alertStyle}
                            options={[ {label:'Default', value:'default'}, {label:'Glassy', value:'glassy'}, {label:'Outlined', value:'outlined'} ]}
                            onChange={val => setAttributes({alertStyle: val})}
                        />
                        <TextControl label={__('Padding', 'milliondollartheme')} value={padding} onChange={val => setAttributes({padding: val})} />
                        <TextControl label={__('Border Radius', 'milliondollartheme')} value={borderRadius} onChange={val => setAttributes({borderRadius: val})} />
                        {/* Color controls can use core color support (text, background) */}
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    {showIcon && <AlertIcon type={alertType} customIcon={customIcon} />}
                    <div className="alert-content-wrapper">
                        <RichText
                            tagName="div" // Using div for message to allow multiple paragraphs if needed
                            multiline="p"
                            className="alert-message"
                            value={message}
                            onChange={(val) => setAttributes({ message: val })}
                            placeholder={__('Enter alert message...', 'milliondollartheme')}
                        />
                    </div>
                    {isDismissible && (
                        <button type="button" className="alert-dismiss-button" aria-label={__('Dismiss alert', 'milliondollartheme')}>
                            &times;
                        </button>
                    )}
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const { message, alertType, isDismissible, showIcon, customIcon, alertStyle, borderRadius, padding } = attributes;

        // Core color support classes (like .has-text-color, .has-background) are added by useBlockProps.save()
        // if colors are set via the editor's color palettes.
        const blockProps = useBlockProps.save({
            className: `is-style-${alertStyle} alert-type-${alertType}`,
            style: {
                borderRadius: borderRadius,
                padding: padding,
            },
            // Alpine.js for dismissible functionality
            'x-data': isDismissible ? '{ open: true }' : undefined,
            'x-show': isDismissible ? 'open' : undefined,
            'x-transition:leave': isDismissible ? 'transition ease-in duration-200' : undefined,
            'x-transition:leave-start': isDismissible ? 'opacity-100 transform scale-100' : undefined,
            'x-transition:leave-end': isDismissible ? 'opacity-0 transform scale-90' : undefined,
        });

        return (
            <div {...blockProps}>
                {showIcon && <AlertIcon type={alertType} customIcon={customIcon} />}
                <div className="alert-content-wrapper">
                    <RichText.Content tagName="div" className="alert-message" value={message} />
                </div>
                {isDismissible && (
                    <button
                        type="button"
                        className="alert-dismiss-button"
                        aria-label={__('Dismiss alert', 'milliondollartheme')}
                        {'x-on:click'}="open = false"
                    >
                        &times;
                    </button>
                )}
            </div>
        );
    },
});
