import type { Task, TaskPriority, TaskStatus } from "../../types/task";

const statusLabels: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

const priorityColors: Record<TaskPriority, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-amber-50 text-amber-700",
  HIGH: "bg-red-50 text-red-700",
};

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  page: number;
  totalPages: number;
  onRefresh: () => void;
  onStatusChange: (task: Task) => void;
  onDelete: (task: Task) => void;
  onPageChange: (page: number) => void;
}

export default function TaskList({
  tasks,
  loading,
  page,
  totalPages,
  onRefresh,
  onStatusChange,
  onDelete,
  onPageChange,
}: TaskListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="font-bold text-slate-900">Task list</h2>
        <button
          type="button"
          onClick={onRefresh}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="p-8 text-center text-sm text-slate-500">
          Loading tasks...
        </p>
      ) : tasks.length === 0 ? (
        <div className="p-10 text-center">
          <h3 className="font-semibold text-slate-900">No tasks found</h3>
          <p className="mt-2 text-sm text-slate-500">
            Create a task or change your filters.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <article key={task.id} className="p-5">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  aria-label={
                    task.status === "COMPLETED"
                      ? `Reopen ${task.title}`
                      : `Complete ${task.title}`
                  }
                  onClick={() => onStatusChange(task)}
                  className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                    task.status === "COMPLETED"
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-300 hover:border-blue-500"
                  }`}
                >
                  {task.status === "COMPLETED" ? "✓" : ""}
                </button>

                <div className="min-w-0 flex-1">
                  <h3
                    className={`break-words font-semibold ${
                      task.status === "COMPLETED"
                        ? "text-slate-400 line-through"
                        : "text-slate-900"
                    }`}
                  >
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                      {task.description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityColors[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {statusLabels[task.status]}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-slate-500">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDelete(task)}
                  aria-label={`Delete ${task.title}`}
                  className="shrink-0 rounded-lg px-2 py-1 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
        <p className="text-xs text-slate-500">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
