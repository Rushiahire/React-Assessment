export type User = {
id: string
name: string
username: string
email: string
contact?: string
password: string | null;
profileImage?: string // base64 or data URL
provider?:string
}

export type AuthState = {
currentUser: User | null
users?: User[]
loading: boolean
error?: string | null
}

// src/types/types.ts
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  taskName: string;        // keep this if your db uses taskName
  stage: 0 | 1 | 2 | 3;
  priority: Priority;
  deadline: string;
  ownerId?: string;        // optional (since stored inside user)
}


