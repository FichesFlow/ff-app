import axios from 'axios'

const BASE_URL = `${import.meta.env.VITE_API_URL}/review_queues`

/**
 * Return Authorization header when a JWT token is stored in localStorage.
 */
const authHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? {Authorization: `Bearer ${token}`} : {}
}

/**
 * Add a deck to the user's revision queue.
 * @param {string} deckId - Deck UUID to add to the queue
 * @returns {Promise<any>}
 */
export async function addToRevisionQueue(deckId) {
  if (!deckId) throw new Error('addToRevisionQueue: deckId is required')

  const {data} = await axios.post(BASE_URL, {
    deck: `/api/decks/${deckId}`
  }, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  })
  return data
}

/**
 * Get the user's revision queue.
 * @returns {Promise<any>}
 */
export async function getRevisionQueue() {
  const {data} = await axios.get(BASE_URL, {
    headers: authHeaders(),
  })
  return data
}

/**
 * Remove a deck from the user's revision queue.
 * @param {string} queueItemId - Queue item ID to remove
 * @returns {Promise<any>}
 */
export async function removeFromRevisionQueue(queueItemId) {
  if (!queueItemId) throw new Error('removeFromRevisionQueue: queueItemId is required')

  const {data} = await axios.delete(`${BASE_URL}/${queueItemId}`, {
    headers: authHeaders(),
  })
  return data
}

/**
 * Get the user's review queues.
 * @returns {Promise<any>}
 */
export async function getMyReviewQueues() {
  const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/my-review-queues`, {
    headers: authHeaders(),
  })
  return data
}