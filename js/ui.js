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

