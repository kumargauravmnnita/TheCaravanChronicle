import api from "./axios";

export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getStaffMembers = async () => {
  const response = await api.get("/users/staff");
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await api.put(`/users/${id}/role`, { role });
  return response.data;
};

export const deactivateUser = async (id) => {
  const response = await api.put(`/users/${id}/deactivate`);
  return response.data;
};
