/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, ToggleControl, TextControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render'; // Import ServerSideRender
import { Disabled } from '@wordpress/components'; // To disable interaction with preview

/**
 * Internal dependencies
 */
import metadata from './block.json';
// Styles loaded via block.json style property for front-end, editor can inherit or have specific.
// For ServerSideRender, editor often just uses front-end styles.
// import './index.css'; // If specific editor wrapper styles are needed

const { name, title, attributes } = metadata;

registerBlockType(name, {
    title: title,
    attributes: attributes,

    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps(); // Basic props for wrapper
        const {
            numberOfPosts, layout, columns, displayFeaturedImage, displayPostTitle,
            displayPostDate, displayPostExcerpt, excerptLength, categories, orderBy, order,
            postsDisplayStyle
        } = attributes;

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Query Settings', 'milliondollartheme')}>
                        <RangeControl
                            label={__('Number of Posts', 'milliondollartheme')}
                            value={numberOfPosts}
                            onChange={(val) => setAttributes({ numberOfPosts: val })}
                            min={1}
                            max={12}
                        />
                        <TextControl /* TODO: Replace with proper CategorySelect component */
                            label={__('Categories (slugs, comma-separated)', 'milliondollartheme')}
                            value={categories}
                            onChange={(val) => setAttributes({ categories: val })}
                            help={__('Leave empty for all categories.', 'milliondollartheme')}
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
                            options={[ {label: 'Descending (DESC)', value: 'DESC'}, {label: 'Ascending (ASC)', value: 'ASC'} ]}
                            onChange={(val) => setAttributes({ order: val })}
                        />
                    </PanelBody>
                    <PanelBody title={__('Layout & Display', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Layout', 'milliondollartheme')}
                            value={layout}
                            options={[ {label: 'Grid', value: 'grid'}, {label: 'List', value: 'list'} ]}
                            onChange={(val) => setAttributes({ layout: val })}
                        />
                        {layout === 'grid' && (
                            <RangeControl
                                label={__('Columns', 'milliondollartheme')}
                                value={columns}
                                onChange={(val) => setAttributes({ columns: val })}
                                min={1}
                                max={4} // Max columns for this iteration
                            />
                        )}
                        <SelectControl
                            label={__('Post Item Style', 'milliondollartheme')}
                            value={postsDisplayStyle}
                            options={[ {label: 'Default', value: 'default'}, {label: 'Card (Glassy)', value: 'card-glassy'} ]}
                            onChange={(val) => setAttributes({ postsDisplayStyle: val })}
                        />
                    </PanelBody>
                    <PanelBody title={__('Post Elements', 'milliondollartheme')}>
                        <ToggleControl label={__('Display Featured Image', 'milliondollartheme')} checked={!!displayFeaturedImage} onChange={() => setAttributes({displayFeaturedImage: !displayFeaturedImage})} />
                        <ToggleControl label={__('Display Post Title', 'milliondollartheme')} checked={!!displayPostTitle} onChange={() => setAttributes({displayPostTitle: !displayPostTitle})} />
                        <ToggleControl label={__('Display Post Date', 'milliondollartheme')} checked={!!displayPostDate} onChange={() => setAttributes({displayPostDate: !displayPostDate})} />
                        <ToggleControl label={__('Display Post Excerpt', 'milliondollartheme')} checked={!!displayPostExcerpt} onChange={() => setAttributes({displayPostExcerpt: !displayPostExcerpt})} />
                        {displayPostExcerpt && (
                            <RangeControl label={__('Excerpt Length (words)', 'milliondollartheme')} value={excerptLength} onChange={(val) => setAttributes({excerptLength: val})} min={10} max={100} />
                        )}
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <Disabled> {/* Disable interaction with the rendered preview */}
                        <ServerSideRender
                            block={name} // Critical: use the block's registered name
                            attributes={attributes}
                        />
                    </Disabled>
                </div>
            </>
        );
    },

    save: () => {
        // For dynamic blocks, save() returns null. Content is rendered via PHP.
        return null;
    },
});
