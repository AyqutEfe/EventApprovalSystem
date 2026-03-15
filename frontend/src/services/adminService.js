import api from './api';

export const adminService = {
  getPendingPetitions: () => api.get('/admin/petitions'),
  getAllPetitions: () => api.get('/admin/petitions/all'),
  approve: (id) => api.put(`/admin/petitions/${id}/approve`),
  reject: (id) => api.put(`/admin/petitions/${id}/reject`),

  // Kulüp yönetimi
  getClubs: () => api.get('/admin/clubs'),
  createClub: (data) => api.post('/admin/clubs', data),

  // Kullanıcı listesi
  getUsers: () => api.get('/admin/users'),
};
