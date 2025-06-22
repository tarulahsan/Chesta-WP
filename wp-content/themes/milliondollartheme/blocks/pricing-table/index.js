import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, TextControl } from '@wordpress/components';
import metadata from './block.json';

const { name, attributes } = metadata; // attributes here will include the new ones
const ALLOWED_BLOCKS = ['chesta/pricing-plan-item'];
const DEFAULT_PLAN_ITEM_ATTRS = { planName: 'New Plan', price: '$0', priceInterval: '/mo', features: '<li>Feature A</li><li>Feature B</li>', buttonText: 'Choose Plan' };

registerBlockType(name, {
    title: metadata.title,
    attributes: attributes, // Use the updated attributes from block.json
    edit: ({ attributes, setAttributes }) => {
        const { columns, tableStyle, gap, tableBackgroundColor, tableBorderColor } = attributes;
        const template = Array(columns).fill(null).map(() => ['chesta/pricing-plan-item', DEFAULT_PLAN_ITEM_ATTRS]);

        const blockProps = useBlockProps({
            className: `is-style-${tableStyle} columns-${columns}`,
            style: {
                backgroundColor: tableBackgroundColor,
                borderColor: tableBorderColor,
                borderStyle: tableBorderColor ? 'solid' : undefined,
                borderWidth: tableBorderColor ? '1px' : undefined
            }
        });

        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PanelBody title={__('Layout', 'milliondollartheme')}>
                        <RangeControl
                            label={__('Number of Plans (Columns)', 'milliondollartheme')}
                            value={columns}
                            onChange={(val) => setAttributes({ columns: val })}
                            min={1}
                            max={4}
                        />
                        <TextControl
                            label={__('Gap between plans (e.g., 16px)', 'milliondollartheme')}
                            value={gap}
                            onChange={(val) => setAttributes({ gap: val })}
                        />
                    </PanelBody>
                    <PanelBody title={__('Table Style', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Overall Table Style', 'milliondollartheme')}
                            value={tableStyle}
                            options={[ {label: 'Default (Joined)', value: 'default'}, {label: 'Separated Cards', value: 'separated-cards'} ]}
                            onChange={(val) => setAttributes({ tableStyle: val })}
                        />
                        <TextControl /* TODO: ColorPalette */ label={__('Overall Table Background', 'milliondollartheme')} value={tableBackgroundColor || ''} onChange={val => setAttributes({tableBackgroundColor: val})} />
                        <TextControl /* TODO: ColorPalette */ label={__('Overall Table Border Color', 'milliondollartheme')} value={tableBorderColor || ''} onChange={val => setAttributes({tableBorderColor: val})} />
                    </PanelBody>
                </InspectorControls>
                <InnerBlocks
                    allowedBlocks={ALLOWED_BLOCKS}
                    template={template}
                    // templateLock="all"
                />
            </div>
        );
    },
    save: ({ attributes }) => {
        const { columns, tableStyle, gap, tableBackgroundColor, tableBorderColor } = attributes;
        const blockProps = useBlockProps.save({
            className: `is-style-${tableStyle} columns-${columns}`,
            style: {
                '--pricing-table-gap': gap,
                backgroundColor: tableBackgroundColor,
                borderColor: tableBorderColor,
                borderStyle: tableBorderColor ? 'solid' : undefined,
                borderWidth: tableBorderColor ? '1px' : undefined
            }
        });
        return (
            <div {...blockProps}>
                <InnerBlocks.Content />
            </div>
        );
    },
});
