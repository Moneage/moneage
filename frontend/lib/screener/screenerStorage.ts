import { v4 as uuidv4 } from 'uuid';
import { SavedScreen, FilterCriteria } from './types';

const STORAGE_KEY = 'moneage_saved_screens';

/**
 * Get all saved screens
 */
export function getSavedScreens(): SavedScreen[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        return JSON.parse(stored) as SavedScreen[];
    } catch (error) {
        console.error('Error reading saved screens:', error);
        return [];
    }
}

/**
 * Save a new screen
 */
export function saveScreen(name: string, filters: FilterCriteria): SavedScreen {
    const screens = getSavedScreens();

    const newScreen: SavedScreen = {
        id: uuidv4(),
        name,
        filters,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
    };

    screens.push(newScreen);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(screens));

    return newScreen;
}

/**
 * Load a screen by ID
 */
export function loadScreen(id: string): SavedScreen | null {
    const screens = getSavedScreens();
    const screen = screens.find((s) => s.id === id);

    if (screen) {
        // Update last used timestamp
        screen.lastUsed = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(screens));
    }

    return screen || null;
}

/**
 * Delete a screen
 */
export function deleteScreen(id: string): void {
    const screens = getSavedScreens();
    const filtered = screens.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Rename a screen
 */
export function renameScreen(id: string, newName: string): void {
    const screens = getSavedScreens();
    const screen = screens.find((s) => s.id === id);

    if (screen) {
        screen.name = newName;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(screens));
    }
}

/**
 * Update a screen's filters
 */
export function updateScreen(id: string, filters: FilterCriteria): void {
    const screens = getSavedScreens();
    const screen = screens.find((s) => s.id === id);

    if (screen) {
        screen.filters = filters;
        screen.lastUsed = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(screens));
    }
}

/**
 * Clear all saved screens
 */
export function clearAllScreens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}
