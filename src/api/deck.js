import axios from 'axios'

const BASE_URL = `${import.meta.env.VITE_API_URL}/decks`

/**
 * Return Authorization header when a JWT token is stored in localStorage.
 */
const authHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? {Authorization: `Bearer ${token}`} : {}
}

/**
 * Fetch a paginated list of decks.
 * @param {Object} params - Optional query parameters (e.g. { page: 1 })
 * @param {Object} options - Optional axios request options
 * @returns {Promise<any>}
 */
export async function fetchDecks(params = {}, options = {}) {
  const {data} = await axios.get(BASE_URL, {
    params,
    ...options
  });
  return data;
}

/**
 * Fetch a single deck by id.
 * @param {string} id - Deck UUID
 */
export async function fetchDeck(id) {
  if (!id) throw new Error('fetchDeck: id is required')
  const {data} = await axios.get(`${BASE_URL}/${id}`)
  return data
}

/**
 * Fetch a single deck by id, with review stats.
 * @param {string} id - Deck UUID
 */
export async function fetchDeckWithStats(id) {
  if (!id) throw new Error('fetchDeckWithStats: id is required')
  const {data} = await axios.get(`${BASE_URL}/${id}/stats`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  })
  return data
}

/**
 * Create a new deck (requires auth).
 * @param {Object} deck - Payload that matches the Deck POST contract
 */
export async function createDeck(deck) {
  const {data} = await axios.post(BASE_URL, deck, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  })
  return data
}

/**
 * Update an existing deck (requires auth and ownership).
 * @param {string} id - Deck UUID
 * @param {Object} deck - Partial/complete Deck payload
 */
export async function updateDeck(id, deck) {
  if (!id) throw new Error('updateDeck: id is required')
  const {data} = await axios.put(`${BASE_URL}/${id}`, deck, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  })
  return data
}

/**
 * Delete a deck (requires auth and ownership).
 * @param {string} id - Deck UUID
 */
export async function deleteDeck(id) {
  if (!id) throw new Error('deleteDeck: id is required')
  const {data} = await axios.delete(`${BASE_URL}/${id}`, {
    headers: authHeaders(),
  })
  return data
}
