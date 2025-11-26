// src/services/authApi.ts
import type { User } from "../types/types";

const BASE = "http://localhost:5000";
const USERS = `${BASE}/users`;

/**
 * Query json-server for users by query object.
 */
export async function findUsersByQuery(query: Record<string, string>) {
  const params = new URLSearchParams(query).toString();
  const res = await fetch(`${USERS}?${params}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function createUser(payload: Partial<User>) {
  const body = { ...payload, id: payload.id ?? String(Date.now()) };
  const res = await fetch(USERS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || "Failed to create user");
  }
  return res.json();
}

export async function loginWithIdentifier(identifier: string, password: string) {
  // username + password
  let arr = await findUsersByQuery({ username: identifier, password });
  if (arr && arr.length > 0) return arr[0];
  // email + password
  arr = await findUsersByQuery({ email: identifier, password });
  if (arr && arr.length > 0) return arr[0];
  return null;
}

/**
 * Example token API call wrapper (replace with your real API).
 * This is optional — used if you have an OAuth/token endpoint.
 */
export async function getTokenFromApi(payload: { username: string; password: string }) {
  // Example using fetch to a token endpoint (replace URL)
  const res = await fetch("http://localhost:5000/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || "Failed to get token");
  }
  return res.json(); // expect { access_token: '...' } or similar
}
