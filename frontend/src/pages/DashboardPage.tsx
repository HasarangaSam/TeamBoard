import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { UserButton, useAuth, useUser } from "@clerk/react";
import { Link } from "react-router-dom";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import { createTask, deleteTask, getTasks, updateTask } from "../lib/api";
import type { Task, TaskPriority, TaskStatus } from "../types/task";

export default function DashboardPage() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "">("");
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchTasks = useCallback(async () => {
    const token = await getToken();
    if (!token) throw new Error("No active session token.");

    return getTasks(token, {
      page,
      limit: 10,
      status: statusFilter,
      priority: priorityFilter,
      search: search.trim(),
    });
  }, [getToken, page, statusFilter, priorityFilter, search]);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchTasks();
      setTasks(result.items);
      setTotal(result.pagination.total);
      setTotalPages(Math.max(1, result.pagination.totalPages));
    } catch {
      setError("Unable to load tasks. Please retry.");
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  useEffect(() => {
    let active = true;

    void fetchTasks()
      .then((result) => {
        if (!active) return;

        setTasks(result.items);
        setTotal(result.pagination.total);
        setTotalPages(Math.max(1, result.pagination.totalPages));
        setError("");
      })
      .catch(() => {
        if (active) setError("Unable to load tasks. Please retry.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetchTasks]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!title.trim()) {
      setError("Enter a task title.");
      return;
    }

    setSaving(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("No active session token.");

      await createTask(token, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate
          ? new Date(`${dueDate}T12:00:00`).toISOString()
          : undefined,
      });

      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setDueDate("");
      setPage(1);
      setNotice("Task created successfully.");

      if (page === 1) {
        await loadTasks();
      }
    } catch {
      setError("Unable to create the task. Please check your input.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(task: Task) {
    setError("");
    setNotice("");

    try {
      const token = await getToken();
      if (!token) throw new Error("No active session token.");

      const nextStatus: TaskStatus =
        task.status === "COMPLETED" ? "TODO" : "COMPLETED";

      await updateTask(token, task.id, { status: nextStatus });
      setNotice("Task status updated.");
      await loadTasks();
    } catch {
      setError("Unable to update this task.");
    }
  }

  async function handleDelete(task: Task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return;

    setError("");
    setNotice("");

    try {
      const token = await getToken();
      if (!token) throw new Error("No active session token.");

      await deleteTask(token, task.id);
      setNotice("Task deleted successfully.");

      if (tasks.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadTasks();
      }
    } catch {
      setError("Unable to delete this task.");
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-slate-200 pb-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              T
            </span>
            <span className="text-xl font-bold text-slate-900">TeamBoard</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:inline">
              {user?.fullName ?? user?.primaryEmailAddress?.emailAddress}
            </span>
            <UserButton />
          </div>
        </header>

        <section className="py-9">
          <p className="text-sm font-semibold text-blue-600">YOUR WORKSPACE</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                My tasks
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Plan your work and keep track of your progress.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs text-slate-500">Matching tasks</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{total}</p>
            </div>
          </div>
        </section>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        {notice && (
          <p
            role="status"
            className="mb-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            {notice}
          </p>
        )}

        <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-4">
            <TaskFilters
              search={search}
              status={statusFilter}
              priority={priorityFilter}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              onStatusChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              onPriorityChange={(value) => {
                setPriorityFilter(value);
                setPage(1);
              }}
            />
            <TaskList
              tasks={tasks}
              loading={loading}
              page={page}
              totalPages={totalPages}
              onRefresh={() => void loadTasks()}
              onStatusChange={(task) => void handleStatusChange(task)}
              onDelete={(task) => void handleDelete(task)}
              onPageChange={setPage}
            />
          </div>
          <TaskForm
            title={title}
            description={description}
            priority={priority}
            dueDate={dueDate}
            saving={saving}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onPriorityChange={setPriority}
            onDueDateChange={setDueDate}
            onSubmit={(event) => void handleCreate(event)}
          />
        </section>
      </div>
    </main>
  );
}
