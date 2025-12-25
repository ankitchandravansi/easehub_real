import { getAllPGs } from '../services/services';

// Cache configuration
const CACHE_KEY = 'easehub_pgs_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch PGs with retry logic, caching, and timeout handling
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} retryDelay - Delay between retries in ms
 * @returns {Promise<Array>} - Array of PG listings
 */
export const fetchPGsWithRetry = async (maxRetries = 3, retryDelay = 2000) => {
    // Try to get cached data first
    const cached = getCachedPGs();
    if (cached) {
        console.log('[PG Fetch] Using cached data');
        // Return cached data immediately, but fetch fresh data in background
        fetchFreshPGs(maxRetries, retryDelay).catch(() => {
            // Silent fail for background refresh
        });
        return cached;
    }

    // No cache, fetch fresh data
    return await fetchFreshPGs(maxRetries, retryDelay);
};

/**
 * Fetch fresh PG data with retry logic
 */
const fetchFreshPGs = async (maxRetries, retryDelay) => {
    let lastError = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            console.log(`[PG Fetch] Attempt ${attempt + 1}/${maxRetries}`);

            // Create AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await getAllPGs();
            clearTimeout(timeoutId);

            // Extract data from response
            let data = [];
            if (response.data && Array.isArray(response.data.data)) {
                data = response.data.data;
            } else if (response.data && Array.isArray(response.data.pgs)) {
                data = response.data.pgs;
            } else if (Array.isArray(response.data)) {
                data = response.data;
            }

            console.log(`[PG Fetch] Success: Loaded ${data.length} PGs`);

            // Cache the successful response
            cachePGs(data);

            return data;
        } catch (error) {
            lastError = error;
            console.error(`[PG Fetch] Attempt ${attempt + 1} failed:`, {
                message: error.message,
                status: error.response?.status,
                code: error.code
            });

            // Don't retry on certain errors
            if (error.response?.status === 404 || error.response?.status === 403) {
                throw error;
            }

            // Wait before retrying (except on last attempt)
            if (attempt < maxRetries - 1) {
                console.log(`[PG Fetch] Retrying in ${retryDelay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
    }

    // All retries failed
    throw lastError;
};

/**
 * Get cached PG data if available and not expired
 */
const getCachedPGs = () => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;

        if (age < CACHE_DURATION) {
            console.log(`[Cache] Using cached data (age: ${Math.round(age / 1000)}s)`);
            return data;
        } else {
            console.log('[Cache] Cached data expired');
            localStorage.removeItem(CACHE_KEY);
            return null;
        }
    } catch (error) {
        console.error('[Cache] Error reading cache:', error);
        return null;
    }
};

/**
 * Cache PG data in localStorage
 */
const cachePGs = (data) => {
    try {
        const cacheData = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        console.log(`[Cache] Cached ${data.length} PGs`);
    } catch (error) {
        console.error('[Cache] Error saving cache:', error);
    }
};

/**
 * Clear PG cache
 */
export const clearPGCache = () => {
    localStorage.removeItem(CACHE_KEY);
    console.log('[Cache] Cleared PG cache');
};
