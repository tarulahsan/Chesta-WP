import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    InspectorControls,
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
    ToolbarGroup,
    ToolbarButton,
    TextareaControl,
    ColorPalette, // Will use later if needed for custom color pickers
    __experimentalBoxControl as BoxControl, // For padding/margin if needed for wrapper
    RangeControl
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { link as linkIcon, image as imageIcon, edit as editIcon } from '@wordpress/icons';
import metadata from './block.json';

const { name } = metadata;

registerBlockType(name, {
    attributes: metadata.attributes,
    edit: ({ attributes, setAttributes, isSelected }) => {
        const blockProps = useBlockProps({
            className: `align${attributes.align || 'none'}`, // Add alignment class
        });
        const {
            imageUrl, imageId, alt, caption,
            linkUrl, linkTarget, rel,
            hoverEffect, overlayColor, overlayText,
            borderStyle, borderWidth, borderColor, borderRadius,
            boxShadowPreset, shapeMask,
            align, width, height, aspectRatio, scale
        } = attributes;

        const onSelectImage = (media) => {
            setAttributes({
                imageUrl: media.url,
                imageId: media.id,
                alt: media.alt || '',
                width: media.width,
                height: media.height
            });
        };

        const onRemoveImage = () => {
            setAttributes({
                imageUrl: undefined,
                imageId: undefined,
                alt: '',
                width: undefined,
                height: undefined
            });
        };

        const imageStyles = {
            borderRadius: borderRadius,
            aspectRatio: aspectRatio,
            objectFit: scale,
            width: width ? `${width}px` : undefined,
            height: height ? `${height}px` : undefined,
            // CSS for border, boxShadow, shapeMask will be applied via classes on frontend
        };

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Image Settings', 'milliondollartheme')}>
                        {!imageUrl ? (
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={onSelectImage}
                                    allowedTypes={['image']}
                                    value={imageId}
                                    render={({ open }) => (
                                        <Button onClick={open} isPrimary icon={imageIcon}>
                                            {__('Select Image', 'milliondollartheme')}
                                        </Button>
                                    )}
                                />
                            </MediaUploadCheck>
                        ) : (
                            <>
                                <p>{__('Current Image:', 'milliondollartheme')}</p>
                                <img src={imageUrl} alt={__('Preview', 'milliondollartheme')} style={{maxWidth: '100%', height: 'auto', marginBottom: '10px'}} />
                                <Button onClick={onRemoveImage} isLink isDestructive>
                                    {__('Remove Image', 'milliondollartheme')}
                                </Button>
                                <TextareaControl
                                    label={__('Alt Text (Alternative Text)', 'milliondollartheme')}
                                    value={alt}
                                    onChange={(val) => setAttributes({ alt: val })}
                                    help={__('Describe the purpose of the image. Leave empty if the image is purely decorative.', 'milliondollartheme')}
                                />
                            </>
                        )}
                    </PanelBody>

                    <PanelBody title={__('Link Settings', 'milliondollartheme')}>
                        <TextControl
                            label={__('Link URL', 'milliondollartheme')}
                            value={linkUrl}
                            onChange={(val) => setAttributes({ linkUrl: val })}
                            type="url"
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
                                help={__('Set the rel attribute for the link (e.g., nofollow, noreferrer).', 'milliondollartheme')}
                            />
                        )}
                    </PanelBody>

                    <PanelBody title={__('Appearance & Effects', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Hover Effect', 'milliondollartheme')}
                            value={hoverEffect}
                            options={[
                                { label: __('None', 'milliondollartheme'), value: 'none' },
                                { label: __('Zoom In', 'milliondollartheme'), value: 'zoom-in' },
                                { label: __('Zoom Out', 'milliondollartheme'), value: 'zoom-out' },
                                { label: __('Grayscale to Color', 'milliondollartheme'), value: 'grayscale' },
                                { label: __('Simple Overlay', 'milliondollartheme'), value: 'overlay-simple' },
                                { label: __('Overlay with Text', 'milliondollartheme'), value: 'overlay-text' },
                            ]}
                            onChange={(val) => setAttributes({ hoverEffect: val })}
                        />
                        {(hoverEffect === 'overlay-simple' || hoverEffect === 'overlay-text') && (
                            <TextControl /* TODO: Replace with ColorPalette */
                                label={__('Overlay Color', 'milliondollartheme')}
                                value={overlayColor}
                                onChange={(val) => setAttributes({ overlayColor: val })}
                                help={__('E.g., rgba(0,0,0,0.5)', 'milliondollartheme')}
                            />
                        )}
                        {hoverEffect === 'overlay-text' && (
                            <TextControl
                                label={__('Overlay Text', 'milliondollartheme')}
                                value={overlayText}
                                onChange={(val) => setAttributes({ overlayText: val })}
                            />
                        )}
                        <SelectControl
                            label={__('Shape Mask', 'milliondollartheme')}
                            value={shapeMask}
                            options={[
                                { label: __('None (Default)', 'milliondollartheme'), value: 'none' },
                                { label: __('Circle', 'milliondollartheme'), value: 'circle' },
                                { label: __('Blob 1', 'milliondollartheme'), value: 'blob-1' },
                                { label: __('Diamond', 'milliondollartheme'), value: 'diamond' },
                                // Add more predefined clip-paths later
                            ]}
                            onChange={(val) => setAttributes({ shapeMask: val })}
                        />
                    </PanelBody>

                    <PanelBody title={__('Border & Shadow', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Border Style', 'milliondollartheme')}
                            value={borderStyle}
                            options={[
                                { label: __('None', 'milliondollartheme'), value: 'none' },
                                { label: __('Solid', 'milliondollartheme'), value: 'solid' },
                                { label: __('Dashed', 'milliondollartheme'), value: 'dashed' },
                                { label: __('Dotted', 'milliondollartheme'), value: 'dotted' },
                            ]}
                            onChange={(val) => setAttributes({ borderStyle: val })}
                        />
                        {borderStyle !== 'none' && (
                            <>
                                <TextControl
                                    label={__('Border Width (e.g., 2px)', 'milliondollartheme')}
                                    value={borderWidth}
                                    onChange={(val) => setAttributes({ borderWidth: val })}
                                />
                                <TextControl /* TODO: ColorPalette */
                                    label={__('Border Color', 'milliondollartheme')}
                                    value={borderColor}
                                    onChange={(val) => setAttributes({ borderColor: val })}
                                />
                            </>
                        )}
                        <TextControl
                            label={__('Border Radius (e.g., 8px or 50%)', 'milliondollartheme')}
                            value={borderRadius}
                            onChange={(val) => setAttributes({ borderRadius: val })}
                        />
                        <SelectControl
                            label={__('Box Shadow', 'milliondollartheme')}
                            value={boxShadowPreset}
                            options={[
                                { label: __('None', 'milliondollartheme'), value: 'none' },
                                { label: __('Soft', 'milliondollartheme'), value: 'soft' },
                                { label: __('Medium', 'milliondollartheme'), value: 'medium' },
                                { label: __('Large', 'milliondollartheme'), value: 'large' },
                            ]}
                            onChange={(val) => setAttributes({ boxShadowPreset: val })}
                        />
                    </PanelBody>
                     <PanelBody title={__('Dimensions', 'milliondollartheme')}>
                        <RangeControl
                            label={__('Width (px)', 'milliondollartheme')}
                            value={width}
                            onChange={(val) => setAttributes({ width: val })}
                            min={50}
                            max={1200}
                            step={10}
                            allowReset
                        />
                        <RangeControl
                            label={__('Height (px)', 'milliondollartheme')}
                            value={height}
                            onChange={(val) => setAttributes({ height: val })}
                            min={50}
                            max={1200}
                            step={10}
                            allowReset
                        />
                        <TextControl
                            label={__('Aspect Ratio (e.g., 16/9, 1/1)', 'milliondollartheme')}
                            value={aspectRatio}
                            onChange={(val) => setAttributes({ aspectRatio: val })}
                            help={__('Overrides height if set. Clear to disable.', 'milliondollartheme')}
                        />
                        <SelectControl
                            label={__('Image Scale (Object Fit)', 'milliondollartheme')}
                            value={scale}
                            options={[
                                { label: 'Cover', value: 'cover' },
                                { label: 'Contain', value: 'contain' },
                                { label: 'Fill', value: 'fill' },
                                { label: 'Scale Down', value: 'scale-down' },
                                { label: 'None', value: 'none' },
                            ]}
                            onChange={(val) => setAttributes({ scale: val })}
                        />
                    </PanelBody>
                </InspectorControls>
                <BlockControls>
                    <AlignmentToolbar
                        value={align}
                        onChange={(newAlign) => setAttributes({ align: newAlign })}
                    />
                     {imageUrl && (
                        <ToolbarGroup>
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={onSelectImage}
                                    allowedTypes={['image']}
                                    value={imageId}
                                    render={({open}) => (
                                        <ToolbarButton
                                            label={__('Edit image', 'milliondollartheme')}
                                            icon={editIcon}
                                            onClick={open}
                                        />
                                    )}
                                />
                            </MediaUploadCheck>
                        </ToolbarGroup>
                    )}
                </BlockControls>
                <div {...blockProps}>
                    {!imageUrl ? (
                        <div className="chesta-advanced-image-placeholder">
                             <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={onSelectImage}
                                    allowedTypes={['image']}
                                    value={imageId}
                                    render={({ open }) => (
                                        <Button onClick={open} isPrimary icon={imageIcon} style={{margin: 'auto', display: 'block'}}>
                                            {__('Select Image', 'milliondollartheme')}
                                        </Button>
                                    )}
                                />
                            </MediaUploadCheck>
                        </div>
                    ) : (
                        <figure className={`chesta-advanced-image-figure shape-${shapeMask} shadow-${boxShadowPreset} hover-${hoverEffect}`}>
                            {linkUrl ? (
                                <a href={linkUrl} target={linkTarget} rel={rel} className="chesta-advanced-image-link">
                                    <img src={imageUrl} alt={alt} style={imageStyles} />
                                    {(hoverEffect === 'overlay-simple' || hoverEffect === 'overlay-text') && <div className="image-overlay" style={{ backgroundColor: overlayColor }}></div>}
                                    {hoverEffect === 'overlay-text' && overlayText && <span className="overlay-text-content">{overlayText}</span>}
                                </a>
                            ) : (
                                <>
                                    <img src={imageUrl} alt={alt} style={imageStyles} />
                                    {(hoverEffect === 'overlay-simple' || hoverEffect === 'overlay-text') && <div className="image-overlay" style={{ backgroundColor: overlayColor }}></div>}
                                    {hoverEffect === 'overlay-text' && overlayText && <span className="overlay-text-content">{overlayText}</span>}
                                </>
                            )}
                            {caption && (
                                <RichText
                                    tagName="figcaption"
                                    value={caption}
                                    onChange={(val) => setAttributes({ caption: val })}
                                    placeholder={__('Add caption...', 'milliondollartheme')}
                                    className="chesta-advanced-image-caption"
                                    inlineToolbar
                                />
                            )}
                        </figure>
                    )}
                </div>
            </>
        );
    },
    save: ({ attributes }) => {
        const {
            imageUrl, alt, caption,
            linkUrl, linkTarget, rel,
            hoverEffect, overlayColor, overlayText,
            borderStyle, borderWidth, borderColor, borderRadius,
            boxShadowPreset, shapeMask,
            align, width, height, aspectRatio, scale
        } = attributes;

        if (!imageUrl) {
            return null;
        }

        const wrapperClasses = [
            'chesta-advanced-image-figure',
            shapeMask !== 'none' ? `shape-${shapeMask}` : '',
            boxShadowPreset !== 'none' ? `shadow-${boxShadowPreset}` : '',
            hoverEffect !== 'none' ? `hover-${hoverEffect}` : '',
            align ? `align${align}` : ''
        ].filter(Boolean).join(' ');

        const imageStyles = {
            borderRadius: borderRadius, // Applied via CSS class if possible, or inline if complex
            aspectRatio: aspectRatio || undefined,
            objectFit: scale || undefined,
            width: width ? `${width}px` : undefined,
            height: height && !aspectRatio ? `${height}px` : undefined, // Height is ignored if aspect ratio is set
            borderStyle: borderStyle !== 'none' ? borderStyle : undefined,
            borderWidth: borderStyle !== 'none' ? borderWidth : undefined,
            borderColor: borderStyle !== 'none' ? borderColor : undefined,
        };

        const imgTag = <img src={imageUrl} alt={alt} style={imageStyles} />;

        let linkOrImg = imgTag;
        if (linkUrl) {
            linkOrImg = <a href={linkUrl} target={linkTarget} rel={rel} className="chesta-advanced-image-link">{imgTag}</a>;
        }

        return (
            <figure {...useBlockProps.save({ className: wrapperClasses })}>
                {linkOrImg}
                {(hoverEffect === 'overlay-simple' || hoverEffect === 'overlay-text') && (
                    <div className="image-overlay" style={{ backgroundColor: overlayColor }}></div>
                )}
                {hoverEffect === 'overlay-text' && overlayText && (
                    <span className="overlay-text-content">{overlayText}</span>
                )}
                {caption && (
                    <RichText.Content tagName="figcaption" value={caption} className="chesta-advanced-image-caption" />
                )}
            </figure>
        );
    },
});
