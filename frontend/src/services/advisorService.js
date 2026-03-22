import api from './api';

export const advisorService = {
  getPetitions: () => api.get('/advisor/petitions'),
  approve: (id) => api.put(`/advisor/petitions/${id}/approve`),
  reject: (id, reason) => api.put(`/advisor/petitions/${id}/reject`, null, { params: { reason } }),
};
