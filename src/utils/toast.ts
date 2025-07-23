type ToastType = 'success' | 'error' | 'warning' | 'info';

export const showToast = (message: string, type: ToastType = 'info') => {
    // Simple implementation - you can replace with a more advanced toast library
    // like react-hot-toast or react-toastify if preferred

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transform transition-all duration-300 ease-in-out translate-x-full opacity-0`;

    // Add type-specific styling
    switch (type) {
        case 'success':
            toast.className += ' bg-green-500';
            break;
        case 'error':
            toast.className += ' bg-red-500';
            break;
        case 'warning':
            toast.className += ' bg-yellow-500';
            break;
        default:
            toast.className += ' bg-blue-500';
    }

    toast.textContent = message;
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => {
        toast.className = toast.className.replace('translate-x-full opacity-0', 'translate-x-0 opacity-100');
    }, 100);

    // Hide and remove toast after 3 seconds
    setTimeout(() => {
        toast.className = toast.className.replace('translate-x-0 opacity-100', 'translate-x-full opacity-0');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
};
