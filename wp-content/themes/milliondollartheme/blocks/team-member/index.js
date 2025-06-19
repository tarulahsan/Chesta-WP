/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps, RichText, InspectorControls, MediaUpload, MediaUploadCheck,
    BlockControls, AlignmentToolbar
} from '@wordpress/block-editor';
import {
    PanelBody, TextControl, TextareaControl, SelectControl, Button, Icon, Tooltip
    // __experimentalRepeater as Repeater // For more complex repeaters
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { v4 as uuidv4 } from 'uuid';


/**
 * Internal dependencies
 */
import metadata from './block.json';
import './style-index.css';
import './index.css';

const { name, title, attributes } = metadata;

// Simple Social Icon component (using Dashicons for placeholders for now)
const SocialIcon = ({ icon, color }) => {
    const dashiconClass = `dashicons dashicons-${icon ? icon.toLowerCase().replace('facebook-f', 'facebook').replace('linkedin-in', 'linkedin') : 'admin-site'}`;
    return <span className={dashiconClass} style={{ fontSize: '20px', color: color || 'inherit' }}></span>;
};


registerBlockType(name, {
    title: title,
    attributes: attributes,

    edit: ({ attributes, setAttributes }) => {
        const {
            name: memberName, role, bio, imageUrl, imageShape, layout, alignment,
            cardStyle, socialLinks, padding, borderRadius, backgroundColor, borderColor,
            nameColor, roleColor, bioColor, socialIconColor
        } = attributes;

        const blockProps = useBlockProps({
            className: `is-style-${cardStyle} layout-${layout} has-text-align-${alignment}`,
            style: {
                padding: padding,
                borderRadius: borderRadius,
                backgroundColor: (cardStyle === 'default' || cardStyle === 'custom') ? backgroundColor : undefined,
                borderColor: (cardStyle === 'custom' || cardStyle === 'outline') ? borderColor : undefined,
                borderStyle: (cardStyle === 'custom' && borderColor || cardStyle === 'outline') ? 'solid' : undefined,
                borderWidth: (cardStyle === 'custom' && borderColor || cardStyle === 'outline') ? '1px' : undefined,
            }
        });

        const nameStyles = { color: nameColor };
        const roleStyles = { color: roleColor };
        const bioStyles = { color: bioColor };


        const updateSocialLink = (index, key, value) => {
            const newLinks = socialLinks.map((link, i) =>
                i === index ? { ...link, [key]: value } : link
            );
            setAttributes({ socialLinks: newLinks });
        };
        const addSocialLink = () => {
            setAttributes({ socialLinks: [...socialLinks, { id: uuidv4(), icon: 'admin-site', url: '#'}] });
        };
        const removeSocialLink = (indexToRemove) => {
            setAttributes({ socialLinks: socialLinks.filter((_, index) => index !== indexToRemove) });
        };


        return (
            <>
                <BlockControls>
                    <AlignmentToolbar value={alignment} onChange={(val) => setAttributes({ alignment: val })} />
                </BlockControls>
                <InspectorControls>
                    <PanelBody title={__('Member Details', 'milliondollartheme')}>
                        <TextControl label={__('Name', 'milliondollartheme')} value={memberName} onChange={(val) => setAttributes({ name: val })} />
                        <TextControl label={__('Role/Title', 'milliondollartheme')} value={role} onChange={(val) => setAttributes({ role: val })} />
                        <TextareaControl label={__('Short Bio', 'milliondollartheme')} value={bio} onChange={(val) => setAttributes({ bio: val })} rows={3} />
                    </PanelBody>
                    <PanelBody title={__('Image', 'milliondollartheme')}>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={(media) => setAttributes({ imageUrl: media.url, imageId: media.id })}
                                allowedTypes={['image']} value={attributes.imageId}
                                render={({ open }) => (<Button onClick={open} isSecondary>{!imageUrl ? __('Upload Image', 'milliondollartheme') : __('Replace Image', 'milliondollartheme')}</Button>)}
                            />
                        </MediaUploadCheck>
                        {imageUrl && <Button onClick={() => setAttributes({ imageUrl: '', imageId: null })} isLink isDestructive style={{marginLeft:'10px'}}>{__('Remove Image', 'milliondollartheme')}</Button>}
                        {imageUrl && <SelectControl label={__('Image Shape', 'milliondollartheme')} value={imageShape} options={[{label:'Circle',value:'circle'},{label:'Rounded',value:'rounded'},{label:'Square',value:'square'}]} onChange={val => setAttributes({imageShape: val})} />}
                    </PanelBody>
                    <PanelBody title={__('Social Links', 'milliondollartheme')}>
                        {socialLinks.map((link, index) => (
                            <div key={link.id || index} className="social-link-repeater-item">
                                <TextControl label={__('Icon Slug (e.g., twitter, linkedin)', 'milliondollartheme')} value={link.icon} onChange={val => updateSocialLink(index, 'icon', val)} />
                                <TextControl label={__('URL', 'milliondollartheme')} value={link.url} onChange={val => updateSocialLink(index, 'url', val)} />
                                <Button isDestructive isSmall onClick={() => removeSocialLink(index)} style={{marginTop:'5px'}}>{__('Remove Link', 'milliondollartheme')}</Button>
                            </div>
                        ))}
                        <Button isSecondary onClick={addSocialLink}>{__('Add Social Link', 'milliondollartheme')}</Button>
                    </PanelBody>
                    <PanelBody title={__('Card Appearance', 'milliondollartheme')}>
                        <SelectControl label={__('Layout', 'milliondollartheme')} value={layout} options={[{label:'Image Top',value:'image-top'},{label:'Image Left',value:'image-left'}]} onChange={val => setAttributes({layout: val})} />
                        <SelectControl label={__('Card Style', 'milliondollartheme')} value={cardStyle} options={[{label:'Default',value:'default'},{label:'Glassy',value:'glassy'},{label:'Outline',value:'outline'}]} onChange={val => setAttributes({cardStyle: val})} />
                        <TextControl label={__('Padding', 'milliondollartheme')} value={padding} onChange={val => setAttributes({padding: val})} />
                        <TextControl label={__('Border Radius', 'milliondollartheme')} value={borderRadius} onChange={val => setAttributes({borderRadius: val})} />
                    </PanelBody>
                    <PanelBody title={__('Colors (Initial)', 'milliondollartheme')} initialOpen={false}>
                        <TextControl /* TODO: ColorPalette */ label={__('Name Color', 'milliondollartheme')} value={nameColor || ''} onChange={val => setAttributes({nameColor: val})} />
                        <TextControl /* TODO: ColorPalette */ label={__('Role Color', 'milliondollartheme')} value={roleColor || ''} onChange={val => setAttributes({roleColor: val})} />
                        <TextControl /* TODO: ColorPalette */ label={__('Bio Color', 'milliondollartheme')} value={bioColor || ''} onChange={val => setAttributes({bioColor: val})} />
                        <TextControl /* TODO: ColorPalette */ label={__('Social Icon Color', 'milliondollartheme')} value={socialIconColor || ''} onChange={val => setAttributes({socialIconColor: val})} />
                        {(cardStyle === 'default' || cardStyle === 'custom') && <TextControl /* TODO: ColorPalette */ label={__('Background Color', 'milliondollartheme')} value={backgroundColor || ''} onChange={val => setAttributes({backgroundColor: val})} />}
                        {(cardStyle === 'outline' || cardStyle === 'custom') && <TextControl /* TODO: ColorPalette */ label={__('Border Color', 'milliondollartheme')} value={borderColor || ''} onChange={val => setAttributes({borderColor: val})} />}
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    {imageUrl && (
                        <div className="team-member-image-wrapper">
                            <img src={imageUrl} alt={memberName || ''} className={`is-shape-${imageShape}`} />
                        </div>
                    )}
                    <div className="team-member-content">
                        <RichText tagName="h4" className="team-member-name" value={memberName} onChange={(val) => setAttributes({ name: val })} placeholder={__('Name...','milliondollartheme')} style={nameStyles} />
                        <RichText tagName="p" className="team-member-role" value={role} onChange={(val) => setAttributes({ role: val })} placeholder={__('Role...','milliondollartheme')} style={roleStyles} />
                        <RichText tagName="p" className="team-member-bio" value={bio} onChange={(val) => setAttributes({ bio: val })} placeholder={__('Short bio...','milliondollartheme')} style={bioStyles} />
                        {socialLinks && socialLinks.length > 0 && (
                            <div className="team-member-social-links">
                                {socialLinks.map((link, index) => (
                                    <a href={link.url || '#'} key={link.id || index} className="team-member-social-link" target="_blank" rel="noopener noreferrer" data-icon={link.icon} style={{color: socialIconColor}}>
                                        <SocialIcon icon={link.icon} />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const {
            name: memberName, role, bio, imageUrl, imageShape, layout, alignment,
            cardStyle, socialLinks, padding, borderRadius, backgroundColor, borderColor,
            nameColor, roleColor, bioColor, socialIconColor
        } = attributes;

        const blockProps = useBlockProps.save({
            className: `is-style-${cardStyle} layout-${layout} has-text-align-${alignment}`,
            style: {
                padding: padding,
                borderRadius: borderRadius,
                backgroundColor: (cardStyle === 'default' || cardStyle === 'custom') ? backgroundColor : undefined,
                borderColor: (cardStyle === 'custom' || cardStyle === 'outline') ? borderColor : undefined,
                borderStyle: (cardStyle === 'custom' && borderColor || cardStyle === 'outline') ? 'solid' : undefined,
                borderWidth: (cardStyle === 'custom' && borderColor || cardStyle === 'outline') ? '1px' : undefined,
            }
        });
        const nameStyles = { color: nameColor };
        const roleStyles = { color: roleColor };
        const bioStyles = { color: bioColor };

        return (
            <div {...blockProps}>
                {imageUrl && (
                    <div className="team-member-image-wrapper">
                        <img src={imageUrl} alt={memberName || ''} className={`is-shape-${imageShape}`} />
                    </div>
                )}
                <div className="team-member-content">
                    <RichText.Content tagName="h4" className="team-member-name" value={memberName} style={nameStyles} />
                    <RichText.Content tagName="p" className="team-member-role" value={role} style={roleStyles} />
                    <RichText.Content tagName="p" className="team-member-bio" value={bio} style={bioStyles} />
                    {socialLinks && socialLinks.length > 0 && (
                        <div className="team-member-social-links">
                            {socialLinks.map((link, index) => (
                                <a href={link.url || '#'} key={link.id || index} className="team-member-social-link" target="_blank" rel="noopener noreferrer" data-icon={link.icon} style={{color: socialIconColor}}>
                                    <SocialIcon icon={link.icon} />
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    },
});
