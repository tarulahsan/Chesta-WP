// Alert/Notification Block View Script
// This script might not be strictly necessary if Alpine.js is globally available
// and the x-data, x-show directives in the save() output are sufficient.
// It could be used for more complex dismiss logic or if Alpine needs explicit initialization per block.

document.addEventListener('alpine:init', () => {
    // Example: If you needed to register a specific Alpine component for alerts
    // Alpine.data('customAlert', () => ({
    //     open: true,
    //     // ... other properties or methods
    // }));
});

// console.log('Alert/Notification view.js loaded.');
