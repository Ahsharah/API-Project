// js/api.js

/**
 * Base URL for the PokeAPI
 * Using the v2 endpoint which is the most stable version I can find.
 */
const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Default limit
 * PokeAPI allows up to 100 items per request
 */
const DEFAULT_LIMIT = 20;
/**
 * Fetches a paginated list of Pokémon
 * @param {number} offset - Number of items to skip for pagination
 * @param {number} limit - Number of items to fetch per page
 * @returns {Promise<Object>} - Object containing pokemon list and count
 * @throws {Error} - If the fetch fails or returns non-OK status
 */
export async function getPokemonList(offset = 0, limit = DEFAULT_LIMIT) {
    try {
        const response = await fetch(
            `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Fetch detailed data for each Pokémon
        const pokemonDetails = await Promise.all(
            data.results.map(pokemon => getPokemonDetails(pokemon.name))
        );
        
        return {
            pokemon: pokemonDetails,
            count: data.count
        };
    } catch (error) {
        console.error('Error fetching Pokemon list:', error);
        throw error;
    }
}

