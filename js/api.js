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

/**
 * Fetches detailed information about a specific Pokémon
 * @param {string} nameOrId - Name or ID of the Pokémon
 * @returns {Promise<Object>} - Detailed Pokémon data
 * @throws {Error} - If the fetch fails or returns non-OK status
 */
export async function getPokemonDetails(nameOrId) {
    try {
        const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Return only the data we need to reduce payload size
        return {
            id: data.id,
            name: data.name,
            types: data.types.map(type => type.type.name),
            sprites: {
                front: data.sprites.front_default,
                back: data.sprites.back_default,
                official: data.sprites.other['official-artwork'].front_default
            },
            stats: data.stats.map(stat => ({
                name: stat.stat.name,
                value: stat.base_stat
            })),
            height: data.height,
            weight: data.weight,
            abilities: data.abilities.map(ability => ability.ability.name)
        };
    } catch (error) {
        console.error(`Error fetching details for ${nameOrId}:`, error);
        throw error;
    }
}
/**
 * Searches for Pokémon by name
 * @param {string} searchTerm - The search term to query
 * @returns {Promise<Array>} - Array of matching Pokémon
 * @throws {Error} - If the fetch fails or returns non-OK status
 */
export async function searchPokemon(searchTerm) {
    try {
        // First get a large list of Pokémon to search through
        const { pokemon } = await getPokemonList(0, 100);
        
        // Filter pokemon based on search term
        return pokemon.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    } catch (error) {
        console.error('Error searching Pokemon:', error);
        throw error;
    }
}

/**
 * Fetches all available Pokémon types
 * @returns {Promise<Array>} - Array of Pokémon types
 * @throws {Error} - If the fetch fails or returns non-OK status
 */
export async function getPokemonTypes() {
    try {
        const response = await fetch(`${BASE_URL}/type`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.results.map(type => type.name);
    } catch (error) {
        console.error('Error fetching Pokemon types:', error);
        throw error;
    }
}

/**
 * Filters Pokémon by type
 * @param {string} type - The type to filter by
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array>} - Array of Pokémon of the specified type
 * @throws {Error} - If the fetch fails or returns non-OK status
 */
export async function filterByType(type, limit = DEFAULT_LIMIT) {
    try {
        const response = await fetch(`${BASE_URL}/type/${type}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Get details for the first 'limit' number of Pokémon
        const pokemonPromises = data.pokemon
            .slice(0, limit)
            .map(p => getPokemonDetails(p.pokemon.name));
            
        return await Promise.all(pokemonPromises);
    } catch (error) {
        console.error(`Error filtering Pokemon by type ${type}:`, error);
        throw error;
    }
}