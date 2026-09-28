# Pomodoro Pet 🐱

A Pomodoro timer that sits on your Mac desktop as a little pet character. The pet works and breaks with you — it bounces when you complete a pomodoro, relaxes during breaks, and you can click it for encouragement.

## Setup (Mac)

```bash
cd pomodoro-pet
npm install
npm start
```

## Build as a Mac app (.dmg)

```bash
npm run build
```

This creates a `.dmg` installer in the `dist/` folder.

## Features

- **25/5/15 Pomodoro cycle** (configurable)
- **Always-on-top** — the pet stays visible above all windows
- **Transparent window** — only the pet card is visible
- **Pet reactions:**
  - 😺 Working — steady breathing animation
  - ✨ Break — relaxed, tail slows down
  - 🎉 Pomodoro complete — bounces happily
  - Click the pet for a random encouragement message
- **Configurable** — change work/break/long-break durations and daily goal
- **Progress tracker** — shows "3/4 done" when you're close to your goal
- **System tray** — quit or show/hide from the menu bar

## Customization

- **Change pet color:** edit `.pet-body` background in `style.css`
- **Change durations:** click ⚙ in the pet UI
- **Change pet:** replace the pet HTML in `index.html`
