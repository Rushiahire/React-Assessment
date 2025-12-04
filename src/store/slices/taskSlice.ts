import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import * as taskApi from "../../services/api/taskApi";
import type { Task } from "../../types/types";

type TasksState = {
  items: Task[];
  loading: boolean;
  error: string | null | undefined;
};

interface MovePayload {
  id: number;
  newStage: number;
}

const initialState: TasksState = { items: [], loading: false, error: null };

export const loadTasks = createAsyncThunk<Task[], string>(
  "tasks/load",
  async (userId, { rejectWithValue }) => {
    try {
      return await taskApi.fetchTasksByUser(userId);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load tasks");
    }
  }
);

export const addTask = createAsyncThunk<Task, Partial<Task>>(
  "tasks/add",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await taskApi.createTask(payload);
    } catch (err: any) {
      return rejectWithValue(err.message || "Create failed");
    }
  }
);

export const patchTask = createAsyncThunk(
  "tasks/patch",
  async ({ id, data }: any, { rejectWithValue }) => {
    try {
      return await taskApi.updateTaskApi(id, data);
    } catch (err: any) {
      return rejectWithValue(err.message || "Update failed");
    }
  }
);

export const removeTask = createAsyncThunk<string, string>(
  "tasks/remove",
  async (id, { rejectWithValue }) => {
    try {
      await taskApi.deleteTaskApi(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || "Delete failed");
    }
  }
);

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // local optimistic move (used by drag-end before server patch)
    localMove(state, action: PayloadAction<MovePayload>) {
      const t = state?.items?.find((x: any) => x.id === action.payload.id);
      if (t) t.stage = action.payload.newStage as 0 | 1 | 2 | 3;
    },
  },
  extraReducers: (b) => {
    b.addCase(loadTasks.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(loadTasks.fulfilled, (s, a) => {
      console.log({ s, a });
      s.items = a.payload;
      s.loading = false;
    });
    b.addCase(loadTasks.rejected, (s, a) => {
      s.loading = false;
      s.error = (a.payload as string) || a.error.message;
    });

    b.addCase(addTask.fulfilled, (s, a) => {
      s.items.push(a.payload);
    });
    b.addCase(addTask.rejected, (s, a) => {
      s.error = (a.payload as string) || a.error.message;
    });

    b.addCase(patchTask.fulfilled, (s, a) => {
      const idx = s.items.findIndex((x) => x.id === a.payload.id);
      if (idx >= 0) s.items[idx] = a.payload;
    });

    b.addCase(removeTask.fulfilled, (s, a) => {
      s.items = s.items.filter((t) => t.id !== a.payload);
    });
  },
});

export const { localMove } = slice.actions;
export default slice.reducer;
