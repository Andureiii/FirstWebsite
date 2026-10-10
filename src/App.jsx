import { useState, useEffect } from "react";

const pad = (n) => String(n).padStart(2, "0");

const panel =
  "w-full max-w-[380px] rounded-2xl border-2 border-slate-200 bg-white px-5 py-7 dark:border-edge dark:bg-panel";
const heading = "mb-4 text-[1.1rem] font-bold text-slate-500 dark:text-muted";
const display = "font-mono text-[2.6rem] font-bold tracking-[2px] tabular-nums";
const field =
  "rounded-[10px] border-2 border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-edge dark:bg-ink dark:text-fg";
const btn =
  "cursor-pointer rounded-[10px] px-[18px] py-2.5 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40";

function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centis = Math.floor((ms % 1000) / 10);
  return `${pad(minutes)}:${pad(seconds)}.${pad(centis)}`;
}

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return [dark, setDark];
}

function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <section className={panel}>
      <h2 className={heading}>Digital Clock</h2>
      <div className={display}>
        {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}
      </div>
      <p className="mt-3 text-slate-500 dark:text-muted">{now.toDateString()}</p>
    </section>
  );
}

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    if (!running) return;

    const startedAt = Date.now() - elapsed;
    const id = setInterval(() => setElapsed(Date.now() - startedAt), 10);

    return () => clearInterval(id);
  }, [running]);

  function addLap() {
    const lastTotal = laps.length ? laps[laps.length - 1].total : 0;
    setLaps([...laps, { id: laps.length + 1, split: elapsed - lastTotal, total: elapsed }]);
  }

  function reset() {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  }

  const splits = laps.map((lap) => lap.split);
  const fastest = Math.min(...splits);
  const slowest = Math.max(...splits);

  function lapColor(lap) {
    if (laps.length < 2) return "";
    if (lap.split === fastest) return "text-green-600 dark:text-go";
    if (lap.split === slowest) return "text-red-600 dark:text-stop";
    return "";
  }

  return (
    <section className={panel}>
      <h2 className={heading}>Stopwatch</h2>
      <div className={display}>{formatTime(elapsed)}</div>
      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        <button className={`${btn} bg-go`} onClick={() => setRunning(true)} disabled={running}>
          Start
        </button>
        <button className={`${btn} bg-stop`} onClick={() => setRunning(false)} disabled={!running}>
          Stop
        </button>
        <button className={`${btn} bg-lap`} onClick={addLap} disabled={!running}>
          Lap
        </button>
        <button className={`${btn} bg-accent`} onClick={reset}>
          Reset
        </button>
      </div>

      {laps.length > 0 && (
        <ol className="mt-5 max-h-48 divide-y divide-slate-200 overflow-y-auto text-left font-mono text-sm dark:divide-edge">
          {[...laps].reverse().map((lap) => (
            <li key={lap.id} className={`flex justify-between py-2 ${lapColor(lap)}`}>
              <span>Lap {lap.id}</span>
              <span>{formatTime(lap.split)}</span>
              <span className="text-slate-500 dark:text-muted">{formatTime(lap.total)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

const CITIES = [
  { name: "Manila", zone: "Asia/Manila" },
  { name: "Tokyo", zone: "Asia/Tokyo" },
  { name: "Seoul", zone: "Asia/Seoul" },
  { name: "Singapore", zone: "Asia/Singapore" },
  { name: "Dubai", zone: "Asia/Dubai" },
  { name: "London", zone: "Europe/London" },
  { name: "Paris", zone: "Europe/Paris" },
  { name: "New York", zone: "America/New_York" },
  { name: "Los Angeles", zone: "America/Los_Angeles" },
  { name: "Sydney", zone: "Australia/Sydney" },
];

function timeIn(zone, date) {
  return date.toLocaleTimeString("en-US", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
}

function dateIn(zone, date) {
  return date.toLocaleDateString("en-US", {
    timeZone: zone,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function WorldClock() {
  const [now, setNow] = useState(new Date());
  const [shown, setShown] = useState(["Asia/Manila", "Asia/Tokyo", "Europe/London", "America/New_York"]);
  const [pick, setPick] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const available = CITIES.filter((c) => !shown.includes(c.zone));

  function addCity() {
    if (!pick) return;
    setShown([...shown, pick]);
    setPick("");
  }

  function removeCity(zone) {
    setShown(shown.filter((z) => z !== zone));
  }

  return (
    <section className={panel}>
      <h2 className={heading}>World Clock</h2>

      <ul className="divide-y divide-slate-200 text-left dark:divide-edge">
        {shown.map((zone) => {
          const city = CITIES.find((c) => c.zone === zone);
          return (
            <li key={zone} className="flex items-center justify-between gap-3 py-2">
              <div>
                <div className="font-semibold">{city.name}</div>
                <div className="text-xs text-slate-500 dark:text-muted">{dateIn(zone, now)}</div>
              </div>
              <div className="font-mono text-lg font-bold tabular-nums">{timeIn(zone, now)}</div>
              <button
                onClick={() => removeCity(zone)}
                aria-label={`Remove ${city.name}`}
                className="cursor-pointer rounded-md px-2 text-slate-400 hover:text-red-600 dark:hover:text-stop"
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>

      {shown.length === 0 && <p className="text-slate-500 dark:text-muted">No cities yet. Add one below.</p>}

      {available.length > 0 && (
        <div className="mt-4 flex gap-2">
          <select className={`${field} flex-1`} value={pick} onChange={(e) => setPick(e.target.value)}>
            <option value="">Add a city...</option>
            {available.map((c) => (
              <option key={c.zone} value={c.zone}>
                {c.name}
              </option>
            ))}
          </select>
          <button className={`${btn} bg-accent`} onClick={addCity} disabled={!pick}>
            Add
          </button>
        </div>
      )}
    </section>
  );
}

function formatCountdown(ms) {
  const total = Math.ceil(ms / 1000);
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

function Timer() {
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const endAt = Date.now() + remaining;
    const id = setInterval(() => {
      const left = endAt - Date.now();
      if (left <= 0) {
        setRemaining(0);
        setRunning(false);
      } else {
        setRemaining(left);
      }
    }, 100);

    return () => clearInterval(id);
  }, [running]);

  const notStarted = remaining === null;
  const finished = remaining === 0;
  const setupMs = (minutes * 60 + seconds) * 1000;

  function start() {
    if (notStarted) {
      if (setupMs <= 0) return;
      setRemaining(setupMs);
    }
    setRunning(true);
  }

  function reset() {
    setRunning(false);
    setRemaining(null);
  }

  const clamp = (value, max) => Math.max(0, Math.min(max, Number(value) || 0));

  return (
    <section className={panel}>
      <h2 className={heading}>Timer</h2>

      {notStarted ? (
        <div className="flex items-center justify-center gap-2 font-mono text-[2.6rem] font-bold">
          <input
            type="number"
            min="0"
            max="99"
            aria-label="Minutes"
            value={minutes}
            onChange={(e) => setMinutes(clamp(e.target.value, 99))}
            className={`${field} w-24 text-center text-3xl`}
          />
          <span>:</span>
          <input
            type="number"
            min="0"
            max="59"
            aria-label="Seconds"
            value={seconds}
            onChange={(e) => setSeconds(clamp(e.target.value, 59))}
            className={`${field} w-24 text-center text-3xl`}
          />
        </div>
      ) : (
        <div className={`${display} ${finished ? "text-red-600 dark:text-stop" : ""}`}>
          {formatCountdown(remaining)}
        </div>
      )}

      {finished && <p className="mt-2 font-semibold text-red-600 dark:text-stop">Time's up!</p>}

      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        <button className={`${btn} bg-go`} onClick={start} disabled={running || finished}>
          {notStarted ? "Start" : "Resume"}
        </button>
        <button className={`${btn} bg-lap`} onClick={() => setRunning(false)} disabled={!running}>
          Pause
        </button>
        <button className={`${btn} bg-accent`} onClick={reset} disabled={notStarted}>
          Reset
        </button>
      </div>
    </section>
  );
}

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  } catch {
    return [];
  }
}

function TodoList() {
  const [tasks, setTasks] = useState(loadTasks);
  const [text, setText] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(e) {
    e.preventDefault();
    const clean = text.trim();
    if (!clean) return;
    setTasks([...tasks, { id: Date.now(), text: clean, done: false }]);
    setText("");
  }

  function toggleTask(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  function clearDone() {
    setTasks(tasks.filter((t) => !t.done));
  }

  const left = tasks.filter((t) => !t.done).length;
  const hasDone = tasks.some((t) => t.done);

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

      {tasks.length === 0 ? (
        <p className="mt-4 text-slate-500 dark:text-muted">Nothing to do. Add a task above.</p>
      ) : (
        <ul className="mt-4 max-h-56 divide-y divide-slate-200 overflow-y-auto text-left dark:divide-edge">
          {tasks.map((t) => (
            <li key={t.id} className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggleTask(t.id)}
                className="h-4 w-4 cursor-pointer"
              />
              <span className={`flex-1 break-words ${t.done ? "text-slate-400 line-through dark:text-muted" : ""}`}>
                {t.text}
              </span>
              <button
                onClick={() => deleteTask(t.id)}
                aria-label={`Delete ${t.text}`}
                className="cursor-pointer rounded-md px-2 text-slate-400 hover:text-red-600 dark:hover:text-stop"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {tasks.length > 0 && (
        <div className="mt-3 flex items-center justify-between text-sm text-slate-500 dark:text-muted">
          <span>{left} left</span>
          {hasDone && (
            <button onClick={clearDone} className="cursor-pointer underline hover:text-slate-900 dark:hover:text-fg">
              Clear completed
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [dark, setDark] = useDarkMode();

  return (
    <div className="relative min-h-screen bg-slate-100 px-5 py-8 text-center text-slate-900 dark:bg-ink dark:text-fg">
      <button
        onClick={() => setDark(!dark)}
        className="absolute top-4 right-4 cursor-pointer rounded-[10px] border-2 border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 dark:border-edge dark:text-muted dark:hover:bg-panel"
      >
        {dark ? "Switch to light mode" : "Switch to dark mode"}
      </button>

      <h1 className="mt-10 mb-7 text-[2rem] font-bold text-blue-600 sm:mt-0 dark:text-accent">
        Clock + Stopwatch + More
      </h1>
      <div className="flex flex-wrap justify-center gap-6">
        <Clock />
        <Stopwatch />
        <WorldClock />
        <Timer />
        <TodoList />
      </div>
    </div>
  );
}