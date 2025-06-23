const { registerPlugin } = wp.plugins;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
const { PanelBody, TabPanel, TextareaControl, Button, Spinner, ExternalLink } = wp.components;
const { Fragment, useState, useEffect } = wp.element;
const { __ } = wp.i18n;
const { useSelect, useDispatch } = wp.data;
const { store: coreStore } = wp.coreData;

// Import a placeholder icon or use a Dashicon string
const PLUGIN_ICON = 'dashicons-brain'; // Using a Dashicon

const AIToolsPluginSidebar = () => {
    const [activeTab, setActiveTab] = useState('metaDescription');
    const [sourceText, setSourceText] = useState(''); // For meta description, etc.
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Get post content for some tools
    const { editorBlocks, editedPostContent, currentPostId, currentPostType } = useSelect((select) => {
        const { getBlocks } = select('core/block-editor');
        const { getEditedPostAttribute } = select('core/editor');
        return {
            editorBlocks: getBlocks(),
            editedPostContent: getEditedPostAttribute('content'),
            currentPostId: select('core/editor').getCurrentPostId(),
            currentPostType: select('core/editor').getCurrentPostType(),
        };
    }, []);

    const { createNotice } = useDispatch('core/notices');

    // Function to get text from blocks, excluding certain types if needed
    const getTextFromBlocks = (blocks) => {
        let text = '';
        blocks.forEach(block => {
            if (block.name === 'core/paragraph' || block.name === 'core/heading') {
                text += block.attributes.content + '\n';
            }
            // Recursively process inner blocks
            if (block.innerBlocks && block.innerBlocks.length > 0) {
                text += getTextFromBlocks(block.innerBlocks);
            }
        });
        return text.trim();
    };

    // Update sourceText when editor content changes, for relevant tools
    useEffect(() => {
        if (activeTab === 'metaDescription' || activeTab === 'headlineSuggestions') { // Example tabs needing content
            const contentText = getTextFromBlocks(editorBlocks);
            // Limit source text length to avoid overly long inputs for some tools
            setSourceText(contentText.substring(0, 3000));
        }
    }, [editorBlocks, activeTab]);


    const handleGenerate = (tool) => {
        setIsLoading(true);
        setGeneratedContent('');
        setError('');

        let ajaxAction = '';
        let requestData = {
            _ajax_nonce: mdt_ai_editor_sidebar_vars.nonce,
            post_id: currentPostId,
            post_type: currentPostType,
            // source_text will be added based on tool
        };

        switch (tool) {
            case 'metaDescription':
                ajaxAction = 'mdt_generate_meta_description_editor';
                requestData.source_text = sourceText; // Use the potentially pre-filled sourceText
                break;
            case 'contentOutline':
                ajaxAction = 'mdt_generate_content_outline_editor';
                // For outline, source_text is usually a topic/title.
                // Let's use the post title as a default for now, or let user input in a dedicated field.
                // For simplicity, we'll assume a TextareaControl for topic input for outline
                requestData.source_text = sourceText; // Assuming sourceText is used for topic
                break;
            case 'headlineSuggestions':
                 ajaxAction = 'mdt_generate_headline_suggestions_editor';
                 requestData.source_text = sourceText; // Use post content as basis
                 requestData.num_headlines = 5; // Configurable later
                break;
            // Add more cases for other tools
            default:
                setError(__('Invalid tool selected.', 'milliondollartheme'));
                setIsLoading(false);
                return;
        }

        requestData.action = ajaxAction;

        wp.ajax.post(requestData)
            .done((response) => {
                if (response.success && response.data) {
                    setGeneratedContent(response.data);
                } else {
                    setError(response.data?.message || __('An error occurred.', 'milliondollartheme'));
                }
            })
            .fail((jqXHR) => {
                setError(__('AJAX request failed: ', 'milliondollartheme') + jqXHR.statusText);
            })
            .always(() => {
                setIsLoading(false);
            });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            createNotice('success', __('Copied to clipboard!', 'milliondollartheme'), {
                isDismissible: true,
                type: 'snackbar',
            });
        }).catch(err => {
             createNotice('error', __('Failed to copy.', 'milliondollartheme'), {
                isDismissible: true,
                type: 'snackbar',
            });
        });
    };


    return (
        <Fragment>
            <PluginSidebarMoreMenuItem target="ai-tools-sidebar" icon={PLUGIN_ICON}>
                {mdt_ai_editor_sidebar_vars.i18n.sidebarTitle || __('AI Tools', 'milliondollartheme')}
            </PluginSidebarMoreMenuItem>
            <PluginSidebar
                name="ai-tools-sidebar"
                title={mdt_ai_editor_sidebar_vars.i18n.sidebarTitle || __('AI Tools', 'milliondollartheme')}
                icon={PLUGIN_ICON}
            >
                <PanelBody>
                    <p>{__('Enhance your content with AI-powered tools directly in the editor.', 'milliondollartheme')}</p>
                </PanelBody>

                <TabPanel
                    className="ai-tools-tab-panel"
                    activeClass="is-active"
                    onSelect={setActiveTab}
                    activeTab={activeTab}
                    tabs={[
                        { name: 'metaDescription', title: __('Meta Desc', 'milliondollartheme'), className: 'tab-meta-description' },
                        { name: 'contentOutline', title: __('Outline', 'milliondollartheme'), className: 'tab-content-outline' },
                        { name: 'headlineSuggestions', title: __('Headlines', 'milliondollartheme'), className: 'tab-headline-suggestions' },
                        // Add more tabs as tools are developed
                    ]}
                >
                    {(tab) => {
                        switch (tab.name) {
                            case 'metaDescription':
                                return (
                                    <PanelBody title={mdt_ai_editor_sidebar_vars.i18n.metaDescription || __('Meta Description Generator', 'milliondollartheme')}>
                                        <TextareaControl
                                            label={__('Source Text (auto-populates from content, edit if needed):', 'milliondollartheme')}
                                            value={sourceText}
                                            onChange={setSourceText}
                                            help={__('Provide a summary or the main content to generate a meta description from.', 'milliondollartheme')}
                                            rows="5"
                                        />
                                        <Button isPrimary onClick={() => handleGenerate('metaDescription')} disabled={isLoading || !sourceText.trim()}>
                                            {isLoading ? <Spinner /> : __('Generate Meta Description', 'milliondollartheme')}
                                        </Button>
                                    </PanelBody>
                                );
                            case 'contentOutline':
                                return (
                                    <PanelBody title={mdt_ai_editor_sidebar_vars.i18n.contentOutline || __('Content Outline Generator', 'milliondollartheme')}>
                                        <TextareaControl
                                            label={__('Topic/Subject for Outline:', 'milliondollartheme')}
                                            value={sourceText} // Re-using sourceText state for simplicity, could be a different state
                                            onChange={setSourceText}
                                            help={__('Enter the main topic for which you want to generate an outline.', 'milliondollartheme')}
                                            rows="3"
                                        />
                                        <Button isPrimary onClick={() => handleGenerate('contentOutline')} disabled={isLoading || !sourceText.trim()}>
                                            {isLoading ? <Spinner /> : __('Generate Outline', 'milliondollartheme')}
                                        </Button>
                                    </PanelBody>
                                );
                            case 'headlineSuggestions':
                                return (
                                    <PanelBody title={mdt_ai_editor_sidebar_vars.i18n.headlineSuggestions || __('Headline Suggestions', 'milliondollartheme')}>
                                         <TextareaControl
                                            label={__('Content Summary (auto-populates, edit if needed):', 'milliondollartheme')}
                                            value={sourceText}
                                            onChange={setSourceText}
                                            help={__('The AI will generate headlines based on this text.', 'milliondollartheme')}
                                            rows="5"
                                        />
                                        <Button isPrimary onClick={() => handleGenerate('headlineSuggestions')} disabled={isLoading || !sourceText.trim()}>
                                            {isLoading ? <Spinner /> : __('Generate Headlines', 'milliondollartheme')}
                                        </Button>
                                    </PanelBody>
                                );
                            default:
                                return <p>{__('Select a tool.', 'milliondollartheme')}</p>;
                        }
                    }}
                </TabPanel>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                {generatedContent && (
                    <PanelBody title={__('Generated Content', 'milliondollartheme')}>
                        <TextareaControl
                            value={generatedContent}
                            readOnly
                            rows="10"
                        />
                        <Button isSecondary onClick={() => copyToClipboard(generatedContent)}>
                            {__('Copy to Clipboard', 'milliondollartheme')}
                        </Button>
                        {/* Add "Insert into Editor" buttons later if applicable */}
                    </PanelBody>
                )}
                 <PanelBody title={__("How to Use", "milliondollartheme")}>
                    <p>
                        {__("Select a tool from the tabs above. The content from your editor may be used as a base for some tools. Click the generate button, and the AI-generated content will appear below. You can then copy it.", "milliondollartheme")}
                    </p>
                    <p>
                        <ExternalLink href={mdt_ai_editor_sidebar_vars.ajaxurl.replace('admin-ajax.php', 'admin.php?page=milliondollartheme-ai-dashboard#settings')}>
                            {__("Configure AI model preferences in the main AI Dashboard.", "milliondollartheme")}
                        </ExternalLink>
                    </p>
                </PanelBody>
            </PluginSidebar>
        </Fragment>
    );
};

registerPlugin('ai-tools-sidebar', {
    render: AIToolsPluginSidebar,
    icon: PLUGIN_ICON, // Icon for the editor settings menu
});

// Ensure file ends with a newline
