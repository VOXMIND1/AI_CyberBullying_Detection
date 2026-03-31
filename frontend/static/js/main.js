// VoxMind - Main Chat Logic (FINAL FIXED)

// ── State ─────────────────────────────────────────────
let myName = '', myColor = '#4a148c', myRoom = '';
let socket = null;
let totalMsgs = 0, flaggedMsgs = 0, riskHistory = [];
let selectedColor = '#4a148c';

// ── Color picker ──────────────────────────────────────
document.querySelectorAll('.cbtn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.cbtn').forEach(x => x.classList.remove('sel'));
    b.classList.add('sel');
    selectedColor = b.dataset.c;
  });
});

function setTheme(mode) {
  const isDark = mode === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.textContent = isDark ? '☀️' : '🌙';
    btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }
  localStorage.setItem('voxmind-theme', isDark ? 'dark' : 'light');
}

function toggleTheme() {
  const current = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
}

function initTheme() {
  const saved = localStorage.getItem('voxmind-theme');
  setTheme(saved === 'dark' ? 'dark' : 'light');
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
}

initTheme();

// ── Join room ─────────────────────────────────────────
function joinRoom() {
  myName  = document.getElementById('inp-name').value.trim() || 'Anonymous';
  myRoom  = document.getElementById('inp-room').value.trim() || 'default-room';
  myColor = selectedColor;

  socket = io();

  socket.on('connect', () => {
    socket.emit('join', { name: myName, color: myColor, room: myRoom });
    document.getElementById('join-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    document.getElementById('room-label').textContent  = myRoom;
    document.getElementById('hname').textContent       = myName;
    document.getElementById('hstatus').textContent     = '🟢 Connected · ' + myRoom;
    document.getElementById('hav').textContent         = myName[0].toUpperCase();
    document.getElementById('hav').style.background    = myColor;
  });

  socket.on('message', onMessage);
  socket.on('system', onSystem);
  socket.on('disconnect', () => {
    document.getElementById('hstatus').textContent = '🔴 Disconnected';
  });
}

// ── Incoming message ──────────────────────────────────
function onMessage(d) {
  const isMe = d.sender === myName;

  renderBubble(
    d.text,
    isMe ? 'out' : 'in',
    d.sender,
    d.color,
    d.flagged,
    d.cat,
    d.tox,
    d.ts
  );

  totalMsgs++;
  document.getElementById('sTot').textContent = totalMsgs;

  const tox = Number(d.tox) || 0;
  riskHistory.push(tox);
  updateRisk(tox);
  updateAvg();

  if (d.flagged) {
    flaggedMsgs++;
    document.getElementById('sFlag').textContent = flaggedMsgs;
    showTG(d.text, d.sender, d);
  }
}

// ── System messages ───────────────────────────────────
function onSystem(d) {
  const msgs = document.getElementById('messages');
  const el   = document.createElement('div');
  el.className   = 'sys-msg';
  el.textContent = '🔔 ' + d.text;
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;

  if (d.users) renderUsers(d.users);
}

// ── Send message ──────────────────────────────────────
function sendMsg() {
  const input = document.getElementById('msgInput');
  const text  = input.value.trim();

  if (!text || !socket) return;

  input.value = '';
  input.style.height = 'auto';

  document.getElementById('scanBar').classList.add('on');
  setTimeout(() => {
    document.getElementById('scanBar').classList.remove('on');
  }, 800);

  socket.emit('message', {
    sender: myName,
    color: myColor,
    room: myRoom,
    text: text
  });
}

// ── Render message bubble ─────────────────────────────
function renderBubble(text, dir, sender, color, flagged, cat, tox, ts) {
  const msgs = document.getElementById('messages');
  const row  = document.createElement('div');

  row.className = 'msg-row ' + dir;

  let flag = '';

  // 🔥 ALWAYS SHOW TOXICITY (FIXED)
  if (flagged) {
    flag = `<div class="flag-tag">⚠️ ${cat} · ${tox}%</div>`;
  } else if (tox > 20) {
    flag = `<div class="flag-tag" style="color:orange;">ℹ️ mild · ${tox}%</div>`;
  }

  const who = dir === 'in'
    ? `<span style="font-size:10px;font-weight:700;color:${color || '#7b61ff'}">${sender}</span><br>`
    : '';

  row.innerHTML = `
    <div class="bubble ${flagged ? 'flagged' : ''}">
      ${who}${text}${flag}
      <div class="btime">${ts} ${dir === 'out' ? '✓✓' : ''}</div>
    </div>
  `;

  msgs.appendChild(row);
  msgs.scrollTop = msgs.scrollHeight;
}

// ── Users sidebar ─────────────────────────────────────
function renderUsers(users) {
  document.getElementById('userList').innerHTML = users.map(u => `
    <div class="user-item">
      <div class="uav" style="background:${u.color}">
        ${u.name[0].toUpperCase()}
      </div>
      <div>
        <div class="uname">
          ${u.name}${u.name === myName ? ' (you)' : ''}
        </div>
        <div class="ustatus">
          <div class="udot"></div>Online
        </div>
      </div>
    </div>
  `).join('');
}

// ── Risk meter ────────────────────────────────────────
function updateRisk(tox) {
  const fill = document.getElementById('riskFill');
  const pct  = document.getElementById('riskPct');

  fill.style.width = tox + '%';

  const c = tox >= 70
    ? 'var(--red)'
    : tox >= 35
    ? 'var(--orange)'
    : 'var(--safe)';

  fill.style.background = c;
  pct.style.color = c;
  pct.textContent = tox + '%';
}

// ── Average risk ──────────────────────────────────────
function updateAvg() {
  if (!riskHistory.length) return;

  const avg = Math.round(
    riskHistory.reduce((a, b) => a + b, 0) / riskHistory.length
  );

  document.getElementById('sAvg').textContent = avg + '%';
}

// ── Telegram overlay ──────────────────────────────────
function showTG(text, sender, d) {
  const e = d.risk === 'HIGH' ? '🔴' : d.risk === 'MEDIUM' ? '🟠' : '🟡';

  document.getElementById('tgMsg').textContent    = text;
  document.getElementById('tgSender').textContent = sender + ' · Room: ' + myRoom;
  document.getElementById('tgTox').textContent    = d.tox + '%';
  document.getElementById('tgRisk').textContent   = e + ' ' + d.risk;
  document.getElementById('tgCat').textContent    = d.cat;

  document.getElementById('alertSub').textContent =
    d.risk === 'HIGH'
      ? 'Severe threat — immediate action needed!'
      : 'Harmful content detected — user at risk.';

  document.getElementById('tgOverlay').classList.add('show');
}

// ── Close Telegram popup ──────────────────────────────
function closeTG() {
  document.getElementById('tgOverlay').classList.remove('show');
}

// ── Input handlers ────────────────────────────────────
const inp = document.getElementById('msgInput');

inp.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMsg();
  }
});

inp.addEventListener('input', () => {
  inp.style.height = 'auto';
  inp.style.height = Math.min(inp.scrollHeight, 80) + 'px';
});
