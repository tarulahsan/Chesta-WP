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
                        <TextControl /* TODO: Replace with proper CategorySelect component (can select multiple) */ /* TODO: Replace with proper CategorySelect component */
                            label={__('Categories (slugs or IDs, comma-separated)', 'milliondollartheme')}
                            value={selectedCategories || ''}
                            onChange={(val) => setAttributes({ selectedCategories: val })}
                            help={__('Leave empty for all. e.g., news,events', 'milliondollartheme')}
                        />
                        {/* TODO: Add TagSelector component here for selectedTags attribute */}
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
                            options={[ {label: 'Date', value: 'date'}, {label: 'Title', value: 'title'}, {label: 'Random', value: 'rand'}, {label: 'Menu Order', value: 'menu_order'} ]} // Added menu_order
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
                            max={600} // Adjusted max
                            help={__('Masonry JS will create columns based on this.', 'milliondollartheme')}
                        />
                        {/* TODO: Add optional RangeControls for specific columnsTablet, columnsMobile if more direct control is desired beyond minWidth */}
                        <RangeControl
                            label={__('Gap between items (px)', 'milliondollartheme')}
                            value={gap}
                            onChange={(val) => setAttributes({ gap: val })}
                            min={0}
                            max={60} // Increased max
                        />
                    </PanelBody>
                    <PanelBody title={__('Item Appearance', 'milliondollartheme')}>
                        <SelectControl /* TODO: Populate options from available image sizes in WP */
                            label={__('Image Size', 'milliondollartheme')}
                            value={imageSize}
                            options={[ {label:'Thumbnail', value:'thumbnail'}, {label:'Medium', value:'medium'}, {label:'Medium Large', value:'medium_large'}, {label:'Large', value:'large'}, {label:'Full', value:'full'} ]} // More options
                            onChange={(val) => setAttributes({ imageSize: val })}
                        />
                        <SelectControl
                            label={__('Image Aspect Ratio (CSS)', 'milliondollartheme')}
                            value={attributes.imageAspectRatio || 'auto'} // Ensure default if attr is new
                            options={[ {label:'Auto (Natural)', value:'auto'}, {label:'Square (1:1)', value:'1/1'}, {label:'Landscape (4:3)', value:'4/3'}, {label:'Portrait (3:4)', value:'3/4'}, {label:'Widescreen (16:9)', value:'16/9'}, {label:'Tall (9:16)', value:'9/16'} ]}
                            onChange={(val) => setAttributes({ imageAspectRatio: val })}
                        />
                        <ToggleControl
                            label={__('Show Post Title on Hover', 'milliondollartheme')}
                            checked={!!showPostTitleOnHover}
                            onChange={() => setAttributes({ showPostTitleOnHover: !showPostTitleOnHover })}
                        />
                        <SelectControl
                            label={__('Hover Effect', 'milliondollartheme')}
                            value={attributes.hoverEffect || 'zoom'} // Ensure default
                            options={[ {label:'None', value:'none'}, {label:'Zoom Image', value:'zoom'}, {label:'Overlay Title', value:'overlay-title'}, {label:'Slide-up Title (TODO)', value:'slide-up-title'}, {label:'Grayscale to Color (TODO)', value:'grayscale'} ]}
                            onChange={(val) => setAttributes({ hoverEffect: val })}
                        />
                        <SelectControl
                            label={__('Item Style', 'milliondollartheme')}
                            value={itemStyle}
                            options={[ {label: 'Default', value: 'default'}, {label: 'Glassy Card', value: 'glassy-card'}, {label: 'Outline Card (TODO)', value: 'outline-card'} ]}
                            onChange={(val) => setAttributes({ itemStyle: val })}
                        />
                    </PanelBody>
                    {/* Placeholder for Filter Bar and Pagination controls (for future iterations) */}
                    <PanelBody title={__('Filtering & Pagination (Future)', 'milliondollartheme')} initialOpen={false}>
                        <ToggleControl label={__('Show Filter Bar (TODO)', 'milliondollartheme')} checked={!!attributes.showFilterBar} onChange={() => setAttributes({showFilterBar: !attributes.showFilterBar})} />
                        {/* TODO: Controls for filterBy if showFilterBar is true */}
                        {/* TODO: SelectControl for paginationType (none, load-more, numeric) */}
                        {/* TODO: TextControl for loadMoreButtonText if paginationType is load-more */}
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
