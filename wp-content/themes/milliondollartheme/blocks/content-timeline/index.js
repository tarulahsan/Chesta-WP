import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, ColorPalette, RangeControl } from '@wordpress/components'; // Assuming ColorPalette will be used or custom color picker
import metadata from './block.json';

const { name, attributes: blockAttributes } = metadata;

const ALLOWED_BLOCKS = ['chesta/content-timeline-item'];

registerBlockType(name, {
    attributes: blockAttributes,
    edit: ({ attributes, setAttributes }) => {
        const {
            layout, lineColor, lineWidth,
            pointColor, pointSize, pointStyle,
            paddingTop, paddingRight, paddingBottom, paddingLeft,
            backgroundColor, gradient // from supports
        } = attributes;

        const blockProps = useBlockProps({
            className: `timeline-layout-${layout}`,
            style: {
                '--timeline-line-color': lineColor,
                '--timeline-line-width': lineWidth,
                '--timeline-point-color': pointColor,
                '--timeline-point-size': pointSize,
                // backgroundColor and gradient are handled by block supports if set via panel
                // padding is handled by block supports if set via panel
            }
        });

        // Default template for one item to start with
        const TEMPLATE = [
            ['chesta/content-timeline-item', {}],
            ['chesta/content-timeline-item', {}],
        ];

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Timeline Layout', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Layout Style', 'milliondollartheme')}
                            value={layout}
                            options={[
                                { label: __('Center Alternating', 'milliondollartheme'), value: 'center-alternating' },
                                { label: __('Left Sided', 'milliondollartheme'), value: 'left-sided' },
                                { label: __('Right Sided', 'milliondollartheme'), value: 'right-sided' },
                            ]}
                            onChange={(val) => setAttributes({ layout: val })}
                        />
                    </PanelBody>
                    <PanelBody title={__('Timeline Line & Points', 'milliondollartheme')}>
                        <TextControl /* TODO: ColorPalette */
                            label={__('Line Color', 'milliondollartheme')}
                            value={lineColor}
                            onChange={(val) => setAttributes({ lineColor: val })}
                        />
                        <TextControl
                            label={__('Line Width (e.g., 3px)', 'milliondollartheme')}
                            value={lineWidth}
                            onChange={(val) => setAttributes({ lineWidth: val })}
                        />
                         <TextControl /* TODO: ColorPalette */
                            label={__('Point Color', 'milliondollartheme')}
                            value={pointColor}
                            onChange={(val) => setAttributes({ pointColor: val })}
                        />
                        <TextControl
                            label={__('Point Size (e.g., 16px)', 'milliondollartheme')}
                            value={pointSize}
                            onChange={(val) => setAttributes({ pointSize: val })}
                        />
                        <SelectControl
                            label={__('Point Style', 'milliondollartheme')}
                            value={pointStyle}
                            options={[
                                { label: __('Circle', 'milliondollartheme'), value: 'circle' },
                                { label: __('Square', 'milliondollartheme'), value: 'square' },
                                { label: __('Diamond (CSS)', 'milliondollartheme'), value: 'diamond' },
                                // Could add 'Icon' and then an icon picker attribute
                            ]}
                            onChange={(val) => setAttributes({ pointStyle: val })}
                        />
                    </PanelBody>
                    {/* Spacing and Color panels will be available via block supports in block.json */}
                </InspectorControls>
                <div {...blockProps}>
                    <InnerBlocks
                        allowedBlocks={ALLOWED_BLOCKS}
                        template={TEMPLATE}
                        orientation="vertical"
                        // templateLock={false} // Allow adding/removing/reordering items
                    />
                </div>
            </>
        );
    },
    save: ({ attributes }) => {
        const { layout, lineColor, lineWidth, pointColor, pointSize, pointStyle } = attributes;

        // Classes and styles from block supports (align, backgroundColor, gradient, padding)
        // will be automatically applied by useBlockProps.save()
        const blockProps = useBlockProps.save({
            className: `timeline-layout-${layout}`,
            style: {
                '--timeline-line-color': lineColor,
                '--timeline-line-width': lineWidth,
                '--timeline-point-color': pointColor,
                '--timeline-point-size': pointSize,
                // pointStyle will be handled by CSS based on the main class or item class
            }
        });

        return (
            <div {...blockProps}>
                <InnerBlocks.Content />
            </div>
        );
    },
});
