import axios from "axios";
import type {
  CreateTaskInput,
  Task,
  TaskListResponse,
  TaskPriority,
  TaskStatus,
  UpdateTaskInput,
} from "../types/task";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export async function getTasks(
  token: string,
  filters: {
    page?: number;
    limit?: number;
    status?: TaskStatus | "";
    priority?: TaskPriority | "";
    search?: string;
  } = {},
): Promise<TaskListResponse> {
  const response = await api.get<TaskListResponse>("/tasks", {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.priority ? { priority: filters.priority } : {}),
      ...(filters.search ? { search: filters.search } : {}),
    },
  });

  return response.data;
}

export async function createTask(
  token: string,
  input: CreateTaskInput,
): Promise<Task> {
  const response = await api.post<Task>("/tasks", input, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
}

export async function updateTask(
  token: string,
  id: string,
  input: UpdateTaskInput,
): Promise<Task> {
  const response = await api.patch<Task>(`/tasks/${id}`, input, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
}

export async function deleteTask(token: string, id: string): Promise<void> {
  await api.delete(`/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
