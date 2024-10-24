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
}/**
 * Get set of Pokemon IDs in compare list from local storage
 * @returns {Set<string>} Set of Pokemon IDs in compare list
 */
export function getCompareList() {
    try {
        const compareList = JSON.parse(localStorage.getItem('pokemonCompareList')) || [];
        return new Set(compareList);
    } catch (error) {
        console.error('Error getting compare list:', error);
        return new Set();
    }
}