import api from './api';

export const petitionService = {
  // President
  create: (data) => api.post('/petitions', data),
  getMyPetitions: () => api.get('/petitions/me'),
  getById: (id) => api.get(`/petitions/${id}`),
  download: (id) => api.get(`/petitions/${id}/download`, { responseType: 'blob' }),
};
