// Progress Bar Block View Script
document.addEventListener('DOMContentLoaded', function () {
    const progressBars = document.querySelectorAll('.wp-block-milliondollartheme-progress-bar.animate-on-scroll');

    if (!progressBars.length) {
        return;
    }

    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the element is visible
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const barElement = entry.target;
                const fillElement = barElement.querySelector('.progress-bar-fill');
                const percentage = barElement.dataset.percentage || '0';

                // Ensure transition is set before width change for animation to occur
                // The transition is already set inline by save() if animateOnScroll is true
                // fillElement.style.transition = 'width 1s ease-out'; // Or from attribute

                setTimeout(() => { // Small delay to ensure CSS transition is picked up
                    if (fillElement) {
                        fillElement.style.width = percentage + '%';
                    }
                }, 100); // Adjust delay if needed

                barElement.classList.add('in-view'); // Add class for other potential CSS animations
                obs.unobserve(barElement); // Stop observing once animated
            }
        });
    }, observerOptions);

    progressBars.forEach(bar => {
        observer.observe(bar);
    });
});
