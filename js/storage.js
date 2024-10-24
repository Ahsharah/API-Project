// js/storage.js

/**
 * Storage keys for localStorage
 */
const STORAGE_KEYS = {
    FAVORITES: 'pokemon_favorites',
    COMPARE_LIST: 'pokemon_compare',
    SETTINGS: 'pokemon_settings'
};

/**
 * Default application settings
 */
const DEFAULT_SETTINGS = {
    itemsPerPage: 20,
    sortOrder: 'id',
    theme: 'light',
    preferredType: null
};

/**
 * Get items from localStorage
 * @param {string} key - Storage key
 * @returns {Array} Stored items or empty array
 */
function getStoredItems(key) {
    try {
        const items = localStorage.getItem(key);
        return items ? JSON.parse(items) : [];
    } catch (error) {
        console.error(`Error reading from localStorage (${key}):`, error);
        return [];
    }
}

/**
 * Save items to localStorage
 * @param {string} key - Storage key
 * @param {Array} items - Items to store
 */
function saveItems(key, items) {
    try {
        localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
        console.error(`Error writing to localStorage (${key}):`, error);
    }
}

/**
 * Get favorite Pokemon
 * @returns {Set} Set of favorite Pokemon IDs
 */
export function getFavorites() {
    return new Set(getStoredItems(STORAGE_KEYS.FAVORITES));
}

/**
 * Toggle Pokemon favorite status
 * @param {string} id - Pokemon ID
 * @returns {boolean} New favorite status
 */
export function toggleFavorite(id) {
    const favorites = getFavorites();
    const newStatus = !favorites.has(id);
    
    if (newStatus) {
        favorites.add(id);
    } else {
        favorites.delete(id);
    }
    
    saveItems(STORAGE_KEYS.FAVORITES, Array.from(favorites));
    return newStatus;
}

/**
 * Get Pokemon comparison list
 * @returns {Set} Set of Pokemon IDs to compare
 */
export function getCompareList() {
    return new Set(getStoredItems(STORAGE_KEYS.COMPARE_LIST));
}

/**
 * Toggle Pokemon comparison status
 * @param {string} id - Pokemon ID
 * @returns {Object} Status object with success and message
 */
export function toggleCompare(id) {
    const compareList = getCompareList();
    const isAdding = !compareList.has(id);
    
    if (isAdding && compareList.size >= 3) {
        return {
            success: false,
            message: 'Can only compare up to 3 Pokemon at once.'
        };
    }
    
    if (isAdding) {
        compareList.add(id);
    } else {
        compareList.delete(id);
    }
    
    saveItems(STORAGE_KEYS.COMPARE_LIST, Array.from(compareList));
    return {
        success: true,
        message: isAdding ? 'Added to comparison' : 'Removed from comparison'
    };
}

/**
 * Get user settings
 * @returns {Object} User settings with defaults
 */
export function getSettings() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch (error) {
        console.error('Error reading settings:', error);
        return DEFAULT_SETTINGS;
    }
}

/**
 * Save user settings
 * @param {Object} newSettings - Settings to save
 */
export function saveSettings(newSettings) {
    try {
        const currentSettings = getSettings();
        const updatedSettings = { ...currentSettings, ...newSettings };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

// Export default object for convenient importing
export default {
    getFavorites,
    toggleFavorite,
    getCompareList,
    toggleCompare,
    getSettings,
    saveSettings
};