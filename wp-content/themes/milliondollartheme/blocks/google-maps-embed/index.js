/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, RangeControl, SelectControl, ToggleControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { Disabled } from '@wordpress/components';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import './index.css'; // For editor wrapper styles

const { name, title, attributes } = metadata;

registerBlockType(name, {
    title: title,
    attributes: attributes,

    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps();
        const { query, zoom, mapType, height, preventScroll, showMarker, mapStyle, customMapStyleJSON, borderRadius } = attributes;

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Map Settings', 'milliondollartheme')}>
                        <TextareaControl
                            label={__('Address or Coordinates (Lat,Lng)', 'milliondollartheme')}
                            value={query}
                            onChange={(val) => setAttributes({ query: val })}
                            rows={2}
                            help={__('e.g., "1600 Amphitheatre Parkway, Mountain View, CA" or "37.422,-122.084"', 'milliondollartheme')}
                        />
                        <RangeControl
                            label={__('Zoom Level', 'milliondollartheme')}
                            value={zoom}
                            onChange={(val) => setAttributes({ zoom: val })}
                            min={1}
                            max={22}
                        />
                        <SelectControl
                            label={__('Map Type', 'milliondollartheme')}
                            value={mapType}
                            options={[
                                { label: 'Roadmap', value: 'roadmap' },
                                { label: 'Satellite', value: 'satellite' },
                                { label: 'Hybrid', value: 'hybrid' },
                                { label: 'Terrain', value: 'terrain' },
                            ]}
                            onChange={(val) => setAttributes({ mapType: val })}
                        />
                        <TextControl
                            label={__('Map Height (e.g., 450px, 75vh)', 'milliondollartheme')}
                            value={height}
                            onChange={(val) => setAttributes({ height: val })}
                        />
                    </PanelBody>
                    <PanelBody title={__('Controls & Appearance', 'milliondollartheme')}>
                        <ToggleControl
                            label={__('Prevent Scroll Hijacking', 'milliondollartheme')}
                            checked={!!attributes.preventScroll}
                            onChange={() => setAttributes({ preventScroll: !attributes.preventScroll })}
                            help={__('Requires user to click map to zoom/pan with scroll.', 'milliondollartheme')}
                        />
                         <ToggleControl
                            label={__('Show Default Marker (via Place mode)', 'milliondollartheme')}
                            checked={!!attributes.showMarker}
                            onChange={() => setAttributes({ showMarker: !attributes.showMarker })}
                            help={__('Note: \'Place\' embed mode usually shows a marker by default.', 'milliondollartheme')}
                        />
                        <SelectControl
                            label={__('Map Frame Style', 'milliondollartheme')}
                            value={attributes.mapStyle}
                            options={[
                                { label: 'Default', value: 'default' },
                                { label: 'Theme Glassy Frame', value: 'theme-glassy-frame' },
                                { label: 'Custom JSON Style (Future - JS API)', value: 'custom-json' }
                            ]}
                            onChange={(val) => setAttributes({ mapStyle: val })}
                        />
                        <TextControl
                            label={__('Wrapper Border Radius', 'milliondollartheme')}
                            value={borderRadius || ''}
                            onChange={(val) => setAttributes({ borderRadius: val })}
                            help={__('e.g., 8px, var(--border-radius-md)', 'milliondollartheme')}
                        />
                        {attributes.mapStyle === 'custom-json' && (
                            <TextareaControl
                                label={__('Custom Map Style JSON', 'milliondollartheme')}
                                value={attributes.customMapStyleJSON || ''}
                                onChange={(val) => setAttributes({ customMapStyleJSON: val })}
                                rows={5}
                                help={__('Paste JSON code from map style generators. Note: This typically requires Google Maps JavaScript API, not used by basic iframe embed.', 'milliondollartheme')}
                            />
                        )}
                        {/* TODO: Add control for custom marker icon URL (for future JS API map) */}
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <Disabled> {/* Disabling interaction with the iframe preview in editor */}
                        <ServerSideRender
                            block={name}
                            attributes={attributes}
                        />
                    </Disabled>
                </div>
            </>
        );
    },

    save: () => {
        return null;
    },
});
