/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, RangeControl, ToggleControl, ColorPalette } from '@wordpress/components';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import './style-index.css';
import './index.css';

const { name, title, attributes } = metadata;

// Placeholder for Icon component
const IconComponent = ({ iconName, size, color }) => {
    if (!iconName) return null;
    const style = { fontSize: size, color: color || 'inherit' };
    return <span className="divider-icon-placeholder" style={style}>{`[ICON: ${iconName}]`}</span>;
};


registerBlockType(name, {
    title: title,
    attributes: attributes,

    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps();
        const {
            type, height, dividerStyle, dividerColor, dividerGradient, dividerThickness, dividerWidth, dividerAlignment,
            addIcon, icon, iconSize, iconColor
            // shape attributes are placeholders for now
        } = attributes;

        const commonControls = (
            <PanelBody title={__('General', 'milliondollartheme')}>
                <SelectControl
                    label={__('Type', 'milliondollartheme')}
                    value={type}
                    options={[
                        { label: 'Spacer', value: 'spacer' },
                        { label: 'Divider Line', value: 'divider' },
                        // { label: 'Shape (Coming Soon)', value: 'shape' },
                    ]}
                    onChange={(val) => setAttributes({ type: val })}
                />
            </PanelBody>
        );

        let typeSpecificControls;
        let previewContent;

        if (type === 'spacer') {
            typeSpecificControls = (
                <PanelBody title={__('Spacer Settings', 'milliondollartheme')}>
                    <TextControl
                        label={__('Height (e.g., 50px, 10vh)', 'milliondollartheme')}
                        value={height}
                        onChange={(val) => setAttributes({ height: val })}
                    />
                </PanelBody>
            );
            previewContent = <div className="spacer-preview" style={{ height: height || '50px' }}>Spacer: {height}</div>;
        } else if (type === 'divider') {
            typeSpecificControls = (
                <PanelBody title={__('Divider Settings', 'milliondollartheme')}>
                    <SelectControl
                        label={__('Style', 'milliondollartheme')}
                        value={dividerStyle}
                        options={[ { label: 'Solid', value: 'solid' }, { label: 'Dotted', value: 'dotted' }, { label: 'Dashed', value: 'dashed' } ]}
                        onChange={(val) => setAttributes({ dividerStyle: val })}
                    />
                    <TextControl /* TODO: Replace with ColorPalette for dividerColor */
                        label={__('Line Color', 'milliondollartheme')}
                        value={dividerColor}
                        onChange={(val) => setAttributes({ dividerColor: val })}
                        help={__('Used if Gradient is not set.', 'milliondollartheme')}
                    />
                    <TextareaControl /* TODO: Replace with GradientPicker */
                        label={__('Line Gradient (CSS value)', 'milliondollartheme')}
                        value={dividerGradient || ''}
                        onChange={(val) => setAttributes({ dividerGradient: val })}
                        help={__('Overrides Line Color if set.', 'milliondollartheme')}
                    />
                    <RangeControl
                        label={__('Thickness (px)', 'milliondollartheme')}
                        value={dividerThickness}
                        onChange={(val) => setAttributes({ dividerThickness: val })}
                        min={1}
                        max={20}
                    />
                    <TextControl
                        label={__('Width (e.g., 50%, 100px)', 'milliondollartheme')}
                        value={dividerWidth}
                        onChange={(val) => setAttributes({ dividerWidth: val })}
                    />
                    {dividerWidth !== '100%' && (
                        <SelectControl
                            label={__('Alignment', 'milliondollartheme')}
                            value={dividerAlignment}
                            options={[ {label: 'Left', value: 'flex-start'}, {label: 'Center', value: 'center'}, {label: 'Right', value: 'flex-end'} ]}
                            onChange={(val) => setAttributes({ dividerAlignment: val })}
                        />
                    )}
                    <ToggleControl
                        label={__('Add Icon', 'milliondollartheme')}
                        checked={!!addIcon}
                        onChange={() => setAttributes({addIcon: !addIcon})}
                    />
                    {addIcon && (
                        <>
                            <TextControl /* TODO: Replace with IconPicker */
                                label={__('Icon Name (Feather Icon Slug)', 'milliondollartheme')}
                                value={icon || ''}
                                onChange={val => setAttributes({icon: val})}
                            />
                            <TextControl
                                label={__('Icon Size (e.g., 24px, 1.5em)', 'milliondollartheme')}
                                value={iconSize || ''}
                                onChange={val => setAttributes({iconSize: val})}
                            />
                            <TextControl /* TODO: Replace with ColorPalette for iconColor */
                                label={__('Icon Color', 'milliondollartheme')}
                                value={iconColor || ''}
                                onChange={val => setAttributes({iconColor: val})} />
                        </>
                    )}
                </PanelBody>
            );
            const dividerLineStyles = {
                borderTopStyle: dividerStyle,
                borderTopWidth: `${dividerThickness || 2}px`,
                borderTopColor: !dividerGradient ? (dividerColor || 'currentColor') : 'transparent', // Color if no gradient
                backgroundImage: dividerGradient || undefined,
                width: dividerWidth || '100%',
            };
            const iconStyles = { fontSize: iconSize, color: iconColor };
            previewContent = (
                <div className="divider-preview-wrapper" style={{ justifyContent: dividerAlignment === 'left' ? 'flex-start' : (dividerAlignment === 'right' ? 'flex-end' : 'center') }}>
                    <div className="divider-line-preview" style={dividerLineStyles}>
                        {addIcon && icon && <span className="divider-icon-placeholder" style={iconStyles}>{`[ICON: ${icon}]`}</span>}
                    </div>
                </div>
            );
        }
        // else if (type === 'shape') { ... }

        return (
            <>
                <InspectorControls>
                    {commonControls}
                    {typeSpecificControls}
                </InspectorControls>
                <div {...blockProps}>
                    {previewContent}
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const blockProps = useBlockProps.save();
        const { type, height, dividerStyle, dividerColor, dividerThickness, dividerWidth, dividerAlignment, addIcon, icon, iconSize, iconColor } = attributes;

        if (type === 'spacer') {
            return <div {...blockProps} style={{ height: height || '50px' }} aria-hidden="true"></div>;
        }

        if (type === 'divider') {
            const wrapperClasses = [
                blockProps.className, // Includes alignment classes like alignwide, alignfull
                'is-style-divider'    // Specific class for divider type styling
            ].filter(Boolean).join(' ');

            const wrapperStyles = {
                display: 'flex',
                justifyContent: dividerAlignment === 'left' ? 'flex-start' : (dividerAlignment === 'right' ? 'flex-end' : 'center'),
                width: '100%', // Wrapper takes full block width
            };
            const lineStyles = {
                borderTopStyle: dividerStyle,
                borderTopWidth: `${dividerThickness || 2}px`,
                borderTopColor: !dividerGradient ? (dividerColor || 'currentColor') : 'transparent',
                backgroundImage: dividerGradient || undefined,
                width: dividerWidth || '100%',
                display: 'flex', // For icon alignment
                alignItems: 'center',
                justifyContent: 'center', // Center icon if line is full width
                position: 'relative', // For icon positioning
            };
            const iconSaveStyles = { fontSize: iconSize, color: iconColor };
            // Remove blockProps.className from here as it's on the outer div now
            return (
                <div {...blockProps} className={wrapperClasses} style={wrapperStyles}>
                    <div className="divider-line" style={lineStyles}>
                        {addIcon && icon && (
                            <span className="divider-icon-wrapper">
                                <IconComponent iconName={icon} size={iconSize} color={iconColor} /> {/* Ensure IconComponent uses these props */}
                            </span>
                        )}
                    </div>
                </div>
            );
        }
        // if (type === 'shape') { ... return SVG or img }
        return <div {...blockProps}></div>; // Fallback for unhandled type
    },
});
