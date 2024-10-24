// js/ui.js

import { getFavorites, getCompareList } from './storage.js';

/**
 * Type color mapping for Pokemon type badges
 */
const TYPE_COLORS = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
};

/**
 * Creates a Pokemon card element
 * @param {Object} pokemon - Pokemon data
 * @param {boolean} isFavorite - Whether Pokemon is favorited
 * @param {boolean} isCompared - Whether Pokemon is in compare list
 * @returns {HTMLElement} Pokemon card element
 */
export function createPokemonCard(pokemon, isFavorite = false, isCompared = false) {
    const card = document.createElement('div');
    card.className = 'pokemon-card slide-in';
    card.dataset.id = pokemon.id;

    const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    
    card.innerHTML = `
        <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
            ♥
        </button>
        <button class="compare-btn ${isCompared ? 'active' : ''}"
                aria-label="${isCompared ? 'Remove from comparison' : 'Add to comparison'}">
            ⚖
        </button>
        <img src="${pokemon.sprites.official || pokemon.sprites.front}" 
             alt="${name}"
             loading="lazy"
             onerror="this.src='${pokemon.sprites.front}'">
        <h3>${name}</h3>
        <div class="pokemon-number">#${String(pokemon.id).padStart(3, '0')}</div>
        <div class="type-container">
            ${pokemon.types.map(type => createTypeBadge(type)).join('')}
        </div>
        <button class="details-btn" aria-label="View details">View Details</button>
    `;

    // Add hover animation for the image
    const img = card.querySelector('img');
    img.addEventListener('mouseenter', () => {
        if (pokemon.sprites.back) {
            img.src = pokemon.sprites.back;
        }
    });
    img.addEventListener('mouseleave', () => {
        img.src = pokemon.sprites.official || pokemon.sprites.front;
    });

    return card;
}

/**
 * Creates a type badge element
 * @param {string} type - Pokemon type
 * @returns {string} HTML string for type badge
 */
function createTypeBadge(type) {
    return `
        <span class="type-badge" 
              style="background-color: ${TYPE_COLORS[type] || '#777'}"
              title="Type: ${type}">
            ${type}
        </span>
    `;
}

/**
 * Renders Pokemon grid
 * @param {Array} pokemonList - List of Pokemon to render
 */
export function renderPokemonGrid(pokemonList) {
    const grid = document.getElementById('pokemonGrid');
    const favorites = getFavorites();
    const compareList = getCompareList();
    
    grid.innerHTML = '';
    
    pokemonList.forEach(pokemon => {
        const card = createPokemonCard(
            pokemon,
            favorites.has(pokemon.id.toString()),
            compareList.has(pokemon.id.toString())
        );
        grid.appendChild(card);
    });
}

/**
 * Shows Pokemon details in modal
 * @param {Object} pokemon - Pokemon data
 */
export function showPokemonModal(pokemon) {
    const modal = document.getElementById('pokemonModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
        <div class="pokemon-detail fade-in">
            <img src="${pokemon.sprites.official || pokemon.sprites.front}" 
                 alt="${pokemon.name}"
                 class="detail-image">
            <h2>${pokemon.name.toUpperCase()}</h2>
            
            <div class="type-container">
                ${pokemon.types.map(type => createTypeBadge(type)).join('')}
            </div>
            
            <p class="pokemon-description">${pokemon.description}</p>
            
            <div class="pokemon-attributes">
                <div class="attribute">
                    <span>Height:</span> ${pokemon.height}m
                </div>
                <div class="attribute">
                    <span>Weight:</span> ${pokemon.weight}kg
                </div>
                <div class="attribute">
                    <span>Base XP:</span> ${pokemon.baseExperience}
                </div>
            </div>

            <div class="pokemon-stats">
                <h3>Base Stats</h3>
                ${pokemon.stats.map(stat => createStatBar(stat)).join('')}
            </div>

            <div class="pokemon-abilities">
                <h3>Abilities</h3>
                <p>${pokemon.abilities.map(ability => 
                    ability.charAt(0).toUpperCase() + ability.slice(1)
                ).join(', ')}</p>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('active');
}

/**
 * Creates a stat bar element
 * @param {Object} stat - Stat data
 * @returns {string} HTML string for stat bar
 */
function createStatBar(stat) {
    const percentage = (stat.value / 255) * 100; // 255 is max possible stat
    return `
        <div class="stat-row">
            <span class="stat-name">${stat.name}</span>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${percentage}%"></div>
            </div>
            <span class="stat-value">${stat.value}</span>
        </div>
    `;
}

/**
 * Updates the favorite and compare counters
 */
export function updateCounters() {
    const favCount = document.getElementById('favCount');
    const compareCount = document.getElementById('compareCount');
    const compareButton = document.getElementById('compareButton');
    
    const favorites = getFavorites();
    const compareList = getCompareList();
    
    favCount.textContent = favorites.size;
    compareCount.textContent = compareList.size;
    compareButton.disabled = compareList.size < 2;
}

/**
 * Shows loading spinner
 */
export function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

/**
 * Hides loading spinner
 */
export function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

/**
 * Shows error message
 * @param {string} message - Error message to display
 */
export function showError(message) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

/**
 * Hides error message
 *ii/
export function hideError() {
    document.getElementById('error').classList.add('hidden');
}

/**
 * Updates pagination display
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 */
export function updatePagination(currentPage, totalPages) {
    document.getElementById('currentPage').textContent = `${currentPage} / ${totalPages}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;i