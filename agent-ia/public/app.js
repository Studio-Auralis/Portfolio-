/* ══════════════════════════════════════════════════
   AI Strategy Engine — Frontend
   ══════════════════════════════════════════════════ */

// ── SVG Icons ──
const ICONS = {
  analyst: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
  technical: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><polyline points="7 10 10 13 14 8 17 11"/></svg>`,
  strategist: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><path d="M5 20V10l4-5 4 3 4-4 3 3v13"/><circle cx="9" cy="5" r="1.5" fill="currentColor" stroke="none"/><circle cx="17" cy="7" r="1.5" fill="currentColor" stroke="none"/></svg>`,
  pending: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9" opacity="0.3"/><path d="M12 7v5l3 3"/></svg>`,
  active: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3a9 9 0 1 1-6.36 2.64" /><polyline points="6 3 6 7 10 7"/></svg>`,
  done: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="9 12 11.5 14.5 16 9.5"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
};

// ── Agent config ──
const AGENTS = {
  analyst: { name: 'Agent Analyste', icon: ICONS.analyst, color: '#4A9EFF', role: 'Analyse sectorielle' },
  technical: { name: 'Agent Technique', icon: ICONS.technical, color: '#4AFF8B', role: 'Solutions IA' },
  strategist: { name: 'Agent Stratégique', icon: ICONS.strategist, color: '#4AFFD4', role: 'Stratégie & Plan' },
};

// ── DOM elements ──
const $ = (sel) => document.querySelector(sel);
const formSection = $('#form-section');
const orchSection = $('#orchestration-section');
const reportSection = $('#report-section');
const form = $('#analysis-form');
const submitBtn = $('#submit-btn');
const sectorSelect = $('#sector');
const sectorCustom = $('#sectorCustom');
const chatMessages = $('#chat-messages');
const stepsList = $('#steps-list');
const companyInfo = $('#company-info');
const loadingOverlay = $('#loading-overlay');
const reportContent = $('#report-content');
const reportSubtitle = $('#report-subtitle');
const btnDownloadPdf = $('#btn-download-pdf');
const errorToast = $('#error-toast');
const errorMessage = $('#error-message');

// ── State ──
let currentMessageEl = null;
let currentMessageText = '';
let reportText = '';
let formData = {};

// ══════════════════════════════════════════════════
// PARTICLES BACKGROUND
// ══════════════════════════════════════════════════
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(74, 255, 212, ${p.alpha})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(74, 255, 212, ${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

// ══════════════════════════════════════════════════
// MARKDOWN PARSER (lightweight)
// ══════════════════════════════════════════════════
function parseMarkdown(md) {
  let html = md
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
    .replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
    .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
    // Bold + Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Horizontal rules
    .replace(/^---+$/gm, '<hr>')
    // Tables — mark rows, detect separator to identify header
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim() !== '');
      // Check if this is a separator row (|---|---|)
      const isSeparator = cells.every(c => /^[\s-:]+$/.test(c));
      if (isSeparator) return '<tr data-sep="1"></tr>';
      return '<tr>' + cells.map(c => {
        const content = c.trim().replace(/^\*\*|\*\*$/g, '');
        return `<td>${content}</td>`;
      }).join('') + '</tr>';
    });

  // Wrap table rows in <table> and promote header row
  html = html.replace(/((?:<tr[^>]*>.*<\/tr>\n?)+)/g, (block) => {
    // If there's a separator row, the row before it is the header
    if (block.includes('data-sep="1"')) {
      block = block
        .replace(/<tr data-sep="1"><\/tr>\n?/g, '')
        .replace(/<tr>(.*?)<\/tr>/, (m, inner) => {
          // First row becomes thead
          const headerRow = inner.replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>');
          return `<thead><tr>${headerRow}</tr></thead><tbody>`;
        });
      block = block + '</tbody>';
    }
    return '<table>' + block + '</table>';
  });

  // Unordered lists — use temp marker to avoid collision with ordered
  html = html.replace(/^[\s]*[-*]\s+(.+)$/gm, '<uli>$1</uli>');
  html = html.replace(/((?:<uli>.*<\/uli>\n?)+)/g, (m) => '<ul>' + m.replace(/uli>/g, 'li>') + '</ul>');

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<oli>$1</oli>');
  html = html.replace(/((?:<oli>.*<\/oli>\n?)+)/g, (m) => '<ol>' + m.replace(/oli>/g, 'li>') + '</ol>');

  // Paragraphs (lines not already wrapped)
  html = html.replace(/^(?!<[hluot\/<]|<hr|<li|<tr)(.+)$/gm, '<p>$1</p>');

  // Clean empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');

  return html;
}

// ══════════════════════════════════════════════════
// SECTION NAVIGATION
// ══════════════════════════════════════════════════
function showSection(section) {
  [formSection, orchSection, reportSection].forEach((s) => s.classList.remove('active'));
  section.classList.add('active');
  window.scrollTo(0, 0);
}

// ══════════════════════════════════════════════════
// FORM HANDLING
// ══════════════════════════════════════════════════
sectorSelect.addEventListener('change', () => {
  sectorCustom.classList.toggle('hidden', sectorSelect.value !== 'other');
  if (sectorSelect.value === 'other') sectorCustom.focus();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const sector = sectorSelect.value === 'other' ? sectorCustom.value : sectorSelect.value;
  if (!sector) return;

  formData = {
    companyName: $('#companyName').value.trim(),
    sector,
    employees: $('#employees').value,
    challenges: $('#challenges').value.trim(),
    budget: $('#budget').value || '',
  };

  startAnalysis(formData);
});

// ══════════════════════════════════════════════════
// SSE ANALYSIS
// ══════════════════════════════════════════════════
async function startAnalysis(data) {
  // Reset state
  chatMessages.innerHTML = '';
  stepsList.innerHTML = '';
  reportText = '';
  currentMessageEl = null;
  currentMessageText = '';

  // Show company info in sidebar
  companyInfo.innerHTML = `
    <strong>${data.companyName}</strong>
    <span>${data.sector}</span>
    <span>${data.employees}</span>
    ${data.budget ? `<span>Budget : ${data.budget}</span>` : ''}
  `;

  // Show loading then orchestration
  loadingOverlay.classList.remove('hidden');
  submitBtn.disabled = true;

  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    loadingOverlay.classList.add('hidden');
    showSection(orchSection);

    // Read SSE stream
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let eventType = '';
    let eventData = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith('event: ')) {
          eventType = line.slice(7);
        } else if (line.startsWith('data: ')) {
          eventData = line.slice(6);
        } else if (line === '') {
          // Blank line = end of SSE event block
          if (eventType && eventData) {
            try {
              handleSSE(eventType, JSON.parse(eventData));
            } catch (e) {
              console.warn('SSE parse error:', e);
            }
          }
          eventType = '';
          eventData = '';
        }
      }
    }

    submitBtn.disabled = false;
  } catch (err) {
    loadingOverlay.classList.add('hidden');
    showError(err.message);
    submitBtn.disabled = false;
  }
}

function handleSSE(type, data) {
  switch (type) {
    case 'steps':
      renderSteps(data.steps);
      break;

    case 'step-update':
      updateStep(data.stepId, data.status);
      break;

    case 'thinking':
      finishCurrentMessage();
      showThinking(data);
      break;

    case 'chunk':
      appendChunk(data.agent, data.content);
      break;

    case 'agent-done':
      finishCurrentMessage();
      removeThinking();
      break;

    case 'report-chunk':
      reportText += data.content;
      break;

    case 'complete':
      showReport(data.report || reportText);
      break;

    case 'error':
      showError(data.message);
      break;

    case 'done':
      // Stream ended
      break;
  }
}

// ══════════════════════════════════════════════════
// STEPS SIDEBAR
// ══════════════════════════════════════════════════
function renderSteps(steps) {
  stepsList.innerHTML = steps
    .map(
      (s) => `
    <div class="step-item" data-step="${s.id}">
      <span class="step-icon">${ICONS.pending}</span>
      <span>${s.label}</span>
    </div>
  `
    )
    .join('');
}

function updateStep(stepId, status) {
  const el = stepsList.querySelector(`[data-step="${stepId}"]`);
  if (!el) return;

  el.classList.remove('active', 'done');
  const icon = el.querySelector('.step-icon');

  if (status === 'active') {
    el.classList.add('active');
    icon.innerHTML = ICONS.active;
  } else if (status === 'done') {
    el.classList.add('done');
    icon.innerHTML = ICONS.done;
  }
}

// ══════════════════════════════════════════════════
// CHAT MESSAGES
// ══════════════════════════════════════════════════
function showThinking(data) {
  const div = document.createElement('div');
  div.className = 'thinking-indicator';
  div.id = 'thinking';
  const agentCfg = AGENTS[data.agent] || {};
  div.innerHTML = `
    <div class="agent-avatar agent-avatar--sm" style="--agent-color: ${data.color}">
      ${agentCfg.icon || ''}
    </div>
    <div class="thinking-dots" style="--agent-color: ${data.color}">
      <span></span><span></span><span></span>
    </div>
    <span class="thinking-text">${data.name} analyse les données...</span>
  `;
  chatMessages.appendChild(div);
  scrollChat();
}

function removeThinking() {
  const el = document.getElementById('thinking');
  if (el) el.remove();
}

function appendChunk(agentId, content) {
  const agent = AGENTS[agentId];
  if (!agent) return;

  // Create message bubble if first chunk for this agent turn
  if (!currentMessageEl || currentMessageEl.dataset.agent !== agentId) {
    removeThinking();
    finishCurrentMessage();

    currentMessageText = '';
    const div = document.createElement('div');
    div.className = 'chat-message';
    div.dataset.agent = agentId;
    div.innerHTML = `
      <div class="agent-avatar" style="--agent-color: ${agent.color}">
        ${agent.icon}
      </div>
      <div class="message-content">
        <div class="message-header">
          <span class="message-name" style="--agent-color: ${agent.color}">${agent.name}</span>
          <span class="message-tag">${agent.role}</span>
        </div>
        <div class="message-body"></div>
      </div>
    `;
    chatMessages.appendChild(div);
    currentMessageEl = div;
  }

  currentMessageText += content;

  // Render markdown periodically (throttled)
  renderCurrentMessage();
  scrollChat();
}

let renderTimeout = null;
function renderCurrentMessage() {
  if (renderTimeout) return;
  renderTimeout = setTimeout(() => {
    if (currentMessageEl) {
      const body = currentMessageEl.querySelector('.message-body');
      body.innerHTML = parseMarkdown(currentMessageText);
    }
    renderTimeout = null;
  }, 80);
}

function finishCurrentMessage() {
  if (renderTimeout) {
    clearTimeout(renderTimeout);
    renderTimeout = null;
  }
  if (currentMessageEl) {
    const body = currentMessageEl.querySelector('.message-body');
    body.innerHTML = parseMarkdown(currentMessageText);
    currentMessageEl = null;
    currentMessageText = '';
  }
}

function scrollChat() {
  requestAnimationFrame(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}

// ══════════════════════════════════════════════════
// REPORT
// ══════════════════════════════════════════════════
function showReport(report) {
  // Clean report markers
  let clean = report
    .replace(/---RAPPORT_DEBUT---/g, '')
    .replace(/---RAPPORT_FIN---/g, '')
    .trim();

  reportSubtitle.textContent = `Pour ${formData.companyName} — ${formData.sector}`;
  reportContent.innerHTML = parseMarkdown(clean);

  // Brief delay for dramatic effect
  setTimeout(() => {
    showSection(reportSection);
  }, 800);
}

// ══════════════════════════════════════════════════
// PDF DOWNLOAD
// ══════════════════════════════════════════════════
btnDownloadPdf.addEventListener('click', () => {
  // Use browser print as PDF fallback
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    showError('Le navigateur a bloqué le popup. Veuillez autoriser les popups pour télécharger le PDF.');
    return;
  }
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Rapport IA — ${formData.companyName}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          color: #1a1a2e;
          line-height: 1.7;
        }
        h1 { color: #0f9b8e; font-size: 1.8rem; margin-bottom: 0.3rem; }
        h2 { color: #666; font-size: 1rem; font-weight: 400; border-bottom: 2px solid #0f9b8e; padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
        h3 { color: #0f9b8e; font-size: 1.3rem; margin-top: 2rem; }
        h4 { font-size: 1.05rem; margin-top: 1.2rem; }
        table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        th { background: #f0faf8; color: #0f9b8e; text-align: left; padding: 0.5rem 0.75rem; border: 1px solid #ddd; }
        td { padding: 0.5rem 0.75rem; border: 1px solid #ddd; }
        ul, ol { padding-left: 1.4rem; }
        li { margin-bottom: 0.3rem; }
        hr { border: none; border-top: 1px solid #eee; margin: 1.5rem 0; }
        .footer { margin-top: 3rem; text-align: center; color: #999; font-size: 0.85rem; border-top: 1px solid #eee; padding-top: 1rem; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      ${reportContent.innerHTML}
      <div class="footer">
        Rapport généré par AI Strategy Engine — Studio Auralis<br>
        ${new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
});

// ══════════════════════════════════════════════════
// ERROR HANDLING
// ══════════════════════════════════════════════════
function showError(msg) {
  errorMessage.textContent = msg;
  errorToast.classList.remove('hidden');
  setTimeout(() => errorToast.classList.add('hidden'), 8000);
}
