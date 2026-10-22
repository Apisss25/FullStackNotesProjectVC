const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const TOKEN_KEY = "auth_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function removeToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiClient(endpoint, options = {}) {
  const { headers = {}, token, ...customConfig } = options;
  const activeToken = token !== undefined ? token : getToken();

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  };

  if (activeToken) {
    defaultHeaders.Authorization = `Bearer ${activeToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...customConfig,
    headers: defaultHeaders,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(payload?.message || "Terjadi kesalahan pada request");
    error.status = response.status;
    error.data = payload;

    if (response.status === 401 && endpoint !== "/api/login" && typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    throw error;
  }

  return payload;
}

export async function getNotes(page = 1) {
  return await apiClient(`/api/notes?page=${page}`);
}

export async function getNoteDetail(id) {
  return await apiClient(`/api/notes/${id}`);
}

export async function getMyNotes(page = 1) {
  return await apiClient(`/api/my-notes?page=${page}`);
}

export async function getProfile() {
  return await apiClient("/api/profile");
}

export async function getSavedNotes(page = 1) {
  return await apiClient(`/api/saved-notes?page=${page}`);
}

export async function createNote(note) {
  return await apiClient("/api/notes", {
    method: "POST",
    body: JSON.stringify(note),
  });
}

export async function updateNote(id, note) {
  return await apiClient(`/api/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(note),
  });
}

export async function deleteNote(id) {
  return await apiClient(`/api/notes/${id}`, { method: "DELETE" });
}

export async function saveNote(noteId) {
  return await apiClient(`/api/notes/${noteId}/save`, { method: "POST" });
}

export async function unsaveNote(noteId) {
  return await apiClient(`/api/notes/${noteId}/save`, { method: "DELETE" });
}
