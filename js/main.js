// js/main.js

import * as api from './api.js';
import * as ui from './ui.js';
import * as storage from './storage.js';
import { setupEventListeners, loadPokemonPage } from './eventHandlers.js';

/**
 * Application initialization state
 */
const initState = {
    initialized: false,
    retryCount: 0,
    maxRetries: 3
};

/**
 * Initializes the application
 * Sets up event listeners and loads initial data
 */
async function initializeApp() {
    try {
        if (initState.initialized) return;

        // Show loading state
        ui.showLoading();
        
        // Set up all event listeners
        setupEventListeners();
        
        // Initialize components in parallel
        await Promise.all([
            initializeTypes(),
            initializeFirstPage(),
            initializeCounters()
        ]);

        // Mark as initialized
        initState.initialized = true;

        // Apply any stored settings
        applyStoredSettings();
    } catch (error) {
        handleInitializationError(error);
    } finally {
        ui.hideLoading();
    }
}

/**
 * Initializes Pokemon types for the filter
 */
async function initializeTypes() {
    try {
        await loadPokemonPage(1);
    } catch (error) {
        throw new Error('Failed to load initial Pokemon data: ' + error.message);
    }
}

/**
 * Initialize first page of Pokemon
 */
async function initializeFirstPage() {
    try {
        await loadPokemonPage(1);
    } catch (error) {
        throw new Error('Failed to load initial Pokemon data: ' + error.message);
    }
}

/**
 * Initializes favorite and compare counters
 */
function initializeCounters() {
    try {
        ui.updateCounters();
    } catch (error) {
        console.error('Failed to initialize counters:', error);
        // Don't fail initialization for counter failure
    }
}

/**
 * Applies any stored user settings
 */
function applyStoredSettings() {
    try {
        const settings = storage.getSettings();

        // Apply sort order
        if (settings.sortOrder) {
            const sortSelect = document.getElementById('sortSelect');
            if (sortSelect) sortSelect.value = settings.sortOrder;
        }

        // Apply prefeered type filter
        if (settings.preferredType) {
            const typeFilter = document.getElementById('typeFilter');
            if (typeFilter) typeFilter.value = settings.preferredType;
        }

    } catch (error) {
        console.error('Failed to apply stored settings:', error);
        // Don't fail initialization for settings failure
    }
}

/**
 * Handles initialization errors
 * @oaram {Error} error - The error that occured
 */
function handleInitializationError(error) {
    console.error('Initialization error:', error);

    if (initState.retryCount < initState.maxRetries) {
        initState.retryCount++;
        ui.showError(`Initialization failed. Retrying... (Attempt ${initState.retryCount}/${initState.maxRetries})`);

        // Retry initialization after a delay
        setTimeout(() => {
            initializeApp();
        }, 2000 * initState.retryCount); // Increasing delay with each retry
    } else {
        ui.showError(`Failed to initialize application after ${initState.maxRetries} attempts. Please refresh the page.`);
    }
}

/**
 * Sets up error handling for uncaught errors
 */
function setupErrorHandling() {
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        ui.showError('An unexpected error occurred. Please refresh the page.');
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        ui.showError('An unexpected error occurred. Please refresh the page.');
    });
}

/**
 * Sets up performance monitoring
 */
function setupPerformanceMonitoring() {
    if (window.performance && window.performance.mark) {
        window.performance.mark('app-init-start');

        // Track when the app becomes interactive
        Promise.resolve().then(() => {
            window.performance.mark('app-init-end');
            window.performance.measure('app-initialization', 'app-init-start', 'app-init-end');

            const measure = window.performance.getEntriesByName('app-initialization')[0];
            console.log(`App initialized in ${Math.round(measure.duration)}ms`);
        });
    }
}

/**
 * Checks browser compatibility
 * @returns {boolean} Whether browser is compatible
 */
function checkBrowserCompatibility() {
    const requirements = {
        localStorage: !!window.localStorage,
        modules: 'noModule' in document.createElement('script'),
        fetch: 'fetch' in window,
        promises: 'Promise' in window
    };

    const incompatible = Object.entries(requirements)
    .filter(([, supported]) => !supported)
    .map(([feature]) => feature);

    if (incompatible.length > 0) {
        ui.showError(`Your browser doesn't support: ${incompatible.join(', ')}. Please use a modern browser.`);
        return false;
    }

    return true;
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (checkBrowserCompatibility()) {
        setupErrorHandling();
        setupPerformanceMonitoring();
        initializeApp();
    }
});

// Export initialization function for potential manual initialization
export { initializeApp };

        // Load Pokemon types for filter
        const types = await api.getPokemonTypes();
        ui.updateTypeFilter(types);
        
        // Load first page of Pokemon
        await loadPokemonPage(1);
        
    } catch (error) {
        ui.showError('Error initializing application. Please refresh the page.');
        console.error('Initialization error:', error);
    } finally {
        ui.hideLoading();
    }
}
// Start the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle errors that occur during script loading
window.addEventListener('error', (event) => {
    ui.showError('An unexpected error occurred. Please refresh the page.');
    console.error('Global error:', event.error);
});