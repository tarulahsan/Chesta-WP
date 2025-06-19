/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { Disabled } from '@wordpress/components';

/**
 * Internal dependencies
 */
import metadata from './block.json';
// style-index.css is loaded for both editor and front-end via block.json

const { name, title, attributes } = metadata;

registerBlockType(name, {
    title: title,
    attributes: attributes,

    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps();
        const {
            selectedCategories, numberOfItems, orderBy, order,
            columnMinWidth, imageSize, showPostTitleOnHover, gap, itemStyle
        } = attributes;

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Query Settings', 'milliondollartheme')}>
                        <TextControl /* TODO: Proper CategorySelect */
                            label={__('Categories (slugs, comma-separated)', 'milliondollartheme')}
                            value={selectedCategories}
                            onChange={(val) => setAttributes({ selectedCategories: val })}
                        />
                        <RangeControl
                            label={__('Number of Items', 'milliondollartheme')}
                            value={numberOfItems}
                            onChange={(val) => setAttributes({ numberOfItems: val })}
                            min={1}
                            max={30}
                        />
                        <SelectControl
                            label={__('Order By', 'milliondollartheme')}
                            value={orderBy}
                            options={[ {label: 'Date', value: 'date'}, {label: 'Title', value: 'title'}, {label: 'Random', value: 'rand'} ]}
                            onChange={(val) => setAttributes({ orderBy: val })}
                        />
                        <SelectControl
                            label={__('Order', 'milliondollartheme')}
                            value={order}
                            options={[ {label: 'Descending', value: 'DESC'}, {label: 'Ascending', value: 'ASC'} ]}
                            onChange={(val) => setAttributes({ order: val })}
                        />
                    </PanelBody>
                    <PanelBody title={__('Layout & Appearance', 'milliondollartheme')}>
                        <RangeControl
                            label={__('Minimum Column Width (px)', 'milliondollartheme')}
                            value={columnMinWidth}
                            onChange={(val) => setAttributes({ columnMinWidth: val })}
                            min={150}
                            max={500}
                        />
                        <RangeControl /* Using Range for gap, could be TextControl for units */
                            label={__('Gap between items (px)', 'milliondollartheme')}
                            value={gap}
                            onChange={(val) => setAttributes({ gap: val })}
                            min={0}
                            max={50}
                        />
                        <SelectControl /* TODO: Image size selector based on available sizes */
                            label={__('Image Size', 'milliondollartheme')}
                            value={imageSize}
                            options={[ {label: 'Medium Large', value: 'medium_large'}, {label: 'Large', value: 'large'}, {label: 'Full', value: 'full'} ]}
                            onChange={(val) => setAttributes({ imageSize: val })}
                        />
                        <ToggleControl
                            label={__('Show Post Title on Hover', 'milliondollartheme')}
                            checked={!!showPostTitleOnHover}
                            onChange={() => setAttributes({ showPostTitleOnHover: !showPostTitleOnHover })}
                        />
                        <SelectControl
                            label={__('Item Style', 'milliondollartheme')}
                            value={itemStyle}
                            options={[ {label: 'Default', value: 'default'}, {label: 'Glassy Card', value: 'glassy-card'} ]}
                            onChange={(val) => setAttributes({ itemStyle: val })}
                        />
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <Disabled>
                        <ServerSideRender
                            block={name}
                            attributes={attributes}
                        />
                    </Disabled>
                </div>
            </>
        );
    },

    save: () => {
        // For dynamic blocks using render.php or a PHP render_callback, save() returns null.
        return null;
    },
});
