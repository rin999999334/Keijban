/* ==========================
   main.js
   掲示板の投稿管理
   ========================== */

// 投稿データを保存するキー（localStorage用）
const POSTS_KEY = "bbs_posts";

// --- 投稿を取得する関数 ---
function getPosts() {
  const data = localStorage.getItem(POSTS_KEY);
  return data ? JSON.parse(data) : [];
}

// --- 投稿を保存する関数 ---
function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

// --- 投稿を追加する関数 ---
function addPost(name, subject, body) {
  const posts = getPosts();
  const newPost = {
    id: Date.now(),
    name,
    subject,
    body,
    date: new Date().toLocaleString(),
  };
  posts.unshift(newPost); // 新しい投稿を上に追加
  savePosts(posts);
  renderPosts(); // 画面を更新
}

// --- 投稿を表示する関数 ---
function renderPosts() {
  const container = document.getElementById("postsContainer");
  const posts = getPosts();

  container.innerHTML = posts
    .map(
      (p) => `
      <article class="post">
        <h2>${p.subject || "（無題）"}</h2>
        <p class="meta">投稿者：${p.name} ｜ ${p.date}</p>
        <p>${p.body.replace(/\n/g, "<br>")}</p>
      </article>
    `
    )
    .join("");
}

// --- 投稿フォームの動作 ---
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("postForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const body = document.getElementById("body").value.trim();

    if (!name || !body) {
      alert("名前と本文は必須です。");
      return;
    }

    addPost(name, subject, body);
    form.reset(); // 入力欄をリセット
  });

  renderPosts(); // ページ表示時に投稿一覧を描画
});
