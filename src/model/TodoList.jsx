import { useState, useEffect } from "react";

const panel =
  "w-full max-w-[380px] rounded-2xl border-2 border-slate-200 bg-white px-5 py-7 dark:border-edge dark:bg-panel";
const heading = "mb-4 text-[1.1rem] font-bold text-slate-500 dark:text-muted";
const field =
  "rounded-[10px] border-2 border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-edge dark:bg-ink dark:text-fg";
const btn =
  "cursor-pointer rounded-[10px] px-[18px] py-2.5 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40";

class TodoModel {
  constructor(tasks = []) {
    this.tasks = tasks;
  }

  static load() {
    try {
      return new TodoModel(JSON.parse(localStorage.getItem("tasks")) || []);
    } catch {
      return new TodoModel();
    }
  }

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  get left() {
    return this.tasks.filter((t) => !t.done).length;
  }

  get hasDone() {
    return this.tasks.some((t) => t.done);
  }

  add(text) {
    const clean = text.trim();
    if (!clean) return this;
    return new TodoModel([...this.tasks, { id: Date.now() + Math.random(), text: clean, done: false }]);
  }

  toggle(id) {
    return new TodoModel(this.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  remove(id) {
    return new TodoModel(this.tasks.filter((t) => t.id !== id));
  }

  clearDone() {
    return new TodoModel(this.tasks.filter((t) => !t.done));
  }
}

export default function TodoList() {
  const [todo, setTodo] = useState(() => TodoModel.load());
  const [text, setText] = useState("");

  useEffect(() => {
    todo.save();
  }, [todo]);

  function addTask(e) {
    e.preventDefault();
    setTodo(todo.add(text));
    setText("");
  }

  return (
    <section className={panel}>
      <h2 className={heading}>To-Do List</h2>

      <form onSubmit={addTask} className="flex gap-2">
        <input
          className={`${field} flex-1`}
          placeholder="Add a task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className={`${btn} bg-accent`}>
          Add
        </button>
      </form>

      {todo.tasks.length === 0 ? (
        <p className="mt-4 text-slate-500 dark:text-muted">Nothing to do. Add a task above.</p>
      ) : (
        <ul className="mt-4 max-h-56 divide-y divide-slate-200 overflow-y-auto text-left dark:divide-edge">
          {todo.tasks.map((t) => (
            <li key={t.id} className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => setTodo(todo.toggle(t.id))}
                className="h-4 w-4 cursor-pointer"
              />
              <span className={`flex-1 break-words ${t.done ? "text-slate-400 line-through dark:text-muted" : ""}`}>
                {t.text}
              </span>
              <button
                onClick={() => setTodo(todo.remove(t.id))}
                aria-label={`Delete ${t.text}`}
                className="cursor-pointer rounded-md px-2 text-slate-400 hover:text-red-600 dark:hover:text-stop"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {todo.tasks.length > 0 && (
        <div className="mt-3 flex items-center justify-between text-sm text-slate-500 dark:text-muted">
          <span>{todo.left} left</span>
          {todo.hasDone && (
            <button
              onClick={() => setTodo(todo.clearDone())}
              className="cursor-pointer underline hover:text-slate-900 dark:hover:text-fg"
            >
              Clear completed
            </button>
          )}
        </div>
      )}
    </section>
  );
}