// dm.js
// DMページ専用ロジック

const me = JSON.parse(localStorage.getItem("userProfile") || "{}").name || "匿名";
const params = new URLSearchParams(location.search);
const to = params.get("to");

const dmTitle = document.getElementById("dmTitle");
const container = document.getElementById("dmMessages");
const form = document.getElementById("dmForm");
const textarea = document.getElementById("dmText");

// DMキー（自分と相手の組み合わせでユニーク化）
const key = `dm_${[me, to].sort().join("_")}`;

// メッセージ読み込み
const messages = JSON.parse(localStorage.getItem(key) || "[]");

function renderDM() {
  dmTitle.textContent = `${to} とのDM`;
  container.innerHTML = messages
    .map(m => `
      <div class="post ${m.from === me ? "mymsg" : "theirmsg"}">
        <p class="meta">${m.from}｜${m.date}</p>
        <p>${m.text.replace(/\n/g, "<br>")}</p>
      </div>
    `)
    .join("");
}

// 送信処理
form.addEventListener("submit", e => {
  e.preventDefault();
  const text = textarea.value.trim();
  if (!text) return;

  messages.push({
    from: me,
    to,
    text,
    date: new Date().toLocaleString(),
  });

  localStorage.setItem(key, JSON.stringify(messages));
  textarea.value = "";
  renderDM();
});

renderDM();
