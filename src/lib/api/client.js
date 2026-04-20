import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if exists
apiClient.interceptors.request.use((config) => {
  let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token && typeof window !== 'undefined') {
    token = Cookies.get('token');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Simple in-memory cache store for fetchGet
const cacheStore = new Map();

// Separate cache for table orders (faster TTL)
const tableOrdersCache = new Map();

const DEFAULT_CACHE_TTL = 30 * 1000; // 30 seconds default
const TABLE_ORDERS_CACHE_TTL = 10 * 1000; // 10 seconds for table orders

// Helper to get Bearer token for fetch requests
export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  let token = localStorage.getItem('token');
  if (!token) {
    token = Cookies.get('token');
  }
  return token;
}

// Fetch wrapper with Bearer token for GET requests
export async function fetchGet(endpoint, options = {}) {
  const { useCache = true, cacheTTL = DEFAULT_CACHE_TTL } = options;
  const cacheKey = endpoint;

  // Check cache first
  if (useCache && cacheStore.has(cacheKey)) {
    const cached = cacheStore.get(cacheKey);
    if (Date.now() < cached.expiry) {
      return cached.data;
    }
    cacheStore.delete(cacheKey);
  }

  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${endpoint}`);
  }

  const data = await response.json();

  // Store in cache
  if (useCache) {
    cacheStore.set(cacheKey, {
      data,
      expiry: Date.now() + cacheTTL,
    });
  }

  return data;
}

// Clear specific cache entry or all cache
export function clearCache(endpoint) {
  if (endpoint) {
    cacheStore.delete(endpoint);
  } else {
    cacheStore.clear();
  }
}

// Get or set table orders cache
export function getTableOrdersCache(tableId) {
  const key = `table_orders_${tableId}`;
  if (tableOrdersCache.has(key)) {
    const cached = tableOrdersCache.get(key);
    if (Date.now() < cached.expiry) {
      return cached.data;
    }
    tableOrdersCache.delete(key);
  }
  return null;
}

export function setTableOrdersCache(tableId, data) {
  const key = `table_orders_${tableId}`;
  tableOrdersCache.set(key, {
    data,
    expiry: Date.now() + TABLE_ORDERS_CACHE_TTL,
  });
}

// Clear table orders cache
export function clearTableOrdersCache(tableId) {
  if (tableId) {
    tableOrdersCache.delete(`table_orders_${tableId}`);
  } else {
    tableOrdersCache.clear();
  }
}

export default apiClient;
