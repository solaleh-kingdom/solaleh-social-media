const users = [
  {
    id: 'solaleh',
    name: 'Solaleh',
    accent: 'accent-cyan',
    starterPrompt: 'Ask AI to help me with content, captions, and trend ideas.',
    starterKeywords: 'gemstone trends, ai creator tools, luxury content',
  },
  {
    id: 'farahnaz',
    name: 'Farahnaz',
    accent: 'accent-pink',
    starterPrompt: 'Ask AI to organize my notes, rewrite ideas, and plan posts.',
    starterKeywords: 'gemstone trends, productivity, behind the scenes',
  },
];

const assistantModes = ['Chat', 'Trend lookup', 'Rewrite', 'Planning'];

const root = document.getElementById('root');
root.innerHTML = `
  <div class="page-shell">
    <div class="backdrop backdrop-left"></div>
    <div class="backdrop backdrop-right"></div>

    <header class="topbar">
      <div>
        <span class="eyebrow">Private AI workspace</span>
        <h1>Solaleh + Farahnaz, each with a dedicated AI section.</h1>
        <p class="lead">
          The first feature we are building is AI chat plus Google Trends lookup for the last 7 days.
          Each user gets their own visible area inside the page.
        </p>
      </div>
      <div class="topbar-actions">
        <span class="url-chip">Live on Netlify</span>
        <span class="url-chip">GitHub connected</span>
      </div>
    </header>

    <section class="hero-card">
      <div>
        <div class="stat-grid">
          <div class="stat-card">
            <strong>2</strong>
            <span>visible user sections</span>
          </div>
          <div class="stat-card">
            <strong>AI</strong>
            <span>chat-ready workspace</span>
          </div>
          <div class="stat-card">
            <strong>7d</strong>
            <span>Google Trends window</span>
          </div>
        </div>
      </div>
      <div class="hero-panel">
        <span class="panel-badge">How this will work</span>
        <ol>
          <li>Each user writes a prompt or keywords.</li>
          <li>The AI section answers or summarizes the request.</li>
          <li>The trends section returns the top 3 searched results for the last week.</li>
        </ol>
      </div>
    </section>

    <section class="assistant-bar panel">
      <div>
        <span class="panel-label">Shared AI mode</span>
        <h2>Choose what the assistant should do</h2>
      </div>
      <div class="assistant-controls">
        <label>
          <span class="field-label">Mode</span>
          <select id="assistant-mode">
            ${assistantModes.map((mode) => `<option value="${mode}">${mode}</option>`).join('')}
          </select>
        </label>
        <label>
          <span class="field-label">API status</span>
          <input value="OpenAI connection will be added next" readonly />
        </label>
      </div>
    </section>

    <main class="workspace">
      ${users
        .map(
          (user) => `
            <section class="persona-card ${user.accent}" data-user="${user.id}">
              <header class="persona-head">
                <div>
                  <span class="persona-kicker">${user.name}</span>
                  <h2>${user.name}'s dedicated workspace</h2>
                </div>
                <span class="status-pill">Visible</span>
              </header>

              <div class="section-block">
                <span class="panel-label">AI chat for ${user.name}</span>
                <textarea id="${user.id}-prompt" class="persona-note">${user.starterPrompt}</textarea>
                <div class="action-row">
                  <button class="secondary-btn" data-fill-prompt="${user.id}">Load example</button>
                  <button class="ghost-btn" data-send-prompt="${user.id}">Send to AI</button>
                </div>
                <div class="assistant-preview">
                  <span class="field-label">AI reply preview</span>
                  <p id="${user.id}-reply"></p>
                </div>
              </div>

              <div class="section-block">
                <span class="panel-label">Google Trends for ${user.name}</span>
                <label class="field-label" for="${user.id}-keywords">Keywords for Google Trends</label>
                <textarea id="${user.id}-keywords" class="persona-note">${user.starterKeywords}</textarea>
                <div class="action-row">
                  <button class="secondary-btn" data-fill-keywords="${user.id}">Load example keywords</button>
                  <button class="ghost-btn" data-search-trends="${user.id}">Search trends</button>
                </div>
                <div class="assistant-preview">
                  <span class="field-label">Top 3 results from the last week</span>
                  <ul class="trend-list" id="${user.id}-trends"></ul>
                </div>
              </div>

              <div class="section-block">
                <span class="panel-label">Saved history for ${user.name}</span>
                <ul class="trend-list" id="${user.id}-history"></ul>
              </div>
            </section>
          `
        )
        .join('')}
    </main>
  </div>
`;

const assistantModeEl = document.getElementById('assistant-mode');
const promptEls = Object.fromEntries(users.map((user) => [user.id, document.getElementById(`${user.id}-prompt`)]));
const keywordEls = Object.fromEntries(users.map((user) => [user.id, document.getElementById(`${user.id}-keywords`)]));
const replyEls = Object.fromEntries(users.map((user) => [user.id, document.getElementById(`${user.id}-reply`)]));
const trendEls = Object.fromEntries(users.map((user) => [user.id, document.getElementById(`${user.id}-trends`)]));
const historyEls = Object.fromEntries(users.map((user) => [user.id, document.getElementById(`${user.id}-history`)]));

const historyItems = {
  solaleh: [
    'Drafted gemstone trend ideas',
    'Saved an AI caption rewrite',
    'Looked up last week’s search terms',
  ],
  farahnaz: [
    'Organized weekly tasks',
    'Rewrote a post for clarity',
    'Saved trend lookup results',
  ],
};

function renderAiReply(userId) {
  const mode = assistantModeEl.value;
  const prompt = promptEls[userId].value.trim() || 'No prompt yet';
  replyEls[userId].textContent = `Mode: ${mode}. I can help turn this into a useful AI response: "${prompt}"`;
}

function renderTrendPreview(userId) {
  const text = keywordEls[userId].value.trim();
  const items = text
    ? text.split('\n').map((line) => line.trim()).filter(Boolean)
    : ['Trend lookup will appear here', 'Connect the Google Trends function next', 'Top 3 results'];

  const top3 = items.slice(0, 3);
  trendEls[userId].innerHTML = top3.map((item) => `<li>${item}</li>`).join('');
}

function renderHistory(userId) {
  historyEls[userId].innerHTML = historyItems[userId].map((item) => `<li>${item}</li>`).join('');
}

function refreshUser(userId) {
  renderAiReply(userId);
  renderTrendPreview(userId);
  renderHistory(userId);
}

assistantModeEl.addEventListener('change', () => {
  users.forEach((user) => refreshUser(user.id));
});

users.forEach((user) => {
  promptEls[user.id].addEventListener('input', () => renderAiReply(user.id));
  keywordEls[user.id].addEventListener('input', () => renderTrendPreview(user.id));
});

document.querySelectorAll('[data-fill-prompt]').forEach((button) => {
  button.addEventListener('click', () => {
    const userId = button.getAttribute('data-fill-prompt');
    promptEls[userId].value =
      userId === 'solaleh'
        ? 'Help me draft content ideas for gemstone trends and luxury style.'
        : 'Rewrite my notes into a clear plan for the week.';
    renderAiReply(userId);
  });
});

document.querySelectorAll('[data-fill-keywords]').forEach((button) => {
  button.addEventListener('click', () => {
    const userId = button.getAttribute('data-fill-keywords');
    keywordEls[userId].value =
      userId === 'solaleh'
        ? 'gemstone trends\nluxury jewelry trends\nAI creator tools'
        : 'gemstone trends\nproductivity trends\naudience growth';
    renderTrendPreview(userId);
  });
});

document.querySelectorAll('[data-send-prompt]').forEach((button) => {
  button.addEventListener('click', () => {
    const userId = button.getAttribute('data-send-prompt');
    renderAiReply(userId);
  });
});

document.querySelectorAll('[data-search-trends]').forEach((button) => {
  button.addEventListener('click', () => {
    const userId = button.getAttribute('data-search-trends');
    renderTrendPreview(userId);
  });
});

users.forEach((user) => refreshUser(user.id));
