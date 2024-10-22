// js/ui.js

/**
 * Creates a card element for a single Pokémon
 * @param {Object} pokemon - Pokemon data object
 * @returns {HTMLElement} - Pokemon card element
 */
export function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.dataset.id = pokemon.id;