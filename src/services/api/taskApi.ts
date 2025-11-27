import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import type { Task } from "../types/types";

const BASE = "http://localhost:5000";
const USERS = `${BASE}/users`;

// Fetch user by id
const fetchUser = async (userId: string) => {
  const { data } = await axios.get(`${USERS}/${userId}`);
  return data;
};

// Fetch tasks of specific user
export const fetchTasksByUser = async (userId: string): Promise<Task[]> => {
  const user = await fetchUser(userId);
  return user.tasks ?? [];
};

// Create a new task for specific user
export const createTask = async (
  payload: Partial<Task> & { ownerId: string }
): Promise<Task> => {
  if (!payload.ownerId) throw new Error("ownerId missing");

  const user = await fetchUser(payload.ownerId);
  const tasks = Array.isArray(user.tasks) ? [...user.tasks] : [];

  const newTask: Task = {
    id: uuidv4(),
    taskName: payload.taskName ?? "Untitled Task",
    priority: payload.priority ?? "medium",
    deadline: payload.deadline ?? "",
    stage: payload.stage ?? 0,
    ownerId: payload.ownerId,
  };

  tasks.push(newTask);

  await axios.patch(`${USERS}/${payload.ownerId}`, { tasks });

  return newTask;
};

// Update specific task
export const updateTaskApi = async (
  taskId: string,
  data: Partial<Task>
): Promise<Task> => {
  const { data: users } = await axios.get(USERS);

  const owner = users.find((u: any) =>
    u.tasks?.some((t: any) => t.id === taskId)
  );

  if (!owner) throw new Error("Owner not found for task");

  const updatedTasks = owner.tasks.map((t: any) =>
    t.id === taskId ? { ...t, ...data } : t
  );

  await axios.patch(`${USERS}/${owner.id}`, { tasks: updatedTasks });

  return updatedTasks.find((t: any) => t.id === taskId);
};

// Delete task by ID
export const deleteTaskApi = async (taskId: string): Promise<void> => {
  const { data: users } = await axios.get(USERS);

  const owner = users.find((u: any) =>
    u.tasks?.some((t: any) => t.id === taskId)
  );

  if (!owner) throw new Error("Task owner not found");

  const remaining = owner.tasks.filter((t: any) => t.id !== taskId);

  await axios.patch(`${USERS}/${owner.id}`, { tasks: remaining });
};
