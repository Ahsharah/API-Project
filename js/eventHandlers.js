// js/eventHandlers.js

import * as api from './api.js';
import * as ui from './ui.js';

/**
 * Application state management
 * Keeps track of current pagination, filters, and search state
 */
const state = {
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0,
    currentType: '',
    searchTerm: '',
    isLoading: false
};
