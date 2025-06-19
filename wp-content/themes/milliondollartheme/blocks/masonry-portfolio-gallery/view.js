// Masonry Portfolio Gallery Block View Script
// Example using vanilla JS and Masonry library (assuming it's enqueued separately by the theme or this block)
document.addEventListener('DOMContentLoaded', function () {
    const galleries = document.querySelectorAll('.wp-block-milliondollartheme-masonry-portfolio-gallery');
    galleries.forEach(gallery => {
        // Check if Masonry library is available
        if (typeof Masonry !== 'undefined') {
            const columnMinWidth = parseInt(gallery.style.getPropertyValue('--masonry-column-min-width')) || 250;
            const gap = parseInt(gallery.style.getPropertyValue('--masonry-gap')) || 16;

            // Initialize Masonry
            const msnry = new Masonry(gallery, {
                itemSelector: '.masonry-item',
                columnWidth: '.masonry-grid-sizer', // Can also be a number or selector
                gutter: gap,
                percentPosition: true,
                fitWidth: true // Often good for centered galleries
            });

            // Optional: Recalculate layout when images load if using imagesLoaded library
            if (typeof imagesLoaded !== 'undefined') {
                imagesLoaded(gallery).on('progress', function() {
                    msnry.layout();
                });
            } else {
                // Fallback or simple re-layout after a delay if imagesLoaded is not present
                // This is less reliable.
                // window.addEventListener('load', () => msnry.layout());
            }
        } else {
            console.warn('Masonry library not found for milliondollartheme/masonry-portfolio-gallery block.');
            // Provide basic flex fallback if Masonry is not loaded
            gallery.style.display = 'flex';
            gallery.style.flexWrap = 'wrap';
            gallery.style.gap = gallery.style.getPropertyValue('--masonry-gap') || '16px';
            const items = gallery.querySelectorAll('.masonry-item');
            items.forEach(item => {
                item.style.flex = `1 1 ${gallery.style.getPropertyValue('--masonry-column-min-width') || '250px'}`;
                item.style.maxWidth = `${gallery.style.getPropertyValue('--masonry-column-min-width') || '250px'}`; // Simple fallback
            });

        }
    });
});
