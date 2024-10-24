# API-Project - PokéAPI Explorer

A modern, interactive web application for exploring basic Pokémon data using the PokéAPI. This project demonstrates the use of modern JavaScript features, including modules, async/await, and the Fetch API.

## Features

- **Search Functionality**: Search for Pokémon by name or ID
- **Advanced Filtering**: Filter Pokémon by type
- **Sorting Options**: Sort Pokémon by:
  - ID (Pokédex number)
  - Name (A-Z or Z-A)
  - Height
  - Weight
- **Favorites System**: 
  - Save your favorite Pokémon
  - Quick access to favorited Pokémon
  - Persistent storage using localStorage
- **Comparison Feature**:
  - Compare up to 3 Pokémon side by side
  - Compare stats, types, and abilities
- **Detailed Information**:
  - Official artwork
  - Base stats
  - Type information
  - Abilities
  - Physical characteristics
  - Species information
- **Responsive Design**:
  - Works on desktop and mobile devices
  - Adaptive layout for different screen sizes

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- [PokeAPI](https://pokeapi.co/)
- Local Storage API
- Fetch API

## Project Structure

```
project-folder/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── api.js
│   ├── ui.js
│   ├── storage.js
│   └── eventHandlers.js
└── README.md
```

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/Ahsharah/API-Project
```

2. Navigate to the project directory:
```bash
cd pokemon-api-explorer
```

3. Open with a live server:
   - Using VS Code: Install "Live Server" extension and click "Go Live"
   - Using Node.js: `npx http-server`

4. Access the application in your browser:
   - Default URL: `http://localhost:5500` or `http://localhost:8000`

## Usage

1. **Search**: 
   - Use the search bar to find Pokémon by name
   - Results update as you type

2. **Filtering**:
   - Use the type dropdown to filter Pokémon by type
   - Clear filter by selecting "All Types"

3. **Sorting**:
   - Use the sort dropdown to change the display order
   - Multiple sorting options available

4. **Favorites**:
   - Click the heart icon on any Pokémon card to favorite
   - View favorites by clicking the "Favorites" button
   - Favorites persist across sessions

5. **Comparison**:
   - Select up to 3 Pokémon using the compare button on cards
   - Click "Compare Selected" to see detailed comparison

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- Images are lazy loaded
- Pagination to limit data loading
- Caching of frequently accessed data

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## Known Issues

- Some sprite images might not be available for all Pokémon
- Evolution chain data requires additional API calls
- API rate limiting may affect load times

## Future Enhancements

- [ ] Add evolution chain visualization
- [ ] Implement advanced search filters
- [ ] Add move list and damage calculations
- [ ] Include shiny sprites
- [ ] Add team builder functionality

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- [PokeAPI](https://pokeapi.co/) for providing the Pokémon data
- The Pokémon Company for the original content
- Contributors and maintainers of the project

## Author

Alexandria Walker
Created for Per Scholas

## Contact

- GitHub: Ahsharah

## Project Status

Active development - Last updated: October 2024