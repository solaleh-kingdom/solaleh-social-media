const personas = [
  {
    id: 'solaleh',
    name: 'Solaleh',
    colorClass: 'persona-a',
    prompt: 'Ask the AI to draft posts, summarize ideas, or plan content for Solaleh.',
    chips: ['Content ideas', 'Post drafts', 'Weekly plan'],
    starter: 'Today I want to plan my content for the week and draft one strong post.',
  },
  {
    id: 'farahnaz',
    name: 'Farahnaz',
    colorClass: 'persona-b',
    prompt: 'Ask the AI to brainstorm, rewrite, or organize work for Farahnaz.',
    chips: ['Brainstorming', 'Rewrite help', 'Task list'],
    starter: 'Help me turn my thoughts into clear tasks and one useful post idea.',
  },
];

const assistantModes = ['General help', 'Content writing', 'Planning', 'Rewrite'];

const examples = {
  solaleh: [
    'Create 5 content ideas about AI for creators.',
    'Write a short caption that sounds confident and warm.',
    'Turn this rough note into a clean post.',
  ],
  farahnaz: [
    'Organize my ideas into a simple to-do list.',
    'Rewrite this message so it sounds polished.',
    'Give me 3 angles for a post about productivity.',
  ],
};

function createPersonaCard(persona) {
  return `
    <section class="persona-card ${persona.colorClass}" data-persona="${persona.id}">
      <header class="persona-head">
        <div>
          <span class="persona-kicker">${persona.name}</span>
          <h2>${persona.name}'s space</h2>
        </div>
        <span class="status-pill">AI ready</span>
      </header>

      <p class="persona-copy">${persona.prompt}</p>

      <div class="chip-row">
        ${persona.chips.map((chip) => `<span class="chip">${chip}</span>`).join('')}
      </div>

      <label class="field-label" for="${persona.id}-note">Quick note</label>
      <textarea id="${persona.id}-note" class="persona-note">${persona.starter}</textarea>

      <div class="action-row">
        <button class="secondary-btn" data-fill="${persona.id}">Load example</button>
        <button class="ghost-btn" data-copy="${persona.id}">Copy note</button>
      </div>

      <div class="assistant-preview">
        <span class="field-label">Suggested AI prompt</span>
        <p id="${persona.id}-suggestion"></p>
      </div>
    </section>
  `;
}

const root = document.getElementById('root');
root.innerHTML = `
  <div class="page-shell">
    <div class="backdrop backdrop-left"></div>
    <div class="backdrop backdrop-right"></div>

    <header class="topbar">
      <div>
        <span class="eyebrow">Private AI workspace</span>
        <h1>One place for Solaleh, Farahnaz, and AI help anytime.</h1>
        <p class="lead">
          This site is being shaped as a shared space where each person has their own section,
          with an assistant area ready for OpenAI-powered help later.
        </p>
      </div>
      <div class="topbar-actions">
        <span class="url-chip">Connected to GitHub + Netlify</span>
        <span class="url-chip">Edit once, publish everywhere</span>
      </div>
    </header>

    <main class="layout">
      <section class="hero-card">
        <div class="hero-copy">
          <div class="stat-grid">
            <div class="stat-card">
              <strong>2</strong>
              <span>separate user spaces</span>
            </div>
            <div class="stat-card">
              <strong>AI</strong>
              <span>assistant-ready design</span>
            </div>
            <div class="stat-card">
              <strong>Live</strong>
              <span>Netlify deploys from GitHub</span>
            </div>
          </div>
        </div>
        <div class="hero-panel">
          <span class="panel-badge">How it will work</span>
          <ol>
            <li>Each person gets their own section.</li>
            <li>Each section has a prompt box and AI suggestions.</li>
            <li>Later we connect the OpenAI API so the site can answer directly.</li>
          </ol>
        </div>
      </section>

      <section class="assistant-bar panel">
        <div>
          <span class="panel-label">Shared assistant</span>
          <h2>One AI for both users</h2>
        </div>
        <div class="assistant-controls">
          <label>
            <span class="field-label">Mode</span>
            <select id="assistant-mode">
              ${assistantModes.map((mode) => `<option value="${mode}">${mode}</option>`).join('')}
            </select>
          </label>
          <label>
            <span class="field-label">Model note</span>
            <input id="model-note" value="Ready for OpenAI API connection" readonly />
          </label>
        </div>
      </section>

      <section class="workspace">
        ${personas.map(createPersonaCard).join('')}
      </section>
    </main>
  </div>
`;

const assistantModeEl = document.getElementById('assistant-mode');
const suggestionEls = Object.fromEntries(personas.map((persona) => [persona.id, document.getElementById(`${persona.id}-suggestion`)]));
const noteEls = Object.fromEntries(personas.map((persona) => [persona.id, document.getElementById(`${persona.id}-note`)]));

function buildSuggestion(name, note, mode) {
  const cleaned = note.trim() || 'No note yet';
  return `Mode: ${mode}. Turn this into a useful next step for ${name}: "${cleaned}"`;
}

function renderSuggestions() {
  const mode = assistantModeEl.value;
  personas.forEach((persona) => {
    suggestionEls[persona.id].textContent = buildSuggestion(persona.name, noteEls[persona.id].value, mode);
  });
}

assistantModeEl.addEventListener('change', renderSuggestions);

personas.forEach((persona) => {
  noteEls[persona.id].addEventListener('input', renderSuggestions);
});

document.querySelectorAll('[data-fill]').forEach((button) => {
  button.addEventListener('click', () => {
    const personaId = button.getAttribute('data-fill');
    noteEls[personaId].value = examples[personaId][0];
    renderSuggestions();
  });
});

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const personaId = button.getAttribute('data-copy');
    await navigator.clipboard.writeText(noteEls[personaId].value);
    button.textContent = 'Copied';
    setTimeout(() => {
      button.textContent = 'Copy note';
    }, 1200);
  });
});

renderSuggestions();
