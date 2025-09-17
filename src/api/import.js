import axios from 'axios';

const authHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? {Authorization: `Bearer ${token}`} : {}
}

export async function importFileForCards(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/import/${extension}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...authHeaders(),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
}
