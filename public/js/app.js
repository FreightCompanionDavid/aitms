if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof tippy === 'function') {
        tippy('[data-tippy-content]', {
            allowHTML: true,
            interactive: true,
        });
    } else {
        console.error('Tippy.js is not loaded properly');
    }
});