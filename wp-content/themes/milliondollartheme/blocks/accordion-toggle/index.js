/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, SelectControl, Button, Icon } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element'; // For editor interactivity
import { v4 as uuidv4 } from 'uuid'; // For unique IDs for items

/**
 * Internal dependencies
 */
import metadata from './block.json';
import './style-index.css';
import './index.css';

const { name, title, attributes } = metadata;

const AccordionItem = ({ title, content, id, isOpen, onClick, onUpdateTitle, onUpdateContent, onRemove, titleTag, iconSet }) => {
    const TitleTag = titleTag || 'h4';
    return (
        <div className="accordion-item-editor">
            <div className="accordion-item-header-editor" onClick={onClick}>
                <RichText
                    tagName={TitleTag}
                    className="accordion-title-text-editor"
                    value={title}
                    onChange={onUpdateTitle}
                    placeholder={__('Accordion Title', 'milliondollartheme')}
                />
                <span className={`accordion-icon-editor icon-set-${iconSet}`}>
                    {iconSet === 'plus-minus' && (isOpen ? '[-]' : '[+]') }
                    {iconSet === 'chevron' && (isOpen ? '▲' : '▼') }
                    {/* iconSet === 'none' will render nothing here or be hidden by CSS */}
                </span>
            </div>
            {isOpen && (
                <div className="accordion-content-editor">
                    <RichText
                        tagName="div"
                        className="accordion-content-inner-editor"
                        multiline="p"
                        value={content}
                        onChange={onUpdateContent}
                        placeholder={__('Accordion content...', 'milliondollartheme')}
                    />
                </div>
            )}
            <Button isDestructive isSmall onClick={onRemove} style={{marginTop: '5px'}}>
                {__('Remove Item', 'milliondollartheme')}
            </Button>
        </div>
    );
};


registerBlockType(name, {
    title: title,
    attributes: attributes,

    edit: ({ attributes, setAttributes }) => {
        const {
            items, openMultiple, defaultOpenIndex, accordionStyle, iconSet, titleTag,
            titleColor, titleBgColor, contentBgColor, borderColor, borderRadius
        } = attributes;

        const blockProps = useBlockProps({
            className: `is-style-${accordionStyle} icon-set-${iconSet}`
        });

        const [openItems, setOpenItems] = useState(() => {
            if (openMultiple) {
                const initialOpen = {};
                if (defaultOpenIndex >= 0 && items[defaultOpenIndex] && items[defaultOpenIndex].id) {
                    initialOpen[items[defaultOpenIndex].id] = true;
                }
                return initialOpen;
            }
            return defaultOpenIndex >= 0 && items[defaultOpenIndex] && items[defaultOpenIndex].id ? items[defaultOpenIndex].id : null;
        });

        const toggleItem = (itemId) => {
            if (openMultiple) {
                setOpenItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
            } else {
                setOpenItems(prev => (prev === itemId ? null : itemId));
            }
        };

        const updateItem = (index, key, value) => {
            const newItems = [...items];
            newItems[index] = { ...newItems[index], [key]: value };
            setAttributes({ items: newItems });
        };

        const addItem = () => {
            const newItemId = `item-${uuidv4()}`;
            setAttributes({
                items: [...items, { id: newItemId, title: __('New Title', 'milliondollartheme'), content: __('New content.', 'milliondollartheme') }]
            });
        };

        const removeItem = (index) => {
            const newItems = items.filter((_, i) => i !== index);
            setAttributes({ items: newItems });
        };

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Accordion Settings', 'milliondollartheme')}>
                        <ToggleControl
                            label={__('Allow multiple items open?', 'milliondollartheme')}
                            checked={!!openMultiple}
                            onChange={() => setAttributes({ openMultiple: !openMultiple })}
                        />
                        <TextControl
                            label={__('Default Open Item Index (0-based, -1 for none)', 'milliondollartheme')}
                            type="number"
                            value={defaultOpenIndex}
                            onChange={(val) => setAttributes({ defaultOpenIndex: parseInt(val) })}
                        />
                         <SelectControl
                            label={__('Icon Set', 'milliondollartheme')}
                            value={iconSet}
                            options={[ {label: 'Plus/Minus', value: 'plus-minus'}, {label: 'Chevron Down/Up', value: 'chevron'}, {label: 'None', value: 'none'} ]}
                            onChange={(val) => setAttributes({ iconSet: val })}
                        />
                        <SelectControl
                            label={__('Title HTML Tag', 'milliondollartheme')}
                            value={titleTag}
                            options={[ {label: 'H2', value: 'h2'}, {label: 'H3', value: 'h3'}, {label: 'H4', value: 'h4'}, {label: 'H5', value: 'h5'}, {label: 'P (div style)', value: 'p'} ]}
                            onChange={(val) => setAttributes({ titleTag: val })}
                        />
                    </PanelBody>
                    <PanelBody title={__('Styling', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Accordion Style', 'milliondollartheme')}
                            value={accordionStyle}
                            options={[ {label: 'Default', value: 'default'}, {label: 'Glassy', value: 'glassy'}, {label: 'Separated Items', value: 'separated'} ]}
                            onChange={(val) => setAttributes({ accordionStyle: val })}
                        />
                        <TextControl /* TODO: ColorPalette for titleColor */
                            label={__('Title Text Color', 'milliondollartheme')}
                            value={titleColor || ''}
                            onChange={(val) => setAttributes({ titleColor: val })}
                        />
                        <TextControl /* TODO: ColorPalette for titleBgColor */
                            label={__('Title Background Color', 'milliondollartheme')}
                            value={titleBgColor || ''}
                            onChange={(val) => setAttributes({ titleBgColor: val })}
                        />
                        <TextControl /* TODO: ColorPalette for contentBgColor */
                            label={__('Content Background Color', 'milliondollartheme')}
                            value={contentBgColor || ''}
                            onChange={(val) => setAttributes({ contentBgColor: val })}
                        />
                        <TextControl /* TODO: ColorPalette for borderColor */
                            label={__('Border Color (for default/separated styles)', 'milliondollartheme')}
                            value={borderColor || ''}
                            onChange={(val) => setAttributes({ borderColor: val })}
                        />
                        <TextControl
                            label={__('Border Radius (e.g., 4px, var(--border-radius-sm))', 'milliondollartheme')}
                            value={borderRadius || ''}
                            onChange={(val) => setAttributes({ borderRadius: val })}
                        />
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    {items.map((item, index) => (
                        <AccordionItem
                            key={item.id || index}
                            id={item.id}
                            title={item.title}
                            content={item.content}
                            isOpen={openMultiple ? !!openItems[item.id] : openItems === item.id}
                            onClick={() => toggleItem(item.id)}
                            onUpdateTitle={(newTitle) => updateItem(index, 'title', newTitle)}
                            onUpdateContent={(newContent) => updateItem(index, 'content', newContent)}
                            onRemove={() => removeItem(index)}
                            titleTag={titleTag}
                            iconSet={iconSet}
                        />
                    ))}
                    <Button isPrimary onClick={addItem} style={{marginTop: '10px'}}>
                        {__('Add Accordion Item', 'milliondollartheme')}
                    </Button>
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const { items, openMultiple, defaultOpenIndex, accordionStyle, iconSet, titleTag, borderRadius, borderColor, titleBgColor, titleColor, contentBgColor } = attributes;
        const blockProps = useBlockProps.save({
            className: `is-style-${accordionStyle} icon-set-${iconSet}`,
            'x-data': JSON.stringify({
                openItems: openMultiple ? {} : (defaultOpenIndex >= 0 && items[defaultOpenIndex] ? items[defaultOpenIndex].id : null),
                openMultiple: openMultiple,
                toggleItem(itemId) {
                    if (this.openMultiple) {
                        this.openItems[itemId] = !this.openItems[itemId];
                    } else {
                        this.openItems = (this.openItems === itemId ? null : itemId);
                    }
                }
            })
        });
        const TitleTag = titleTag || 'h4';

        return (
            <div {...blockProps}>
                {items.map((item, index) => (
                    <div
                        className="accordion-item"
                        key={item.id || index}
                        data-id={item.id || index}
                        style={{
                            borderRadius: accordionStyle === 'separated' ? borderRadius : undefined,
                            borderColor: accordionStyle === 'separated' ? borderColor : undefined,
                            borderWidth: accordionStyle === 'separated' && borderColor ? '1px' : undefined,
                            borderStyle: accordionStyle === 'separated' && borderColor ? 'solid' : undefined,
                            marginBottom: accordionStyle === 'separated' ? 'var(--spacing-sm)' : undefined,
                        }}
                    >
                        <button
                            type="button"
                            className="accordion-title"
                            // Alpine bindings for aria-expanded and class
                            x-bind:aria-expanded={openMultiple ? `!!openItems['${item.id}']` : `openItems === '${item.id}'`}
                            x-bind:class="{'is-active': ${openMultiple ? `!!openItems['${item.id}']` : `openItems === '${item.id}'`}}"
                            aria-controls={`accordion-content-${item.id}`}
                            id={`accordion-title-${item.id}`}
                            style={{
                                backgroundColor: titleBgColor,
                                // Dynamic border radius for title button managed by CSS based on .is-active and item position
                            }}
                            dangerouslySetInnerHTML={{__html: `<${TitleTag} class='accordion-title-text' style='color: ${titleColor || "inherit"};'>${item.title}</${TitleTag}>`}}
                            x-on:click={`toggleItem('${item.id}')`}
                        >
                            {/* Icon is handled by CSS pseudo-elements based on .icon-set-* and .is-active */}
                        </button>
                        <div
                            className="accordion-content"
                            id={`accordion-content-${item.id}`}
                            role="region"
                            aria-labelledby={`accordion-title-${item.id}`}
                            x-show={openMultiple ? `openItems['${item.id}']` : `openItems === '${item.id}'`}
                            x-collapse.duration.300ms=""
                            style={{
                                backgroundColor: contentBgColor,
                                // Dynamic border radius for content managed by CSS
                                borderColor: (accordionStyle === 'default' || accordionStyle === 'glassy') ? borderColor : undefined, // Only apply top border if needed
                                borderTopStyle: (accordionStyle === 'default' || accordionStyle === 'glassy') && borderColor ? 'solid' : undefined,
                                borderTopWidth: (accordionStyle === 'default' || accordionStyle === 'glassy') && borderColor ? '1px' : undefined,
                            }}
                        >
                            <RichText.Content tagName="div" className="accordion-content-inner" value={item.content} />
                        </div>
                    </div>
                ))}
            </div>
        );
    },
});
