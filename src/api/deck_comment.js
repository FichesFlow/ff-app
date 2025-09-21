import axios from 'axios';

/**
 * Return Authorization header when a JWT token is stored in localStorage.
 */
const authHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? {Authorization: `Bearer ${token}`} : {}
}

/**
 * Fetch all comments for a specific deck
 */
export const fetchDeckComments = async (deckId) => {
  if (!deckId) throw new Error('fetchDeckComments: deckId is required');

  const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/decks/${deckId}/comments`, {
    headers: {
      'Accept': 'application/json',
      ...authHeaders(),
    },
  });

  return data;
}

/**
 * Post a new comment on a deck
 */
export const postDeckComment = async (deckId, content) => {
  if (!deckId) throw new Error('postDeckComment: deckId is required');
  if (!content) throw new Error('postDeckComment: content is required');

  const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/decks/${deckId}/comments`,
    {body: content},
    {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
    }
  );

  return data;
}

/**
 * Update an existing comment
 */
export const updateComment = async (commentId, content) => {
  if (!commentId) throw new Error('updateComment: commentId is required');
  if (!content) throw new Error('updateComment: content is required');

  const {data} = await axios.put(`${import.meta.env.VITE_API_URL}/comments/${commentId}`,
    {body: content},
    {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
    }
  );

  return data;
}

/**
 * Delete a comment
 */
export const deleteComment = async (commentId) => {
  if (!commentId) throw new Error('deleteComment: commentId is required');

  const {data} = await axios.delete(`${import.meta.env.VITE_API_URL}/comments/${commentId}`, {
    headers: {
      ...authHeaders(),
    },
  });

  return data;
}
