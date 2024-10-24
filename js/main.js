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