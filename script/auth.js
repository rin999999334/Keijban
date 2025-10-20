/* ==========================
   auth.js
   ログイン状態の管理
   ========================== */

const AUTH_KEY = "bbs_user";

// --- ログインしているか確認 ---
function isLoggedIn() {
  return localStorage.getItem(AUTH_KEY) !== null;
}

// --- ログイン処理 ---
function login(email, password) {
  const mockUser = {
    email,
    name: email.split("@")[0],
    loginAt: new Date().toISOString(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
  alert("ログインしました！");
  window.location.href = "index.html";
}

// --- ログアウト処理 ---
function logout() {
  localStorage.removeItem(AUTH_KEY);
  alert("ログアウトしました。");
  window.location.href = "login.html";
}

// --- 現在のユーザー情報を取得 ---
function getUser() {
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
}

// --- ヘッダーのUIを更新 ---
function updateNavUI() {
  const nav = document.querySelector("header nav");
  if (!nav) return;

  if (isLoggedIn()) {
    const user = getUser();
    nav.innerHTML = `
      <a href="profile.html">👤 ${user.name}</a>
      <a href="#" id="logoutBtn">ログアウト</a>
    `;
    document.getElementById("logoutBtn").addEventListener("click", logout);
  } else {
    nav.innerHTML = `
      <a href="login.html">ログイン</a>
      <a href="register.html">新規登録</a>
    `;
  }
}

document.addEventListener("DOMContentLoaded", updateNavUI);
