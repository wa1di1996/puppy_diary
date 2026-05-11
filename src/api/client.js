const API_BASE = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api'

function getToken() { return localStorage.getItem('puppy_token') }
function getPetId() { return localStorage.getItem('puppy_selected_pet') ? JSON.parse(localStorage.getItem('puppy_selected_pet')).id : null }

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

// Auth
export async function apiRegister(username, password) { return request('/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) }) }
export async function apiLogin(username, password) { return request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }) }

// Pets
export async function fetchPets() { const d = await request('/pets'); return d.pets }
export async function createPet(data) { return request('/pets', { method: 'POST', body: JSON.stringify(data) }) }
export async function removePet(id) { return request(`/pets/${id}`, { method: 'DELETE' }) }

// Profile
export async function fetchProfile() { const d = await request(`/profile?petId=${getPetId() || ''}`); return d.profile }
export async function saveProfile(p) { return request('/profile', { method: 'PUT', body: JSON.stringify({ profile: p, petId: getPetId() }) }) }
export async function deleteProfile() { return request('/profile', { method: 'DELETE' }) }

// Records
export async function fetchRecords() { const d = await request(`/records?petId=${getPetId() || ''}`); return d.records }
export async function createRecord(r) { return request('/records', { method: 'POST', body: JSON.stringify({ ...r, petId: getPetId() }) }) }
export async function removeRecord(id) { return request(`/records/${id}`, { method: 'DELETE' }) }

// Foods
export async function fetchFoods() { const d = await request(`/foods?petId=${getPetId() || ''}`); return d.foods }
export async function createFood(f) { return request('/foods', { method: 'POST', body: JSON.stringify({ ...f, petId: getPetId() }) }) }
export async function updateFood(id, f) { return request(`/foods/${id}`, { method: 'PUT', body: JSON.stringify(f) }) }
export async function removeFood(id) { return request(`/foods/${id}`, { method: 'DELETE' }) }
