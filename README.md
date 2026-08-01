# <font color="Gray">Organ Attack! — A Digital Card Game</font>

## This is a team effort

## Our Team

| Name               | Role             |
| ------------------ | ---------------- |
| Sirisha Dalasari   | UI Dev           |
| Nandini Dasari     | Full Stack       |
| Vivek Bhardwaj     | Full Stack       |
| Samiran Gharami    | Business Analyst |
| Nikhil Chodavarapu | Full Stack       |
| Chiranjeevi Gurram | Full Stack       |
| Adityan K          | UI Dev           |
| Shivang Singh      | Quality Analyst  |

---

# About our game project

A collaborative effort by our team to make a turn-based (out-of-turn-response)
card game.

## `Organ Attack` description

- Players take turns to defend and afflict damage to each other's organs.

- Non-turn players can still defend themselves and play
  <font color='#b42929'>_**instant cards**_</font> to respond to attacks.

## 🌐 Try the Game

> [Play Here](https://organ-attack-leucocytes.onrender.com/)

Experience the game live in your browser! No installation needed — just gather
your friends. The live version supports:

- Real-time multiplayer (HTTP polling)
- Interactive game board

---

## 🛠 Tech Stack

| Layer    | Technology                            |
| -------- | ------------------------------------- |
| Runtime  | [Deno 2.x](https://deno.land/)        |
| Server   | [Hono 4.x](https://hono.dev/)         |
| Language | TypeScript + Vanilla JS               |
| Frontend | HTML / CSS / Vanilla JS               |
| Testing  | Deno test runner + `@std/testing/bdd` |
| CI       | GitHub Actions                        |

---

## 🚀 Getting Started

### Prerequisites

Install [Deno 2.x](https://docs.deno.com/runtime/getting_started/installation/):

```sh
# macOS / Linux
curl -fsSL https://deno.land/install.sh | sh
```

### Run locally

```sh
# Clone the repository
git clone https://github.com/step-batch-11/organ-attack-Leucocytes.git
cd organ-attack-Leucocytes

# Start the server (with hot-reload)
deno task dev
```

Open **http://localhost:8000** in your browser.

### Available tasks

```sh
deno task run             # start the server (port 8000)
deno task dev             # start with hot-reload (--watch)
deno task test            # run all tests
deno task test:watch      # run tests in watch mode
deno task test:coverage   # run tests with coverage report
deno task lint            # lint the codebase
```

---

## 🎲 How to Play

1. **Login** — enter your name on the home page to create a session.
2. **Create or Join a Room** — the host creates a room; guests enter the room ID
   on the join page.
3. **Start the Game** — the host clicks **Start Game** from the lobby once all
   players have joined.
4. **Take Turns** — play an attack card against an opponent's organ, or use a
   special card.
5. **Defend** — even when it's not your turn, play an
   <font color='#b42929'>instant card</font> to block incoming attacks.
6. **Win** — be the last player with at least one organ remaining!

---
