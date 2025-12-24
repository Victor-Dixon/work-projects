const STORAGE_KEY = "flowr_mock_state_v1";

/**
 * State machine:
 * - idle: no session
 * - running: startTs set, finishTs null
 * - finished: startTs set, finishTs set
 */
const DEFAULT_STATE = {
  mode: "nextHour", // "nextHour" | "duration"
  durationMinutes: 60,
  introMessage: "sup gang",
  outroMessage: "flowr this hour",
  startTs: null,
  finishTs: null,
};

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatHMS(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(sec)}`;
}

function formatTime(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function computeAutoFinishTs({ mode, startTs, durationMinutes }) {
  if (!startTs) return null;
  if (mode === "duration") {
    return startTs + durationMinutes * 60 * 1000;
  }
  // nextHour: top of the next hour
  const d = new Date(startTs);
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return d.getTime();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      durationMinutes: clamp(Number(parsed.durationMinutes ?? DEFAULT_STATE.durationMinutes), 5, 240),
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function toast(title, body) {
  const host = document.getElementById("toastHost");
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<div class="toastTitle"></div><div class="toastBody"></div>`;
  el.querySelector(".toastTitle").textContent = title;
  el.querySelector(".toastBody").textContent = body;
  host.appendChild(el);
  window.setTimeout(() => el.remove(), 4200);
}

function getPhase(state) {
  if (!state.startTs) return "idle";
  if (state.startTs && !state.finishTs) return "running";
  return "finished";
}

function setStatusUI(phase) {
  const statusText = document.getElementById("statusText");
  const dot = document.getElementById("statusDot");

  if (phase === "idle") {
    statusText.textContent = "Idle";
    dot.style.background = "rgba(255,255,255,0.35)";
    dot.style.boxShadow = "0 0 0 4px rgba(255,255,255,0.06)";
    return;
  }
  if (phase === "running") {
    statusText.textContent = "Smoking";
    dot.style.background = "rgba(75, 247, 165, 0.95)";
    dot.style.boxShadow = "0 0 0 4px rgba(75, 247, 165, 0.14)";
    return;
  }
  statusText.textContent = "Finished";
  dot.style.background = "rgba(255, 211, 79, 0.95)";
  dot.style.boxShadow = "0 0 0 4px rgba(255, 211, 79, 0.14)";
}

function setModeUI(state) {
  const nextHourBtn = document.getElementById("modeNextHour");
  const durationBtn = document.getElementById("modeDuration");
  const durationInput = document.getElementById("durationMinutes");
  const explainer = document.getElementById("ruleExplainer");

  nextHourBtn.classList.toggle("isActive", state.mode === "nextHour");
  durationBtn.classList.toggle("isActive", state.mode === "duration");

  durationInput.disabled = state.mode !== "duration";
  durationInput.value = String(state.durationMinutes);

  explainer.textContent =
    state.mode === "nextHour"
      ? "“Next hour” ends at the top of the next hour (your “flowr this hour” vibe)."
      : "“Duration” ends after N minutes from the moment you tapped “Smoked.”";
}

function render(state) {
  const phase = getPhase(state);
  setStatusUI(phase);
  setModeUI(state);

  const smokedAt = document.getElementById("smokedAt");
  const autoFinishAt = document.getElementById("autoFinishAt");
  const finishedAt = document.getElementById("finishedAt");
  const meta = document.getElementById("timerMeta");

  const autoFinishTs = computeAutoFinishTs(state);

  smokedAt.textContent = formatTime(state.startTs);
  autoFinishAt.textContent = formatTime(autoFinishTs);
  finishedAt.textContent = formatTime(state.finishTs);

  const startBtn = document.getElementById("btnStart");
  const resetBtn = document.getElementById("btnReset");
  const finishBtn = document.getElementById("btnFinish");

  startBtn.textContent = phase === "idle" ? "Smoked" : phase === "running" ? "Smoking…" : "Start again";
  startBtn.disabled = phase === "running";

  finishBtn.disabled = phase !== "running";
  resetBtn.disabled = phase === "idle";

  if (phase === "idle") meta.textContent = "Tap “Smoked” to start.";
  if (phase === "running") meta.textContent = "Auto-finish will trigger when the rule hits.";
  if (phase === "finished") meta.textContent = "Session finished. Reset or start again.";

  const intro = document.getElementById("introMessage");
  const outro = document.getElementById("outroMessage");
  intro.value = state.introMessage;
  outro.value = state.outroMessage;
}

function finishIfDue(state, now) {
  if (!state.startTs || state.finishTs) return state;
  const autoFinishTs = computeAutoFinishTs(state);
  if (!autoFinishTs) return state;
  if (now < autoFinishTs) return state;

  const finished = { ...state, finishTs: now };
  saveState(finished);
  toast("Flowr", state.outroMessage || "flowr this hour");
  return finished;
}

function main() {
  let state = loadState();

  // wire UI
  const startBtn = document.getElementById("btnStart");
  const resetBtn = document.getElementById("btnReset");
  const finishBtn = document.getElementById("btnFinish");
  const nextHourBtn = document.getElementById("modeNextHour");
  const durationBtn = document.getElementById("modeDuration");
  const durationInput = document.getElementById("durationMinutes");
  const introInput = document.getElementById("introMessage");
  const outroInput = document.getElementById("outroMessage");
  const elapsedEl = document.getElementById("elapsed");
  const commandForm = document.getElementById("commandForm");
  const commandInput = document.getElementById("commandInput");

  function update(partial) {
    state = { ...state, ...partial };
    saveState(state);
    render(state);
  }

  startBtn.addEventListener("click", () => {
    const phase = getPhase(state);
    if (phase === "running") return;
    const now = Date.now();
    update({ startTs: now, finishTs: null });
    toast("Flowr", state.introMessage || "sup gang");
  });

  finishBtn.addEventListener("click", () => {
    const phase = getPhase(state);
    if (phase !== "running") return;
    update({ finishTs: Date.now() });
    toast("Flowr", state.outroMessage || "flowr this hour");
  });

  resetBtn.addEventListener("click", () => {
    state = { ...DEFAULT_STATE, mode: state.mode, durationMinutes: state.durationMinutes, introMessage: state.introMessage, outroMessage: state.outroMessage };
    saveState(state);
    render(state);
    toast("Flowr", "Reset.");
  });

  nextHourBtn.addEventListener("click", () => update({ mode: "nextHour" }));
  durationBtn.addEventListener("click", () => update({ mode: "duration" }));

  durationInput.addEventListener("change", () => {
    const n = clamp(Number(durationInput.value || 60), 5, 240);
    update({ durationMinutes: n });
  });

  introInput.addEventListener("input", () => update({ introMessage: introInput.value }));
  outroInput.addEventListener("input", () => update({ outroMessage: outroInput.value }));

  commandForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = commandInput.value.trim().toLowerCase();
    commandInput.value = "";
    if (!raw) return;

    if (raw === "help") {
      toast("Commands", "smoke / done / reset / help");
      return;
    }
    if (raw === "smoke") {
      startBtn.click();
      return;
    }
    if (raw === "done") {
      finishBtn.click();
      return;
    }
    if (raw === "reset") {
      resetBtn.click();
      return;
    }
    toast("Unknown command", `Try: smoke / done / reset / help`);
  });

  // initial render
  render(state);

  // tick
  window.setInterval(() => {
    const now = Date.now();
    const prevFinishTs = state.finishTs;
    state = finishIfDue(state, now);
    if (prevFinishTs !== state.finishTs) {
      render(state);
    }

    const phase = getPhase(state);
    const start = state.startTs ?? now;
    const elapsedMs =
      phase === "idle" ? 0 : (state.finishTs ?? now) - start;
    elapsedEl.textContent = formatHMS(elapsedMs);

    // Keep the “Session” timestamps fresh (auto-finish time can change if mode/duration changed)
    if (phase !== "idle") {
      const autoFinishTs = computeAutoFinishTs(state);
      document.getElementById("autoFinishAt").textContent = formatTime(autoFinishTs);
    }
  }, 250);
}

document.addEventListener("DOMContentLoaded", main);
