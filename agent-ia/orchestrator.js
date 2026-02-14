const Groq = require('groq-sdk');
const analyst = require('./agents/analyst');
const technical = require('./agents/technical');
const strategist = require('./agents/strategist');

const MODEL = 'llama-3.3-70b-versatile';

function createGroqClient() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

async function streamAgentResponse(groq, agent, userMessage, onChunk) {
  const stream = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: agent.systemPrompt },
      { role: 'user', content: userMessage },
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 2048,
  });

  let fullResponse = '';
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      fullResponse += content;
      onChunk(content);
    }
  }
  return fullResponse;
}

async function streamReportResponse(groq, userMessage, onChunk) {
  const stream = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: strategist.reportPrompt },
      { role: 'user', content: userMessage },
    ],
    stream: true,
    temperature: 0.5,
    max_tokens: 4096,
  });

  let fullResponse = '';
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      fullResponse += content;
      onChunk(content);
    }
  }
  return fullResponse;
}

/**
 * Run the full orchestration pipeline.
 * sendEvent(type, data) sends an SSE event to the client.
 */
async function orchestrate(formData, sendEvent) {
  const groq = createGroqClient();

  const steps = [
    { id: 'sector-analysis', label: 'Analyse du secteur', agent: 'analyst' },
    { id: 'opportunities', label: 'Identification des opportunités', agent: 'analyst' },
    { id: 'technical-solutions', label: 'Recherche de solutions techniques', agent: 'technical' },
    { id: 'strategy', label: 'Élaboration de la stratégie', agent: 'strategist' },
    { id: 'feedback', label: 'Tour de feedback entre agents', agent: 'all' },
    { id: 'report', label: 'Génération du rapport final', agent: 'strategist' },
  ];

  sendEvent('steps', { steps });

  // ── Step 1 & 2: Agent Analyste ──
  sendEvent('step-update', { stepId: 'sector-analysis', status: 'active' });
  sendEvent('thinking', { agent: analyst.role, name: analyst.name,  color: analyst.color });

  let analystOutput = '';
  try {
    analystOutput = await streamAgentResponse(
      groq,
      analyst,
      analyst.buildUserPrompt(formData),
      (chunk) => sendEvent('chunk', { agent: analyst.role, content: chunk })
    );
  } catch (err) {
    sendEvent('error', { message: `Erreur Agent Analyste: ${err.message}` });
    throw err;
  }

  sendEvent('agent-done', { agent: analyst.role });
  sendEvent('step-update', { stepId: 'sector-analysis', status: 'done' });
  sendEvent('step-update', { stepId: 'opportunities', status: 'done' });

  // ── Step 3: Agent Technique ──
  sendEvent('step-update', { stepId: 'technical-solutions', status: 'active' });
  sendEvent('thinking', { agent: technical.role, name: technical.name,  color: technical.color });

  let technicalOutput = '';
  try {
    technicalOutput = await streamAgentResponse(
      groq,
      technical,
      technical.buildUserPrompt(analystOutput),
      (chunk) => sendEvent('chunk', { agent: technical.role, content: chunk })
    );
  } catch (err) {
    sendEvent('error', { message: `Erreur Agent Technique: ${err.message}` });
    throw err;
  }

  sendEvent('agent-done', { agent: technical.role });
  sendEvent('step-update', { stepId: 'technical-solutions', status: 'done' });

  // ── Step 4: Agent Stratégique ──
  sendEvent('step-update', { stepId: 'strategy', status: 'active' });
  sendEvent('thinking', { agent: strategist.role, name: strategist.name,  color: strategist.color });

  let strategicOutput = '';
  try {
    strategicOutput = await streamAgentResponse(
      groq,
      strategist,
      strategist.buildUserPrompt(analystOutput, technicalOutput),
      (chunk) => sendEvent('chunk', { agent: strategist.role, content: chunk })
    );
  } catch (err) {
    sendEvent('error', { message: `Erreur Agent Stratégique: ${err.message}` });
    throw err;
  }

  sendEvent('agent-done', { agent: strategist.role });
  sendEvent('step-update', { stepId: 'strategy', status: 'done' });

  // ── Step 5: Feedback round ──
  sendEvent('step-update', { stepId: 'feedback', status: 'active' });

  // Analyst feedback
  sendEvent('thinking', { agent: analyst.role, name: analyst.name,  color: analyst.color });
  let analystFeedback = '';
  try {
    analystFeedback = await streamAgentResponse(
      groq,
      analyst,
      analyst.buildFeedbackPrompt(technicalOutput, strategicOutput),
      (chunk) => sendEvent('chunk', { agent: analyst.role, content: chunk })
    );
  } catch (err) {
    sendEvent('error', { message: `Erreur feedback Analyste: ${err.message}` });
    analystFeedback = '';
  }
  sendEvent('agent-done', { agent: analyst.role });

  // Technical feedback
  sendEvent('thinking', { agent: technical.role, name: technical.name,  color: technical.color });
  let technicalFeedback = '';
  try {
    technicalFeedback = await streamAgentResponse(
      groq,
      technical,
      technical.buildFeedbackPrompt(strategicOutput, analystFeedback),
      (chunk) => sendEvent('chunk', { agent: technical.role, content: chunk })
    );
  } catch (err) {
    sendEvent('error', { message: `Erreur feedback Technique: ${err.message}` });
    technicalFeedback = '';
  }
  sendEvent('agent-done', { agent: technical.role });

  // Strategist integrates feedback
  sendEvent('thinking', { agent: strategist.role, name: strategist.name,  color: strategist.color });
  let strategistFeedback = '';
  try {
    strategistFeedback = await streamAgentResponse(
      groq,
      strategist,
      strategist.buildFeedbackPrompt(analystFeedback, technicalFeedback),
      (chunk) => sendEvent('chunk', { agent: strategist.role, content: chunk })
    );
  } catch (err) {
    sendEvent('error', { message: `Erreur feedback Stratégique: ${err.message}` });
    strategistFeedback = '';
  }
  sendEvent('agent-done', { agent: strategist.role });
  sendEvent('step-update', { stepId: 'feedback', status: 'done' });

  // ── Step 6: Final Report ──
  sendEvent('step-update', { stepId: 'report', status: 'active' });
  sendEvent('thinking', { agent: strategist.role, name: strategist.name,  color: strategist.color });

  const feedbackRound = [analystFeedback, technicalFeedback, strategistFeedback]
    .filter(Boolean)
    .join('\n\n');

  let report = '';
  try {
    report = await streamReportResponse(
      groq,
      strategist.buildReportPrompt(formData, analystOutput, technicalOutput, strategicOutput, feedbackRound),
      (chunk) => sendEvent('report-chunk', { content: chunk })
    );
  } catch (err) {
    sendEvent('error', { message: `Erreur génération rapport: ${err.message}` });
    throw err;
  }

  sendEvent('step-update', { stepId: 'report', status: 'done' });
  sendEvent('complete', { report });
}

module.exports = { orchestrate };
