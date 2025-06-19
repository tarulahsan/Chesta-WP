/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps, RichText, InspectorControls, MediaUpload, MediaUploadCheck,
    BlockControls, AlignmentControl
} from '@wordpress/block-editor';
import {
    PanelBody, TextareaControl, TextControl, ToggleControl, SelectControl, RangeControl,
    Button, ResponsiveWrapper, FontSizePicker
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import './style-index.css';
import './index.css';

const { name, title, attributes } = metadata;

// Helper to render stars
const StarRating = ({ rating, starColor, starSize }) => {
    const stars = [];
    const style = { color: starColor || 'gold', fontSize: starSize || '1.2em' };
    for (let i = 0; i < 5; i++) {
        stars.push(<span key={i} className={`dashicons dashicons-star-${i < rating ? 'filled' : 'empty'}`} style={style}></span>);
    }
    return <div className="testimonial-rating">{stars}</div>;
};

registerBlockType(name, {
    title: title,
    attributes: attributes,

    edit: ({ attributes, setAttributes }) => {
        const {
            quote, authorName, authorTitle, authorImageUrl, imageShape,
            showRating, rating, testimonialStyle, alignment,
            quoteFontSize, quoteColor, authorNameColor, authorTitleColor, starColor,
            padding, borderRadius, backgroundColor, borderColor
        } = attributes;

        const blockProps = useBlockProps({
            className: `is-style-${testimonialStyle} has-text-align-${alignment}`,
            style: {
                padding: padding,
                borderRadius: borderRadius,
                backgroundColor: (testimonialStyle === 'default' || testimonialStyle === 'custom') ? backgroundColor : undefined,
                borderColor: (testimonialStyle === 'custom' /* || testimonialStyle === 'outline' */) ? borderColor : undefined,
                borderStyle: (testimonialStyle === 'custom' && borderColor) ? 'solid' : undefined,
                borderWidth: (testimonialStyle === 'custom' && borderColor) ? '1px' : undefined,
            }
        });

        const quoteStyles = { fontSize: quoteFontSize, color: quoteColor };
        const authorNameStyles = { color: authorNameColor };
        const authorTitleStyles = { color: authorTitleColor };


        return (
            <>
                <BlockControls>
                    <AlignmentControl value={alignment} onChange={(val) => setAttributes({ alignment: val })} />
                </BlockControls>
                <InspectorControls>
                    <PanelBody title={__('Content', 'milliondollartheme')}>
                        <TextareaControl
                            label={__('Quote', 'milliondollartheme')}
                            value={quote}
                            onChange={(val) => setAttributes({ quote: val })}
                            rows={4}
                        />
                        <TextControl label={__('Author Name', 'milliondollartheme')} value={authorName} onChange={(val) => setAttributes({ authorName: val })} />
                        <TextControl label={__('Author Title/Company', 'milliondollartheme')} value={authorTitle} onChange={(val) => setAttributes({ authorTitle: val })} />
                    </PanelBody>
                    <PanelBody title={__('Author Image', 'milliondollartheme')}>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={(media) => setAttributes({ authorImageUrl: media.url, authorImageId: media.id })}
                                allowedTypes={['image']}
                                value={attributes.authorImageId}
                                render={({ open }) => (
                                    <Button onClick={open} isSecondary>
                                        {!attributes.authorImageUrl ? __('Upload Image', 'milliondollartheme') : __('Replace Image', 'milliondollartheme')}
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>
                        {attributes.authorImageUrl && (
                            <Button onClick={() => setAttributes({ authorImageUrl: '', authorImageId: null })} isLink isDestructive style={{marginLeft: '10px'}}>
                                {__('Remove Image', 'milliondollartheme')}
                            </Button>
                        )}
                        {attributes.authorImageUrl && (
                             <SelectControl
                                label={__('Image Shape', 'milliondollartheme')}
                                value={imageShape}
                                options={[{label: 'Circle', value: 'circle'}, {label: 'Rounded Square', value: 'rounded-square'}, {label: 'Square', value: 'square'}]}
                                onChange={(val) => setAttributes({ imageShape: val })}
                            />
                        )}
                    </PanelBody>
                    <PanelBody title={__('Rating', 'milliondollartheme')}>
                        <ToggleControl label={__('Show Rating', 'milliondollartheme')} checked={!!showRating} onChange={() => setAttributes({ showRating: !showRating })} />
                        {showRating && (
                            <RangeControl label={__('Rating (1-5)', 'milliondollartheme')} value={rating} onChange={(val) => setAttributes({ rating: val })} min={1} max={5} />
                        )}
                        {showRating && <TextControl /* TODO: ColorPalette */ label={__('Star Color', 'milliondollartheme')} value={starColor} onChange={val => setAttributes({starColor: val})} />}
                    </PanelBody>
                    <PanelBody title={__('Styling & Appearance', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Testimonial Style', 'milliondollartheme')}
                            value={testimonialStyle}
                            options={[{label: 'Glassy', value: 'glassy'}, {label: 'Default', value: 'default'}, {label: 'Quote Background', value: 'quote-bg'}]}
                            onChange={(val) => setAttributes({ testimonialStyle: val })}
                        />
                        <FontSizePicker
                            fontSizes={[ {name: __('Small', 'milliondollartheme'), slug: 'small', size: '1em'}, {name: __('Medium', 'milliondollartheme'), slug: 'medium', size: '1.3em'}, {name: __('Large', 'milliondollartheme'), slug: 'large', size: '1.6em'} ]}
                            value={quoteFontSize}
                            units={['em', 'px', 'rem']}
                            fallbackFontSize={'1.3em'}
                            onChange={ ( val ) => setAttributes( { quoteFontSize: val } ) }
                        />
                        <TextControl /* TODO: ColorPalette */ label={__('Quote Color', 'milliondollartheme')} value={quoteColor || ''} onChange={val => setAttributes({quoteColor: val})} />
                        <TextControl /* TODO: ColorPalette */ label={__('Author Name Color', 'milliondollartheme')} value={authorNameColor || ''} onChange={val => setAttributes({authorNameColor: val})} />
                        <TextControl /* TODO: ColorPalette */ label={__('Author Title Color', 'milliondollartheme')} value={authorTitleColor || ''} onChange={val => setAttributes({authorTitleColor: val})} />

                        {(testimonialStyle === 'default' || testimonialStyle === 'custom') && ( /* Added 'custom' for completeness */
                            <TextControl /* TODO: ColorPalette */ label={__('Background Color', 'milliondollartheme')} value={backgroundColor || ''} onChange={val => setAttributes({backgroundColor: val})} />
                        )}
                        {/* TODO: Border Color for custom/outline styles */ }

                        <TextControl label={__('Padding (e.g., 20px)', 'milliondollartheme')} value={padding} onChange={val => setAttributes({padding: val})} />
                        <TextControl label={__('Border Radius (e.g., 8px)', 'milliondollartheme')} value={borderRadius} onChange={val => setAttributes({borderRadius: val})} />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    {authorImageUrl && (
                        <div className="testimonial-image-wrapper">
                            <img src={authorImageUrl} alt={authorName || ''} className={`is-shape-${imageShape}`} />
                        </div>
                    )}
                    <RichText
                        tagName="blockquote"
                        className="testimonial-quote"
                        value={quote}
                        onChange={(val) => setAttributes({ quote: val })}
                        placeholder={__('Enter testimonial quote...', 'milliondollartheme')}
                        style={quoteStyles}
                    />
                    <div className="testimonial-author-details">
                        <RichText
                            tagName="p"
                            className="testimonial-author-name"
                            value={authorName}
                            onChange={(val) => setAttributes({ authorName: val })}
                            placeholder={__('Author Name', 'milliondollartheme')}
                            style={authorNameStyles}
                        />
                        <RichText
                            tagName="p"
                            className="testimonial-author-title"
                            value={authorTitle}
                            onChange={(val) => setAttributes({ authorTitle: val })}
                            placeholder={__('Author Title/Company', 'milliondollartheme')}
                            style={authorTitleStyles}
                        />
                    </div>
                    {showRating && <StarRating rating={rating} starColor={starColor} />}
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const {
            quote, authorName, authorTitle, authorImageUrl, imageShape,
            showRating, rating, testimonialStyle, alignment,
            quoteFontSize, quoteColor, authorNameColor, authorTitleColor, starColor,
            padding, borderRadius, backgroundColor, borderColor
        } = attributes;

        const blockProps = useBlockProps.save({
            className: `is-style-${testimonialStyle} has-text-align-${alignment}`,
            style: {
                padding: padding,
                borderRadius: borderRadius,
                backgroundColor: (testimonialStyle === 'default' || testimonialStyle === 'custom') ? backgroundColor : undefined,
                borderColor: (testimonialStyle === 'custom' /* || testimonialStyle === 'outline' */) ? borderColor : undefined,
                borderStyle: (testimonialStyle === 'custom' && borderColor) ? 'solid' : undefined,
                borderWidth: (testimonialStyle === 'custom' && borderColor) ? '1px' : undefined,
            }
        });

        const quoteStyles = { fontSize: quoteFontSize, color: quoteColor };
        const authorNameStyles = { color: authorNameColor };
        const authorTitleStyles = { color: authorTitleColor };

        return (
            <div {...blockProps}>
                {authorImageUrl && (
                    <div className="testimonial-image-wrapper">
                        <img src={authorImageUrl} alt={authorName || ''} className={`is-shape-${imageShape}`} />
                    </div>
                )}
                <RichText.Content tagName="blockquote" className="testimonial-quote" value={quote} style={quoteStyles} />
                <div className="testimonial-author-details">
                    <RichText.Content tagName="p" className="testimonial-author-name" value={authorName} style={authorNameStyles} />
                    <RichText.Content tagName="p" className="testimonial-author-title" value={authorTitle} style={authorTitleStyles} />
                </div>
                {showRating && <StarRating rating={rating} starColor={starColor} />}
            </div>
        );
    },
});
