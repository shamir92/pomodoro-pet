// Pomodoro Pet — renderer

const PHASES = { WORK: "work", SHORT: "short", LONG: "long", IDLE: "idle" };

let state = {
  phase: PHASES.IDLE,
  running: false,
  timeLeft: 25 * 60,
  totalTime: 25 * 60,
  pomodoros: 0,
  interval: null,
  workMin: 25,
  shortMin: 5,
  longMin: 15,
  goal: 4,
};

const $ = (id) => document.getElementById(id);

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function updateDisplay() {
  $("timerDisplay").textContent = formatTime(state.timeLeft);
  document.title = `${formatTime(state.timeLeft)} — Pomodoro Pet`;
}

function setPhase(phase) {
  state.phase = phase;
  const label = $("phaseLabel");
  const pet = $("pet");
  const status = $("statusText");

  label.className = "phase";
  pet.className = "pet";

  switch (phase) {
    case PHASES.WORK:
      label.textContent = "Work";
      status.textContent = "Let's work! 🐱";
      break;
    case PHASES.SHORT:
      label.textContent = "Break";
      label.classList.add("break");
      pet.classList.add("break");
      status.textContent = "Stretch time 🐱✨";
      break;
    case PHASES.LONG:
      label.textContent = "Long Break";
      label.classList.add("long-break");
      pet.classList.add("break");
      status.textContent = "You earned this 😺";
      break;
    case PHASES.IDLE:
      label.textContent = "Ready";
      status.textContent = "Ready when you are 🐱";
      break;
  }
}

function setDurations() {
  switch (state.phase) {
    case PHASES.WORK:
      state.totalTime = state.workMin * 60;
      break;
    case PHASES.SHORT:
      state.totalTime = state.shortMin * 60;
      break;
    case PHASES.LONG:
      state.totalTime = state.longMin * 60;
      break;
  }
  state.timeLeft = state.totalTime;
}

function tick() {
  state.timeLeft--;
  if (state.timeLeft <= 0) {
    clearInterval(state.interval);
    state.interval = null;
    state.running = false;
    onPhaseComplete();
    return;
  }
  updateDisplay();
}

function onPhaseComplete() {
  // Play a subtle notification
  try {
    new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YU").play().catch(() => {});
  } catch {}

  if (state.phase === PHASES.WORK) {
    state.pomodoros++;
    const pet = $("pet");
    pet.classList.add("happy");
    setTimeout(() => pet.classList.remove("happy"), 1600);

    if (state.pomodoros >= state.goal) {
      setPhase(PHASES.LONG);
      $("statusText").textContent = `${state.pomodoros} done! Long break 🎉`;
    } else {
      setPhase(PHASES.SHORT);
      $("statusText").textContent = `${state.pomodoros}/${state.goal} done! 🎉`;
    }
  } else {
    // Break over → back to work (or idle if goal not met)
    if (state.phase === PHASES.LONG) {
      state.pomodoros = 0;
      setPhase(PHASES.IDLE);
      $("statusText").textContent = "Fresh start! 🐱";
      return;
    }
    setPhase(PHASES.WORK);
  }

  setDurations();
  updateDisplay();
  // Auto-start next phase
  start();
}

function start() {
  if (state.running) return;
  if (state.phase === PHASES.IDLE) {
    setPhase(PHASES.WORK);
    setDurations();
    updateDisplay();
  }
  state.running = true;
  state.interval = setInterval(tick, 1000);
  $("startBtn").style.display = "none";
  $("pauseBtn").style.display = "";
}

function pause() {
  state.running = false;
  clearInterval(state.interval);
  state.interval = null;
  $("startBtn").style.display = "";
  $("pauseBtn").style.display = "none";
}

function reset() {
  pause();
  state.pomodoros = 0;
  setPhase(PHASES.IDLE);
  state.timeLeft = state.workMin * 60;
  state.totalTime = state.workMin * 60;
  updateDisplay();
}

// Settings
function toggleSettings() {
  const p = $("settingsPanel");
  p.style.display = p.style.display === "none" ? "" : "none";
}

function saveSettings() {
  state.workMin = parseInt($("workInput").value) || 25;
  state.shortMin = parseInt($("shortInput").value) || 5;
  state.longMin = parseInt($("longInput").value) || 15;
  state.goal = parseInt($("goalInput").value) || 4;
  toggleSettings();
  if (!state.running && state.phase === PHASES.IDLE) {
    state.timeLeft = state.workMin * 60;
    state.totalTime = state.workMin * 60;
    updateDisplay();
  }
}

// Pet interaction — click pet to toggle eye / meow
function petClick() {
  const pet = $("pet");
  pet.classList.add("happy");
  const messages = ["Meow! 😺", "Purr~", "Let's go!", "Focus! 🎯", "You got this!"];
  $("statusText").textContent = messages[Math.floor(Math.random() * messages.length)];
  setTimeout(() => pet.classList.remove("happy"), 800);
}

// Close
function close() {
  window.petAPI?.quit?.();
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  $("startBtn").addEventListener("click", start);
  $("pauseBtn").addEventListener("click", pause);
  $("resetBtn").addEventListener("click", reset);
  $("settingsBtn").addEventListener("click", toggleSettings);
  $("saveBtn").addEventListener("click", saveSettings);
  $("closeBtn").addEventListener("click", close);
  $("pet").addEventListener("click", petClick);

  setPhase(PHASES.IDLE);
  updateDisplay();
});
