import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, TextControl } from '@wordpress/components';
import metadata from './block.json';

const { name, attributes } = metadata;
const ALLOWED_BLOCKS = ['milliondollartheme/pricing-plan-item'];
const DEFAULT_PLAN_ITEM_ATTRS = { planName: 'New Plan', price: '$0', priceInterval: '/mo', features: '<li>Feature A</li><li>Feature B</li>', buttonText: 'Choose Plan' };

registerBlockType(name, {
    title: metadata.title,
    attributes: attributes,
    edit: ({ attributes, setAttributes }) => {
        const { columns, tableStyle, gap } = attributes;
        // Prepare a template of InnerBlocks based on the number of columns
        const template = Array(columns).fill(null).map(() => ['milliondollartheme/pricing-plan-item', DEFAULT_PLAN_ITEM_ATTRS]);

        const blockProps = useBlockProps({
            className: `is-style-${tableStyle} columns-${columns}`
        });
        // Forcing InnerBlocks to re-render when columns change is tricky.
        // A common approach is to use clientId as key or manage InnerBlocks instances more directly if needed.
        // For this iteration, changing columns in editor might require manual adjustment of items.
        // A better way: a button "Set number of plans" that re-initializes the template.

        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PanelBody title={__('Layout', 'milliondollartheme')}>
                        <RangeControl
                            label={__('Number of Plans (Columns)', 'milliondollartheme')}
                            value={columns}
                            onChange={(val) => setAttributes({ columns: val })}
                            min={1}
                            max={4} // Max 4 plans for typical pricing tables
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
                        {/* TODO: Global styling options for all plans if needed */}
                    </PanelBody>
                </InspectorControls>
                <InnerBlocks
                    allowedBlocks={ALLOWED_BLOCKS}
                    template={template}
                    // templateLock="all" // Lock if you only want plan items and no other blocks
                    // orientation="horizontal" // Helps with visual layout in editor for columns
                />
            </div>
        );
    },
    save: ({ attributes }) => {
        const { columns, tableStyle, gap } = attributes;
        const blockProps = useBlockProps.save({
            className: `is-style-${tableStyle} columns-${columns}`,
            style: { '--pricing-table-gap': gap } // Pass gap as CSS variable
        });
        return (
            <div {...blockProps}>
                <InnerBlocks.Content />
            </div>
        );
    },
});
