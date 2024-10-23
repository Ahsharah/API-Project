// js/main.js

import * as api from './api.js';
import * as ui from './ui.js';
import { setupEventListeners, loadPokemonPage } from './eventHandlers.js';


/**
 * Initializes the application
 * Sets up event listeners and loads initial data
 */
async function initializeApp() {
    try {
        ui.showLoading();
        
        // Set up all event listeners
        setupEventListeners();
        
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