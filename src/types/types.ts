export type User = {
id: string
name: string
username: string
email: string
contact?: string
password: string
profileImage?: string // base64 or data URL
}

export type AuthState = {
currentUser: User | null
users?: User[]
loading: boolean
error?: string | null
}

export type Priority = "low" | "medium" | "high";
