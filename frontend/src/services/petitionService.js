import api from './api';

export const petitionService = {
  // President
  create: (data) => api.post('/petitions', data),
  getMyPetitions: () => api.get('/petitions/me'),
  getById: (id) => api.get(`/petitions/${id}`),
  download: (id) => api.get(`/petitions/${id}/download`, { responseType: 'blob' }),

  // Takvim (tüm roller)
  getCalendar: () => api.get('/petitions/calendar'),
  // Takvim çakışması kontrolü
  checkDate: (date) => api.get('/petitions/check-date', { params: { date } }),
};
