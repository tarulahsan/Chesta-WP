/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps, InspectorControls, InnerBlocks, RichText, useInnerBlocksProps
} from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, Button, TextareaControl } from '@wordpress/components'; // Added TextareaControl
import { useState, useEffect } from '@wordpress/element';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import './style-index.css';
import './index.css';

const { name, title, attributes } = metadata;

const ALLOWED_BLOCKS = ['core/paragraph', 'core/heading', 'core/image', 'core/list', 'chesta/advanced-button'];

registerBlockType(name, {
    title: title,
    attributes: attributes,

    edit: ({ attributes, setAttributes, clientId }) => {
        const { tabs, tabLayout, tabsStyle, activeTab, contentPadding, borderRadius, tabTitleColor, tabTitleBgColor, activeTabTitleColor, activeTabTitleBgColor, borderColor, contentBgColor } = attributes;
        const [selectedTab, setSelectedTab] = useState(activeTab || (tabs.length > 0 ? tabs[0].id : null));

        useEffect(() => {
            if (!activeTab && tabs.length > 0 && !selectedTab) {
                const firstTabId = tabs[0].id;
                setSelectedTab(firstTabId);
                setAttributes({ activeTab: firstTabId });
            } else if (activeTab && activeTab !== selectedTab) {
                setSelectedTab(activeTab);
            }
        }, [tabs, activeTab, selectedTab, setAttributes]);

        const blockProps = useBlockProps({
            className: `is-style-${tabsStyle} layout-${tabLayout}`
        });

        const defaultTemplate = [['core/paragraph', { placeholder: 'Tab content...' }]];
        const template = tabs.map(tab => ['core/group', {className: 'tab-panel-wrapper', 'data-tab-id': tab.id, 'aria-labelledby': `tab-button-${tab.id}`, lock: {move: true, remove: true} }, defaultTemplate ] );
        const innerBlocksProps = useInnerBlocksProps(
            { className: 'tabs-content-editor-area' },
            {
                template: template,
                templateLock: false,
                allowedBlocks: ALLOWED_BLOCKS,
            }
        );

        const addTab = () => {
            const newTabId = `tab-${uuidv4()}`;
            const newTabs = [...tabs, { id: newTabId, title: __('New Tab', 'milliondollartheme') }];
            setAttributes({ tabs: newTabs });
            if (!selectedTab || tabs.length === 0) {
                setSelectedTab(newTabId);
                setAttributes({activeTab: newTabId});
            }
        };

        const updateTabTitle = (index, newTitle) => {
            const newTabs = tabs.map((tab, i) => i === index ? { ...tab, title: newTitle } : tab);
            setAttributes({ tabs: newTabs });
        };

        const removeTab = (indexToRemove) => {
            const tabToRemove = tabs[indexToRemove];
            const newTabs = tabs.filter((_, index) => index !== indexToRemove);
            setAttributes({ tabs: newTabs });
            if (selectedTab === tabToRemove.id) {
                const newSelectedTabId = newTabs.length > 0 ? newTabs[Math.max(0, indexToRemove - 1)].id : null;
                setSelectedTab(newSelectedTabId);
                setAttributes({activeTab: newSelectedTabId});
            }
        };

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Tab Settings', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Tab Layout', 'milliondollartheme')}
                            value={tabLayout}
                            options={[ {label: 'Horizontal Top', value: 'horizontal'}, {label: 'Vertical Left', value: 'vertical-left'}, {label: 'Vertical Right', value: 'vertical-right'} ]}
                            onChange={(val) => setAttributes({ tabLayout: val })}
                        />
                        <SelectControl
                            label={__('Initial Active Tab', 'milliondollartheme')}
                            value={activeTab} // This is the ID of the tab
                            options={tabs.map(tab => ({label: tab.title, value: tab.id}))}
                            onChange={(val) => {setAttributes({ activeTab: val }); setSelectedTab(val);}}
                            help={__('Select the tab to be open by default.', 'milliondollartheme')}
                        />
                    </PanelBody>
                    <PanelBody title={__('Styling', 'milliondollartheme')}>
                        <SelectControl
                            label={__('Tabs Style', 'milliondollartheme')}
                            value={tabsStyle}
                            options={[ {label: 'Default', value: 'default'}, {label: 'Pills', value: 'pills'}, {label: 'Glassy', value: 'glassy'}, {label: 'Line', value: 'line'} ]}
                            onChange={(val) => setAttributes({ tabsStyle: val })}
                        />
                        <TextControl /* TODO: ColorPalette for tabTitleColor */ label={__('Tab Title Color', 'milliondollartheme')} value={tabTitleColor || ''} onChange={val => setAttributes({tabTitleColor: val})} />
                        <TextControl /* TODO: ColorPalette for tabTitleBgColor */ label={__('Tab Title Background', 'milliondollartheme')} value={tabTitleBgColor || ''} onChange={val => setAttributes({tabTitleBgColor: val})} />
                        <TextControl /* TODO: ColorPalette for activeTabTitleColor */ label={__('Active Tab Title Color', 'milliondollartheme')} value={activeTabTitleColor || ''} onChange={val => setAttributes({activeTabTitleColor: val})} />
                        <TextControl /* TODO: ColorPalette for activeTabTitleBgColor */ label={__('Active Tab Title Background', 'milliondollartheme')} value={activeTabTitleBgColor || ''} onChange={val => setAttributes({activeTabTitleBgColor: val})} />
                        <TextControl /* TODO: ColorPalette for borderColor */ label={__('Border Color (Wrapper/Tabs)', 'milliondollartheme')} value={borderColor || ''} onChange={val => setAttributes({borderColor: val})} />
                        <TextControl /* TODO: ColorPalette for contentBgColor */ label={__('Content Area Background', 'milliondollartheme')} value={contentBgColor || ''} onChange={val => setAttributes({contentBgColor: val})} />
                        <TextControl label={__('Content Area Padding', 'milliondollartheme')} value={contentPadding} onChange={val => setAttributes({contentPadding: val})} />
                        <TextControl label={__('Border Radius (Wrapper)', 'milliondollartheme')} value={borderRadius} onChange={val => setAttributes({borderRadius: val})} />
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <div className="tab-titles-editor">
                        {tabs.map((tab, index) => (
                            <div key={tab.id} className={`tab-title-item-editor ${selectedTab === tab.id ? 'is-active' : ''}`}>
                                <RichText
                                    tagName="button"
                                    className="tab-title-editor"
                                    value={tab.title}
                                    onChange={(newTitle) => updateTabTitle(index, newTitle)}
                                    onClick={() => { setSelectedTab(tab.id); setAttributes({ activeTab: tab.id }); }}
                                    placeholder={__('Tab Title', 'milliondollartheme')}
                                />
                                <Button isSmall isDestructive onClick={() => removeTab(index)} label={__('Remove Tab', 'milliondollartheme')}>X</Button>
                            </div>
                        ))}
                        <Button isSecondary onClick={addTab}>{__('Add Tab', 'milliondollartheme')}</Button>
                    </div>
                    {/* Editor preview of tab content relies on CSS to show only the active one, or JS to manipulate InnerBlocks children visibility */}
                    {/* For this iteration, all panels are technically rendered by InnerBlocks, editor CSS provides some basic separation */}
                    <div {...innerBlocksProps} />
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const { tabs, tabLayout, tabsStyle, activeTab, contentPadding, borderRadius,
                tabTitleColor, tabTitleBgColor, activeTabTitleColor, activeTabTitleBgColor,
                borderColor, contentBgColor } = attributes;

        const blockProps = useBlockProps.save({
            className: `is-style-${tabsStyle} layout-${tabLayout}`,
            style: {
                borderRadius: (tabsStyle === 'glassy' || tabsStyle === 'default' || tabsStyle === 'pills') ? borderRadius : undefined,
                borderColor: borderColor,
                borderWidth: borderColor ? '1px' : undefined,
                borderStyle: borderColor ? 'solid' : undefined,
            },
            'x-data': JSON.stringify({
                activeTab: activeTab || (tabs.length > 0 ? tabs[0].id : null),
                isTabActive(tabId) { return this.activeTab === tabId; },
                setActiveTab(tabId) { this.activeTab = tabId; }
            })
        });

        const tabContentStyles = {
            backgroundColor: contentBgColor,
            padding: contentPadding,
            borderRadius: (tabsStyle === 'default' && !borderColor) ? borderRadius : ( (tabsStyle === 'pills' || tabsStyle === 'line') ? borderRadius : `0 0 ${borderRadius || '0px'} ${borderRadius || '0px'}`),
            border: (tabsStyle === 'default' && borderColor) ? `1px solid ${borderColor}` : undefined,
            borderTop: (tabsStyle === 'default' && borderColor && tabLayout === 'horizontal') ? 'none' : ((tabsStyle === 'default' && borderColor) ? `1px solid ${borderColor}` : undefined),
        };

        return (
            <div {...blockProps}>
                <div className="tab-buttons-wrapper" role="tablist">
                    {tabs.map((tab) => {
                        // const tabButtonStyles = {}; // Defined for clarity for x-bind:style
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                className="tab-button" // Base class, Alpine adds 'is-active'
                                role="tab"
                                aria-controls={`tab-panel-${tab.id}`}
                                id={`tab-button-${tab.id}`}
                                x-on:click={`setActiveTab('${tab.id}')`}
                                x-bind:aria-selected={`isTabActive('${tab.id}')`}
                                x-bind:class={`{ 'is-active': isTabActive('${tab.id}') }`}
                                x-bind:style={`{
                                    backgroundColor: isTabActive('${tab.id}') ? '${activeTabTitleBgColor || ''}' : '${tabTitleBgColor || ''}',
                                    color: isTabActive('${tab.id}') ? '${activeTabTitleColor || ''}' : '${tabTitleColor || ''}',
                                    borderColor: isTabActive('${tab.id}') && (tabsStyle === 'line' || tabsStyle === 'default') ? (activeTabTitleBgColor || 'transparent') : 'transparent',
                                }`}
                            >
                                <RichText.Content tagName="span" value={tab.title} />
                            </button>
                        );
                    })}
                </div>
                <div className="tab-content-panels-wrapper" style={tabContentStyles}>
                    {/* InnerBlocks.Content renders all core/group blocks. */}
                    {/* A PHP filter 'render_block_core/group' is needed to add x-show to these panels */}
                    <InnerBlocks.Content />
                </div>
            </div>
        );
    },
});
