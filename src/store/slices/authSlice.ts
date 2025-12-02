// src/store/slices/authSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authApi from "../../services/api/authApi";
import type { AuthState, User } from "../../types/types";

const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
};

// register thunk
export const register = createAsyncThunk<
  { success: true },
  Partial<User>,
  { rejectValue: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    // duplicate username check
    if (payload.username) {
      const same = await authApi.findUsersByQuery({
        username: payload.username,
      });
      if (same && same.length > 0)
        return rejectWithValue("Username already exists");
    }
    // duplicate email check
    if (payload.email) {
      const same = await authApi.findUsersByQuery({ email: payload.email });
      if (same && same.length > 0)
        return rejectWithValue("Email already registered");
    }
    await authApi.createUser(payload);
    return { success: true };
  } catch (err: any) {
    return rejectWithValue(err.message || "Registration failed");
  }
});

// login thunk
export const login = createAsyncThunk<
  User,
  { identifier: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ identifier, password }, { rejectWithValue }) => {
  try {
    const user = await authApi.loginWithIdentifier(identifier, password);
    console.log({ user });
    // if (user?.provider === "google") return user;
    if (!user) return rejectWithValue("Invalid credentials");
    return user;
  } catch (err: any) {
    return rejectWithValue(err.message || "Login failed");
  }
});

// GOOGLE LOGIN THUNK
export const googleLogin = createAsyncThunk<
  User,
  { email: string; name: string },
  { rejectValue: string }
>("auth/googleLogin", async ({ email, name }, { rejectWithValue }) => {
  try {
    const found = await authApi.findUsersByQuery({ email });

    let user: User;

    if (found.length > 0) {
      user = found[0]; // existing user
    } else {
      // auto create user
      user = await authApi.createUser({
        name,
        email,
        username: email.split("@")[0],
        password: "",
        provider: "google",
      });
    }

    return user;
  } catch (err: any) {
    return rejectWithValue("Google login failed");
  }
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("currentUser");
    },
    clearError(state) {
      state.error = null;
    },
    // rehydrate from localStorage if needed
    setUser(state, action: any) {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    // register
    builder.addCase(register.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(register.fulfilled, (s) => {
      s.loading = false;
      s.error = null;
    });
    builder.addCase(register.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload || a.error.message || "Register failed";
    });

    //google login
    builder.addCase(googleLogin.pending, (s) => {
      s.loading = true;
      s.error = null;
    });

    builder.addCase(googleLogin.fulfilled, (s, a) => {
      s.loading = false;
      s.currentUser = a.payload;

      try {
        localStorage.setItem("currentUser", JSON.stringify(a.payload));
      } catch {}
    });

    builder.addCase(googleLogin.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload || "Google login failed";
    });

    // login
    builder.addCase(login.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(login.fulfilled, (s, a) => {
      s.loading = false;
      s.currentUser = a.payload;
      s.error = null;
      // persist
      try {
        localStorage.setItem("currentUser", JSON.stringify(a.payload));
      } catch {}
    });
    builder.addCase(login.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload || a.error.message || "Login failed";
    });
  },
});

export const { logout, clearError, setUser } = slice.actions;
export default slice.reducer;
