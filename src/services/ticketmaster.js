const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
const API_KEY = import.meta.env.VITE_TM_API_KEY;

const buildUrl = (path, params = {}) => {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('apikey', API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
};

const request = async (path, params) => {
  const response = await fetch(buildUrl(path, params));
  if (response.status === 429) {
    throw new Error('Too many requests. Please wait a moment and try again.');
  }
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json();
};

export const getEvents = (params) =>
  request('/events.json', { sort: 'date,asc', size: 12, ...params });

export const getEventById = (id) => request(`/events/${id}.json`);

export const getClassifications = () => request('/classifications.json', { size: 50 });