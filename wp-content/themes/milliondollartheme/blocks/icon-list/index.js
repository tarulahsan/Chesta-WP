import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    RichText,
    InspectorControls,
    BlockControls,
    AlignmentControl,
} from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    Button,
    SelectControl,
    ToggleControl,
    PanelColorSettings,
    ToolbarGroup,
    ToolbarButton,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { plus, trash } from '@wordpress/icons';
import './editor.css'; // For editor-specific styles if any beyond shared
// import './style.css'; // Shared styles (already in block.json)

const ListItemIcon = ({ icon, size, color }) => {
    const iconSlug = icon || 'check-circle'; // Fallback icon
    // For actual SVGs, this would be different. For Dashicons:
    const dashiconClass = `dashicons dashicons-${iconSlug.toLowerCase().replace(/_/g, '-')}`;
    return <span className={dashiconClass} style={{ fontSize: size, color: color || 'inherit', lineHeight: 1, flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}></span>;
};

export default function Edit({ attributes, setAttributes, isSelected }) {
    const { items, globalIcon, globalIconSize, globalIconColor, globalTextColor, itemSpacing, iconTextGap, listStyleType, alignment } = attributes;

    const blockProps = useBlockProps({
        className: `million-dollar-icon-list align-${alignment || 'none'}`,
        style: {
            '--list-item-spacing': itemSpacing || '0.5em',
            '--list-icon-text-gap': iconTextGap || '0.5em',
            '--list-global-icon-color': globalIconColor,
            '--list-global-text-color': globalTextColor,
            'listStyleType': listStyleType === 'none' ? 'none' : '' // Let CSS handle ul/ol display based on tag
        }
    });

    const [selectedItemIndex, setSelectedItemIndex] = useState(null);

    const updateItem = (index, key, value) => {
        const newItems = items.map((item, i) =>
            i === index ? { ...item, [key]: value } : item
        );
        setAttributes({ items: newItems });
    };

    const addItem = () => {
        const newItems = [
            ...items,
            {
                id: `item-${new Date().getTime()}`, // More unique ID
                text: __(`New Item ${items.length + 1}`, 'milliondollartheme'),
                icon: globalIcon, // Use globalIcon for new items
                iconColor: '', // Default to global
                textColor: '', // Default to global
                linkUrl: '',
                newTab: false,
            },
        ];
        setAttributes({ items: newItems });
        setSelectedItemIndex(newItems.length - 1); // Select the new item
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setAttributes({ items: newItems });
        if (selectedItemIndex === index) {
            setSelectedItemIndex(null); // Deselect if the removed item was selected
        } else if (selectedItemIndex > index) {
            setSelectedItemIndex(selectedItemIndex - 1); // Adjust selection if an earlier item was removed
        }
    };

    const ListTag = listStyleType === 'ol' ? 'ol' : listStyleType === 'ul' ? 'ul' : 'div';
    const listWrapperClass = listStyleType === 'none' ? 'icon-list-items-container div-list' : 'icon-list-items-container';

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Global List Settings', 'milliondollartheme')} initialOpen={true}>
                    <SelectControl
                        label={__('Default Icon for New Items (Dashicon)', 'milliondollartheme')}
                        value={globalIcon}
                        options={[
                            {label: 'Check Circle', value: 'check-circle'}, {label: 'Check', value: 'yes'}, {label: 'Star Filled', value: 'star-filled'}, {label: 'Star Empty', value: 'star-empty'}, {label: 'Arrow Right', value: 'arrow-right-alt2'},
                            {label: 'Info', value: 'info-outline'}, {label: 'Plus', value: 'plus-alt'}, {label: 'Minus', value: 'minus'}, {label: 'Edit', value: 'edit'}, {label: 'Camera', value: 'camera'}, {label: 'Admin Users', value: 'admin-users'}
                            /* TODO: Add more common Dashicons or a true IconPicker component */
                        ]}
                        onChange={val => setAttributes({globalIcon: val})}
                        help={__('This icon will be used for new items or items without a specific icon.', 'milliondollartheme')}
                    />
                    <TextControl label={__('Global Icon Size (e.g., 1.2em, 20px)', 'milliondollartheme')} value={globalIconSize} onChange={val => setAttributes({globalIconSize: val})} placeholder="1.2em" />
                    <PanelColorSettings
                        title={__('Global Colors', 'milliondollartheme')}
                        initialOpen={false}
                        colorSettings={[
                            { value: globalIconColor, onChange: (val) => setAttributes({ globalIconColor: val }), label: __('Icon Color') },
                            { value: globalTextColor, onChange: (val) => setAttributes({ globalTextColor: val }), label: __('Text Color') },
                        ]}
                    />
                    <TextControl type="string" label={__('Vertical Spacing Between Items (CSS value)', 'milliondollartheme')} value={itemSpacing} onChange={val => setAttributes({itemSpacing: val})} placeholder="0.5em" />
                    <TextControl type="string" label={__('Gap Between Icon and Text (CSS value)', 'milliondollartheme')} value={iconTextGap} onChange={val => setAttributes({iconTextGap: val})} placeholder="0.5em" />
                    <SelectControl
                        label={__('List Style Type', 'milliondollartheme')}
                        value={listStyleType}
                        options={[ { label: 'Unordered (ul)', value: 'ul' }, { label: 'Ordered (ol)', value: 'ol' }, { label: 'None (divs)', value: 'none' } ]}
                        onChange={val => setAttributes({listStyleType: val})}
                    />
                </PanelBody>

                {selectedItemIndex !== null && items[selectedItemIndex] && (
                    <PanelBody title={`${__('Item', 'milliondollartheme')} ${selectedItemIndex + 1} ${__('Settings', 'milliondollartheme')}`} initialOpen={true}>
                        <SelectControl
                            label={__('Item Icon (Dashicon)', 'milliondollartheme')}
                            value={items[selectedItemIndex].icon || ''}
                            options={[
                                {label: 'Default (Use Global)', value: ''}, {label: 'Check Circle', value: 'check-circle'}, {label: 'Check', value: 'yes'}, {label: 'Star Filled', value: 'star-filled'}, {label: 'Star Empty', value: 'star-empty'},
                                {label: 'Arrow Right', value: 'arrow-right-alt2'}, {label: 'Info', value: 'info-outline'}, {label: 'Plus', value: 'plus-alt'},
                                {label: 'Minus', value: 'minus'}, {label: 'Edit', value: 'edit'}, {label: 'Camera', value: 'camera'}, {label: 'Admin Users', value: 'admin-users'}, {label: 'None (No Icon)', value: 'none'}
                            ]}
                            onChange={val => updateItem(selectedItemIndex, 'icon', val)}
                        />
                        <PanelColorSettings
                            title={__('Item Colors', 'milliondollartheme')}
                            initialOpen={false}
                            colorSettings={[
                                { value: items[selectedItemIndex].iconColor, onChange: (val) => updateItem(selectedItemIndex, 'iconColor', val), label: __('Icon Color (Overrides Global)') },
                                { value: items[selectedItemIndex].textColor, onChange: (val) => updateItem(selectedItemIndex, 'textColor', val), label: __('Text Color (Overrides Global)') },
                            ]}
                        />
                        <TextControl
                            label={__('Item Link URL (Optional)', 'milliondollartheme')}
                            value={items[selectedItemIndex].linkUrl || ''}
                            onChange={val => updateItem(selectedItemIndex, 'linkUrl', val)}
                            type="url"
                        />
                        <ToggleControl
                           label={__('Open link in new tab', 'milliondollartheme')}
                           checked={!!items[selectedItemIndex].newTab}
                           onChange={val => updateItem(selectedItemIndex, 'newTab', val)}
                        />
                    </PanelBody>
                )}
            </InspectorControls>
            <BlockControls>
                <AlignmentControl
                    value={alignment}
                    onChange={(newAlignment) => setAttributes({ alignment: newAlignment })}
                />
                <ToolbarGroup>
                    <ToolbarButton
                        icon={plus}
                        label={__('Add item', 'milliondollartheme')}
                        onClick={addItem}
                    />
                </ToolbarGroup>
            </BlockControls>

            <ListTag {...blockProps} className={`${blockProps.className} ${listWrapperClass}`}>
                {items.map((item, index) => {
                    const effectiveIcon = item.icon || globalIcon;
                    const isCurrentItemSelected = isSelected && selectedItemIndex === index;

                    const textContent = (
                        <RichText
                            tagName="span"
                            className="icon-list-item-text"
                            value={item.text}
                            onChange={content => updateItem(index, 'text', content)}
                            placeholder={__('List item text...', 'milliondollartheme')}
                            style={{ color: item.textColor || globalTextColor }}
                            keepPlaceholderOnFocus
                            onFocus={() => setSelectedItemIndex(index)}
                        />
                    );

                    return (
                        <li
                            key={item.id || index}
                            className={`icon-list-item ${isCurrentItemSelected ? 'is-selected' : ''}`}
                            onClick={() => setSelectedItemIndex(index)}
                            style={{ display: 'flex', alignItems: 'flex-start' }} // Ensure vertical alignment with icon
                        >
                            {effectiveIcon && effectiveIcon !== 'none' && (
                                <ListItemIcon
                                    icon={effectiveIcon}
                                    size={globalIconSize}
                                    color={item.iconColor || globalIconColor}
                                />
                            )}
                            <div className="icon-list-item-content-wrapper" style={{ flexGrow: 1 }}> {/* Wrapper for text and toolbar */}
                                {item.linkUrl && !isCurrentItemSelected ? ( // Only show as link if not editing text
                                    <span className="icon-list-item-link-preview" style={{ color: 'inherit', textDecoration: 'underline' }}>{textContent}</span>
                                ) : (
                                    textContent
                                )}
                            </div>
                            {isCurrentItemSelected && (
                                <ToolbarGroup className="item-actions-toolbar">
                                    <ToolbarButton
                                        icon={trash}
                                        label={__('Remove item', 'milliondollartheme')}
                                        onClick={() => removeItem(index)}
                                        isDestructive
                                    />
                                </ToolbarGroup>
                            )}
                        </li>
                    );
                })}
                 {items.length === 0 && (
                    <p className="icon-list-placeholder">
                        {__('Add items to your list using the + button in the toolbar or in the inspector.', 'milliondollartheme')}
                    </p>
                )}
            </ListTag>
            {isSelected && items.length > 0 && selectedItemIndex === null && (
                 <p className="icon-list-editor-hint">
                    {__('Click on an item to see its specific settings in the Inspector.', 'milliondollartheme')}
                </p>
            )}
        </>
    );
}

export function Save({ attributes }) {
    const { items, globalIcon, globalIconSize, globalIconColor, globalTextColor, itemSpacing, iconTextGap, listStyleType, alignment } = attributes;

    const blockProps = useBlockProps.save({
        className: `million-dollar-icon-list align-${alignment || 'none'}`,
        style: {
            '--list-item-spacing': itemSpacing || '0.5em',
            '--list-icon-text-gap': iconTextGap || '0.5em',
            '--list-global-icon-color': globalIconColor,
            '--list-global-text-color': globalTextColor,
            'listStyleType': listStyleType === 'none' ? 'none' : ''
        }
    });

    const ListTag = listStyleType === 'ol' ? 'ol' : listStyleType === 'ul' ? 'ul' : 'div';
    const listWrapperClass = listStyleType === 'none' ? 'icon-list-items-container div-list' : 'icon-list-items-container';

    return (
        <ListTag {...blockProps} className={`${blockProps.className} ${listWrapperClass}`}>
            {items.map((item, index) => {
                const effectiveIcon = item.icon || globalIcon;
                const itemIconColor = item.iconColor || globalIconColor;
                const itemTextColor = item.textColor || globalTextColor;

                const textContent = (
                    <RichText.Content
                        tagName="span"
                        className="icon-list-item-text"
                        value={item.text}
                        style={{ color: itemTextColor }}
                    />
                );

                return (
                    <li key={item.id || index} className="icon-list-item" style={{ display: 'flex', alignItems: 'flex-start' }}>
                        {effectiveIcon && effectiveIcon !== 'none' && (
                            <ListItemIcon
                                icon={effectiveIcon}
                                size={globalIconSize}
                                color={itemIconColor}
                            />
                        )}
                        {item.linkUrl ? (
                            <a href={item.linkUrl} style={{color: 'inherit', textDecoration: 'none'}} {...(item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                                {textContent}
                            </a>
                        ) : (
                            textContent
                        )}
                    </li>
                );
            })}
        </ListTag>
    );
}
