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
/**
 * Shows detailed information for a selected Pokemon
 * @param {string} pokemonId - ID of the selected Pokemon
 */
async function showPokemonDetails(pokemonId) {
    try {
        ui.showLoading();
        const pokemon = await api.getPokemonDetails(pokemonId);
        ui.showPokemonModal(pokemon);
    } catch (error) {
        ui.showError('Error loading Pokémon details. Please try again.');
        console.error('Detail loading error:', error);
    } finally {
        ui.hideLoading();
    }
}
/**
 * Sets up all event listeners for the application
 */
export function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    // Debounce search for better performance
    const debouncedSearch = debounce((term) => handleSearch(term), 300);
    
    searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));
    searchButton.addEventListener('click', () => handleSearch(searchInput.value));
// Type filter
const typeFilter = document.getElementById('typeFilter');
typeFilter.addEventListener('change', (e) => handleTypeFilter(e.target.value));

// Pagination
const prevButton = document.getElementById('prevPage');
const nextButton = document.getElementById('nextPage');

prevButton.addEventListener('click', () => {
    if (state.currentPage > 1) {
        loadPokemonPage(state.currentPage - 1);
    }
});