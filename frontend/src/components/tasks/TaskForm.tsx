import type { FormEvent } from "react";
import type { TaskPriority } from "../../types/task";

interface TaskFormProps {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  saving: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: TaskPriority) => void;
  onDueDateChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function TaskForm({
  title,
  description,
  priority,
  dueDate,
  saving,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onDueDateChange,
  onSubmit,
}: TaskFormProps) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-bold text-slate-900">Create a task</h2>
      <p className="mt-1 text-sm leading-6 text-slate-500">
        Add a task to your personal workspace.
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="task-title"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Title
          </label>
          <input
            id="task-title"
            required
            maxLength={120}
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="e.g. Prepare interview notes"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="task-description"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Description
          </label>
          <textarea
            id="task-description"
            maxLength={2000}
            rows={3}
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="Add a few details..."
            className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="task-priority"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Priority
          </label>
          <select
            id="task-priority"
            value={priority}
            onChange={(event) => onPriorityChange(event.target.value as TaskPriority)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="task-due-date"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Due date <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(event) => onDueDateChange(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
        >
          {saving ? "Creating task..." : "Create task"}
        </button>
      </form>
    </aside>
  );
}
