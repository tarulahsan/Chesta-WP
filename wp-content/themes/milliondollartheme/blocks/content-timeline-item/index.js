import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    InspectorControls,
    RichText,
    MediaUpload,
    MediaUploadCheck
} from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    SelectControl,
    Button,
    ToggleControl
} from '@wordpress/components';
import metadata from './block.json';

const { name, attributes: blockAttributes, usesContext } = metadata;

registerBlockType(name, {
    attributes: blockAttributes,
    usesContext: usesContext,

    edit: ({ attributes, setAttributes, context }) => {
        const {
            date, title, titleTag, description,
            imageUrl, imageId, imageAlignment,
            itemPointColor, itemLineColorBefore,
            itemPadding, itemBackgroundColor, itemBorderRadius, // These are from block.json supports too
        } = attributes;

        const timelineLayout = context['chesta/timelineLayout']; // Example of using context

        const blockProps = useBlockProps({
            className: `timeline-item-image-align-${imageAlignment}`,
            style: {
                // Background and padding are handled by block supports if set in Inspector
            }
        });

        const onSelectImage = (media) => setAttributes({ imageUrl: media.url, imageId: media.id });
        const onRemoveImage = () => setAttributes({ imageUrl: undefined, imageId: undefined });

        const TitleTag = titleTag || 'h4';

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Content', 'milliondollartheme')}>
                        <TextControl
                            label={__('Date/Label', 'milliondollartheme')}
                            value={date}
                            onChange={(val) => setAttributes({ date: val })}
                        />
                        <SelectControl
                            label={__('Title HTML Tag', 'milliondollartheme')}
                            value={titleTag}
                            options={[
                                { label: 'H2', value: 'h2' }, { label: 'H3', value: 'h3' },
                                { label: 'H4', value: 'h4' }, { label: 'H5', value: 'h5' },
                                { label: 'H6', value: 'h6' }, { label: 'p', value: 'p' },
                            ]}
                            onChange={(val) => setAttributes({ titleTag: val })}
                        />
                    </PanelBody>
                    <PanelBody title={__('Image (Optional)', 'milliondollartheme')}>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={onSelectImage}
                                allowedTypes={['image']}
                                value={imageId}
                                render={({open}) => (
                                    <Button onClick={open} isSecondary>
                                        {!imageUrl ? __('Select Image', 'milliondollartheme') : __('Change Image', 'milliondollartheme')}
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>
                        {imageUrl && (
                             <Button onClick={onRemoveImage} isLink isDestructive style={{marginLeft: '8px'}}>
                                {__('Remove Image', 'milliondollartheme')}
                            </Button>
                        )}
                        {imageUrl && (
                            <SelectControl
                                label={__('Image Alignment (within item)', 'milliondollartheme')}
                                value={imageAlignment}
                                options={[
                                    { label: __('None', 'milliondollartheme'), value: 'none' },
                                    { label: __('Left of Text', 'milliondollartheme'), value: 'left' },
                                    { label: __('Right of Text', 'milliondollartheme'), value: 'right' },
                                    { label: __('Above Text', 'milliondollartheme'), value: 'top' },
                                ]}
                                onChange={(val) => setAttributes({ imageAlignment: val })}
                            />
                        )}
                    </PanelBody>
                    <PanelBody title={__('Item Specific Styles (Overrides)', 'milliondollartheme')} initialOpen={false}>
                        <TextControl /* TODO: ColorPalette */
                            label={__('Timeline Point Color', 'milliondollartheme')}
                            value={itemPointColor || ''}
                            onChange={(val) => setAttributes({ itemPointColor: val })}
                            help={__('Overrides default point color for this item.', 'milliondollartheme')}
                        />
                        <TextControl /* TODO: ColorPalette */
                            label={__('Line Color Before This Item', 'milliondollartheme')}
                            value={itemLineColorBefore || ''}
                            onChange={(val) => setAttributes({ itemLineColorBefore: val })}
                            help={__('Overrides default line color for the segment leading to this item.', 'milliondollartheme')}
                        />
                    </PanelBody>
                     {/* Item Background and Padding controls are available via block supports color & spacing panels */}
                </InspectorControls>

                <div {...blockProps}>
                    <div className="timeline-item-date-wrapper">
                        <RichText
                            tagName="div"
                            className="timeline-item-date"
                            value={date}
                            onChange={(val) => setAttributes({ date: val })}
                            placeholder={__('Date...', 'milliondollartheme')}
                        />
                    </div>
                    <div className="timeline-item-content-wrapper">
                        {mediaType === 'image' && imageUrl && (imageAlignment === 'top') && (
                            <div className="timeline-item-image-container">
                                <img src={imageUrl} alt="" />
                            </div>
                        )}
                        <RichText
                            tagName={TitleTag}
                            className="timeline-item-title"
                            value={title}
                            onChange={(val) => setAttributes({ title: val })}
                            placeholder={__('Event Title...', 'milliondollartheme')}
                        />
                        <RichText
                            tagName="div"
                            multiline="p"
                            className="timeline-item-description"
                            value={description}
                            onChange={(val) => setAttributes({ description: val })}
                            placeholder={__('Event description...', 'milliondollartheme')}
                        />
                         {mediaType === 'image' && imageUrl && (imageAlignment !== 'top' && imageAlignment !== 'none') && (
                             <div className="timeline-item-image-container">
                                <img src={imageUrl} alt="" />
                            </div>
                         )}
                    </div>
                </div>
            </>
        );
    },
    save: ({ attributes, context }) => {
        const {
            date, title, titleTag, description,
            imageUrl, imageAlignment,
            itemPointColor, itemLineColorBefore
        } = attributes;

        const timelineLayout = context['chesta/timelineLayout'];
        // Other context values can be retrieved here if needed for save output classes/styles

        const blockProps = useBlockProps.save({
            className: `timeline-item-image-align-${imageAlignment}`,
            style: {
                '--item-point-color': itemPointColor || undefined,
                '--item-line-color-before': itemLineColorBefore || undefined,
                // Background, padding from block supports will be applied automatically
            }
        });

        const TitleTagSave = titleTag || 'h4';

        return (
            <div {...blockProps}>
                 <div className="timeline-item-point"></div> {/* Visual point on the timeline line */}
                 <div className="timeline-item-line-segment"></div> {/* Visual line segment before point */}

                <div className="timeline-item-date-wrapper">
                    <RichText.Content tagName="div" className="timeline-item-date" value={date} />
                </div>
                <div className="timeline-item-content-wrapper">
                    {imageUrl && (imageAlignment === 'top') && (
                        <div className="timeline-item-image-container">
                            <img src={imageUrl} alt={title || date} />
                        </div>
                    )}
                    <RichText.Content tagName={TitleTagSave} className="timeline-item-title" value={title} />
                    <RichText.Content tagName="div" className="timeline-item-description" value={description} />
                    {imageUrl && (imageAlignment !== 'top' && imageAlignment !== 'none') && (
                        <div className="timeline-item-image-container">
                            <img src={imageUrl} alt={title || date} />
                        </div>
                    )}
                </div>
            </div>
        );
    },
});
