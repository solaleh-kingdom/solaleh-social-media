const users = {
  solaleh: {
    id: 'solaleh',
    name: 'Solaleh',
    accent: 'accent-cyan',
    starterPrompt: 'Ask AI to help me with content, captions, and trend ideas.',
    starterKeywords: 'gemstone trends, ai creator tools, luxury content',
    history: ['Drafted gemstone trend ideas', 'Saved an AI caption rewrite', 'Looked up last week’s search terms'],
  },
  farahnaz: {
    id: 'farahnaz',
    name: 'Farahnaz',
    accent: 'accent-pink',
    starterPrompt: 'Ask AI to organize my notes, rewrite ideas, and plan posts.',
    starterKeywords: 'gemstone trends, productivity, behind the scenes',
    history: ['Organized weekly tasks', 'Rewrote a post for clarity', 'Saved trend lookup results'],
  },
};

const assistantModes = ['Chat', 'Trend lookup', 'Rewrite', 'Planning'];

const stoneNamesGoogleTrends = [
  'Agate',
  'Amazonite',
  'Amethyst',
  'Ametrine',
  'Andalusite',
  'Angelite',
  'Apache Tear',
  'Apatite',
  'Aquamarine',
  'Aquamarine Morganite',
  'Aquaprase',
  'Arfvedsonite',
  'Arusha',
  'Azurite',
  'Azurite Chrysocolla',
  'Azurite Malachite',
  'Biotite',
  'Bloodstone',
  'Bronzite',
  'Calcite',
  'Calligraphy',
  'Carnelian',
  'Celestite',
  'Chakra',
  'Chalcedony',
  'Charoite',
  'Chrysocolla',
  'Chrysoprase',
  'Citrine',
  'Clear Quartz',
  'Coral',
  'Diopside',
  'Dumortierite',
  'Emerald',
  'Fluorite',
  'Fuchsite',
  'Garnet',
  "Hawk's Eye",
  'Hematite',
  'Hematoid',
  'Hemimorphite',
  'Howlite',
  'Hypersthene',
  'Iolite',
  'Jade',
  'Jasper',
  'Jet',
  'Kunzite',
  'Kyanite',
  'Labradorite',
  'Lapis Lazuli',
  'Larimar',
  'Larvikite',
  'Lava',
  'Lepidolite',
  'Lianite',
  'Lodalite / Chlorite',
  'Malachite',
  'Mookaite',
  'Moonstone',
  'Morganite',
  'Mother of Pearl',
  'Obsidian',
  'Onyx',
  'Opal',
  'Peridot',
  'Petrified Wood',
  'Phantom',
  'Phosphosiderite',
  'Pietersite',
  'Prehnite',
  'Pyrite',
  'Quartz',
  'Rhodochrosite',
  'Rhodonite',
  'River Rock',
  'Rose Quartz',
  'Ruby',
  'Ruby Sapphire',
  'Ruby Zoisite',
  'Sacred Seven',
  'Sandstone',
  'Sapphire',
  'Seraphinite',
  'Serpentine',
  'Shattuckite',
  'Shungite',
  'Smoky Quartz',
  'Sodalite',
  'Spinel',
  'Sugilite',
  'Sunstone',
  'Sunstone Moonstone',
  'Tanzanite',
  'Terahertz',
  'Thulite',
  'Tiffany',
  "Tiger's Eye",
  'Topaz',
  'Tourmaline',
  'Turquoise',
  'Unakite',
  'Variscite',
];

const root = document.getElementById('root');

function getRoute() {
  return window.location.pathname.replace(/\/+$/, '') || '/';
}

function go(path) {
  history.pushState({}, '', path);
  render();
}

function renderHome() {
  root.innerHTML = `
    <div class="page-shell">
      <div class="backdrop backdrop-left"></div>
      <div class="backdrop backdrop-right"></div>

      <header class="topbar">
        <div>
          <span class="eyebrow">Private AI workspace</span>
          <h1>Solaleh + Farahnaz, each with a dedicated AI section.</h1>
          <p class="lead">
            Click a name to open a personal page. Each user gets their own space for chat, trends, and history.
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
            <span class="field-label">Open the personal pages</span>
            <input value="Click Solaleh or Farahnaz below" readonly />
          </label>
        </div>
      </section>

      <main class="workspace">
        ${Object.values(users)
          .map(
            (user) => `
              <button class="persona-card ${user.accent} home-card" data-open="${user.id}">
                <header class="persona-head">
                  <div>
                    <span class="persona-kicker">${user.name}</span>
                    <h2>${user.name}'s dedicated workspace</h2>
                  </div>
                  <span class="status-pill">Open page</span>
                </header>
                <div class="section-block">
                  <p class="persona-copy">Click to open ${user.name}'s personal page with their own AI chat, trends, and saved history.</p>
                </div>
              </button>
            `
          )
          .join('')}
      </main>
    </div>
  `;

  document.querySelectorAll('[data-open]').forEach((button) => {
    button.addEventListener('click', () => go(`/${button.getAttribute('data-open')}`));
  });
}

function renderUserPage(user) {
  root.innerHTML = `
    <div class="page-shell">
      <div class="backdrop backdrop-left"></div>
      <div class="backdrop backdrop-right"></div>

      <header class="topbar">
        <div>
          <span class="eyebrow">${user.name.toUpperCase()}</span>
          <h1>${user.name}'s personal AI page</h1>
          <p class="lead">This page is dedicated to ${user.name} only. It includes private AI chat, Google Trends lookup, and personal history.</p>
        </div>
        <div class="topbar-actions">
          <button class="ghost-btn" id="back-home">Back to home</button>
          <span class="url-chip">Personal workspace</span>
        </div>
      </header>

      <section class="hero-card">
        <div>
          <div class="stat-grid">
            <div class="stat-card">
              <strong>Chat</strong>
              <span>Ask the AI anything</span>
            </div>
            <div class="stat-card">
              <strong>Trends</strong>
              <span>Top 3 Google Trends</span>
            </div>
            <div class="stat-card">
              <strong>History</strong>
              <span>Saved notes and activity</span>
            </div>
          </div>
        </div>
        <div class="hero-panel">
          <span class="panel-badge">Personal use</span>
          <ol>
            <li>Open your own page from the home screen.</li>
            <li>Use the AI chat area for your personal prompts.</li>
            <li>Look up trend keywords from the last 7 days.</li>
          </ol>
        </div>
      </section>

      <section class="assistant-bar panel">
        <div>
          <span class="panel-label">AI mode</span>
          <h2>${user.name}'s assistant settings</h2>
        </div>
        <div class="assistant-controls">
          <label>
            <span class="field-label">Mode</span>
            <select id="assistant-mode">
              ${assistantModes.map((mode) => `<option value="${mode}">${mode}</option>`).join('')}
            </select>
          </label>
          <label>
            <span class="field-label">Connection</span>
            <input value="Ready for OpenAI API connection" readonly />
          </label>
        </div>
      </section>

      <main class="workspace single-workspace">
        <section class="persona-card ${user.accent}">
          <header class="persona-head">
            <div>
              <span class="persona-kicker">${user.name}</span>
              <h2>${user.name}'s AI chat</h2>
            </div>
            <span class="status-pill">Visible</span>
          </header>

          <div class="section-block">
            <span class="panel-label">AI chat for ${user.name}</span>
            <textarea id="prompt" class="persona-note">${user.starterPrompt}</textarea>
            <div class="action-row">
              <button class="secondary-btn" id="fill-prompt">Load example</button>
              <button class="ghost-btn" id="send-prompt">Send to AI</button>
            </div>
            <div class="assistant-preview">
              <span class="field-label">AI reply preview</span>
              <p id="reply"></p>
            </div>
          </div>

          <div class="section-block">
            <span class="panel-label">Google Trends for ${user.name}</span>
            <label class="field-label" for="keywords">Keywords for Google Trends</label>
            <textarea id="keywords" class="persona-note">${user.starterKeywords}</textarea>
            <div class="action-row">
              <button class="secondary-btn" id="fill-keywords">Load example keywords</button>
              <button class="ghost-btn" id="search-trends">Search trends</button>
            </div>
            <div class="assistant-preview">
              <span class="field-label">Top 3 results from the last week</span>
              <ul class="trend-list" id="trends"></ul>
            </div>
          </div>

          <div class="section-block">
            <span class="panel-label">Gemstone trends</span>
            <p class="persona-copy">
              Click the button below to search your full gemstone list against Google Trends for the past week and return the top 3.
            </p>
            <div class="action-row">
              <button class="ghost-btn" id="find-gemstone-trends">Find trending gemstones</button>
            </div>
            <div class="assistant-preview">
              <span class="field-label">Gemstone trend results</span>
              <ul class="trend-list" id="gemstone-results"></ul>
            </div>
          </div>

          <div class="section-block">
            <span class="panel-label">Saved history for ${user.name}</span>
            <ul class="trend-list" id="history"></ul>
          </div>
        </section>
      </main>
    </div>
  `;

  const modeEl = document.getElementById('assistant-mode');
  const promptEl = document.getElementById('prompt');
  const keywordEl = document.getElementById('keywords');
  const replyEl = document.getElementById('reply');
  const trendsEl = document.getElementById('trends');
  const gemstoneResultsEl = document.getElementById('gemstone-results');
  const historyEl = document.getElementById('history');

  function renderAiReply() {
    replyEl.textContent = `Mode: ${modeEl.value}. I can help turn this into a useful AI response: "${promptEl.value.trim() || 'No prompt yet'}"`;
  }

  function renderTrendPreview() {
    const items = keywordEl.value
      .trim()
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const top3 = (items.length ? items : ['Trend lookup will appear here', 'Connect the Google Trends function next', 'Top 3 results']).slice(0, 3);
    trendsEl.innerHTML = top3.map((item) => `<li>${item}</li>`).join('');
  }

  function renderHistory() {
    historyEl.innerHTML = user.history.map((item) => `<li>${item}</li>`).join('');
  }

  async function findGemstoneTrends() {
    gemstoneResultsEl.innerHTML = '<li>Searching Google Trends...</li>';
    try {
      const response = await fetch(`/api/trends?keywords=${encodeURIComponent(stoneNamesGoogleTrends.join(','))}`);
      const data = await response.json();

      if (!response.ok) {
        gemstoneResultsEl.innerHTML = `<li>${data.error ?? 'Trend lookup failed.'}</li>`;
        return;
      }

      gemstoneResultsEl.innerHTML = data.results
        .map((item, index) => `<li>${index + 1}. ${item.keyword}</li>`)
        .join('');
    } catch (error) {
      gemstoneResultsEl.innerHTML = `<li>${error instanceof Error ? error.message : 'Trend lookup failed.'}</li>`;
    }
  }

  document.getElementById('back-home').addEventListener('click', () => go('/'));
  document.getElementById('fill-prompt').addEventListener('click', () => {
    promptEl.value =
      user.id === 'solaleh'
        ? 'Help me draft content ideas for gemstone trends and luxury style.'
        : 'Rewrite my notes into a clear plan for the week.';
    renderAiReply();
  });
  document.getElementById('fill-keywords').addEventListener('click', () => {
    keywordEl.value =
      user.id === 'solaleh'
        ? 'gemstone trends\nluxury jewelry trends\nAI creator tools'
        : 'gemstone trends\nproductivity trends\naudience growth';
    renderTrendPreview();
  });
  document.getElementById('send-prompt').addEventListener('click', renderAiReply);
  document.getElementById('search-trends').addEventListener('click', renderTrendPreview);
  document.getElementById('find-gemstone-trends').addEventListener('click', findGemstoneTrends);

  modeEl.addEventListener('change', renderAiReply);
  promptEl.addEventListener('input', renderAiReply);
  keywordEl.addEventListener('input', renderTrendPreview);

  renderAiReply();
  renderTrendPreview();
  renderHistory();
  gemstoneResultsEl.innerHTML = '<li>Click “Find trending gemstones” to search the full list.</li>';
}

function render() {
  const route = getRoute();
  if (route === '/solaleh') {
    renderUserPage(users.solaleh);
    return;
  }
  if (route === '/farahnaz') {
    renderUserPage(users.farahnaz);
    return;
  }
  renderHome();
}

window.addEventListener('popstate', render);
render();
