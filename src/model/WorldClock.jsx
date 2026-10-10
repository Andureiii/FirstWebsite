import { useState, useEffect } from "react";

const panel =
  "w-full max-w-[380px] rounded-2xl border-2 border-slate-200 bg-white px-5 py-7 dark:border-edge dark:bg-panel";
const heading = "mb-4 text-[1.1rem] font-bold text-slate-500 dark:text-muted";
const field =
  "rounded-[10px] border-2 border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-edge dark:bg-ink dark:text-fg";
const btn =
  "cursor-pointer rounded-[10px] px-[18px] py-2.5 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40";

class WorldClockModel {
  static CITIES = [
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

  constructor(shown = ["Asia/Manila", "Asia/Tokyo", "Europe/London", "America/New_York"]) {
    this.shown = shown;
  }

  get cities() {
    return this.shown.map((zone) => WorldClockModel.CITIES.find((c) => c.zone === zone));
  }

  get available() {
    return WorldClockModel.CITIES.filter((c) => !this.shown.includes(c.zone));
  }

  addCity(zone) {
    if (!zone || this.shown.includes(zone)) return this;
    return new WorldClockModel([...this.shown, zone]);
  }

  removeCity(zone) {
    return new WorldClockModel(this.shown.filter((z) => z !== zone));
  }

  static timeIn(zone, date) {
    return date.toLocaleTimeString("en-US", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
  }

  static dateIn(zone, date) {
    return date.toLocaleDateString("en-US", {
      timeZone: zone,
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
}

export default function WorldClock() {
  const [now, setNow] = useState(new Date());
  const [clock, setClock] = useState(new WorldClockModel());
  const [pick, setPick] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  function addCity() {
    setClock(clock.addCity(pick));
    setPick("");
  }

  return (
    <section className={panel}>
      <h2 className={heading}>World Clock</h2>

      <ul className="divide-y divide-slate-200 text-left dark:divide-edge">
        {clock.cities.map((city) => (
          <li key={city.zone} className="flex items-center justify-between gap-3 py-2">
            <div>
              <div className="font-semibold">{city.name}</div>
              <div className="text-xs text-slate-500 dark:text-muted">
                {WorldClockModel.dateIn(city.zone, now)}
              </div>
            </div>
            <div className="font-mono text-lg font-bold tabular-nums">
              {WorldClockModel.timeIn(city.zone, now)}
            </div>
            <button
              onClick={() => setClock(clock.removeCity(city.zone))}
              aria-label={`Remove ${city.name}`}
              className="cursor-pointer rounded-md px-2 text-slate-400 hover:text-red-600 dark:hover:text-stop"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {clock.shown.length === 0 && (
        <p className="text-slate-500 dark:text-muted">No cities yet. Add one below.</p>
      )}

      {clock.available.length > 0 && (
        <div className="mt-4 flex gap-2">
          <select className={`${field} flex-1`} value={pick} onChange={(e) => setPick(e.target.value)}>
            <option value="">Add a city...</option>
            {clock.available.map((c) => (
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