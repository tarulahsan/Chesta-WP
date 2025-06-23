const { registerPlugin } = wp.plugins;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
const { PanelBody, TabPanel, TextareaControl, Button, Spinner, ExternalLink } = wp.components;
const { registerPlugin } = wp.plugins;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
const { PanelBody, TabPanel, TextareaControl, Button, Spinner, ExternalLink, TextControl, ToggleControl } = wp.components; // Added TextControl, ToggleControl
const { Fragment, useState, useEffect } = wp.element;
const { __ } = wp.i18n;
const { useSelect, useDispatch } = wp.data;
const { store: coreStore } = wp.coreData;

// Import a placeholder icon or use a Dashicon string
const PLUGIN_ICON = 'dashicons-brain'; // Using a Dashicon

const AIToolsPluginSidebar = () => {
    const [activeTab, setActiveTab] = useState('metaDescription');
    const [sourceText, setSourceText] = useState(''); // Shared for AI tools, or specific parts of content
    const [focusKeyword, setFocusKeyword] = useState('');
    const [generatedContent, setGeneratedContent] = useState(''); // For AI tools
    const [seoAnalysisResult, setSeoAnalysisResult] = useState(null); // For SEO results
    const [isLoading, setIsLoading] = useState(false);
    const [toolBeingProcessed, setToolBeingProcessed] = useState(''); // To specify which tool is loading
    const [error, setError] = useState('');

    // Get post content and SEO meta for some tools
    const {
        editorBlocks,
        editedPostContent,
        currentPostId,
        currentPostType,
        postTitle,
        overrideGlobalSeo,
        seoTitle,
        seoDescription,
        seoKeywords
    } = useSelect((select) => {
        const { getBlocks } = select('core/block-editor');
        const { getEditedPostAttribute, getEditedPostContent, getCurrentPostId, getCurrentPostType } = select('core/editor');
        const meta = getEditedPostAttribute('meta') || {};
        return {
            editorBlocks: getBlocks(),
            editedPostContent: getEditedPostAttribute('content'),
            currentPostId: getCurrentPostId(),
            currentPostType: getCurrentPostType(),
            postTitle: getEditedPostAttribute('title'),
            overrideGlobalSeo: meta['_chesta_seo_override_global'] || false,
            seoTitle: meta['_chesta_seo_title'] || '',
            seoDescription: meta['_chesta_seo_description'] || '',
            seoKeywords: meta['_chesta_seo_keywords'] || '',
        };
    }, []);

    const { createNotice } = useDispatch('core/notices');
    const { editPost } = useDispatch('core/editor');

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
        setToolBeingProcessed(tool); // Set which tool is currently processing
        setError('');

        let ajaxAction = '';
        let requestData = {
            _ajax_nonce: mdt_ai_editor_sidebar_vars.nonce,
            post_id: currentPostId,
            post_type: currentPostType,
            // other data will be added based on tool
        };

        if (tool === 'seoAnalysis') {
            setSeoAnalysisResult(null);
            ajaxAction = 'mdt_analyze_post_seo_editor';
            requestData.focus_keyword = focusKeyword;
            // Pass current editor content for analysis
            // Using getEditedPostContent() might be heavy if content is huge.
            // For now, let's stick to the block serialization approach if it's more controlled.
            // Or, pass the raw content string.
            requestData.editor_content = editedPostContent; // Pass the full content string
            requestData.title = postTitle; // Pass the current title
            // The PHP handler will need to parse this content.
        } else {
            // AI Content Tools
            setGeneratedContent('');
            switch (tool) {
                case 'metaDescription':
                    ajaxAction = 'mdt_generate_meta_description_editor';
                    requestData.source_text = sourceText;
                    break;
                case 'contentOutline':
                    ajaxAction = 'mdt_generate_content_outline_editor';
                    requestData.source_text = sourceText;
                    break;
                case 'headlineSuggestions':
                    ajaxAction = 'mdt_generate_headline_suggestions_editor';
                    requestData.source_text = sourceText;
                    requestData.num_headlines = 5;
                    break;
                default:
                    setError(__('Invalid AI tool selected.', 'milliondollartheme'));
                    setIsLoading(false);
                    return;
            }
        }

        requestData.action = ajaxAction;

        wp.ajax.post(requestData)
            .done((response) => {
                if (response.success && response.data) {
                    if (tool === 'seoAnalysis') {
                        setSeoAnalysisResult(response.data); // Expecting an object/array of analysis points
                    } else {
                        setGeneratedContent(response.data); // Expecting a string for AI tools
                    }
                } else {
                    setError(response.data?.message || __('An error occurred.', 'milliondollartheme'));
                     if (tool === 'seoAnalysis') setSeoAnalysisResult(null); // Clear previous results on error
                }
            })
            .fail((jqXHR) => {
                setError(__('AJAX request failed: ', 'milliondollartheme') + jqXHR.statusText + ' (' + jqXHR.responseText + ')');
                if (tool === 'seoAnalysis') setSeoAnalysisResult(null);
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
                        { name: 'seoAnalysis', title: __('SEO Analysis', 'milliondollartheme'), className: 'tab-seo-analysis' },
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
                                            {isLoading && activeTab === 'metaDescription' ? <Spinner /> : __('Generate Meta Description', 'milliondollartheme')}
                                        </Button>
                                    </PanelBody>
                                );
                            case 'contentOutline':
                                return (
                                    <PanelBody title={mdt_ai_editor_sidebar_vars.i18n.contentOutline || __('Content Outline Generator', 'milliondollartheme')}>
                                        <TextareaControl
                                            label={__('Topic/Subject for Outline (defaults to post title, edit if needed):', 'milliondollartheme')}
                                            value={sourceText}
                                            onChange={setSourceText}
                                            help={__('Enter the main topic for which you want to generate an outline.', 'milliondollartheme')}
                                            rows="3"
                                        />
                                        <Button isPrimary onClick={() => handleGenerate('contentOutline')} disabled={isLoading || !sourceText.trim()}>
                                            {isLoading && activeTab === 'contentOutline' ? <Spinner /> : __('Generate Outline', 'milliondollartheme')}
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
                                            {isLoading && activeTab === 'headlineSuggestions' ? <Spinner /> : __('Generate Headlines', 'milliondollartheme')}
                                        </Button>
                                    </PanelBody>
                                );
                            case 'seoAnalysis':
                                return (
                                    <PanelBody title={__('On-Page SEO Analysis', 'milliondollartheme')}>
                                        <TextareaControl
                                            label={__('Focus Keyword:', 'milliondollartheme')}
                                            value={focusKeyword}
                                            onChange={setFocusKeyword}
                                            help={__('Enter the primary keyword or phrase for this content.', 'milliondollartheme')}
                                        />
                                        <Button isPrimary onClick={() => handleGenerate('seoAnalysis')} disabled={isLoading || !focusKeyword.trim()}>
                                            {isLoading && activeTab === 'seoAnalysis' && toolBeingProcessed === 'seoAnalysis' ? <Spinner /> : __('Analyze Current Content', 'milliondollartheme')}
                                        </Button>

                                        <hr style={{ margin: '20px 0'}} />

                                        <ToggleControl
                                            label={__('Override Global SEO Settings', 'milliondollartheme')}
                                            checked={overrideGlobalSeo}
                                            onChange={(isChecked) => editPost({ meta: { ...{/* Ensure other meta fields are not lost if editPost replaces the whole meta object - though it should merge by default */} , _chesta_seo_override_global: isChecked } })}
                                            help={overrideGlobalSeo ? __('Using custom SEO settings for this post.', 'milliondollartheme') : __('Using global/default SEO settings.', 'milliondollartheme')}
                                        />

                                        {overrideGlobalSeo && (
                                            <Fragment>
                                                <TextControl
                                                    label={__('SEO Title', 'milliondollartheme')}
                                                    value={seoTitle}
                                                    onChange={(value) => editPost({ meta: { _chesta_seo_title: value } })}
                                                    help={__('If empty, the post title will be used. Aim for 50-60 characters.', 'milliondollartheme')}
                                                />
                                                <TextareaControl
                                                    label={__('Meta Description', 'milliondollartheme')}
                                                    value={seoDescription}
                                                    onChange={(value) => editPost({ meta: { _chesta_seo_description: value } })}
                                                    help={__('Aim for 150-160 characters. Entice users to click.', 'milliondollartheme')}
                                                    rows="4"
                                                />
                                                <TextControl
                                                    label={__('Meta Keywords', 'milliondollartheme')}
                                                    value={seoKeywords}
                                                    onChange={(value) => editPost({ meta: { _chesta_seo_keywords: value } })}
                                                    help={__('Comma-separated keywords. Less important for modern SEO but can be used.', 'milliondollartheme')}
                                                />
                                            </Fragment>
                                        )}
                                    </PanelBody>
                                );
                            default:
                                return <p>{__('Select a tool.', 'milliondollartheme')}</p>;
                        }
                    }}
                </TabPanel>

                {error && <p style={{ color: 'red', margin: '10px', padding: '10px', backgroundColor: '#ffe0e0', border: '1px solid red' }}>{error}</p>}

                {/* Display area for AI generated content */}
                {generatedContent && ['metaDescription', 'contentOutline', 'headlineSuggestions'].includes(activeTab) && (
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

                {/* Display area for SEO Analysis results */}
                {seoAnalysisResult && activeTab === 'seoAnalysis' && (
                    <PanelBody title={__('SEO Analysis Results', 'milliondollartheme')}>
                        <div className="mdt-seo-analysis-results-display">
                            {Object.entries(seoAnalysisResult).map(([key, value]) => {
                                if (key === 'error') { // Skip top-level error if already handled
                                    return null;
                                }
                                // Simple display, can be enhanced with specific formatting per check
                                let displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
                                if (typeof value === 'object' && value !== null) {
                                    displayValue = JSON.stringify(value); // Basic object display
                                }
                                 // More structured display would involve mapping keys to labels and recommendations
                                return (
                                    <div key={key} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
                                        <strong style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}:</strong>
                                        <p style={{ margin: '0', whiteSpace: 'pre-wrap' }}>{String(displayValue)}</p>
                                    </div>
                                );
                            })}
                        </div>
                         <p><em>{__('This is a basic analysis. For detailed recommendations, please use the main SEO Dashboard.', 'milliondollartheme')}</em></p>
                    </PanelBody>
                )}

                 <PanelBody title={__("How to Use", "milliondollartheme")}>
                    <p>
                        {__("Select a tool from the tabs above. The content from your editor may be used as a base for some tools. Click the generate button, and the AI-generated content or SEO analysis will appear below. You can then copy it.", "milliondollartheme")}
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
