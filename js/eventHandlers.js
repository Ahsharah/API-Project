// js/eventHandlers.js

import * as api from './api.js';
import * as ui from './ui.js';

/**
 * Application state management
 * Keeps track of current pagination, filters, and search state
 */
const state = {
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0,
    currentType: '',
    searchTerm: '',
    isLoading: false
};
/**
 * Handles the search functionality
 * @param {string} searchTerm - Term to search for
 */
async function handleSearch(searchTerm) {
    try {
        if (searchTerm.length < 2) {
            await loadPokemonPage(1); // Reset to first page if search is cleared
            return;
        }

        ui.showLoading();
        ui.hideError();
        
        state.searchTerm = searchTerm;
        const results = await api.searchPokemon(searchTerm);
        
        if (results.length === 0) {
            ui.showError('No Pokémon found matching your search.');
        } else {
            ui.renderPokemonGrid(results);
        }
    } catch (error) {
        ui.showError('Error performing search. Please try again.');
        console.error('Search error:', error);
    } finally {
        ui.hideLoading();
    }
}