import type { TaskPriority, TaskStatus } from "../../types/task";

interface TaskFiltersProps {
  search: string;
  status: TaskStatus | "";
  priority: TaskPriority | "";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskStatus | "") => void;
  onPriorityChange: (value: TaskPriority | "") => void;
}

export default function TaskFilters({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: TaskFiltersProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search task titles..."
        aria-label="Search task titles"
        className="min-w-0 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
      />

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as TaskStatus | "")}
        aria-label="Filter by status"
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
      >
        <option value="">All statuses</option>
        <option value="TODO">To do</option>
        <option value="IN_PROGRESS">In progress</option>
        <option value="COMPLETED">Completed</option>
      </select>

      <select
        value={priority}
        onChange={(event) =>
          onPriorityChange(event.target.value as TaskPriority | "")
        }
        aria-label="Filter by priority"
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
      >
        <option value="">All priorities</option>
        <option value="LOW">Low priority</option>
        <option value="MEDIUM">Medium priority</option>
        <option value="HIGH">High priority</option>
      </select>
    </div>
  );
}
