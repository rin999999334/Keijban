// ===============================
// register.js
// 登録フロー（認証コード → 確認 → 承認待ち保存）
// ===============================

// --- DOM取得 ---
const s1 = document.getElementById('step1');
const s2 = document.getElementById('step2');
const s3 = document.getElementById('step3');
const emailEl = document.getElementById('regEmail');
const codeEl  = document.getElementById('regCode');
const nameEl  = document.getElementById('regName');
const passEl  = document.getElementById('regPass');
const pass2El = document.getElementById('regPass2');
const sendCodeBtn   = document.getElementById('sendCodeBtn');
const verifyCodeBtn = document.getElementById('verifyCodeBtn');
const completeBtn   = document.getElementById('completeBtn');
const backToStep1   = document.getElementById('backToStep1');
const backToStep2   = document.getElementById('backToStep2');
const testCodeMsg   = document.getElementById('testCodeMsg');

let generatedCode = null;
let savedEmail = '';

// --- ステップ管理 ---
const go = (step) => [s1, s2, s3].forEach(sec => sec.classList.toggle('active', sec === step));
const isBlank = (s) => !s || !String(s).trim();

// --- STEP1: 認証コード送信 ---
sendCodeBtn.addEventListener('click', () => {
  const email = emailEl.value.trim();
  if (isBlank(email)) return alert('メールアドレスを入力してください');
  generatedCode = Math.floor(100000 + Math.random() * 900000);
  savedEmail = email;
  testCodeMsg.textContent = `テスト用コード: ${generatedCode}`;
  go(s2);
});

// --- STEP2: コード確認 ---
verifyCodeBtn.addEventListener('click', () => {
  const input = codeEl.value.trim();
  if (String(input) !== String(generatedCode)) return alert('認証コードが違います');
  go(s3);
});

// --- 戻るボタン ---
backToStep1.addEventListener('click', () => go(s1));
backToStep2.addEventListener('click', () => go(s2));

// --- STEP3: 承認申請保存 ---
completeBtn.addEventListener('click', () => {
  const name = nameEl.value.trim();
  const p1 = passEl.value.trim();
  const p2 = pass2El.value.trim();
  if (isBlank(name)) return alert('ユーザー名を入力してください');
  if (p1.length < 8) return alert('パスワードは8文字以上');
  if (p1 !== p2) return alert('パスワードが一致しません');

  const pendingUser = {
    name,
    email: savedEmail,
    password: p1,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  const pending = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
  pending.push(pendingUser);
  localStorage.setItem('pendingUsers', JSON.stringify(pending));

  alert('登録申請を受け付けました。運営の承認をお待ちください。');
  window.location.href = 'login.html';
});
