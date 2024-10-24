// js/eventHandlers.js

import * as api from './api.js';
import * as ui from './ui.js';
import * as storage from './storage.js';

/**
 * Application state management
 */
const state = {
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0,
    currentType: '',
    searchTerm: '',
    sortOrder: 'id',
    isLoading: false,
    currentView: 'all' // 'all' or 'favorites'
};

/**
 * Debounce function for search optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Handles Pokemon search
 * @param {string} searchTerm - Search query
 */
async function handleSearch(searchTerm) {
    try {
        if (state.isLoading) return;
        state.isLoading = true;
        
        ui.showLoading();
        ui.hideError();
        
        state.searchTerm = searchTerm.trim();
        
        if (searchTerm.length < 2) {
            await loadPokemonPage(1);
            return;
        }

        const results = await api.searchPokemon(searchTerm);
        const sortedResults = sortPokemonList(results);
        
        if (sortedResults.length === 0) {
            ui.showError('No Pokémon found matching your search.');
        } else {
            ui.renderPokemonGrid(sortedResults);
        }
    } catch (error) {
        ui.showError('Error performing search. Please try again.');
        console.error('Search error:', error);
    } finally {
        state.isLoading = false;
        ui.hideLoading();
    }
}

/**
 * Sorts Pokemon list based on current sort order
 * @param {Array} pokemonList - List to sort
 * @returns {Array} Sorted Pokemon list
 */
function sortPokemonList(pokemonList) {
    return [...pokemonList].sort((a, b) => {
        switch (state.sortOrder) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'height':
                return b.height - a.height;
            case 'weight':
                return b.weight - a.weight;
            default: // 'id'
                return a.id - b.id;
        }
    });
}

/**
 * Handles type filter changes
 * @param {string} type - Pokemon type
 */
async function handleTypeFilter(type) {
    try {
        if (state.isLoading) return;
        state.isLoading = true;
        
        ui.showLoading();
        ui.hideError();
        
        state.currentType = type;
        state.currentPage = 1;
        
        if (!type) {
            await loadPokemonPage(1);
            return;
        }

        const pokemonList = await api.filterByType(type);
        const sortedList = sortPokemonList(pokemonList);
        
        if (sortedList.length === 0) {
            ui.showError('No Pokémon found of this type.');
        } else {
            ui.renderPokemonGrid(sortedList);
            updatePaginationState(sortedList.length);
        }
    } catch (error) {
        ui.showError('Error applying filter. Please try again.');
        console.error('Filter error:', error);
    } finally {
        state.isLoading = false;
        ui.hideLoading();
    }
}

/**
 * Loads Pokemon page
 * @param {number} page - Page number to load
 */
async function loadPokemonPage(page) {
    try {
        if (state.isLoading) return;
        state.isLoading = true;
        
        ui.showLoading();
        ui.hideError();
        
        const offset = (page - 1) * state.itemsPerPage;
        const { pokemon, count } = await api.getPokemonList(offset, state.itemsPerPage);
        
        state.totalItems = count;
        state.currentPage = page;
        
        const sortedPokemon = sortPokemonList(pokemon);
        ui.renderPokemonGrid(sortedPokemon);
        updatePaginationState(count);
    } catch (error) {
        ui.showError('Error loading Pokémon. Please try again.');
        console.error('Page loading error:', error);
    } finally {
        state.isLoading = false;
        ui.hideLoading();
    }
}

/**
 * Updates pagination state and UI
 * @param {number} totalItems - Total number of items
 */
function updatePaginationState(totalItems) {
    const totalPages = Math.ceil(totalItems / state.itemsPerPage);
    ui.updatePagination(state.currentPage, totalPages);
}

/**
 * Handles Pokemon card click
 * @param {Event} event - Click event
 */
async function handleCardClick(event) {
    const card = event.target.closest('.pokemon-card');
    if (!card) return;

    // Handle favorite button click
    if (event.target.matches('.favorite-btn')) {
        const newStatus = storage.toggleFavorite(card.dataset.id);
        event.target.classList.toggle('active', newStatus);
        ui.updateCounters();
        return;
    }

    // Handle compare button click
    if (event.target.matches('.compare-btn')) {
        const result = storage.toggleCompare(card.dataset.id);
        if (result.success) {
            event.target.classList.toggle('active');
            ui.updateCounters();
        } else {
            ui.showError(result.message);
        }
        return;
    }

    // Handle details button click
    if (event.target.matches('.details-btn')) {
        try {
            ui.showLoading();
            const pokemon = await api.getPokemonDetails(card.dataset.id);
            ui.showPokemonModal(pokemon);
        } catch (error) {
            ui.showError('Error loading Pokémon details.');
            console.error('Detail error:', error);
        } finally {
            ui.hideLoading();
        }
    }
}

/**
 * Handles compare button click
 */
async function handleCompare() {
    try {
        const compareList = storage.getCompareList();
        if (compareList.size < 2) {
            ui.showError('Select at least 2 Pokémon to compare.');
            return;
        }

        ui.showLoading();
        const pokemonPromises = Array.from(compareList).map(id => 
            api.getPokemonDetails(id)
        );
        const pokemonList = await Promise.all(pokemonPromises);
        ui.showCompareModal(pokemonList);
    } catch (error) {
        ui.showError('Error loading comparison.');
        console.error('Compare error:', error);
    } finally {
        ui.hideLoading();
    }
}

/**
 * Handles sort order changes
 * @param {string} order - Sort order
 */
function handleSort(order) {
    state.sortOrder = order;
    const grid = document.getElementById('pokemonGrid');
    const pokemon = Array.from(grid.children)
        .map(card => ({
            element: card,
            id: parseInt(card.dataset.id),
            name: card.querySelector('h3').textContent
        }));
    
    const sortedPokemon = sortPokemonList(pokemon);
    grid.innerHTML = '';
    sortedPokemon.forEach(p => grid.appendChild(p.element));
}

/**
 * Sets up all event listeners
 */
export function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const debouncedSearch = debounce(handleSearch, 300);
    
    searchInput.addEventListener('input', e => debouncedSearch(e.target.value));
    searchButton.addEventListener('click', () => handleSearch(searchInput.value));

    // Filters and Sorting
    document.getElementById('typeFilter')
        .addEventListener('change', e => handleTypeFilter(e.target.value));
    document.getElementById('sortSelect')
        .addEventListener('change', e => handleSort(e.target.value));

    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => {
        if (state.currentPage > 1) loadPokemonPage(state.currentPage - 1);
    });
    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);
        if (state.currentPage < totalPages) loadPokemonPage(state.currentPage + 1);
    });

    // Pokemon Grid Interactions
    document.getElementById('pokemonGrid')
        .addEventListener('click', handleCardClick);

    // Compare Button
    document.getElementById('compareButton')
        .addEventListener('click', handleCompare);

    // Modal Close Buttons
    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').classList.add('hidden');
        });
    });

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    });

    // Favorites Toggle
    document.getElementById('toggleFavorites').addEventListener('click', async () => {
        const button = document.getElementById('toggleFavorites');
        state.currentView = state.currentView === 'all' ? 'favorites' : 'all';
        button.classList.toggle('active', state.currentView === 'favorites');
        
        if (state.currentView === 'favorites') {
            const favorites = storage.getFavorites();
            const pokemonPromises = Array.from(favorites).map(id => 
                api.getPokemonDetails(id)
            );
            const pokemonList = await Promise.all(pokemonPromises);
            ui.renderPokemonGrid(sortPokemonList(pokemonList));
        } else {
            await loadPokemonPage(1);
        }
    });
}

// Export necessary functions
export { loadPokemonPage, handleSearch, handleTypeFilter };