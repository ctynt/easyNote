import axiosInstance from "./axiosInstance";

export const createNote = async (noteData) => {
  return axiosInstance.post("/notes", noteData);
};

export const getNotes = async (userId) => {
  return axiosInstance.get(`/notes/user/${userId}`);
};

export const getNote = async (noteId) => {
  return axiosInstance.get(`/notes/${noteId}`);
};

export const getNotesList = async () => {
  return axiosInstance.get("/notes/notesList");
};

export const getNotesByCategory = async (userId, categoryId) => {
  return axiosInstance.get(`/notes/categories/${userId}/${categoryId}`);
};

export const updateNote = async (noteId, noteData) => {
  return axiosInstance.put(`/notes/${noteId}`, noteData);
};

export const deleteNote = async (noteId) => {
  return axiosInstance.delete(`/notes/${noteId}`);
};
