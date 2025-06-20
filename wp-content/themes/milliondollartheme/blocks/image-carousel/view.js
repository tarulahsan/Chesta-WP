// Image Carousel Block View Script (using Swiper.js)
document.addEventListener('DOMContentLoaded', function () {
    // Check if Swiper library is available
    if (typeof Swiper === 'undefined') {
        console.warn('Swiper library not found for milliondollartheme/image-carousel. Please ensure Swiper.js & its CSS are enqueued.');
        // Add a class to wrappers so CSS can provide a basic fallback (e.g., scrollable flex container)
        document.querySelectorAll('.wp-block-milliondollartheme-image-carousel .swiper-container-wrapper').forEach(el => {
            el.classList.add('swiper-not-loaded');
            const swiperEl = el.querySelector('.swiper');
            if (swiperEl) { // Basic scrollable fallback
                swiperEl.style.display = 'flex';
                swiperEl.style.overflowX = 'auto';
                swiperEl.style.gap = el.dataset.spaceBetween + 'px' || '16px';
                const slides = swiperEl.querySelectorAll('.swiper-slide');
                slides.forEach(slide => {
                    slide.style.flexShrink = '0';
                    // Approximate slidesPerView for width, very basic
                    let approxWidth = 100 / (parseFloat(el.dataset.slidesPerViewMobile) || 1);
                    if (window.innerWidth >= 768) approxWidth = 100 / (parseFloat(el.dataset.slidesPerViewTablet) || parseFloat(el.dataset.slidesPerView) || 1);
                    if (window.innerWidth >= 1024) approxWidth = 100 / (parseFloat(el.dataset.slidesPerView) || 1);
                    slide.style.width = approxWidth + '%';
                });
            }
        });
        return;
    }

    const carousels = document.querySelectorAll('.wp-block-milliondollartheme-image-carousel .swiper-container-wrapper');

    carousels.forEach((carouselWrapper, index) => {
        const swiperEl = carouselWrapper.querySelector('.swiper');
        if (!swiperEl) return;

        const uniqueClass = `swiper-instance-${index}`;
        swiperEl.classList.add(uniqueClass);

        const showArrows = carouselWrapper.dataset.showArrows === 'true';
        const showDots = carouselWrapper.dataset.showDots === 'true';

        // Navigation and Pagination elements are now part of the swiperEl by default in HTML save
        const nextElSelector = showArrows ? `.swiper-button-next.swiper-button-next-${uniqueClass}` : null;
        const prevElSelector = showArrows ? `.swiper-button-prev.swiper-button-prev-${uniqueClass}` : null;
        const paginationElSelector = showDots ? `.swiper-pagination.swiper-pagination-${uniqueClass}` : null;

        // Add unique classes to nav/pagination elements within this specific wrapper
        if (showArrows) {
            const nextBtn = carouselWrapper.querySelector('.swiper-button-next');
            const prevBtn = carouselWrapper.querySelector('.swiper-button-prev');
            if(nextBtn) nextBtn.classList.add(`swiper-button-next-${uniqueClass}`);
            if(prevBtn) prevBtn.classList.add(`swiper-button-prev-${uniqueClass}`);
        }
        if (showDots) {
            const pgEl = carouselWrapper.querySelector('.swiper-pagination');
            if(pgEl) pgEl.classList.add(`swiper-pagination-${uniqueClass}`);
        }


        const slidesPerView = parseFloat(carouselWrapper.dataset.slidesPerView) || 1;
        const slidesPerViewTablet = parseFloat(carouselWrapper.dataset.slidesPerViewTablet) || slidesPerView;
        const slidesPerViewMobile = parseFloat(carouselWrapper.dataset.slidesPerViewMobile) || 1;
        const spaceBetween = parseInt(carouselWrapper.dataset.spaceBetween) || 30;
        const loop = carouselWrapper.dataset.loop === 'true';
        const autoplay = carouselWrapper.dataset.autoplay === 'true';
        const delay = parseInt(carouselWrapper.dataset.delay) || 3000;
        const effect = carouselWrapper.dataset.effect || 'slide';
        // arrowStyle & dotStyle are for CSS, not directly Swiper JS options usually

        const swiperOptions = {
            loop: loop,
            spaceBetween: spaceBetween,
            // slidesPerView: slidesPerView, // Will be handled by breakpoints
            effect: effect,
            grabCursor: true,
            // centeredSlides: slidesPerView > 1 ? false : true, // Example: center if only one slide shown
            // autoHeight: true, // If slides have variable height

            autoplay: autoplay ? { delay: delay, disableOnInteraction: false, pauseOnMouseEnter: true } : false,

            navigation: showArrows ? {
                nextEl: nextElSelector,
                prevEl: prevElSelector,
            } : false,

            pagination: showDots ? {
                el: paginationElSelector,
                clickable: true,
                // dynamicBullets: true, // Example of more advanced pagination
            } : false,

            breakpoints: {
                320: { slidesPerView: slidesPerViewMobile, spaceBetween: Math.min(10, spaceBetween) },
                768: { slidesPerView: slidesPerViewTablet, spaceBetween: Math.min(20, spaceBetween) },
                1024: { slidesPerView: slidesPerView, spaceBetween: spaceBetween },
            },
            // Ensure Swiper accessibility features are enabled
            a11y: {
                prevSlideMessage: 'Previous slide',
                nextSlideMessage: 'Next slide',
                firstSlideMessage: 'This is the first slide',
                lastSlideMessage: 'This is the last slide',
                paginationBulletMessage: 'Go to slide {{index}}',
            },
        };

        if (effect === 'fade') {
            swiperOptions.fadeEffect = { crossFade: true };
        } else if (effect === 'cube') {
            swiperOptions.cubeEffect = { shadow: true, slideShadows: true, shadowOffset: 20, shadowScale: 0.94 };
        } else if (effect === 'coverflow') {
            swiperOptions.coverflowEffect = { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true };
            // Often centeredSlides is good with coverflow
            // swiperOptions.centeredSlides = true;
        } else if (effect === 'flip') {
            swiperOptions.flipEffect = { slideShadows: true, limitRotation: true };
        }

        new Swiper(`.${uniqueClass}`, swiperOptions);
    });
    // PHP side should enqueue Swiper JS & CSS. Example:
    // wp_enqueue_style('swiper-css', 'https://unpkg.com/swiper/swiper-bundle.min.css');
    // wp_enqueue_script('swiper-js', 'https://unpkg.com/swiper/swiper-bundle.min.js', array(), null, true);
});
