import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, InnerBlocks, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, __experimentalBoxControl as BoxControl } from '@wordpress/components';
import metadata from './block.json';

const { name, attributes: blockAttributes } = metadata;

const ALLOWED_BLOCKS = ['chesta/info-showcase-item'];

registerBlockType(name, {
    attributes: blockAttributes,
    edit: ({ attributes, setAttributes }) => {
        const { columns, columnGap, rowGap, itemsAlign, paddingTop, paddingRight, paddingBottom, paddingLeft, backgroundColor, gradient } = attributes;

        const blockProps = useBlockProps({
            className: `items-align-${itemsAlign}`,
            style: {
                '--info-showcase-columns': columns,
                '--info-showcase-column-gap': columnGap,
                '--info-showcase-row-gap': rowGap,
                paddingTop: paddingTop,
                paddingRight: paddingRight,
                paddingBottom: paddingBottom,
                paddingLeft: paddingLeft,
                backgroundColor: backgroundColor, // This will be overridden by gradient if set via supports
                // gradient is handled by block supports if a value is chosen from color panel
            }
        });

        const template = Array(columns || 3).fill(null).map(() => ['chesta/info-showcase-item', {}]);

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Layout Settings', 'milliondollartheme')}>
                        <RangeControl
                            label={__('Columns', 'milliondollartheme')}
                            value={columns}
                            onChange={(val) => setAttributes({ columns: val })}
                            min={1}
                            max={4} // Can be adjusted
                        />
                        <SelectControl
                            label={__('Content Alignment (within items)', 'milliondollartheme')}
                            value={itemsAlign}
                            options={[
                                { label: __('Left', 'milliondollartheme'), value: 'left' },
                                { label: __('Center', 'milliondollartheme'), value: 'center' },
                                { label: __('Right', 'milliondollartheme'), value: 'right' },
                            ]}
                            onChange={(val) => setAttributes({ itemsAlign: val })}
                        />
                    </PanelBody>
                    <PanelBody title={__('Spacing', 'milliondollartheme')}>
                        <TextControl
                            label={__('Column Gap', 'milliondollartheme')}
                            value={columnGap}
                            onChange={(val) => setAttributes({ columnGap: val })}
                            help={__('e.g., 16px, 1rem, var(--spacing-md)', 'milliondollartheme')}
                        />
                        <TextControl
                            label={__('Row Gap', 'milliondollartheme')}
                            value={rowGap}
                            onChange={(val) => setAttributes({ rowGap: val })}
                            help={__('e.g., 16px, 1rem, var(--spacing-md)', 'milliondollartheme')}
                        />
                        <BoxControl
                            label={__('Padding (Overall Section)', 'milliondollartheme')}
                            values={{
                                top: paddingTop,
                                right: paddingRight,
                                bottom: paddingBottom,
                                left: paddingLeft,
                            }}
                            onChange={(newPadding) => setAttributes({
                                paddingTop: newPadding.top,
                                paddingRight: newPadding.right,
                                paddingBottom: newPadding.bottom,
                                paddingLeft: newPadding.left,
                             })}
                        />
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <InnerBlocks
                        allowedBlocks={ALLOWED_BLOCKS}
                        template={template}
                        // templateLock="all" // if you want to lock to only the initial template items
                        orientation="horizontal" // This helps with visual layout in editor for multi-column
                    />
                </div>
            </>
        );
    },
    save: ({ attributes }) => {
        const { columns, columnGap, rowGap, itemsAlign, paddingTop, paddingRight, paddingBottom, paddingLeft, backgroundColor, gradient } = attributes;

        // Gradient support adds a class like .has-*-gradient-background
        // Background color support adds .has-*-background-color and style attribute
        // Spacing support for padding adds style attributes directly
        // We only need to pass through what's not handled by block supports automatically in useBlockProps.save()

        const blockProps = useBlockProps.save({
            className: `items-align-${itemsAlign}`, // Custom class for item content alignment
            style: {
                '--info-showcase-columns': columns,
                '--info-showcase-column-gap': columnGap,
                '--info-showcase-row-gap': rowGap,
                // Padding, background color, and gradient are handled by block supports if set via panels
                // If set via our custom TextControl for color, they'd need to be applied here.
                // However, block.json supports color.background and color.gradient, so using those panels is preferred.
            }
        });

        return (
            <div {...blockProps}>
                <InnerBlocks.Content />
            </div>
        );
    },
});
