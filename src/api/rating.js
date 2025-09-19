import axios from 'axios';


/**
 * Return Authorization header when a JWT token is stored in localStorage.
 */
const authHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? {Authorization: `Bearer ${token}`} : {}
}

export const submitDeckRating = async (deckId, rating) => {
  if (!deckId) throw new Error('submitDeckRating: deckId is required');
  if (rating < 1 || rating > 5) throw new Error('submitDeckRating: rating must be between 1 and 5');

  const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/decks/${deckId}/rate`, {rating}, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  });

  return data;
}

export const fetchUserRating = async (deckId) => {
  if (!deckId) throw new Error('fetchUserRating: deckId is required');

  const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/decks/${deckId}/rate`, {
    headers: {
      'Accept': 'application/json',
      ...authHeaders(),
    },
  });

  return data.rating;
}

export const deleteDeckRating = async (deckId) => {
  if (!deckId) throw new Error('deleteDeckRating: deckId is required');

  const {data} = await axios.delete(`${import.meta.env.VITE_API_URL}/decks/${deckId}/rate`, {
    headers: {
      ...authHeaders(),
    },
  });

  return data;
}
