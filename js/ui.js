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
     // Capitalize the first letter of the name
     const displayName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    
     card.innerHTML = `
         <img 
             src="${pokemon.sprites.front}" 
             alt="${displayName}"
             loading="lazy"
         >
         <h3>${displayName}</h3>
         <div class="pokemon-types">
             ${pokemon.types.map(type => 
                 `<span class="type-badge ${type}">${type}</span>`
             ).join('')}
         </div>
     `;
     
     return card;
 }
 