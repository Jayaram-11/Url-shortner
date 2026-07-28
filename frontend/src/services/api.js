// All backend API calls are made from this file.
// React components should never call fetch() directly.

const BASE_URL = "http://127.0.0.1:8000";

// Helper: get JWT token from localStorage
function getToken() {
  return localStorage.getItem("token");
}

// Helper: return Authorization header object
function authHeaders() {
  return {
    Authorization: `Bearer ${getToken()}`,
  };
}

// POST /create-account
// Body: { name, email, password }
// Response: { success, data: { name }, message }
export async function createAccount(name, email, password) {
  const response = await fetch(`${BASE_URL}/create-account`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

// POST /login
// Uses OAuth2PasswordRequestForm so body must be form-encoded (username + password)
// Response: { success, access_token, token_type, message }
export async function login(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

// POST /shorten-url
// Body: { url }
// Response: { success, data: { short_url }, message }
export async function shortenUrl(url) {
  const response = await fetch(`${BASE_URL}/shorten-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ url }),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

// POST /customize-url?custom_code=...
// Body: { url }
// Response: { success, data: { custom_url }, message }
export async function customizeUrl(originalUrl, customCode) {
  const response = await fetch(
    `${BASE_URL}/customize-url?custom_code=${encodeURIComponent(customCode)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ url: originalUrl }),
    }
  );
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

// DELETE /{custom_code}
// Response: { success, data: {}, message }
export async function deleteUrl(customCode) {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(customCode)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

// PATCH /{old_custom_code}?new_custom_code=...
// Response: { success, data: {}, message }
export async function updateUrl(oldCustomCode, newCustomCode) {
  const response = await fetch(
    `${BASE_URL}/${encodeURIComponent(oldCustomCode)}?new_custom_code=${encodeURIComponent(newCustomCode)}`,
    {
      method: "PATCH",
      headers: authHeaders(),
    }
  );
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

// GET /my-urls
// Response: { success, data: [ { original_url, custom_code, custom_url, created_at } ], message }
// Note: click_count is NOT returned by this endpoint
export async function getMyUrls() {
  const response = await fetch(`${BASE_URL}/my-urls`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

// GET /dashboard
// Response: { success, data: { name, dashboard: [ { original_url, custom_code, custom_url, click_count, created_at } ] }, message }
export async function getDashboard() {
  const response = await fetch(`${BASE_URL}/dashboard`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}
