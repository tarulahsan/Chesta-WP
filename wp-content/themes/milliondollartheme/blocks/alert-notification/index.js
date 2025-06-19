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
const AlertIcon = ({ type, icon: selectedIcon, iconColor }) => { // Use new `icon` prop, add iconColor
    // In a real implementation, this would render an SVG from a library like Feather Icons.
    // For styling, we will use a generic class and data-icon attribute.
    let iconSlug = selectedIcon || '';
    if (!selectedIcon) { // Use selectedIcon
        switch (type) {
            case 'success': iconSlug = 'yes-alt'; break;
            case 'warning': iconSlug = 'warning'; break;
            case 'error': iconSlug = 'dismiss'; break;
            case 'info': default: iconSlug = 'info-outline'; break;
        }
    }
    if (!iconSlug) return null;
    const iconClass = `social-icon-svg icon-${iconSlug ? iconSlug.toLowerCase().replace('-f', '').replace('-in', '') : 'default'}`; // Generic class for potential SVG styling
    // Fallback to Dashicon if no SVG logic yet, but CSS will target generic class primarily.
    const dashiconClass = `dashicons dashicons-${iconSlug}`;
    return <span className={`${iconClass} ${dashiconClass}`} style={{color: iconColor, fontSize: '20px'}} data-icon-slug={iconSlug}></span>;
};

registerBlockType(name, {
    title: title,
    attributes: attributes,

    edit: ({ attributes, setAttributes }) => {
        const { message, alertType, isDismissible, showIcon, icon, alertStyle, borderRadius, padding, iconColor, dismissButtonColor } = attributes;
        // Core color support (backgroundColor, textColor) is handled by useBlockProps and WordPress

        const blockProps = useBlockProps({
            className: `is-style-${alertStyle} alert-type-${alertType}`,
            style: {
                borderRadius: borderRadius,
                padding: padding,
                // backgroundColor and color are applied by WP if set in Inspector via core controls
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
                            <SelectControl /* Better than TextControl for predefined icons */
                                label={__('Icon', 'milliondollartheme')}
                                value={icon || ''} /* Use icon attribute */
                                options={[
                                    {label: 'Default for Type', value: ''},
                                    {label: 'Info (Alternative)', value: 'info'},
                                    {label: 'Success (Alternative)', value: 'yes'},
                                    {label: 'Warning (Alternative)', value: 'flag'},
                                    {label: 'Error (Alternative)', value: 'no'},
                                    {label: 'Lightbulb', value: 'lightbulb'},
                                    {label: 'Bell', value: 'bell'},
                                    {label: 'Megaphone', value: 'megaphone'}
                                    /* TODO: Add more common/useful Dashicons or plan for true IconPicker */
                                ]}
                                onChange={(val) => setAttributes({ icon: val })}
                                help={__('Select an icon or leave empty for type default.', 'milliondollartheme')}
                            />
                        )}
                    </PanelBody>
                    <PanelBody title={__('Appearance & Styling', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Alert Style', 'milliondollartheme')}
                            value={alertStyle}
                            options={[ {label:'Default', value:'default'}, {label:'Glassy', value:'glassy'}, {label:'Outlined', value:'outlined'} ]}
                            onChange={val => setAttributes({alertStyle: val})}
                        />
                        <TextControl label={__('Padding (e.g., var(--spacing-md))', 'milliondollartheme')} value={padding} onChange={val => setAttributes({padding: val})} />
                        <TextControl label={__('Border Radius (e.g., var(--border-radius-sm))', 'milliondollartheme')} value={borderRadius} onChange={val => setAttributes({borderRadius: val})} />
                        {showIcon && <TextControl /* TODO: ColorPalette for iconColor */ label={__('Icon Color', 'milliondollartheme')} value={iconColor || ''} onChange={val => setAttributes({iconColor: val})} />}
                        {isDismissible && <TextControl /* TODO: ColorPalette for dismissButtonColor */ label={__('Dismiss Button Color', 'milliondollartheme')} value={dismissButtonColor || ''} onChange={val => setAttributes({dismissButtonColor: val})} />}
                        <p>{__('Use Global Styles (Block Settings > Color) for overall text and background colors.', 'milliondollartheme')}</p>
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    {showIcon && <AlertIcon type={alertType} icon={icon} iconColor={iconColor} />}
                    <div className="alert-content-wrapper">
                        <RichText
                            tagName="div"
                            multiline="p"
                            className="alert-message"
                            value={message}
                            onChange={(val) => setAttributes({ message: val })}
                            placeholder={__('Enter alert message...', 'milliondollartheme')}
                        />
                    </div>
                    {isDismissible && (
                        <button type="button" className="alert-dismiss-button" aria-label={__('Dismiss alert', 'milliondollartheme')} style={{color: dismissButtonColor}}>
                            &times;
                        </button>
                    )}
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const { message, alertType, isDismissible, showIcon, icon, alertStyle, borderRadius, padding, iconColor, dismissButtonColor } = attributes;

        const blockProps = useBlockProps.save({
            className: `is-style-${alertStyle} alert-type-${alertType}`,
            style: {
                borderRadius: borderRadius,
                padding: padding,
            },
            'x-data': isDismissible ? '{ open: true }' : undefined,
            'x-show': isDismissible ? 'open' : undefined,
            'x-transition:leave': isDismissible ? 'transition ease-in duration-200' : undefined,
            'x-transition:leave-start': isDismissible ? 'opacity-100 transform scale-100' : undefined,
            'x-transition:leave-end': isDismissible ? 'opacity-0 transform scale-90' : undefined,
        });

        return (
            <div {...blockProps}>
                {showIcon && <AlertIcon type={alertType} icon={icon} iconColor={iconColor} />}
                <div className="alert-content-wrapper">
                    <RichText.Content tagName="div" className="alert-message" value={message} />
                </div>
                {isDismissible && (
                    <button
                        type="button"
                        className="alert-dismiss-button"
                        aria-label={__('Dismiss alert', 'milliondollartheme')}
                        x-on:click="open = false"
                        style={{color: dismissButtonColor}}
                    >
                        &times;
                    </button>
                )}
            </div>
        );
    },
});
