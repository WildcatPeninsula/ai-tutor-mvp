// ── AI Tutor for Kids 8-12 — Main App Logic ──
// Zero dependencies. Pure vanilla JS. Works offline.

/* ── STATE ── */
let state = {
  currentSubject: null,
  currentDifficulty: null,
  currentLessonIdx: 0,
  currentStepIdx: 0,
  stepCorrect: 0,
  stars: 0,
  totalStars: 0,
  lessonsCompleted: 0,
  subjectLessons: { math: 0, reading: 0, science: 0 },
  badges: [],
  history: [],
  perfectLessons: 0,
  parentPin: "1234"
};

// Load persisted state
try {
  const saved = localStorage.getItem("aiTutorState");
  if (saved) { Object.assign(state, JSON.parse(saved)); }
} catch(e) {}

function persist() {
  try { localStorage.setItem("aiTutorState", JSON.stringify(state)); } catch(e) {}
}

/* ── NAVIGATION ── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.setAttribute('hidden', ''));
  document.getElementById(id).removeAttribute('hidden');
}

function goHome() { updateHeaderStats(); showScreen('screenHome'); }

function updateHeaderStats() {
  document.getElementById('totalStars').textContent = state.totalStars;
  document.getElementById('totalBadges').textContent = state.badges.length;
}

/* ── SUBJECT SELECTION ── */
function startSubject(subject) {
  state.currentSubject = subject;
  showScreen('screenDifficulty');
}

/* ── DIFFICULTY → LESSON ── */
function startLesson(difficulty) {
  state.currentDifficulty = difficulty;
  state.currentLessonIdx = getLessonIndex(subjectDiffKey());
  state.currentStepIdx = 0;
  state.stepCorrect = 0;

  const subjectName = state.currentSubject.charAt(0).toUpperCase() + state.currentSubject.slice(1);
  document.getElementById('lessonSubjectBadge').textContent = `${getSubjectEmoji()} ${subjectName}`;
  document.getElementById('lessonStars').textContent = state.stars;

  showScreen('screenLesson');
  renderStep();
}

function subjectDiffKey() {
  return `${state.currentSubject}_${state.currentDifficulty}`;
}

function getLessonIndex(key) {
  // Map difficulty to lesson index: beginner=0, intermediate=3, advanced=6
  const map = { beginner: 0, intermediate: 3, advanced: 6 };
  return map[state.currentDifficulty] || 0;
}

/* ── RENDER STEP ── */
function renderStep() {
  const key = subjectDiffKey();
  const lessons = LESSONS[state.currentSubject];
  if (!lessons) return;

  const lessonIdx = getLessonIndex(key);
  const lesson = lessons[lessonIdx];
  if (!lesson || !lesson.steps) {
    // Try alternate lessons
    const altIdx = Math.floor(Math.random() * lessons.length);
    renderStepFrom(lessons, altIdx);
    return;
  }

  const progress = ((state.currentStepIdx) / lesson.steps.length) * 100;
  document.getElementById('progressBar').style.width = progress + '%';

  const step = lesson.steps[state.currentStepIdx];
  document.getElementById('tutorBubble').innerHTML = step.q.replace(/\n/g, '<br>');

  // Clear previous answer
  const answerArea = document.getElementById('answerArea');
  answerArea.innerHTML = '';
  document.getElementById('feedbackArea').innerHTML = '';
  document.getElementById('feedbackArea').className = 'feedback-area';
  document.getElementById('lessonActions').hidden = true;

  if (step.type === 'word') {
    answerArea.innerHTML = `
      <input type="text" class="answer-input" id="answerInput" placeholder="Type your answer..." autocomplete="off">
      <div style="text-align:center;margin-top:1rem"><button class="btn-primary" onclick="checkAnswer()">Check! ✅</button></div>`;
    setTimeout(() => { const inp = document.getElementById('answerInput'); if(inp){inp.focus(); inp.addEventListener('keydown', e => { if(e.key==='Enter') checkAnswer(); }); } }, 100);
  } else if (step.type === 'choice') {
    const choicesHTML = step.choices.map((c, i) =>
      `<button class="choice-btn" onclick="checkChoice(${i}, this)">${c}</button>`
    ).join('');
    answerArea.innerHTML = `<div class="choices">${choicesHTML}</div>`;
    setTimeout(() => {
      const btns = answerArea.querySelectorAll('.choice-btn');
      if(btns[0]) { btns[0].focus(); }
    }, 100);
  } else if (step.type === 'word_order') {
    answerArea.innerHTML = `
      <p style="text-align:center;color:#888;margin-bottom:.5rem">Tap the words in the right order:</p>
      <div id="wordOrderDisplay" class="word-display" style="font-size:1.2rem;letter-spacing:.15rem;min-height:2rem">___ ___ ___ ___ ___</div>
      <div id="wordBank" class="choices" style="margin-top:1rem"></div>
      <div style="text-align:center;margin-top:1rem"><button class="btn-primary" onclick="checkWordOrder()">Check! ✅</button></div>`;
    // Shuffle words for word-order challenge
    const shuffled = [...step.words].sort(() => Math.random() - 0.5);
    const wb = document.getElementById('wordBank');
    shuffled.forEach((w, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = w;
      btn.dataset.word = w;
      btn.onclick = () => toggleWord(w, btn);
      wb.appendChild(btn);
    });
    state._wordSelected = [];
    state._correctOrder = step.correct_order || step.hint_words;
    setTimeout(() => { const btns = answerArea.querySelectorAll('.choice-btn'); if(btns[0]) btns[0].focus(); }, 100);
  } else {
    // Default: text input
    answerArea.innerHTML = `
      <input type="text" class="answer-input" id="answerInput" placeholder="Type your answer..." autocomplete="off">
      <div style="text-align:center;margin-top:1rem"><button class="btn-primary" onclick="checkAnswer()">Check! ✅</button></div>`;
    setTimeout(() => { const inp = document.getElementById('answerInput'); if(inp){inp.focus(); inp.addEventListener('keydown', e => { if(e.key==='Enter') checkAnswer(); }); } }, 100);
  }
}

function renderStepFrom(lessons, idx) {
  // Fallback: pick any lesson from this subject
  const lesson = lessons[idx % lessons.length];
  state._alternateLesson = lesson;
  state._alternateSubject = state.currentSubject;
  renderStep();
}

/* ── WORD ORDER ── */
function toggleWord(word, btn) {
  if (!state._wordSelected) state._wordSelected = [];
  if (state._wordSelected.includes(word)) {
    state._wordSelected = state._wordSelected.filter(w => w !== word);
    btn.style.opacity = '1';
  } else {
    state._wordSelected.push(word);
    btn.style.opacity = '0.3';
  }
  document.getElementById('wordOrderDisplay').textContent = state._wordSelected.join(' ');
}

/* ── CHECK ANSWER ── */
function checkAnswer() {
  const step = getStep();
  if (!step) return;
  const input = document.getElementById('answerInput');
  if (!input) return;
  const val = input.value.trim().toLowerCase();
  const correct = String(step.a).toLowerCase();

  if (val === correct) {
    input.classList.add('correct');
    showFeedback(true, step.feedback);
    state.stepCorrect++;
    state.stars++;
    state.totalStars++;
    document.getElementById('lessonStars').textContent = state.stars;
  } else {
    input.classList.add('wrong');
    showFeedback(false, `Not quite! ${step.hint || 'Try the next one!'} 🤔`);
  }
  input.disabled = true;
  document.getElementById('lessonActions').hidden = false;
  checkBadges();
  persist();
}

function checkChoice(idx, btnEl) {
  const step = getStep();
  if (!step || !step.choices) return;
  const selected = step.choices[idx];
  const correct = step.a;
  const btns = document.querySelectorAll('.choice-btn');

  btns.forEach((b, i) => {
    b.disabled = true;
    if (step.choices[i] === correct) b.classList.add('correct');
  });

  if (selected === correct) {
    btnEl.classList.add('correct');
    showFeedback(true, step.feedback);
    state.stepCorrect++;
    state.stars++;
    state.totalStars++;
    document.getElementById('lessonStars').textContent = state.stars;
  } else {
    btnEl.classList.add('wrong');
    showFeedback(false, `The right answer was "${correct}". ${step.hint || 'Keep going!'} 🤔`);
  }
  document.getElementById('lessonActions').hidden = false;
  checkBadges();
  persist();
}

function checkWordOrder() {
  const step = getStep();
  if (!step || !step.correct_order) return;
  const selected = state._wordSelected.map(w => w.charAt(0).toUpperCase() + w.slice(1));
  const correct = step.correct_order;
  const isCorrect = selected.length === correct.length && selected.every((w, i) => w.toLowerCase() === correct[i].toLowerCase());

  if (isCorrect) {
    document.getElementById('wordOrderDisplay').style.color = '#2e7d32';
    showFeedback(true, step.feedback);
    state.stepCorrect++;
    state.stars++;
    state.totalStars++;
    document.getElementById('lessonStars').textContent = state.stars;
  } else {
    document.getElementById('wordOrderDisplay').style.color = '#c62828';
    showFeedback(false, `The right order is: "${correct.join(' ')}". 🤔`);
  }
  // Disable word buttons
  document.querySelectorAll('#wordBank .choice-btn').forEach(b => { b.disabled = true; b.style.opacity = '0.5'; });
  document.getElementById('lessonActions').hidden = false;
  checkBadges();
  persist();
}

function getStep() {
  const key = subjectDiffKey();
  const lessons = LESSONS[state.currentSubject];
  const lessonIdx = getLessonIndex(key);
  const lesson = lessons[lessonIdx] || state._alternateLesson || lessons[Math.floor(Math.random() * lessons.length)];
  return lesson.steps[state.currentStepIdx] || lesson.steps[0];
}

function showIconEmoji() {
  return getSubjectEmoji();
}

function getSubjectEmoji() {
  const map = { math: '➕', reading: '📖', science: '🔬' };
  return map[state.currentSubject] || '📚';
}

/* ── FEEDBACK ── */
function showFeedback(correct, message) {
  const el = document.getElementById('feedbackArea');
  el.textContent = message;
  el.className = 'feedback-area ' + (correct ? 'feedback-correct' : 'feedback-wrong');
}

/* ── NEXT STEP ── */
function nextStep() {
  const key = subjectDiffKey();
  const lessons = LESSONS[state.currentSubject];
  const lessonIdx = getLessonIndex(key);
  const lesson = lessons[lessonIdx] || state._alternateLesson || { steps: [] };

  if (state.currentStepIdx < lesson.steps.length - 1) {
    state.currentStepIdx++;
    renderStep();
  } else {
    // Lesson complete!
    completeLesson();
  }
}

function completeLesson() {
  state.lessonsCompleted++;
  state.subjectLessons[state.currentSubject]++;
  const isPerfect = state.stepCorrect === 3;
  if (isPerfect) state.perfectLessons++;

  const subjectName = state.currentSubject.charAt(0).toUpperCase() + state.currentSubject.slice(1);
  state.history.push({
    subject: subjectName,
    difficulty: state.currentDifficulty,
    stars: state.stars,
    correct: state.stepCorrect,
    date: new Date().toISOString()
  });

  showConfetti();
  // Trigger game screen for fun
  showScreen('screenGame');
  startGame();
  updateHeaderStats();
  checkBadges();
  persist();
}

/* ── QUICK GAME ── */
let gameData = {};

function startGame() {
  const subjects = ['math', 'reading', 'science'];
  const subj = subjects[Math.floor(Math.random() * subjects.length)];
  document.getElementById('gameStars').textContent = state.stars;

  if (subj === 'math') {
    // Math quick game
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, answer, display;
    if (op === '+') { a = rand(1,20); b = rand(1,20); answer = a + b; display = `${a} + ${b} = ?`; }
    else if (op === '-') { a = rand(5,25); b = rand(1,a); answer = a - b; display = `${a} − ${b} = ?`; }
    else { a = rand(1,9); b = rand(1,9); answer = a * b; display = `${a} × ${b} = ?`; }

    // Generate wrong answers
    const wrongs = new Set();
    while (wrongs.size < 2) {
      const w = answer + rand(-5, 5);
      if (w !== answer && w > 0) wrongs.add(w);
    }

    const cells = [answer, ...wrongs].sort(() => Math.random() - 0.5);
    gameData = { answer, type: 'game-math' };

    document.getElementById('gameContent').innerHTML = `
      <div class="game-prompt">${display}</div>
      <div class="game-grid">
        ${cells.map(c => `<div class="game-cell" onclick="checkGame(${c}, this)">${c}</div>`).join('')}
      </div>`;
  } else if (subj === 'reading') {
    // Word scramble game
    const words = ['CAT', 'SUN', 'FISH', 'BIRD', 'STAR', 'TREE', 'BOOK', 'MOON', 'RAIN', 'WOLF'];
    const word = words[Math.floor(Math.random() * words.length)];
    const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');

    // Generate wrong answers (same length, different word)
    const wrongWords = words.filter(w => w !== word && w.length === word.length);
    const cellAnswers = [word, ...wrongWords.slice(0, 2)].sort(() => Math.random() - 0.5);

    gameData = { answer: word, type: 'game-word' };

    document.getElementById('gameContent').innerHTML = `
      <div class="game-prompt">Unscramble: <span class="word-display" style="display:inline">${scrambled}</span></div>
      <p class="scramble-hint">What word is this?</p>
      <div class="choices" style="max-width:400px;margin:0 auto">
        ${cellAnswers.map(w => `<button class="choice-btn" style="font-size:1.3rem" onclick="checkGame('${w}', this)">${w}</button>`).join('')}
      </div>`;
  } else {
    // Science: Which one doesn't belong?
    const groups = [
      { items: ['🐱', '🐶', '🐰', '🪨'], answer: 3, hint: 'The rock is not an animal!' },
      { items: ['🌍', '🪐', '☀️', '🏠'], answer: 3, hint: 'A house is not in space!' },
      { items: ['🌊', '☁️', '🌧️', '🧊'], answer: 0, hint: 'Oceans are on Earth, not in the sky!' },
      { items: ['🐟', '🐋', '🐙', '🦅'], answer: 3, hint: 'Birds fly — the others swim!' },
      { items: ['🍎', '🍊', '🥕', '🍇'], answer: 2, hint: 'Carrots are vegetables!' }
    ];
    const g = groups[Math.floor(Math.random() * groups.length)];
    const shuffledItems = g.items.map((item, i) => ({ item, isAnswer: i === g.answer })).sort(() => Math.random() - 0.5);

    gameData = { answerIdx: shuffledItems.findIndex(x => x.isAnswer), type: 'game-science', correctHint: g.hint };

    document.getElementById('gameContent').innerHTML = `
      <div class="game-prompt">Which one doesn't belong? 🤔</div>
      <div class="game-grid">
        ${shuffledItems.map((x, i) => `<div class="game-cell" onclick="checkGame(${i}, this)">${x.item}</div>`).join('')}
      </div>`;
  }
}

function checkGame(val, el) {
  const fb = document.getElementById('gameFeedback');
  fb.innerHTML = ''; fb.className = 'feedback-area';

  if (gameData.type === 'game-math') {
    if (val === gameData.answer) {
      el.classList.add('correct');
      fb.textContent = '🎉 Correct! You\'re so good at math!';
      fb.className = 'feedback-area feedback-correct';
      state.stars++; state.totalStars++;
      document.getElementById('gameStars').textContent = state.stars;
    } else {
      el.classList.add('wrong');
      fb.textContent = `The answer was ${gameData.answer}. 🤔`;
      fb.className = 'feedback-area feedback-wrong';
    }
  } else if (gameData.type === 'game-word') {
    if (val === gameData.answer) {
      el.classList.add('correct');
      fb.textContent = `🎉 Yes! It spells "${val}"!`;
      fb.className = 'feedback-area feedback-correct';
      state.stars++; state.totalStars++;
      document.getElementById('gameStars').textContent = state.stars;
    } else {
      el.classList.add('wrong');
      fb.textContent = `It was "${gameData.answer}". 🤔`;
      fb.className = 'feedback-area feedback-wrong';
    }
  } else if (gameData.type === 'game-science') {
    if (val === gameData.answerIdx) {
      el.classList.add('correct');
      fb.textContent = '🎉 ' + gameData.correctHint;
      fb.className = 'feedback-area feedback-correct';
      state.stars++; state.totalStars++;
      document.getElementById('gameStars').textContent = state.stars;
    } else {
      el.classList.add('wrong');
      fb.textContent = 'Not quite! Look closely and try again! 🤔';
      fb.className = 'feedback-area feedback-wrong';
    }
  }

  document.getElementById('gameActions').hidden = false;
  checkBadges();
  persist();
}

function nextGameRound() {
  document.getElementById('gameFeedback').innerHTML = '';
  document.getElementById('gameFeedback').className = 'feedback-area';
  document.getElementById('gameActions').hidden = true;
  startGame();
}

/* ── BADGES ── */
function checkBadges() {
  BADGES.forEach(badge => {
    if (!state.badges.includes(badge.id) && badge.condition(state)) {
      state.badges.push(badge.id);
      showBadgeEarned(badge);
    }
  });
}

function showBadgeEarned(badge) {
  document.getElementById('badgeName').innerHTML = `<b>${badge.icon} ${badge.name}</b><br>${badge.desc}`;
  document.getElementById('badgeOverlay').removeAttribute('hidden');
  updateHeaderStats();
  showConfetti();
}

function closeBadge() {
  document.getElementById('badgeOverlay').setAttribute('hidden', '');
}

/* ── PARENT DASHBOARD ── */
function showParentLogin() { showScreen('screenParentLogin'); }

function submitPin() {
  const pin = document.getElementById('pinInput').value;
  if (pin === state.parentPin) {
    showDashboard();
  } else {
    const inp = document.getElementById('pinInput');
    inp.style.borderColor = '#e53935';
    inp.value = '';
    setTimeout(() => { inp.style.borderColor = '#e0e0e0'; }, 1500);
  }
}

function showDashboard() {
  document.getElementById('dashLessons').textContent = state.lessonsCompleted;
  const totalCorrect = state.history.reduce((sum, h) => sum + h.correct, 0);
  document.getElementById('dashCorrect').textContent = totalCorrect;
  document.getElementById('dashStars').textContent = state.totalStars;
  document.getElementById('dashBadges').textContent = state.badges.length;

  // Badges grid
  const bg = document.getElementById('dashBadgesGrid');
  bg.innerHTML = BADGES.map(b => {
    const earned = state.badges.includes(b.id);
    return `<div class="badge-earned ${earned ? '' : 'badge-locked'}">
      <span style="font-size:1.3rem">${b.icon}</span>
      <span>${earned ? b.name : '???'}</span>
    </div>`;
  }).join('');

  // History
  const dh = document.getElementById('dashHistory');
  if (state.history.length === 0) {
    dh.innerHTML = '<p style="color:#999;text-align:center;padding:1rem">No lessons completed yet!</p>';
  } else {
    dh.innerHTML = state.history.slice(-10).reverse().map(h => `
      <div class="dash-history-item">
        <span><span class="dh-subject">${getSubjectEmoji()} ${h.subject}</span> — ${h.difficulty}</span>
        <span class="dh-stars">⭐ ${h.stars} | ✅ ${h.correct}/3</span>
      </div>
    `).join('');
  }

  showScreen('screenDashboard');
}

/* ── CONFETTI ── */
function showConfetti() {
  const colors = ['#ab47bc', '#f9a825', '#43a047', '#1e88e5', '#e53935', '#ff6f00'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 1 + 's';
    piece.style.animationDuration = (2 + Math.random() * 1.5) + 's';
    piece.style.width = (8 + Math.random() * 8) + 'px';
    piece.style.height = (8 + Math.random() * 8) + 'px';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4000);
  }
}

/* ── UTILS ── */
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

/* ── INIT ── */
updateHeaderStats();
