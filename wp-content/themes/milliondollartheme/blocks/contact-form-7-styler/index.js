/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, ToggleControl, Button } from '@wordpress/components'; // Added TextControl, ToggleControl, Button
import ServerSideRender from '@wordpress/server-side-render';
import { Disabled } from '@wordpress/components';

/**
 * Internal dependencies
 */
import metadata from './block.json';
// Styles loaded via block.json style property for front-end, editor can inherit.
// import './index.css'; // If specific editor wrapper styles are needed

const { name, title, attributes } = metadata;

registerBlockType(name, {
    title: title,
    attributes: attributes,

    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps();
        const { formId, formStyle, hideLabels, usePlaceholders, fieldTextColor, fieldBgColor, fieldBorderColor, fieldFocusBorderColor, fieldBorderRadius, fieldPadding, buttonStyle, buttonFullWidth, buttonAlignment } = attributes;

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Form Selection & Main Style', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Overall Form Style', 'milliondollartheme')}
                            value={formStyle}
                            options={[ { label: 'Default Theme Styles', value: 'default' }, { label: 'Glassy Fields', value: 'glassy-fields' }, { label: 'Minimal', value: 'minimal' } ]}
                            onChange={(val) => setAttributes({ formStyle: val })}
                        />
                        {formId ? (
                            <p>{__('Selected Form ID:', 'milliondollartheme')} {formId} <Button isLink onClick={() => setAttributes({formId: 0})}>{__('Change Form', 'milliondollartheme')}</Button></p>
                        ) : (
                            <p>{__('Select a form in the preview area below, or if preview is not working, ensure a form is selected via its ID here (not recommended).', 'milliondollartheme')}</p>
                        )}
                        {/* Fallback ID input if SSR selector fails or for direct input */}
                        <TextControl type="number" label={__('Form ID (Fallback)', 'milliondollartheme')} value={formId || 0} onChange={val => setAttributes({formId: parseInt(val)})} help={__('Use preview selector if possible.', 'milliondollartheme')} />
                    </PanelBody>

                    <PanelBody title={__('Field Styling', 'milliondollartheme')} initialOpen={false}>
                        <ToggleControl label={__('Hide Labels', 'milliondollartheme')} checked={!!hideLabels} onChange={() => setAttributes({hideLabels: !hideLabels})} />
                        <ToggleControl label={__('Use Placeholders as Labels (Requires placeholders in CF7 form)', 'milliondollartheme')} checked={!!usePlaceholders} onChange={() => setAttributes({usePlaceholders: !usePlaceholders})} />
                        <TextControl /* TODO: ColorPalette */ label={__('Field Text Color', 'milliondollartheme')} value={fieldTextColor || ''} onChange={val => setAttributes({fieldTextColor: val})} />
                        <TextControl /* TODO: ColorPalette */ label={__('Field Background Color', 'milliondollartheme')} value={fieldBgColor || ''} onChange={val => setAttributes({fieldBgColor: val})} />
                        <TextControl /* TODO: ColorPalette */ label={__('Field Border Color', 'milliondollartheme')} value={fieldBorderColor || ''} onChange={val => setAttributes({fieldBorderColor: val})} />
                        <TextControl /* TODO: ColorPalette */ label={__('Field Focus Border Color', 'milliondollartheme')} value={fieldFocusBorderColor || ''} onChange={val => setAttributes({fieldFocusBorderColor: val})} />
                        <TextControl label={__('Field Border Radius (e.g., 4px)', 'milliondollartheme')} value={fieldBorderRadius} onChange={val => setAttributes({fieldBorderRadius: val})} />
                        <TextControl label={__('Field Padding (e.g., 10px)', 'milliondollartheme')} value={fieldPadding} onChange={val => setAttributes({fieldPadding: val})} />
                    </PanelBody>

                    <PanelBody title={__('Submit Button Styling', 'milliondollartheme')} initialOpen={false}>
                        <SelectControl
                            label={__('Button Style', 'milliondollartheme')}
                            value={buttonStyle}
                            options={[{label:'Primary', value:'primary'}, {label:'Secondary', value:'secondary'}, {label:'Outline', value:'outline'}, {label:'Glassy', value:'glassy'}]}
                            onChange={val => setAttributes({buttonStyle: val})}
                            help={__('Matches theme button styles.', 'milliondollartheme')}
                        />
                        <ToggleControl label={__('Full Width Button', 'milliondollartheme')} checked={!!buttonFullWidth} onChange={() => setAttributes({buttonFullWidth: !buttonFullWidth})} />
                        <SelectControl
                            label={__('Button Alignment', 'milliondollartheme')}
                            value={buttonAlignment}
                            options={[{label:'Left', value:'left'}, {label:'Center', value:'center'}, {label:'Right', value:'right'}]}
                            onChange={val => setAttributes({buttonAlignment: val})}
                        />
                        {/* TODO: Add individual color controls for button if needed, beyond style presets */}
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <ServerSideRender
                        block={name}
                        attributes={attributes}
                        // httpMethod="POST" // If your callback needs POST
                    />
                </div>
            </>
        );
    },

    save: () => {
        // For dynamic blocks using render.php or a PHP render_callback, save() returns null.
        return null;
    },
});
