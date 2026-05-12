import api from "./axios";

export const submitComplaint = async (formData) => {
  const response = await api.post("/complaints", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getComplaints = async (params) => {
  const response = await api.get("/complaints", { params });
  return response.data;
};

export const getComplaintById = async (id) => {
  const response = await api.get(`/complaints/${id}`);
  return response.data;
};

export const updateComplaintStatus = async (id, data) => {
  const response = await api.put(`/complaints/${id}/status`, data);
  return response.data;
};

export const assignComplaint = async (id, staffId) => {
  const response = await api.put(`/complaints/${id}/assign`, { staffId });
  return response.data;
};

export const getComplaintStats = async () => {
  const response = await api.get("/complaints/stats");
  return response.data;
};

export const deleteComplaint = async (id) => {
  const response = await api.delete(`/complaints/${id}`);
  return response.data;
};
