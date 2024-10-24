/**
 * storage.js - Handles local storage operations for Pokemon favorites and compare list
 */

/**
 * Get set of favorite Pokemon IDs from local storage
 * @returns {Set<string>} Set of favorite Pokemon IDs
 */
export function getFavorites() {
    try {
        const favorites = JSON.parse(localStorage.getItem('pokemonFavorites')) || [];
        return new Set(favorites);
    } catch (error) {
        console.error('Error getting favorites:', error);
        return new Set();
    }
}