(function() {
    "use strict";

    /**
     * Sticky Header Functionality
     */
    const siteHeader = document.getElementById('masthead');
    const stickyHeaderEnabled = document.body.classList.contains('sticky-header-enabled-body'); // Class to be added by PHP if Customizer option is on

    if (siteHeader && stickyHeaderEnabled) {
        let headerOffsetTop = siteHeader.offsetTop;
        const siteHeaderHeight = siteHeader.offsetHeight; // Get header height *before* it becomes sticky

        const handleStickyHeader = () => {
            if (window.scrollY > headerOffsetTop) {
                if (!siteHeader.classList.contains('is-sticky')) {
                    siteHeader.classList.add('is-sticky');
                    // Add padding to body to prevent content jump, only if header is not transparent when sticky
                    // This assumes the sticky header will have a solid background.
                    // document.body.style.paddingTop = siteHeaderHeight + 'px';
                    // A class is often better: document.body.classList.add('sticky-header-active-padding');
                    // For now, we'll rely on CSS to make the sticky header take up space or be an overlay.
                    // If direct body padding is needed, ensure it's removed when not sticky.
                }
            } else {
                if (siteHeader.classList.contains('is-sticky')) {
                    siteHeader.classList.remove('is-sticky');
                    // document.body.style.paddingTop = '';
                    // document.body.classList.remove('sticky-header-active-padding');
                }
            }
        };

        // Re-calculate offset if the page might reflow after load (e.g. images loading, fonts)
        window.addEventListener('load', () => {
            headerOffsetTop = siteHeader.offsetTop; // Recalculate after everything is loaded
        });
        window.addEventListener('scroll', handleStickyHeader);
    }

    /**
     * Scroll to Top Button Functionality
     */
    const scrollToTopButton = document.getElementById('scroll-to-top');

    if (scrollToTopButton) {
        const handleScrollToTopVisibility = () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                scrollToTopButton.classList.add('visible');
            } else {
                scrollToTopButton.classList.remove('visible');
            }
        };

        scrollToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', handleScrollToTopVisibility);
        handleScrollToTopVisibility(); // Initial check in case page is already scrolled (e.g. on refresh)
    }

})();
