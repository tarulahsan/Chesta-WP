import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    InspectorControls,
    RichText,
    MediaUpload,
    MediaUploadCheck,
    URLInputButton,
    BlockControls,
    AlignmentToolbar
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    TextControl,
    ToggleControl,
    Button,
    Icon,
    ToolbarGroup,
    ToolbarButton,
    Dashicon // For icon picker preview
} from '@wordpress/components';
import metadata from './block.json'; // Parent block's metadata

const { name, attributes: blockAttributes, usesContext } = metadata;

// A simple list of Dashicons for the picker for now
// In a real scenario, you might use a more comprehensive icon picker component
const DUMMY_ICON_OPTIONS = [
    { label: 'Star', value: 'star-filled' },
    { label: 'Lightbulb', value: 'lightbulb' },
    { label: 'Admin Cog', value: 'admin-generic' },
    { label: 'Checkmark', value: 'yes' },
    { label: 'Info', value: 'info' },
    { label: 'Heart', value: 'heart' },
    { label: 'Camera', value: 'camera' },
];


registerBlockType(name, {
    attributes: blockAttributes,
    usesContext: usesContext, // Make sure this is inherited if needed from parent

    edit: ({ attributes, setAttributes, context }) => {
        const {
            mediaType, icon, iconSize, iconColor, iconBackgroundColor, iconShape,
            imageUrl, imageId, imageWidth,
            title, titleTag, titleColor,
            description, descriptionColor,
            linkUrl, linkText, linkTarget, rel,
            itemBackgroundColor, itemPadding, // These might be better handled by parent or block styles
            itemBorderRadius, itemBorderStyle, itemBorderWidth, itemBorderColor
        } = attributes;

        const parentItemsAlign = context['chesta/infoShowcase/itemsAlign'] || 'left';

        const blockProps = useBlockProps({
            className: `info-showcase-item-align-${parentItemsAlign}`, // Align content based on parent setting
            style: {
                backgroundColor: itemBackgroundColor,
                padding: itemPadding,
                borderRadius: itemBorderRadius,
                borderStyle: itemBorderStyle !== 'none' ? itemBorderStyle : undefined,
                borderWidth: itemBorderStyle !== 'none' ? itemBorderWidth : undefined,
                borderColor: itemBorderStyle !== 'none' ? itemBorderColor : undefined,
            }
        });

        const onSelectImage = (media) => {
            setAttributes({ imageUrl: media.url, imageId: media.id });
        };
        const onRemoveImage = () => {
            setAttributes({ imageUrl: undefined, imageId: undefined });
        };

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Media Settings', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Media Type', 'milliondollartheme')}
                            value={mediaType}
                            options={[
                                { label: __('Icon', 'milliondollartheme'), value: 'icon' },
                                { label: __('Image', 'milliondollartheme'), value: 'image' },
                            ]}
                            onChange={(val) => setAttributes({ mediaType: val })}
                        />
                        {mediaType === 'icon' && (
                            <>
                                <SelectControl // Replace with a proper IconPicker component in a real theme
                                    label={__('Icon', 'milliondollartheme')}
                                    value={icon}
                                    options={DUMMY_ICON_OPTIONS}
                                    onChange={(val) => setAttributes({ icon: val })}
                                />
                                <TextControl label={__('Icon Size (e.g., 48px, 2em)', 'milliondollartheme')} value={iconSize} onChange={(val) => setAttributes({ iconSize: val })} />
                                <TextControl /* TODO: ColorPalette */ label={__('Icon Color', 'milliondollartheme')} value={iconColor || ''} onChange={val => setAttributes({iconColor: val})} />
                                <TextControl /* TODO: ColorPalette */ label={__('Icon Background Color', 'milliondollartheme')} value={iconBackgroundColor || ''} onChange={val => setAttributes({iconBackgroundColor: val})} />
                                <SelectControl
                                    label={__('Icon Shape/Background', 'milliondollartheme')}
                                    value={iconShape}
                                    options={[
                                        { label: __('None', 'milliondollartheme'), value: 'none' },
                                        { label: __('Circle', 'milliondollartheme'), value: 'circle' },
                                        { label: __('Square', 'milliondollartheme'), value: 'square' },
                                        { label: __('Rounded Square', 'milliondollartheme'), value: 'rounded' },
                                    ]}
                                    onChange={(val) => setAttributes({ iconShape: val })}
                                />
                            </>
                        )}
                        {mediaType === 'image' && (
                            <>
                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={onSelectImage}
                                        allowedTypes={['image']}
                                        value={imageId}
                                        render={({open}) => (
                                            <Button onClick={open} isSecondary>
                                                {imageUrl ? __('Change Image', 'milliondollartheme') : __('Select Image', 'milliondollartheme')}
                                            </Button>
                                        )}
                                    />
                                </MediaUploadCheck>
                                {imageUrl && (
                                    <Button onClick={onRemoveImage} isLink isDestructive style={{marginLeft: '8px'}}>
                                        {__('Remove Image', 'milliondollartheme')}
                                    </Button>
                                )}
                                <TextControl label={__('Image Width (e.g., 80px)', 'milliondollartheme')} value={imageWidth} onChange={(val) => setAttributes({ imageWidth: val })} />
                            </>
                        )}
                    </PanelBody>
                    <PanelBody title={__('Content Settings', 'milliondollartheme')}>
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
                        <TextControl /* TODO: ColorPalette */ label={__('Title Color', 'milliondollartheme')} value={titleColor || ''} onChange={val => setAttributes({titleColor: val})} />
                        <TextControl /* TODO: ColorPalette */ label={__('Description Color', 'milliondollartheme')} value={descriptionColor || ''} onChange={val => setAttributes({descriptionColor: val})} />
                    </PanelBody>
                     <PanelBody title={__('Link Settings (Optional)', 'milliondollartheme')}>
                        <TextControl
                            label={__('Link URL (for entire item or just button)', 'milliondollartheme')}
                            value={linkUrl}
                            onChange={(val) => setAttributes({ linkUrl: val })}
                            type="url"
                        />
                        <TextControl
                            label={__('Link Text (if different from title, or for a dedicated button)', 'milliondollartheme')}
                            value={linkText}
                            onChange={(val) => setAttributes({ linkText: val })}
                            help={__('Leave empty to link the whole item or if no link.', 'milliondollartheme')}
                        />
                        {linkUrl && (
                            <ToggleControl
                                label={__('Open in new tab', 'milliondollartheme')}
                                checked={linkTarget === '_blank'}
                                onChange={(isChecked) => setAttributes({ linkTarget: isChecked ? '_blank' : '_self' })}
                            />
                        )}
                         {linkUrl && (
                            <TextControl
                                label={__('Link rel', 'milliondollartheme')}
                                value={rel}
                                onChange={(val) => setAttributes({ rel: val })}
                            />
                        )}
                    </PanelBody>
                    <PanelBody title={__('Item Styling (Advanced)', 'milliondollartheme')} initialOpen={false}>
                        <TextControl /* TODO: ColorPalette */ label={__('Item Background Color', 'milliondollartheme')} value={itemBackgroundColor || ''} onChange={val => setAttributes({itemBackgroundColor: val})} />
                        <TextControl label={__('Item Padding (e.g., 15px)', 'milliondollartheme')} value={itemPadding || ''} onChange={val => setAttributes({itemPadding: val})} />
                        <TextControl label={__('Item Border Radius (e.g., 8px)', 'milliondollartheme')} value={itemBorderRadius || ''} onChange={val => setAttributes({itemBorderRadius: val})} />
                        <SelectControl label={__('Item Border Style', 'milliondollartheme')} value={itemBorderStyle} options={[{label: 'None', value: 'none'}, {label: 'Solid', value: 'solid'}, {label: 'Dashed', value: 'dashed'}, {label: 'Dotted', value: 'dotted'}]} onChange={val => setAttributes({itemBorderStyle: val})} />
                        {itemBorderStyle !== 'none' && <>
                            <TextControl label={__('Item Border Width (e.g., 1px)', 'milliondollartheme')} value={itemBorderWidth} onChange={val => setAttributes({itemBorderWidth: val})} />
                            <TextControl /* TODO: ColorPalette */ label={__('Item Border Color', 'milliondollartheme')} value={itemBorderColor || ''} onChange={val => setAttributes({itemBorderColor: val})} />
                        </>}
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    {mediaType === 'icon' && icon && (
                        <div
                            className={`info-showcase-item-icon-wrapper shape-${iconShape}`}
                            style={{backgroundColor: iconBackgroundColor}}
                        >
                            <Dashicon icon={icon} size={parseInt(iconSize)} style={{color: iconColor, fontSize: iconSize, width: iconSize, height: iconSize}} />
                        </div>
                    )}
                    {mediaType === 'image' && imageUrl && (
                        <div className="info-showcase-item-image-wrapper">
                            <img src={imageUrl} alt={alt || title} style={{width: imageWidth, height: 'auto', borderRadius: iconShape === 'circle' ? '50%' : (iconShape === 'rounded' ? 'var(--border-radius-md)' : '0') }} />
                        </div>
                    )}
                    <RichText
                        tagName={titleTag || 'h4'}
                        className="info-showcase-item-title"
                        value={title}
                        onChange={(val) => setAttributes({ title: val })}
                        placeholder={__('Enter title...', 'milliondollartheme')}
                        style={{color: titleColor}}
                    />
                    <RichText
                        tagName="p"
                        className="info-showcase-item-description"
                        value={description}
                        onChange={(val) => setAttributes({ description: val })}
                        placeholder={__('Enter description...', 'milliondollartheme')}
                        style={{color: descriptionColor}}
                    />
                    {linkUrl && linkText && (
                        <div className="info-showcase-item-link-wrapper">
                            <a href={linkUrl} target={linkTarget} rel={rel} className="info-showcase-item-button button">
                                {linkText}
                            </a>
                        </div>
                    )}
                </div>
            </>
        );
    },
    save: ({ attributes, context }) => {
        const {
            mediaType, icon, iconSize, iconColor, iconBackgroundColor, iconShape,
            imageUrl, imageId, imageWidth, // alt is not saved directly if image is just decorative or title is used
            title, titleTag, titleColor,
            description, descriptionColor,
            linkUrl, linkText, linkTarget, rel,
            itemBackgroundColor, itemPadding,
            itemBorderRadius, itemBorderStyle, itemBorderWidth, itemBorderColor
        } = attributes;

        const parentItemsAlign = context['chesta/infoShowcase/itemsAlign'] || 'left';

        const blockProps = useBlockProps.save({
            className: `info-showcase-item-align-${parentItemsAlign}`,
             style: {
                backgroundColor: itemBackgroundColor,
                padding: itemPadding,
                borderRadius: itemBorderRadius,
                borderStyle: itemBorderStyle !== 'none' ? itemBorderStyle : undefined,
                borderWidth: itemBorderStyle !== 'none' ? itemBorderWidth : undefined,
                borderColor: itemBorderStyle !== 'none' ? itemBorderColor : undefined,
            }
        });

        const TagName = titleTag || 'h4';

        const mediaElement = mediaType === 'icon' && icon ? (
            <div
                className={`info-showcase-item-icon-wrapper shape-${iconShape}`}
                style={{backgroundColor: iconBackgroundColor}}
            >
                {/* Dashicon component doesn't exist in save, so render span or use SVG */}
                <span
                    className={`dashicons dashicons-${icon}`}
                    style={{color: iconColor, fontSize: iconSize, width: iconSize, height: iconSize}}
                ></span>
            </div>
        ) : mediaType === 'image' && imageUrl ? (
            <div className="info-showcase-item-image-wrapper">
                 <img src={imageUrl} alt={title} style={{width: imageWidth, height: 'auto', borderRadius: iconShape === 'circle' ? '50%' : (iconShape === 'rounded' ? 'var(--border-radius-md)' : '0')}} />
            </div>
        ) : null;

        const content = (
            <>
                {mediaElement}
                <RichText.Content
                    tagName={TagName}
                    className="info-showcase-item-title"
                    value={title}
                    style={{color: titleColor}}
                />
                <RichText.Content
                    tagName="p"
                    className="info-showcase-item-description"
                    value={description}
                    style={{color: descriptionColor}}
                />
                {linkUrl && linkText && (
                     <div className="info-showcase-item-link-wrapper">
                        <a href={linkUrl} target={linkTarget} rel={rel} className="info-showcase-item-button button">
                            {linkText}
                        </a>
                    </div>
                )}
            </>
        );

        return (
            <div {...blockProps}>
                {linkUrl && !linkText ? ( // Link whole item if URL exists but no button text
                    <a href={linkUrl} target={linkTarget} rel={rel} className="info-showcase-item-link-wrapper-full">
                        {content}
                    </a>
                ) : (
                    content
                )}
            </div>
        );
    },
});
