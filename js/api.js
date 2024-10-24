// js/api.js

/**
 * Base configuration for API requests
 */
const API_CONFIG = {
    BASE_URL: 'https://pokeapi.co/api/v2',
    ENDPOINTS: {
        POKEMON_LIST: '/pokemon',
        POKEMON_DETAIL: '/pokemon/',  // e.g., /pokemon/ditto
        POKEMON_TYPES: '/type',
        POKEMON_SPECIES: '/pokemon-species/'
    },
    DEFAULT_LIMIT: 20,
    MAX_POKEMON: 898 // Limit to original Pokemon for better performance
};

/**
 * Generic fetch function with error handling
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
async function fetchWithError(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Fetch error: ${error.message}`);
        throw error;
    }
}

/**
 * Fetches paginated list of Pokemon
 * @param {number} offset - Starting index
 * @param {number} limit - Number of items to fetch
 * @returns {Promise<Object>} Pokemon list and count
 */
export async function getPokemonList(offset = 0, limit = API_CONFIG.DEFAULT_LIMIT) {
    try {
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON_LIST}?offset=${offset}&limit=${limit}`;
        const data = await fetchWithError(url);
        
        // Fetch detailed data for each Pokemon
        const detailedPokemon = await Promise.all(
            data.results.map(pokemon => getPokemonDetails(pokemon.name))
        );

        return {
            pokemon: detailedPokemon,
            count: Math.min(data.count, API_CONFIG.MAX_POKEMON)
        };
    } catch (error) {
        console.error('Error fetching Pokemon list:', error);
        throw error;
    }
}

/**
 * Fetches detailed Pokemon information by name or ID
 * @param {string|number} nameOrId - Pokemon name or ID
 * @returns {Promise<Object>} Detailed Pokemon data
 */
export async function getPokemonDetails(nameOrId) {
    try {
        // Fetch basic Pokemon data
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON_DETAIL}${nameOrId.toString().toLowerCase()}`;
        const data = await fetchWithError(url);
        
        // Fetch species data for additional details
        const speciesData = await fetchWithError(data.species.url);

        // Format and return the combined data
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
            height: data.height / 10, // Convert to meters
            weight: data.weight / 10, // Convert to kilograms
            abilities: data.abilities.map(ability => ({
                name: ability.ability.name,
                isHidden: ability.is_hidden
            })),
            baseExperience: data.base_experience,
            description: speciesData.flavor_text_entries.find(
                entry => entry.language.name === 'en'
            )?.flavor_text.replace(/\f/g, ' ') || 'No description available.',
            genus: speciesData.genera.find(
                genus => genus.language.name === 'en'
            )?.genus || '',
            generation: speciesData.generation.name,
            habitat: speciesData.habitat?.name || 'Unknown',
            isLegendary: speciesData.is_legendary,
            isMythical: speciesData.is_mythical,
            evolutionChainUrl: speciesData.evolution_chain.url
        };
    } catch (error) {
        console.error(`Error fetching details for ${nameOrId}:`, error);
        throw error;
    }
}

/**
 * Fetches Pokemon evolution chain
 * @param {string} evolutionChainUrl - Evolution chain URL
 * @returns {Promise<Array>} Evolution chain data
 */
export async function getEvolutionChain(evolutionChainUrl) {
    try {
        const data = await fetchWithError(evolutionChainUrl);
        return processEvolutionChain(data.chain);
    } catch (error) {
        console.error('Error fetching evolution chain:', error);
        throw error;
    }
}

/**
 * Processes evolution chain data recursively
 * @param {Object} chain - Evolution chain object
 * @returns {Array} Processed evolution data
 */
function processEvolutionChain(chain) {
    const evolutions = [];
    
    function processChain(currentChain, level = 0) {
        evolutions.push({
            name: currentChain.species.name,
            level: level,
            min_level: currentChain.evolution_details[0]?.min_level,
            trigger: currentChain.evolution_details[0]?.trigger?.name,
            item: currentChain.evolution_details[0]?.item?.name
        });

        currentChain.evolves_to.forEach(evolution => {
            processChain(evolution, level + 1);
        });
    }

    processChain(chain);
    return evolutions;
}

/**
 * Fetches all Pokemon types
 * @returns {Promise<Array>} List of Pokemon types
 */
export async function getPokemonTypes() {
    try {
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON_TYPES}`;
        const data = await fetchWithError(url);
        return data.results.map(type => type.name);
    } catch (error) {
        console.error('Error fetching Pokemon types:', error);
        throw error;
    }
}

/**
 * Searches for Pokemon by name or ID
 * @param {string} searchTerm - Search query
 * @returns {Promise<Array>} Matching Pokemon list
 */
export async function searchPokemon(searchTerm) {
    try {
        // Get a larger list for searching
        const { pokemon } = await getPokemonList(0, 100);
        const searchLower = searchTerm.toLowerCase();
        
        return pokemon.filter(p => 
            p.name.toLowerCase().includes(searchLower) ||
            p.id.toString() === searchTerm
        );
    } catch (error) {
        console.error('Error searching Pokemon:', error);
        throw error;
    }
}

/**
 * Fetches Pokemon filtered by type
 * @param {string} type - Pokemon type
 * @returns {Promise<Array>} Filtered Pokemon list
 */
export async function filterByType(type) {
    try {
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON_TYPES}/${type}`;
        const data = await fetchWithError(url);
        
        const pokemonPromises = data.pokemon
            .slice(0, API_CONFIG.DEFAULT_LIMIT)
            .map(p => getPokemonDetails(p.pokemon.name));
            
        return await Promise.all(pokemonPromises);
    } catch (error) {
        console.error(`Error filtering Pokemon by type ${type}:`, error);
        throw error;
    }
}

export default {
    getPokemonList,
    getPokemonDetails,
    getPokemonTypes,
    searchPokemon,
    filterByType,
    getEvolutionChain
};