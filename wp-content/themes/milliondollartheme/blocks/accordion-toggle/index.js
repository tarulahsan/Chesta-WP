/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, SelectControl, Button, Icon } from '@wordpress/components';
import { useState } from '@wordpress/element'; // For editor interactivity
import { v4 as uuidv4 } from 'uuid'; // For unique IDs for items

/**
 * Internal dependencies
 */
import metadata from './block.json';
import './style-index.css';
import './index.css';

const { name, title, attributes } = metadata;

const AccordionItem = ({ title, content, id, isOpen, onClick, onUpdateTitle, onUpdateContent, onRemove, titleTag }) => {
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
                <span className="accordion-icon-editor">{isOpen ? '[-]' : '[+]'}</span>
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
        const { items, openMultiple, defaultOpenIndex, accordionStyle, iconSet, titleTag } = attributes;
        const blockProps = useBlockProps({
            className: `is-style-${accordionStyle} icon-set-${iconSet}`
        });

        // Editor-only state for which items are open
        const [openItems, setOpenItems] = useState(() => {
            if (openMultiple) {
                // If multiple can be open, defaultOpenIndex might be an array or string of indices
                // For simplicity now, only one defaultOpenIndex is handled
                const initialOpen = {};
                if (defaultOpenIndex >= 0 && items[defaultOpenIndex]) {
                    initialOpen[items[defaultOpenIndex].id] = true;
                }
                return initialOpen;
            }
            return defaultOpenIndex >= 0 && items[defaultOpenIndex] ? items[defaultOpenIndex].id : null;
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
                        {/* Default Open Index might be complex if items are reordered, using ID might be better */}
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
                        {/* TODO: ColorPickers for titleColor, titleBgColor, contentBgColor, borderColor */}
                        {/* TODO: TextControl for borderRadius */}
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    {items.map((item, index) => (
                        <AccordionItem
                            key={item.id || index} // Use item.id if available and unique
                            id={item.id}
                            title={item.title}
                            content={item.content}
                            isOpen={openMultiple ? !!openItems[item.id] : openItems === item.id}
                            onClick={() => toggleItem(item.id)}
                            onUpdateTitle={(newTitle) => updateItem(index, 'title', newTitle)}
                            onUpdateContent={(newContent) => updateItem(index, 'content', newContent)}
                            onRemove={() => removeItem(index)}
                            titleTag={titleTag}
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
            // Alpine.js main data store
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
                            aria-expanded={openMultiple ? `!!openItems['${item.id}']` : `openItems === '${item.id}'`} // x-bind:aria-expanded
                            aria-controls={`accordion-content-${item.id}`}
                            id={`accordion-title-${item.id}`}
                            dangerouslySetInnerHTML={{__html: `<${TitleTag} class='accordion-title-text' style='color: ${titleColor || "inherit"};'>${item.title}</${TitleTag}>`}}
                            style={{
                                backgroundColor: titleBgColor,
                                // borderRadius applied via CSS for dynamic open/close state
                            }}
                            {'@click'}(`toggleItem('${item.id}')`) // Alpine click handler
                        >
                            {/* Icon will be CSS pseudo-element or inline SVG based on iconSet */}
                        </button>
                        <div
                            className="accordion-content"
                            id={`accordion-content-${item.id}`}
                            role="region"
                            aria-labelledby={`accordion-title-${item.id}`}
                            x-show={openMultiple ? `openItems['${item.id}']` : `openItems === '${item.id}'`}
                            x-collapse.duration.300ms="" // Alpine collapse plugin
                            style={{
                                backgroundColor: contentBgColor,
                                // borderRadius applied via CSS for dynamic open/close state
                                borderColor: borderColor, // if style needs border on content too
                                borderTopColor: (borderColor && (accordionStyle === 'default' || accordionStyle === 'glassy')) ? borderColor : 'transparent',
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
