// frontend/src/chat/chatScreen.js
const API = "http://localhost:8000";

const REPLY_OPTIONS = [
    { id: 1, label: "I'm okay, just been busy" },
    { id: 2, label: "I'm struggling with the workload" },
    { id: 3, label: "I have personal issues" },
    { id: 4, label: "I need funding help" },
];

export function renderChatScreen(container, studentId = 1) {
    container.innerHTML = `
    <div class="chat-shell">
      <header class="chat-header">StudentReach</header>
      <main class="chat-body" id="chat-body">
        <p class="muted">Loading messages…</p>
      </main>
      <footer class="chat-footer">
        <p class="muted small">Choose a reply:</p>
        ${REPLY_OPTIONS.map(
        (o) => `<button class="reply-btn" data-code="${o.id}">
            <strong>${o.id}.</strong> ${o.label}
          </button>`
    ).join("")}
      </footer>
    </div>
  `;

    const body = container.querySelector("#chat-body");

    fetch(`${API}/students/${studentId}/messages`)
        .then((r) => r.json())
        .then((msgs) => {
            if (!msgs.length) {
                body.innerHTML = `<div class="bubble advisor">Hi! Just checking in — how are you doing?</div>`;
                return;
            }
            body.innerHTML = msgs
                .map((m) => `<div class="bubble ${m.sender}">${m.text}</div>`)
                .join("");
        })
        .catch(() => {
            body.innerHTML = `<div class="bubble advisor">Hi! Just checking in — how are you doing?</div>`;
        });

    container.querySelectorAll(".reply-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const code = parseInt(btn.dataset.code, 10);
            const text = REPLY_OPTIONS.find((o) => o.id === code).label;

            body.insertAdjacentHTML(
                "beforeend",
                `<div class="bubble student">${text}</div>`
            );
            container
                .querySelectorAll(".reply-btn")
                .forEach((b) => (b.disabled = true));

            await fetch(`${API}/students/${studentId}/replies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reply_code: code, reply_text: text }),
            });

            setTimeout(() => {
                renderConfirmationScreen(container, code);
            }, 500);
        });
    });
}

export function renderConfirmationScreen(container, optionId) {
    container.innerHTML = `
    <div class="screen centered">
      <div class="card">
        <div class="check">✓</div>
        <h2>Thanks for replying!</h2>
        <p class="muted">Your advisor has been notified. We'll follow up soon.</p>
        <button id="next">See next steps</button>
      </div>
    </div>
  `;
    container.querySelector("#next").addEventListener("click", () => {
        renderResourceScreen(container, optionId);
    });
}

const RESOURCES = {
    1: { title: "Staying on Track", items: ["Time-management workshop", "Study group sign-up", "Advisor office hours"] },
    2: { title: "Academic Support", items: ["Tutoring centre booking", "Assignment extension", "Counselling services"] },
    3: { title: "Wellbeing Support", items: ["Campus counsellor", "24/7 helpline", "Peer support group"] },
    4: { title: "Funding Help", items: ["NSFAS status check", "Bursary office contact", "Emergency grant form"] },
};

export function renderResourceScreen(container, optionId) {
    const res = RESOURCES[optionId] || RESOURCES[1];
    container.innerHTML = `
    <div class="screen">
      <h2>${res.title}</h2>
      <ul class="resource-list">
        ${res.items.map((i) => `<li>${i}</li>`).join("")}
      </ul>
    </div>
  `;
}