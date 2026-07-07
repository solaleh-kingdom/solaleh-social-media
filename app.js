const toneOptions = ['Confident', 'Playful', 'Educational', 'Luxury'];
const formatOptions = ['30s Short', '45s Short', '60s Short'];

const starterTrends = `1. AI tools for solo creators
2. Behind-the-scenes content
3. Quick productivity wins
4. Storytime clips`;

const ideaLibrary = [
  {
    keyword: 'ai',
    hook: 'Everyone is talking about AI, but here is the version creators actually need.',
    angle: 'Show how you turn noisy trend chatter into a simple weekly content system.',
    cta: 'If you want the template, comment "AI".',
  },
  {
    keyword: 'behind',
    hook: 'The best-performing shorts are not perfect, they are believable.',
    angle: 'Use a behind-the-scenes angle to make the trend feel personal and repeatable.',
    cta: 'Save this if you want more BTS ideas.',
  },
  {
    keyword: 'productivity',
    hook: 'This is the fastest way to make your content system feel lighter this week.',
    angle: 'Frame the trend as a small workflow win instead of a massive overhaul.',
    cta: 'Follow for the weekly breakdown.',
  },
  {
    keyword: 'story',
    hook: 'Storytime shorts work when the opening line creates instant curiosity.',
    angle: 'Use a short story to connect the trend to your own experience.',
    cta: 'Want part two? I can build it next.',
  },
];

function normalizeLines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^\d+[\).\s-]*/, ''));
}

function buildScripts(trends, tone, format) {
  const items = normalizeLines(trends);
  const cleanItems = items.length ? items : ['Trend one', 'Trend two', 'Trend three'];

  return cleanItems.map((trend, index) => {
    const matchedIdea =
      ideaLibrary.find((idea) => trend.toLowerCase().includes(idea.keyword)) ?? ideaLibrary[index % ideaLibrary.length];

    const duration =
      format === '30s Short' ? '20-30 seconds' : format === '45s Short' ? '35-45 seconds' : '50-60 seconds';

    return {
      trend,
      title: `Script ${index + 1}`,
      duration,
      hook: matchedIdea.hook,
      body: `${matchedIdea.angle} Build the short around "${trend}" and keep the pacing ${tone.toLowerCase()} and tight.`,
      cta: matchedIdea.cta,
    };
  });
}

const root = document.getElementById('root');
root.innerHTML = `
  <div class="page-shell">
    <div class="backdrop"></div>
    <header class="topbar">
      <div>
        <span class="eyebrow">Browser-based content studio</span>
        <h1>Turn weekly trends into short-form scripts from any device.</h1>
      </div>
      <div class="topbar-actions">
        <button class="ghost-btn" id="save-week">Save week</button>
        <span class="url-chip">Accessible in your browser</span>
      </div>
    </header>

    <main class="layout">
      <section class="hero-card">
        <div class="hero-copy">
          <p class="lead">
            Paste the trends you want to work on this week, pick a tone, and get a batch of short-ready scripts
            you can record, tweak, and post from your phone, tablet, or laptop.
          </p>
          <div class="hero-stats">
            <div>
              <strong id="script-count">0</strong>
              <span>scripts ready</span>
            </div>
            <div>
              <strong id="length-label">45s Short</strong>
              <span>target length</span>
            </div>
            <div>
              <strong id="tone-label">Confident</strong>
              <span>voice</span>
            </div>
          </div>
        </div>
        <div class="hero-panel">
          <div class="panel-badge">Website workflow</div>
          <p>1. Drop in the trends.</p>
          <p>2. Choose the vibe.</p>
          <p>3. Copy the scripts into your recording process.</p>
        </div>
      </section>

      <section class="workspace">
        <article class="panel editor">
          <div class="panel-head">
            <div>
              <span class="panel-label">Input</span>
              <h2>Your weekly trend brief</h2>
            </div>
            <button class="secondary-btn" id="load-example">Load example</button>
          </div>

          <label class="field-label" for="trends">Trends</label>
          <textarea id="trends" placeholder="Paste the trends, topics, or hooks you want to work on this week."></textarea>

          <div class="controls">
            <label>
              <span class="field-label">Tone</span>
              <select id="tone-select">
                ${toneOptions.map((option) => `<option value="${option}">${option}</option>`).join('')}
              </select>
            </label>
            <label>
              <span class="field-label">Short length</span>
              <select id="format-select">
                ${formatOptions.map((option) => `<option value="${option}">${option}</option>`).join('')}
              </select>
            </label>
          </div>
        </article>

        <article class="panel scripts">
          <div class="panel-head">
            <div>
              <span class="panel-label">Output</span>
              <h2>Generated short scripts</h2>
            </div>
            <span class="count-pill" id="draft-count">0 drafts</span>
          </div>

          <div class="script-list" id="script-list"></div>
        </article>
      </section>

      <section class="bottom-grid">
        <article class="panel mini">
          <span class="panel-label">Website features</span>
          <h2>What this site does</h2>
          <ul>
            <li>Collects the trends you are working on each week.</li>
            <li>Turns them into repeatable short-form structures.</li>
            <li>Keeps your planning inside one shareable website.</li>
          </ul>
        </article>

        <article class="panel mini">
          <span class="panel-label">Saved briefs</span>
          <h2>Recent weeks</h2>
          <div class="saved-list" id="saved-list"></div>
        </article>
      </section>
    </main>
  </div>
`;

const trendsEl = document.getElementById('trends');
const toneEl = document.getElementById('tone-select');
const formatEl = document.getElementById('format-select');
const scriptListEl = document.getElementById('script-list');
const savedListEl = document.getElementById('saved-list');
const scriptCountEl = document.getElementById('script-count');
const draftCountEl = document.getElementById('draft-count');
const toneLabelEl = document.getElementById('tone-label');
const lengthLabelEl = document.getElementById('length-label');
const loadExampleEl = document.getElementById('load-example');
const saveWeekEl = document.getElementById('save-week');

let savedBriefs = [
  'Week of July 7: creator AI workflows, quick hooks, and BTS content',
  'Week of July 14: audience growth, niche authority, and offer teasers',
];

function renderSavedBriefs() {
  savedListEl.innerHTML = savedBriefs.map((brief) => `<div class="saved-item">${brief}</div>`).join('');
}

function renderScripts() {
  const scripts = buildScripts(trendsEl.value, toneEl.value, formatEl.value);
  scriptListEl.innerHTML = scripts
    .map(
      (script) => `
        <section class="script-card">
          <div class="script-meta">
            <strong>${script.title}</strong>
            <span>${script.duration}</span>
          </div>
          <p class="trend-tag">${script.trend}</p>
          <div class="script-line">
            <span>Hook</span>
            <p>${script.hook}</p>
          </div>
          <div class="script-line">
            <span>Body</span>
            <p>${script.body}</p>
          </div>
          <div class="script-line">
            <span>CTA</span>
            <p>${script.cta}</p>
          </div>
        </section>
      `
    )
    .join('');

  scriptCountEl.textContent = `${scripts.length}`;
  draftCountEl.textContent = `${scripts.length} drafts`;
  toneLabelEl.textContent = toneEl.value;
  lengthLabelEl.textContent = formatEl.value;
}

trendsEl.value = starterTrends;
renderSavedBriefs();
renderScripts();

trendsEl.addEventListener('input', renderScripts);
toneEl.addEventListener('change', renderScripts);
formatEl.addEventListener('change', renderScripts);

loadExampleEl.addEventListener('click', () => {
  trendsEl.value = starterTrends;
  renderScripts();
});

saveWeekEl.addEventListener('click', () => {
  const summary = normalizeLines(trendsEl.value).join(' · ') || 'Empty brief';
  savedBriefs = [summary, ...savedBriefs].slice(0, 4);
  renderSavedBriefs();
});
