import { useState, useEffect } from "react";
import WorldClock from "./model/WorldClock";
import Timer from "./model/Timer";
import TodoList from "./model/TodoList";

const pad = (n) => String(n).padStart(2, "0");

const panel =
  "w-full max-w-[380px] rounded-2xl border-2 border-slate-200 bg-white px-5 py-7 dark:border-edge dark:bg-panel";
const heading = "mb-4 text-[1.1rem] font-bold text-slate-500 dark:text-muted";
const display = "font-mono text-[2.6rem] font-bold tracking-[2px] tabular-nums";
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