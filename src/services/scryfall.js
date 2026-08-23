import axios from 'axios';

const ScryfallAPI = axios.create({
  baseURL: 'https://api.scryfall.com',
});

export const searchCards = async (query) => {
  try {
    const response = await ScryfallAPI.get(`/cards/search`, {
      params: { q: query },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching cards from Scryfall:', error);
    throw error;
  }
};

export const getCardById = async (id) => {
  try {
    const response = await ScryfallAPI.get(`/cards/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching card by ID from Scryfall:', error);
    throw error;
  }
};