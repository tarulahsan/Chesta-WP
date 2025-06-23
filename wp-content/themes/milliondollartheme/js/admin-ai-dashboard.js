jQuery(document).ready(function($) {
    // Tab switching logic (already present in the main PHP file for the dashboard,
    // but good to have JS control if we enhance tabbing later)
    const tabs = $('.mdt-ai-dashboard .nav-tab');
    const tabContents = $('.mdt-ai-dashboard .tab-content');

    tabs.on('click', function(event) {
        event.preventDefault();
        const tab = $(this);
        const targetContentId = tab.attr('href').substring(1); // Get id from href like #api-keys

        tabs.removeClass('nav-tab-active');
        tab.addClass('nav-tab-active');

        tabContents.removeClass('active');
        $('#tab-' + targetContentId).addClass('active');

        // Update URL hash without page jump for better UX
        if (history.pushState) {
            history.pushState(null, null, '#' + targetContentId);
        } else {
            window.location.hash = targetContentId;
        }
    });

    // On page load, check for hash and activate the corresponding tab
    if (window.location.hash) {
        const hash = window.location.hash;
        const activeTab = $('.mdt-ai-dashboard .nav-tab[href="' + hash + '"]');
        if (activeTab.length) {
            activeTab.trigger('click');
        } else if (tabs.length > 0) {
            // Fallback to the first tab if hash doesn't match any tab
            $(tabs[0]).trigger('click');
        }
    } else if (tabs.length > 0) {
        // Default to the first tab if no hash
        $(tabs[0]).trigger('click');
    }


    // API Key Verification AJAX Calls
    function handleApiResponse(response, successSelector, errorSelector, spinner, button) {
        spinner.removeClass('is-active');
        button.prop('disabled', false);
        if (response.success) {
            $(successSelector).html('<span style="color:green;">' + response.data.message + '</span>').show();
            $(errorSelector).hide();
        } else {
            $(errorSelector).html('<span style="color:red;">' + response.data.message + '</span>').show();
            $(successSelector).hide();
        }
    }

    $('.mdt-verify-api-key').on('click', function() {
        const button = $(this);
        const provider = button.data('provider');
        const spinner = button.siblings('.mdt-spinner.' + provider + '-spinner');
        const successMessageDiv = button.siblings('.mdt-key-verification-status.' + provider + '-verification-status');
        const errorMessageDiv = successMessageDiv; // Using the same div for simplicity, styled by color

        spinner.addClass('is-active');
        successMessageDiv.hide();
        // errorMessageDiv.hide(); // Not needed if same div
        button.prop('disabled', true);

        let action_name = '';
        if (provider === 'openai') {
            action_name = 'mdt_verify_openai_key';
        } else if (provider === 'gemini') {
            action_name = 'mdt_verify_gemini_key';
        } else {
            errorMessageDiv.html('<span style="color:red;">Invalid provider.</span>').show();
            spinner.removeClass('is-active');
            button.prop('disabled', false);
            return;
        }

        $.ajax({
            url: ajaxurl, // WordPress AJAX URL
            type: 'POST',
            data: {
                action: action_name,
                nonce: mdt_ai_dashboard_vars.nonce, // Nonce passed from wp_localize_script
            },
            success: function(response) {
                handleApiResponse(response, successMessageDiv, errorMessageDiv, spinner, button);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                errorMessageDiv.html('<span style="color:red;">AJAX Error: ' + textStatus + ' - ' + errorThrown + '</span>').show();
                successMessageDiv.hide();
                spinner.removeClass('is-active');
                button.prop('disabled', false);
            }
        });
    });

    // Chart.js rendering (copied from inline script in PHP, can be enhanced)
    if (typeof Chart !== 'undefined' && typeof mdtAiChartData !== 'undefined') {
        const ctxDaily = document.getElementById('mdtDailyUsageChart');
        if (ctxDaily) {
            new Chart(ctxDaily, {
                type: 'line',
                data: {
                    labels: mdtAiChartData.daily.labels,
                    datasets: [{
                        label: mdt_ai_dashboard_vars.i18n.tokensUsed, // Using localized string
                        data: mdtAiChartData.daily.data,
                        tension: 0.1,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    }]
                },
                options: { responsive: true, maintainAspectRatio: true }
            });
        }

        const ctxService = document.getElementById('mdtServiceUsageChart');
        if (ctxService) {
            new Chart(ctxService, {
                type: 'doughnut',
                data: {
                    labels: mdtAiChartData.service.labels,
                    datasets: [{
                        label: mdt_ai_dashboard_vars.i18n.tokensByService, // Using localized string
                        data: mdtAiChartData.service.data,
                        backgroundColor: mdtAiChartData.service.colors
                    }]
                },
                options: { responsive: true, maintainAspectRatio: true }
            });
        }

        const ctxTaskType = document.getElementById('mdtTaskTypeUsageChart');
        if (ctxTaskType) {
            new Chart(ctxTaskType, {
                type: 'bar',
                data: {
                    labels: mdtAiChartData.taskType.labels,
                    datasets: [{
                        label: mdt_ai_dashboard_vars.i18n.tokensByTaskType, // Using localized string
                        data: mdtAiChartData.taskType.data,
                        backgroundColor: mdtAiChartData.taskType.colors
                    }]
                },
                options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
            });
        }
    } else {
        // console.log('Chart.js or mdtAiChartData not available for admin-ai-dashboard.js');
    }
});
