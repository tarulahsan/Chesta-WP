/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps, InspectorControls, MediaPlaceholder, MediaUpload, MediaUploadCheck, BlockControls
} from '@wordpress/block-editor';
import {
    PanelBody, Button, ToggleControl, RangeControl, SelectControl, TextControl, ToolbarGroup, ToolbarButton
} from '@wordpress/components';
import { gallery as galleryIcon, edit as editIcon } from '@wordpress/icons';


/**
 * Internal dependencies
 */
import metadata from './block.json';
import './style-index.css';
import './index.css'; // For editor wrapper styles

const { name, title, attributes } = metadata;

registerBlockType(name, {
    title: title,
    attributes: attributes,

    edit: ({ attributes, setAttributes, isSelected }) => {
        const {
            images, slidesPerView, slidesPerViewTablet, slidesPerViewMobile, spaceBetween, loop, autoplay, delay,
            showArrows, arrowStyle, arrowColor, arrowBgColor,
            showDots, dotStyle, dotColor, activeDotColor,
            effect, carouselStyle, imageFit, imageHeight, borderRadius, imageLinkTarget
        } = attributes;

        const blockProps = useBlockProps({
            className: `is-style-${carouselStyle}`
        });

        const onSelectImages = (newImages) => {
            setAttributes({ images: newImages.map(img => ({
                id: img.id,
                url: img.sizes?.large?.url || img.sizes?.full?.url || img.url,
                alt: img.alt,
                caption: img.caption || ''
            })) });
        };

        const onRemoveImage = (index) => {
            const newImages = [...images];
            newImages.splice(index, 1);
            setAttributes({ images: newImages });
        };

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Image Settings', 'milliondollartheme')}>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={onSelectImages} allowedTypes={['image']} multiple gallery
                                value={images.map(img => img.id)}
                                render={({open}) => <Button onClick={open} isPrimary icon={galleryIcon}>{__('Manage Images', 'milliondollartheme')}</Button>}
                            />
                        </MediaUploadCheck>
                        <SelectControl label={__('Image Fit', 'milliondollartheme')} value={imageFit} options={[{label:'Cover', value:'cover'},{label:'Contain', value:'contain'}]} onChange={val => setAttributes({imageFit: val})} />
                        <TextControl label={__('Carousel Height (e.g., 400px, 60vh)', 'milliondollartheme')} value={imageHeight} onChange={val => setAttributes({imageHeight: val})} />
                        <SelectControl label={__('Image Click Action', 'milliondollartheme')} value={imageLinkTarget || 'none'} options={[{label:'None', value:'none'},{label:'Open Link in New Tab', value:'_blank'},{label:'Open in Lightbox (TODO)', value:'lightbox'}]} onChange={val => setAttributes({imageLinkTarget: val})} help={__('Note: Actual link URL per image is set in Media Library caption or a dedicated field later.', 'milliondollartheme')} />
                    </PanelBody>

                    <PanelBody title={__('Carousel Settings', 'milliondollartheme')}>
                        <RangeControl label={__('Slides Per View (Desktop)', 'milliondollartheme')} value={slidesPerView} onChange={val => setAttributes({slidesPerView: val})} min={1} max={8} />
                        <RangeControl label={__('Slides Per View (Tablet)', 'milliondollartheme')} value={slidesPerViewTablet || slidesPerView} onChange={val => setAttributes({slidesPerViewTablet: val})} min={1} max={4} />
                        <RangeControl label={__('Slides Per View (Mobile)', 'milliondollartheme')} value={slidesPerViewMobile || 1} onChange={val => setAttributes({slidesPerViewMobile: val})} min={1} max={2} />
                        <RangeControl label={__('Space Between Slides (px)', 'milliondollartheme')} value={spaceBetween} onChange={val => setAttributes({spaceBetween: val})} min={0} max={100} />
                        <SelectControl label={__('Effect', 'milliondollartheme')} value={effect} options={[{label:'Slide', value:'slide'},{label:'Fade', value:'fade'},{label:'Cube', value:'cube'},{label:'Coverflow', value:'coverflow'},{label:'Flip', value:'flip'}]} onChange={val => setAttributes({effect: val})} />
                        <ToggleControl label={__('Loop', 'milliondollartheme')} checked={!!loop} onChange={() => setAttributes({loop: !loop})} />
                    </PanelBody>

                    <PanelBody title={__('Autoplay', 'milliondollartheme')}>
                        <ToggleControl label={__('Autoplay', 'milliondollartheme')} checked={!!autoplay} onChange={() => setAttributes({autoplay: !autoplay})} />
                        {autoplay && <RangeControl label={__('Autoplay Delay (ms)', 'milliondollartheme')} value={delay} onChange={val => setAttributes({delay: val})} min={1000} max={10000} step={500} />}
                    </PanelBody>

                    <PanelBody title={__('Navigation & Pagination Styling', 'milliondollartheme')}>
                        <ToggleControl label={__('Show Navigation Arrows', 'milliondollartheme')} checked={!!showArrows} onChange={() => setAttributes({showArrows: !showArrows})} />
                        {showArrows && <>
                            <SelectControl label={__('Arrow Style', 'milliondollartheme')} value={arrowStyle || 'default'} options={[{label:'Default', value:'default'},{label:'Circle Background', value:'circle-bg'},{label:'Square Background', value:'square-bg'}]} onChange={val => setAttributes({arrowStyle: val})} />
                            <TextControl /* TODO: ColorPalette */ label={__('Arrow Color', 'milliondollartheme')} value={arrowColor || ''} onChange={val => setAttributes({arrowColor: val})} />
                            <TextControl /* TODO: ColorPalette */ label={__('Arrow Background Color (for bg styles)', 'milliondollartheme')} value={arrowBgColor || ''} onChange={val => setAttributes({arrowBgColor: val})} />
                        </>}
                        <ToggleControl label={__('Show Pagination Dots', 'milliondollartheme')} checked={!!showDots} onChange={() => setAttributes({showDots: !showDots})} />
                        {showDots && <>
                            <SelectControl label={__('Dot Style', 'milliondollartheme')} value={dotStyle || 'dots'} options={[{label:'Dots', value:'dots'},{label:'Lines (TODO)', value:'lines'},{label:'Numbers (TODO)', value:'numbers'}]} onChange={val => setAttributes({dotStyle: val})} />
                            <TextControl /* TODO: ColorPalette */ label={__('Dot Color', 'milliondollartheme')} value={dotColor || ''} onChange={val => setAttributes({dotColor: val})} />
                            <TextControl /* TODO: ColorPalette */ label={__('Active Dot Color', 'milliondollartheme')} value={activeDotColor || ''} onChange={val => setAttributes({activeDotColor: val})} />
                        </>}
                    </PanelBody>

                    <PanelBody title={__('Overall Appearance', 'milliondollartheme')}>
                        <SelectControl label={__('Carousel Wrapper Style', 'milliondollartheme')} value={carouselStyle} options={[{label:'Default', value:'default'}, {label:'Glassy Wrapper', value:'glassy-wrapper'}]} onChange={val => setAttributes({carouselStyle: val})} />
                        <TextControl label={__('Slide Border Radius (e.g., 8px)', 'milliondollartheme')} value={borderRadius} onChange={val => setAttributes({borderRadius: val})} />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    {images.length === 0 && (
                        <MediaPlaceholder
                            icon={<Icon icon={galleryIcon} />}
                            labels={{ title: __('Image Carousel', 'milliondollartheme'), instructions: __('Select images for your carousel.', 'milliondollartheme') }}
                            onSelect={onSelectImages}
                            allowedTypes={['image']}
                            multiple
                        />
                    )}
                    {images.length > 0 && (
                        <div className="image-carousel-editor-preview" style={{'--slide-height': imageHeight}}>
                            <p>{__('Carousel Preview (Static List):', 'milliondollartheme')} {images.length} {__('image(s)', 'milliondollartheme')}</p>
                            <div className="editor-image-list">
                                {images.map((img, index) => (
                                    <div key={img.id || index} className="editor-image-item">
                                        <img src={img.url} alt={img.alt || ''} style={{height: '80px', width: 'auto', marginRight: '10px'}} />
                                        <Button isSmall isDestructive onClick={() => onRemoveImage(index)}>{__('Remove', 'milliondollartheme')}</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const {
            images, slidesPerView, slidesPerViewTablet, slidesPerViewMobile, spaceBetween, loop, autoplay, delay,
            showArrows, arrowStyle, arrowColor, arrowBgColor,
            showDots, dotStyle, dotColor, activeDotColor,
            effect, carouselStyle, imageFit, imageHeight, borderRadius, imageLinkTarget
        } = attributes;

        const blockProps = useBlockProps.save({
            className: `is-style-${carouselStyle} swiper-container-wrapper`,
            style: {
                '--slide-height': imageHeight,
                '--slide-border-radius': borderRadius,
                '--slide-image-fit': imageFit,
                '--swiper-nav-color': arrowColor,
                '--swiper-nav-bg': arrowBgColor,
                '--swiper-pagination-bullet-color': dotColor,
                '--swiper-pagination-bullet-active-color': activeDotColor
            },
            'data-slides-per-view': slidesPerView,
            'data-slides-per-view-tablet': slidesPerViewTablet || slidesPerView,
            'data-slides-per-view-mobile': slidesPerViewMobile || 1,
            'data-space-between': spaceBetween,
            'data-loop': loop ? 'true' : 'false',
            'data-autoplay': autoplay ? 'true' : 'false',
            'data-delay': delay,
            'data-effect': effect,
            'data-show-arrows': showArrows ? 'true' : 'false',
            'data-arrow-style': arrowStyle || 'default',
            'data-show-dots': showDots ? 'true' : 'false',
            'data-dot-style': dotStyle || 'dots'
        });

        return (
            <div {...blockProps}>
                <div className="swiper">
                    <div className="swiper-wrapper">
                        {images.map((image, index) => {
                            const imgTag = <img src={image.url} alt={image.alt || ''} data-id={image.id} />;
                            const caption = image.caption ? <div className="swiper-caption"><RichText.Content tagName="p" value={image.caption} /></div> : null;

                            let slideContent = <>{imgTag}{caption}</>;
                            if (imageLinkTarget === '_blank' && image.url) { // Assuming image.url can be used as link for now
                                // In a real scenario, each image object might have its own linkUrl attribute
                                slideContent = <a href={image.url} target="_blank" rel="noopener noreferrer">{imgTag}{caption}</a>;
                            } else if (imageLinkTarget === 'lightbox') {
                                // Add lightbox-specific attributes or wrapper if necessary
                                slideContent = <a href={image.url} data-fslightbox="gallery" data-caption={image.caption || image.alt }>{imgTag}{caption}</a>;
                            }

                            return (
                                <div className="swiper-slide" key={image.id || index}>
                                    {slideContent}
                                </div>
                            );
                        })}
                    </div>
                    {showDots && <div className="swiper-pagination"></div>}
                    {showArrows && <>
                        <div className="swiper-button-prev"></div>
                        <div className="swiper-button-next"></div>
                    </>}
                </div>
            </div>
        );
    },
});
