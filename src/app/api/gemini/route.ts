import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

const SYSTEM_CONTEXT = `You are Imole AI, a friendly and knowledgeable civic assistant for OsunFix — 
a public accountability platform for Osun State, Nigeria. Your role is to:
- Help citizens understand how their government works
- Explain constituency projects, budgets, and government accountability in simple, clear language
- Guide citizens on how to report issues, track projects, and exercise their rights
- Provide factual information about Osun State governance
Always be helpful, encouraging, and non-partisan. Use simple English mixed with Yoruba greetings where appropriate (e.g. "E kaabo" for welcome, "E se" for thank you). Keep responses concise (under 200 words unless asked to elaborate).`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, message, context } = body;

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured.' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_CONTEXT
    });

    // ── Mode: Citizen Chat (Imole AI) ─────────────────────────
    if (mode === 'chat') {
      let safeHistory = Array.isArray(context?.history) ? [...context.history] : [];
      
      // Gemini STRICTLY requires the first message in history to be from 'user'.
      // If the UI sends an initial greeting from 'model', we must strip it.
      while (safeHistory.length > 0 && safeHistory[0].role !== 'user') {
        safeHistory.shift();
      }

      const chat = model.startChat({
        history: safeHistory,
        generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
      });
      
      const result = await chat.sendMessage(`Citizen question: ${message}`);
      return NextResponse.json({ reply: result.response.text() });
    }

    // ── Mode: Quiz Grading ────────────────────────────────────
    if (mode === 'quiz') {
      const { question, correctAnswer, userAnswer } = body;
      const prompt = `You are a kind civic education tutor. Grade the following quiz answer:

Question: "${question}"
Correct Answer: "${correctAnswer}"
Student's Answer: "${userAnswer}"

Provide:
1. A score out of 10
2. A brief (2-3 sentence), encouraging, educational explanation
3. One interesting civic fact related to the question

Format your response as JSON: { "score": <number>, "feedback": "<string>", "funFact": "<string>" }`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    }

    // ── Mode: Project AI Audit ────────────────────────────────
    if (mode === 'project') {
      const { project } = body;
      const prompt = `You are a Nigerian civic accountability expert. Analyze this government project and give a clear, honest assessment for ordinary citizens:

Project: "${project.title}"
LGA: ${project.lga}, Osun State
Category: ${project.category}
Contractor: ${project.contractor}
Budget: ₦${(project.budgetNGN / 1_000_000).toFixed(1)}M
Amount Released: ₦${(project.amountReleasedNGN / 1_000_000).toFixed(1)}M
Progress: ${project.progressPercent}%
Status: ${project.status}
Description: ${project.description}
Expected Beneficiaries: ${project.beneficiaries?.toLocaleString()}

Provide a JSON response with:
{
  "citizenSummary": "<2-3 sentence plain English summary for everyday citizens>",
  "accountabilityScore": <1-10 score based on funds released vs progress>,
  "redFlags": ["<list of any concerns, or empty array if none>"],
  "citizenActions": "<1-2 actionable steps citizens can take to hold officials accountable>",
  "environmentalImpact": "<brief mention of sustainability angle>"
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    }

    return NextResponse.json({ error: 'Invalid mode. Use: chat | quiz | project' }, { status: 400 });

  } catch (err: unknown) {
    console.error('[Gemini API Route Error]', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
