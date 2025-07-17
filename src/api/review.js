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

/**
 * Start a review session.
 * @param {Object} params - Parameters for the review session
 * @param {string} params.deckId - Deck UUID to review
 * @param {string} params.mode - Review mode (e.g., "flashcard")
 * @param {Array<string>} params.cardIds - Array of card UUIDs to include in the session
 * @returns {Promise<any>}
 */
export async function startReviewSession({deckId, mode, cardIds}) {
  if (!deckId || !mode || !cardIds || !Array.isArray(cardIds)) {
    throw new Error('startReviewSession: deckId, mode, and cardIds are required')
  }

  const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/review_sessions/start`, {
    deck: deckId,
    mode,
    cards: cardIds
  }, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  })
  return data
}

/**
 * End a review session.
 * @param sessionId
 * @returns {Promise<any>}
 */
export async function endReviewSession(sessionId) {
  if (!sessionId) throw new Error('endReviewSession: sessionId is required')

  const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/review_sessions/${sessionId}/finish`, {}, {
    headers: authHeaders(),
  })
  return data
}

/**
 * Create a review event for a card in a session.
 * @param sessionId
 * @param cardId
 * @param score
 * @returns {Promise<any>}
 */
export async function createReviewEvent({sessionId, cardId, score}) {
  if (!sessionId || !cardId || score === undefined) {
    throw new Error('createReviewEvent: sessionId, cardId, and score are required')
  }

  const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/review_events`, {
    session: `/api/review_sessions/${sessionId}`,
    card: `/api/cards/${cardId}`,
    score
  }, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  })
  return data
}