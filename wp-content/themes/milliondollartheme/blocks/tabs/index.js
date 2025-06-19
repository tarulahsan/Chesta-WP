/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps, InspectorControls, InnerBlocks, RichText, useInnerBlocksProps, useBlockDisplayInformation
} from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, Button, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import './style-index.css';
import './index.css';

const { name, title, attributes } = metadata;

const ALLOWED_BLOCKS = ['core/paragraph', 'core/heading', 'core/image', 'core/list', 'milliondollartheme/advanced-button']; // Example

registerBlockType(name, {
    title: title,
    attributes: attributes,

    edit: ({ attributes, setAttributes, clientId }) => {
        const { tabs, tabLayout, tabsStyle, activeTab } = attributes;
        const [selectedTab, setSelectedTab] = useState(activeTab || (tabs.length > 0 ? tabs[0].id : null));

        useEffect(() => {
            // Ensure activeTab attribute is updated if selectedTab changes
            // or if the initial activeTab from attributes needs to be set.
            if (!activeTab && tabs.length > 0 && !selectedTab) {
                setSelectedTab(tabs[0].id);
                setAttributes({ activeTab: tabs[0].id });
            } else if (activeTab && activeTab !== selectedTab) {
                setSelectedTab(activeTab);
            }
        }, [tabs, activeTab, selectedTab, setAttributes]);

        const blockProps = useBlockProps({
            className: `is-style-${tabsStyle} layout-${tabLayout}`
        });

        // For InnerBlocks, we need to ensure each tab has a corresponding InnerBlocks area.
        // The `template` prop of InnerBlocks can be an array of block arrays.
        // We create one InnerBlocks instance, and its content will be shown/hidden.
        // A more complex approach might use multiple InnerBlocks instances, one per tab, if required by specific plugins or very distinct templates per tab.
        // For simplicity with Alpine on front-end, one InnerBlocks whose direct children are "tab panels" (group blocks) is easier.

        const template = tabs.map(tab => ['core/group', {className: 'tab-panel-wrapper', 'data-tab-id': tab.id, lock: { move: true, remove: true} }, [] ] );
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
            if (!selectedTab || tabs.length === 0) { // If it's the first tab or no tab was selected
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

        // In the editor, we need to visually show/hide the content of InnerBlocks panels.
        // This is tricky with a single InnerBlocks instance.
        // A common pattern is to iterate through clientIds of inner blocks and show/hide them via CSS based on selectedTab.
        // Or, use multiple InnerBlocks instances if state management per tab is simpler.
        // For now, all InnerBlocks content will be visible in editor, user clicks tab title to conceptually switch.
        // A more advanced editor would hide non-active InnerBlock groups.

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
                            value={activeTab}
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
                        {/* TODO: Color pickers for titles, backgrounds, borders */}
                        <TextControl label={__('Content Area Padding', 'milliondollartheme')} value={attributes.contentPadding} onChange={val => setAttributes({contentPadding: val})} />
                        <TextControl label={__('Border Radius (for container)', 'milliondollartheme')} value={attributes.borderRadius} onChange={val => setAttributes({borderRadius: val})} />
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
                    <div {...innerBlocksProps} /> {/* All tab panels rendered here, editor CSS will hide non-active */}
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
                borderRadius: tabsStyle === 'glassy' || tabsStyle === 'default' ? borderRadius : undefined,
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

        return (
            <div {...blockProps}>
                <div className="tab-buttons-wrapper" role="tablist">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            className="tab-button" // Base class
                            role="tab"
                            // Dynamically bind aria-selected and class with Alpine
                            dangerouslySetInnerHTML={{__html: tab.title}} // Title from RichText
                            // Apply custom styling attributes via inline styles if needed, or rely on CSS classes
                            // Example for direct style binding (though classes are better for themeability):
                            // style={{
                            //     backgroundColor: `isTabActive('${tab.id}') ? '${activeTabTitleBgColor}' : '${tabTitleBgColor}'`, // This needs Alpine x-bind:style
                            //     color: `isTabActive('${tab.id}') ? '${activeTabTitleColor}' : '${tabTitleColor}'`,
                            // }}
                            x-bind:aria-selected={`isTabActive('${tab.id}')`}
                            x-bind:class="{'is-active': isTabActive('${tab.id}')}"
                            x-on:click={`setActiveTab('${tab.id}')`}
                            aria-controls={`tab-panel-${tab.id}`} // Link to panel
                            id={`tab-button-${tab.id}`} // ID for button
                        >
                        </button>
                    ))}
                </div>
                <div className="tab-content-panels-wrapper" style={{ backgroundColor: contentBgColor, padding: contentPadding, borderRadius: borderRadius ? `0 0 ${borderRadius} ${borderRadius}` : undefined }}>
                    <InnerBlocks.Content />
                    {/*
                      IMPORTANT for Alpine.js to work with InnerBlocks.Content:
                      Each direct child of InnerBlocks.Content (which are the core/group blocks from our template)
                      needs to have an x-show directive. This is typically done by:
                      1. Using a custom "tab-panel" block that includes x-show in its save function.
                      2. Filtering 'core/group' block's save output to inject x-show if it's within our 'tabs' block.
                      For this iteration, we assume this connection will be made or handled by more advanced JS/PHP.
                      The `data-tab-id` on group blocks (from edit template) is crucial for Alpine to target them.
                      Example of how a panel would look if we iterated here (but InnerBlocks.Content does it):
                      <div role="tabpanel" id={`tab-panel-${tab.id}`} x-show={`isTabActive('${tab.id}')`}>
                         ... content of that tab ...
                      </div>
                    */}
                </div>
            </div>
        );
    },
});
