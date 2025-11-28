import axios from "axios";
import type { User } from "../../types/types";
import { BASE } from "../config";

const USERS = `${BASE}/users`;

export async function findUsersByQuery(query: Record<string, string>) {
  const { data } = await axios.get(USERS, { params: query });
  return data;
}
/**
 * Create user
 */
export async function createUser(payload: Partial<User>) {
  const body = { 
    ...payload,
    id: payload.id ?? String(Date.now()),
    tasks: []
  };

  const { data } = await axios.post(USERS, body);
  return data;
}

/**
 * Login using username/email + password
 */
export async function loginWithIdentifier(identifier: string, password: string) {
  // Try username + password
  let { data: arr } = await axios.get(USERS, {
    params: { username: identifier, password }
  });
  if (arr?.length > 0) return arr[0];

  // Try email + password
  ({ data: arr } = await axios.get(USERS, {
    params: { email: identifier, password }
  }));
  if (arr?.length > 0) return arr[0];

  return null;
}
