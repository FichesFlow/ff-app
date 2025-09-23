import axios from 'axios';


const authHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? {Authorization: `Bearer ${token}`} : {}
}

/**
 * Search decks by title or full text
 */
export const searchDecks = async (query, limit = 10, searchType = 'title') => {
  if (!query?.trim()) {
    return {
      results: [],
      total: 0,
      query,
      message: 'Please provide a search query'
    };
  }

  if (query.trim().length < 2) {
    return {
      results: [],
      total: 0,
      query,
      message: 'Search query must be at least 2 characters long'
    };
  }

  const params = new URLSearchParams({
    q: query,
    limit: Math.min(limit, 20),
    type: searchType
  });

  const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/deck-search?${params}`, {
    headers: {
      'Accept': 'application/json',
      ...authHeaders(),
    },
  });

  return data;
};

/**
 * Get search suggestions for decks
 */
export const getDeckSuggestions = async (query) => {
  if (!query?.trim() || query.trim().length < 2) {
    return {
      suggestions: [],
      query
    };
  }

  const params = new URLSearchParams({q: query});

  const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/deck-search/suggestions?${params}`, {
    headers: {
      'Accept': 'application/json',
      ...authHeaders(),
    },
  });

  return data;
};
