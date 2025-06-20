// Countdown Timer Block View Script
document.addEventListener('DOMContentLoaded', function () {
    const countdownTimers = document.querySelectorAll('.wp-block-milliondollartheme-countdown-timer');

    countdownTimers.forEach(timerBlock => {
        const eventDateTimeStr = timerBlock.dataset.eventDatetime;
        if (!eventDateTimeStr) {
            // console.log('Countdown timer: eventDateTime not set for block:', timerBlock);
            return;
        }

        const eventTime = new Date(eventDateTimeStr).getTime();
        if (isNaN(eventTime)) {
            // console.log('Countdown timer: Invalid eventDateTime:', eventDateTimeStr);
            return;
        }

        const dynamicWrapper = timerBlock.querySelector('.countdown-timer-dynamic-wrapper');
        const expiredMessagePlaceholder = timerBlock.querySelector('.countdown-expired-message-placeholder');
        const hideWhenExpired = timerBlock.dataset.hideWhenExpired === 'true';

        const daysNumEl = dynamicWrapper ? dynamicWrapper.querySelector('[data-unit="days"] .countdown-number') : null;
        const hoursNumEl = dynamicWrapper ? dynamicWrapper.querySelector('[data-unit="hours"] .countdown-number') : null;
        const minutesNumEl = dynamicWrapper ? dynamicWrapper.querySelector('[data-unit="minutes"] .countdown-number') : null;
        const secondsNumEl = dynamicWrapper ? dynamicWrapper.querySelector('[data-unit="seconds"] .countdown-number') : null;

        const showDays = timerBlock.dataset.showDays === 'true';
        const showHours = timerBlock.dataset.showHours === 'true';
        const showMinutes = timerBlock.dataset.showMinutes === 'true';
        const showSeconds = timerBlock.dataset.showSeconds === 'true';

        function updateTimer() {
            const now = new Date().getTime();
            const distance = eventTime - now;

            if (distance < 0) {
                clearInterval(interval);
                if (hideWhenExpired) {
                    timerBlock.style.display = 'none';
                } else {
                    if (dynamicWrapper) dynamicWrapper.style.display = 'none';
                    if (expiredMessagePlaceholder) {
                        expiredMessagePlaceholder.style.display = 'block';
                    }
                }
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (showDays && daysNumEl) daysNumEl.textContent = String(days).padStart(2, '0');
            if (showHours && hoursNumEl) hoursNumEl.textContent = String(hours).padStart(2, '0');
            if (showMinutes && minutesNumEl) minutesNumEl.textContent = String(minutes).padStart(2, '0');
            if (showSeconds && secondsNumEl) secondsNumEl.textContent = String(seconds).padStart(2, '0');
        }

        if (!dynamicWrapper) { // If the dynamic wrapper is missing, don't proceed
            // console.log('Countdown timer: dynamicWrapper not found for block:', timerBlock);
            return;
        }

        const interval = setInterval(updateTimer, 1000);
        updateTimer(); // Initial call
    });
});
