/* ==========================
   main.js
   掲示板の投稿＋返信管理
   ========================== */

const POSTS_KEY = "bbs_posts";

// --- 安全な文字列エスケープ（XSS対策） ---
function esc(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

// --- 単純なバリデーション関数 ---
const isBlank = (s) => !s || !String(s).trim();
const maxLen  = (s, n) => String(s).length <= n;

// --- 投稿データを取得 ---
function getPosts() {
  const data = localStorage.getItem(POSTS_KEY);
  const arr = data ? JSON.parse(data) : [];
  // 既存データに replies が無い場合に補完
  return arr.map(p => ({ ...p, replies: Array.isArray(p.replies) ? p.replies : [] }));
}

// --- 投稿データを保存 ---
function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

// --- 投稿を追加 ---
function addPost(name, subject, body) {
  // バリデーション
  if (isBlank(name) || isBlank(body)) throw new Error('名前と本文は必須です');
  if (!maxLen(name, 40)) throw new Error('名前は40文字以内');
  if (!maxLen(subject, 80)) throw new Error('題名は80文字以内');
  if (!maxLen(body, 2000)) throw new Error('本文は2000文字以内');

  const posts = getPosts();
  const newPost = {
    id: Date.now(),
    name: String(name).trim(),
    subject: String(subject || '').trim(),
    body: String(body).trim(),
    date: new Date().toLocaleString(),
    replies: []
  };
  posts.unshift(newPost);
  savePosts(posts);
  renderPosts();
}

// --- 返信を追加 ---
function addReply(postId, name, body) {
  if (isBlank(name) || isBlank(body)) throw new Error('名前と返信内容は必須です');
  if (!maxLen(name, 40)) throw new Error('名前は40文字以内');
  if (!maxLen(body, 2000)) throw new Error('返信は2000文字以内');

  const posts = getPosts();
  const target = posts.find(p => p.id === postId);
  if (!target) return;

  target.replies.push({
    id: Date.now(),
    name: String(name).trim(),
    body: String(body).trim(),
    date: new Date().toLocaleString()
  });

  savePosts(posts);
  renderPosts();
}

// --- 投稿一覧を描画 ---
function renderPosts() {
  const container = document.getElementById("postsContainer");
  if (!container) return; // コンテナが無い場合は何もしない

  const posts = getPosts();

  if (!posts.length) {
    container.innerHTML = '<div class="post"><p class="meta">まだ投稿がありません</p><p>最初の投稿をしてみましょう。</p></div>';
    return;
  }

  container.innerHTML = posts.map(p => `
    <article class="post">
      <h2>${esc(p.subject) || '（無題）'}</h2>
      <p class="meta">投稿者：${esc(p.name)} ｜ ${esc(p.date)}</p>
      <p>${esc(p.body).replace(/\n/g, '<br>')}</p>

      <button class="reply-btn" data-id="${p.id}">返信する</button>

      <div class="reply-form" id="reply-${p.id}" style="display:none;">
        <input type="text" class="reply-name" placeholder="名前" />
        <textarea class="reply-body" placeholder="返信内容..." rows="2"></textarea>
        <button class="submit-reply" data-id="${p.id}">送信</button>
      </div>

      ${p.replies && p.replies.length ? `
        <div class="replies">
          ${p.replies.map(r => `
            <div class="reply">
              <p class="meta">↳ ${esc(r.name)} ｜ ${esc(r.date)}</p>
              <p>${esc(r.body).replace(/\n/g, '<br>')}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </article>
  `).join('');
}

// --- 投稿フォーム動作 ---
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("postForm");
  const textarea = document.getElementById("body");
  const container = document.getElementById("postsContainer");

  // 本文の自動リサイズ（投稿フォーム）
  if (textarea) {
    const autoGrow = (el) => { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px`; };
    textarea.addEventListener('input', () => autoGrow(textarea));
  }

  // 投稿フォーム送信
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const body = document.getElementById("body").value.trim();
      try {
        addPost(name, subject, body);
        form.reset();
        if (textarea) textarea.style.height = 'auto';
      } catch (err) {
        alert(err.message || '送信に失敗しました');
      }
    });
  }

  // 返信のイベント委譲（クリック & 入力）
  if (container) {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.reply-btn');
      if (btn) {
        const formEl = document.getElementById(`reply-${btn.dataset.id}`);
        if (formEl) formEl.style.display = formEl.style.display === 'none' ? 'block' : 'none';
        return;
      }

      const submit = e.target.closest('.submit-reply');
      if (submit) {
        const id = Number(submit.dataset.id);
        const formEl = document.getElementById(`reply-${id}`);
        if (!formEl) return;
        const nameEl = formEl.querySelector('.reply-name');
        const bodyEl = formEl.querySelector('.reply-body');
        try {
          addReply(id, nameEl.value.trim(), bodyEl.value.trim());
          nameEl.value = '';
          bodyEl.value = '';
        } catch (err) {
          alert(err.message || '返信に失敗しました');
        }
      }
    });

    // 返信テキストエリアの自動リサイズ（入力委譲）
    container.addEventListener('input', (e) => {
      const ta = e.target.closest('.reply-body');
      if (ta) { ta.style.height = 'auto'; ta.style.height = `${ta.scrollHeight}px`; }
    });
  }

  renderPosts();
});
