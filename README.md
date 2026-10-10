# Clock + Stopwatch (React + CSS)

1. npm install
2. npm run dev
3. Open http://localhost:5173

# Class Diagram

Class diagram of the Clock + Stopwatch + More app.

- **Components** draw the screen.
- **Models** hold the data and rules for the three new features: World Clock, Timer and To-Do List.

```mermaid
classDiagram
    direction LR

    class App {
        <<component>>
        -boolean dark
        +setDark(value) void
    }

    class Clock {
        <<component>>
        -Date now
    }

    class Stopwatch {
        <<component>>
        -number elapsed
        -boolean running
        -Array laps
        +addLap() void
        +reset() void
        +lapColor(lap) String
    }

    class WorldClock {
        <<component>>
        -Date now
        -WorldClockModel clock
        -String pick
        +addCity() void
    }

    class Timer {
        <<component>>
        -TimerModel timer
    }

    class TodoList {
        <<component>>
        -TodoModel todo
        -String text
        +addTask(e) void
    }

    class WorldClockModel {
        <<model>>
        +Array CITIES$
        +Array shown
        +Array cities
        +Array available
        +addCity(zone) WorldClockModel
        +removeCity(zone) WorldClockModel
        +timeIn(zone, date)$ String
        +dateIn(zone, date)$ String
    }

    class TimerModel {
        <<model>>
        +number minutes
        +number seconds
        +number remaining
        +boolean running
        +boolean notStarted
        +boolean finished
        +number setupMs
        +with(changes) TimerModel
        +setMinutes(value) TimerModel
        +setSeconds(value) TimerModel
        +start() TimerModel
        +pause() TimerModel
        +reset() TimerModel
        +tick(left) TimerModel
        +clamp(value, max)$ number
        +format(ms)$ String
    }

    class TodoModel {
        <<model>>
        +Array tasks
        +number left
        +boolean hasDone
        +load()$ TodoModel
        +save() void
        +add(text) TodoModel
        +toggle(id) TodoModel
        +remove(id) TodoModel
        +clearDone() TodoModel
    }

    class City {
        +String name
        +String zone
    }

    class Task {
        +number id
        +String text
        +boolean done
    }

    App *-- Clock : renders
    App *-- Stopwatch : renders
    App *-- WorldClock : renders
    App *-- Timer : renders
    App *-- TodoList : renders

    WorldClock --> WorldClockModel : uses
    Timer --> TimerModel : uses
    TodoList --> TodoModel : uses

    WorldClockModel "1" o-- "*" City : contains
    TodoModel "1" o-- "*" Task : contains

    note for WorldClockModel "src/model/WorldClock.jsx"
    note for TimerModel "src/model/Timer.jsx"
    note for TodoModel "src/model/TodoList.jsx"
```

## Legend

| Symbol | Meaning |
|---|---|
| `<<component>>` | React component that draws part of the screen |
| `<<model>>` | Class that holds data and rules for a feature |
| `*--` | `App` renders that component |
| `-->` | A component uses its model |
| `o--` | A model contains a list of items |
| `$` | Static member, called on the class itself (for example `TimerModel.format()`) |