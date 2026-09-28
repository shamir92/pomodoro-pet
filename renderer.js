// Pomodoro Pet v2 — renderer

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
  animal: "cat",
};

const $ = (id) => document.getElementById(id);

// ===== TIME =====
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function updateDisplay() {
  $("timerDisplay").textContent = formatTime(state.timeLeft);
}

// ===== DOTS =====
function renderDots() {
  const el = $("dots");
  el.innerHTML = "";
  for (let i = 0; i < state.goal; i++) {
    const d = document.createElement("span");
    d.className = "dot" + (i < state.pomodoros ? " done" : "");
    el.appendChild(d);
  }
}

// ===== PHASE =====
function setPhase(phase) {
  state.phase = phase;
  const label = $("phaseLabel");
  const pet = $("petInner");
  const status = $("statusText");

  label.className = "phase";
  pet.classList.remove("break-state", "happy-state", "idle-state");

  switch (phase) {
    case PHASES.WORK:
      label.textContent = "Work";
      status.textContent = getRandomMsg("work");
      break;
    case PHASES.SHORT:
      label.textContent = "Break";
      label.classList.add("break");
      pet.classList.add("break-state");
      status.textContent = getRandomMsg("break");
      break;
    case PHASES.LONG:
      label.textContent = "Long Break";
      label.classList.add("long-break");
      pet.classList.add("break-state");
      status.textContent = getRandomMsg("long");
      break;
    case PHASES.IDLE:
      label.textContent = "Ready";
      pet.classList.add("idle-state");
      status.textContent = getRandomMsg("idle");
      break;
  }
}

const MESSAGES = {
  work: ["Let's work! 🐱", "Focus mode ON", "You got this! 💪", "Deep work time"],
  break: ["Stretch time! ✨", "Breathe~", "Coffee break ☕", "Rest those eyes"],
  long: ["You earned this 😺", "Long break! 🎉", "Go recharge!"],
  idle: ["Ready when you are 🐱", "Tap ▶ to start", "Let's go!"],
  click: ["Meow! 😺", "Purr~", "Focus! 🎯", "Let's go!", "You got this!"],
};

function getRandomMsg(type) {
  const arr = MESSAGES[type] || MESSAGES.click;
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===== DURATIONS =====
function setDurations() {
  switch (state.phase) {
    case PHASES.WORK:   state.totalTime = state.workMin * 60; break;
    case PHASES.SHORT:  state.totalTime = state.shortMin * 60; break;
    case PHASES.LONG:   state.totalTime = state.longMin * 60; break;
  }
  state.timeLeft = state.totalTime;
}

// ===== TIMER =====
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
  if (state.phase === PHASES.WORK) {
    state.pomodoros++;
    renderDots();
    const pet = $("petInner");
    pet.classList.add("happy-state");
    setTimeout(() => pet.classList.remove("happy-state"), 1500);

    if (state.pomodoros >= state.goal) {
      setPhase(PHASES.LONG);
      $("statusText").textContent = `${state.pomodoros}/${state.goal} done! Long break 🎉`;
    } else {
      setPhase(PHASES.SHORT);
      $("statusText").textContent = `${state.pomodoros}/${state.goal} done! 🎉`;
    }
  } else {
    if (state.phase === PHASES.LONG) {
      state.pomodoros = 0;
      renderDots();
      setPhase(PHASES.IDLE);
      return;
    }
    setPhase(PHASES.WORK);
  }
  setDurations();
  updateDisplay();
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
  renderDots();
  setPhase(PHASES.IDLE);
  state.timeLeft = state.workMin * 60;
  state.totalTime = state.workMin * 60;
  updateDisplay();
}

// ===== SETTINGS =====
function toggleSettings() {
  const p = $("settingsPanel");
  p.style.display = p.style.display === "none" ? "" : "none";
}

function saveSettings() {
  state.workMin = parseInt($("workInput").value) || 25;
  state.shortMin = parseInt($("shortInput").value) || 5;
  state.longMin = parseInt($("longInput").value) || 15;
  state.goal = parseInt($("goalInput").value) || 4;
  renderDots();
  toggleSettings();
  if (!state.running && state.phase === PHASES.IDLE) {
    state.timeLeft = state.workMin * 60;
    state.totalTime = state.workMin * 60;
    updateDisplay();
  }
}

// ===== ANIMAL =====
function setAnimal(name) {
  state.animal = name;
  const pet = $("petInner");
  // Remove all animal classes
  pet.className = "pet-inner";
  pet.classList.add(`a-${name}`);
  // Re-apply current state class
  if (state.phase === PHASES.SHORT || state.phase === PHASES.LONG) pet.classList.add("break-state");
  else if (state.phase === PHASES.IDLE) pet.classList.add("idle-state");

  // Highlight selected button
  document.querySelectorAll(".animal-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.animal === name);
  });
}

// ===== INTERACTIONS =====
function petClick() {
  const pet = $("petInner");
  pet.classList.add("happy-state");
  $("statusText").textContent = getRandomMsg("click");
  setTimeout(() => {
    pet.classList.remove("happy-state");
    // Restore phase state
    if (state.phase === PHASES.SHORT || state.phase === PHASES.LONG) pet.classList.add("break-state");
    else if (state.phase === PHASES.IDLE) pet.classList.add("idle-state");
  }, 800);
}

function close() {
  window.petAPI?.quit?.();
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  $("startBtn").addEventListener("click", start);
  $("pauseBtn").addEventListener("click", pause);
  $("resetBtn").addEventListener("click", reset);
  $("settingsBtn").addEventListener("click", toggleSettings);
  $("spClose").addEventListener("click", toggleSettings);
  $("saveBtn").addEventListener("click", saveSettings);
  $("closeBtn").addEventListener("click", close);
  $("pet").addEventListener("click", petClick);

  // Animal picker
  document.querySelectorAll(".animal-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setAnimal(btn.dataset.animal);
    });
  });

  setAnimal("cat");
  setPhase(PHASES.IDLE);
  renderDots();
  updateDisplay();
});
