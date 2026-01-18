let gameActive = false;
let score = 0;
let level = 1;
let currentQuestion = 0;
const totalQuestions = 10;
let correctTime = { h: 0, m: 0 };
let difficulty = "easy";

const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const questionEl = document.getElementById("question");
const hintEl = document.getElementById("hint");
const timeButtonsEl = document.getElementById("timeButtons");
const feedbackEl = document.getElementById("feedback");
const gameOverEl = document.getElementById("gameOver");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const canvas = document.getElementById("clockCanvas");
const ctx = canvas.getContext("2d");

function setDifficulty(level, btn) {
  if (gameActive) return;
  difficulty = level;

  document.querySelectorAll(".difficulty-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function startGame() {
  if (gameActive) return;
  gameActive = true;

  score = 0;
  level = 1;
  currentQuestion = 0;

  scoreEl.textContent = "0";
  levelEl.textContent = "1";
  feedbackEl.textContent = "";
  gameOverEl.classList.remove("show");

  updateProgress();
  nextQuestion();
}

function updateProgress() {
  const percent = (currentQuestion / totalQuestions) * 100;
  progressFill.style.width = percent + "%";
  progressText.textContent = `${currentQuestion}/${totalQuestions}`;
}

function nextQuestion() {
  if (currentQuestion >= totalQuestions) {
    endGame();
    return;
  }

  feedbackEl.textContent = "";

  if (difficulty === "easy") {
    correctTime = { h: randomHour(), m: 0 };
    hintEl.textContent = "Big hand at 12 means o'clock.";
  } 
  else if (difficulty === "medium") {
    correctTime = { h: randomHour(), m: [0,15,30,45][rand(4)] };
    hintEl.textContent = "Big hand points to 3, 6, 9 or 12.";
  } 
  else {
    correctTime = { h: randomHour(), m: rand(12) * 5 };
    hintEl.textContent = "Each number is 5 minutes.";
  }

  questionEl.textContent = "What time is shown?";
  drawClock(correctTime.h, correctTime.m);
  createOptions();
}

function createOptions() {
  const options = [formatTime(correctTime)];

  while (options.length < 4) {
    const fake = {
      h: randomHour(),
      m: difficulty === "easy" ? 0 : rand(12) * 5
    };
    const formatted = formatTime(fake);
    if (!options.includes(formatted)) options.push(formatted);
  }

  options.sort(() => Math.random() - 0.5);
  timeButtonsEl.innerHTML = "";

  options.forEach(time => {
    const btn = document.createElement("button");
    btn.className = "time-btn";
    btn.textContent = time;
    btn.onclick = () => checkAnswer(time, btn);
    timeButtonsEl.appendChild(btn);
  });
}

function checkAnswer(selected, btn) {
  const correct = formatTime(correctTime);
  document.querySelectorAll(".time-btn").forEach(b => b.disabled = true);

  if (selected === correct) {
    btn.classList.add("correct");
    score++;
    if (score % 3 === 0) level++;
    feedbackEl.textContent = "✅ Correct!";
  } else {
    btn.classList.add("wrong");
    feedbackEl.textContent = `❌ Correct time was ${correct}`;
  }

  scoreEl.textContent = score;
  levelEl.textContent = level;
  currentQuestion++;
  updateProgress();

  setTimeout(nextQuestion, 1500);
}

function endGame() {
  gameActive = false;
  document.getElementById("finalScore").textContent =
    `You scored ${score} / ${totalQuestions}`;
  gameOverEl.classList.add("show");
}

function resetGame() {
  gameActive = false;
  ctx.clearRect(0,0,350,350);
  timeButtonsEl.innerHTML = "";
  feedbackEl.textContent = "";
  questionEl.textContent = "Click START to begin learning time!";
  progressFill.style.width = "0%";
  progressText.textContent = "0/10";
  gameOverEl.classList.remove("show");
}

function drawClock(h, m) {
  const cx = 175, cy = 175, r = 150;
  ctx.clearRect(0,0,350,350);

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI*2);
  ctx.stroke();

  const hourAngle = ((h%12)+m/60)*Math.PI/6 - Math.PI/2;
  const minAngle = m*Math.PI/30 - Math.PI/2;

  drawHand(hourAngle, 70, 8);
  drawHand(minAngle, 110, 4);
}

function drawHand(angle, length, width) {
  ctx.beginPath();
  ctx.moveTo(175,175);
  ctx.lineTo(175 + length*Math.cos(angle), 175 + length*Math.sin(angle));
  ctx.lineWidth = width;
  ctx.stroke();
}

function formatTime(t) {
  return `${t.h}:${t.m.toString().padStart(2,"0")}`;
}

function randomHour() {
  return rand(12) + 1;
}

function rand(max) {
  return Math.floor(Math.random() * max);
}
