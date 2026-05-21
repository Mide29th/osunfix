'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sparkles, BookOpen, MessageCircle, Search, ChevronRight, Loader2, AlertTriangle, TrendingUp, Users, Leaf, X, Send, RotateCcw, CheckCircle } from 'lucide-react';
import { getProjects, getFlashcards, type ConstituencyProject, type CivicFlashcard } from '@/lib/dataService';

// ── Types ─────────────────────────────────────────────────────
type Tab = 'projects' | 'flashcards' | 'chat';
interface ChatMessage { role: 'user' | 'model'; text: string; }
interface AuditResult {
  citizenSummary: string;
  accountabilityScore: number;
  redFlags: string[];
  citizenActions: string;
  environmentalImpact: string;
}
interface QuizResult { score: number; feedback: string; funFact: string; }

// ── Helpers ───────────────────────────────────────────────────
const formatNGN = (n: number) =>
  n >= 1_000_000_000
    ? `₦${(n / 1_000_000_000).toFixed(2)}B`
    : `₦${(n / 1_000_000).toFixed(1)}M`;

const statusColor: Record<string, string> = {
  Completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Stalled: 'bg-red-100 text-red-700 border-red-200',
};

const categoryIcon: Record<string, string> = {
  'Roads & Transport': '🛣️',
  'Water & Sanitation': '💧',
  Education: '📚',
  Healthcare: '🏥',
  Energy: '⚡',
  Agriculture: '🌾',
};

const progressBarColor = (pct: number) => {
  if (pct >= 80) return 'from-emerald-400 to-emerald-600';
  if (pct >= 40) return 'from-blue-400 to-blue-600';
  if (pct >= 15) return 'from-amber-400 to-amber-500';
  return 'from-red-400 to-red-500';
};

// ── FlipCard Component ────────────────────────────────────────
function FlipCard({ card }: { card: CivicFlashcard }) {
  const [flipped, setFlipped] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<QuizResult | null>(null);
  const [grading, setGrading] = useState(false);

  const grade = async () => {
    if (!answer.trim()) return;
    setGrading(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'quiz',
          question: card.question,
          correctAnswer: card.answer,
          userAnswer: answer,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ score: 0, feedback: 'Could not grade at this time.', funFact: '' });
    } finally {
      setGrading(false);
    }
  };

  const reset = () => { setFlipped(false); setQuizMode(false); setAnswer(''); setResult(null); };

  const diffColor = { Beginner: 'text-emerald-600 bg-emerald-50', Intermediate: 'text-blue-600 bg-blue-50', Advanced: 'text-purple-600 bg-purple-50' }[card.difficulty];
  const catColor: Record<string, string> = {
    'State Government': 'from-violet-500 to-purple-600',
    'Local Government': 'from-blue-500 to-cyan-600',
    'Citizen Rights': 'from-emerald-500 to-teal-600',
    'Financial Accountability': 'from-amber-500 to-orange-600',
  };

  return (
    <div className="group" style={{ perspective: '1000px' }}>
      <div
        className="relative w-full transition-all duration-700 cursor-pointer"
        style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', minHeight: '260px' }}
        onClick={() => !quizMode && setFlipped(f => !f)}
      >
        {/* Front */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/20 shadow-lg" style={{ backfaceVisibility: 'hidden' }}>
          <div className={`absolute inset-0 bg-gradient-to-br ${catColor[card.category]} opacity-90`} />
          <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
            <div className="flex items-start justify-between gap-2">
              <span className="text-4xl">{card.icon}</span>
              <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${diffColor} text-opacity-100`} style={{ color: undefined }}>
                {card.difficulty}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-white/70 mb-2">{card.category}</p>
              <p className="text-base font-bold leading-snug">{card.question}</p>
            </div>
            <p className="text-[11px] text-white/60 flex items-center gap-1 mt-2">
              <RotateCcw className="h-3 w-3" /> Tap to reveal answer
            </p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden border border-border shadow-lg bg-white" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="p-5 h-full flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">{card.category} · Answer</p>
              <p className="text-sm text-foreground leading-relaxed">{card.answer}</p>
            </div>
            <div className="flex gap-2 mt-4" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setQuizMode(true)}
                className="flex-1 text-xs font-semibold py-2 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
              >
                <Sparkles className="h-3 w-3" /> Test with AI
              </button>
              <button onClick={reset} className="text-xs py-2 px-3 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors">Reset</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Drawer */}
      {quizMode && (
        <div className="mt-3 rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-primary flex items-center gap-1"><Sparkles className="h-4 w-4" /> Gemini Quiz Grader</p>
            <button onClick={reset} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <p className="text-xs text-muted-foreground font-medium">{card.question}</p>
          {!result ? (
            <>
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full h-24 text-sm border border-border rounded-xl px-3 py-2 resize-none focus:ring-2 focus:ring-primary outline-none bg-white"
              />
              <button
                onClick={grade}
                disabled={grading || !answer.trim()}
                className="w-full py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {grading ? <><Loader2 className="h-4 w-4 animate-spin" /> Grading...</> : <><Sparkles className="h-4 w-4" /> Submit to Gemini</>}
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-border">
                <div className={`text-2xl font-black ${result.score >= 7 ? 'text-emerald-600' : result.score >= 4 ? 'text-amber-600' : 'text-red-500'}`}>
                  {result.score}/10
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{result.feedback}</p>
              </div>
              {result.funFact && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                  💡 <strong>Fun Fact:</strong> {result.funFact}
                </div>
              )}
              <button onClick={reset} className="w-full py-2 text-xs font-semibold rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors">
                Try Another Card
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── ProjectAuditDrawer ────────────────────────────────────────
function ProjectAuditDrawer({ project, onClose }: { project: ConstituencyProject; onClose: () => void }) {
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'project', project }),
        });
        const data = await res.json();
        setAudit(data);
      } catch {
        setAudit(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [project]);

  const scoreColor = (s: number) => s >= 7 ? 'text-emerald-600' : s >= 4 ? 'text-amber-600' : 'text-red-500';

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Gemini AI Audit</span>
            </div>
            <h3 className="font-bold text-sm leading-snug">{project.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{project.lga} LGA · {project.category}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-xl" />)}
              <p className="text-center text-xs text-muted-foreground pt-2">Gemini is analyzing this project...</p>
            </div>
          ) : audit ? (
            <>
              {/* Accountability Score */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/15">
                <div className={`text-4xl font-black ${scoreColor(audit.accountabilityScore)}`}>
                  {audit.accountabilityScore}/10
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Accountability Score</p>
                  <p className="text-xs text-muted-foreground">Based on funds released vs. progress</p>
                </div>
              </div>

              {/* Citizen Summary */}
              <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                <p className="text-xs font-bold text-foreground mb-1 flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> Citizen Summary</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{audit.citizenSummary}</p>
              </div>

              {/* Red Flags */}
              {audit.redFlags?.length > 0 && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                  <p className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Accountability Flags</p>
                  <ul className="space-y-1">
                    {audit.redFlags.map((f, i) => (
                      <li key={i} className="text-xs text-red-600 flex items-start gap-1.5">
                        <span className="mt-0.5 text-red-400">•</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What Citizens Can Do */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <p className="text-xs font-bold text-emerald-700 mb-1 flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> What You Can Do</p>
                <p className="text-xs text-emerald-700 leading-relaxed">{audit.citizenActions}</p>
              </div>

              {/* Environmental */}
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                <p className="text-xs font-bold text-teal-700 mb-1 flex items-center gap-1"><Leaf className="h-3.5 w-3.5" /> Environmental Impact</p>
                <p className="text-xs text-teal-700 leading-relaxed">{audit.environmentalImpact}</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-center text-muted-foreground py-8">AI audit unavailable — please check your Gemini API key.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function CivicHubPage() {
  const [tab, setTab] = useState<Tab>('projects');

  // Projects
  const [projects, setProjects] = useState<ConstituencyProject[]>([]);
  const [projLoading, setProjLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [auditProject, setAuditProject] = useState<ConstituencyProject | null>(null);

  // Flashcards
  const [flashcards, setFlashcards] = useState<CivicFlashcard[]>([]);
  const [cardLoading, setCardLoading] = useState(true);
  const [cardCategory, setCardCategory] = useState('All');

  // Chat
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', text: 'E kaabo! 👋 I\'m **Imole AI**, your civic guide for Osun State. I can help you understand government projects, your rights, budgets, and how to hold officials accountable.\n\nWhat would you like to know today?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load data
  useEffect(() => {
    getProjects().then(data => { setProjects(data); setProjLoading(false); });
    getFlashcards().then(data => { setFlashcards(data); setCardLoading(false); });
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Filtered projects
  const filteredProjects = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.lga.toLowerCase().includes(search.toLowerCase()) ||
      p.constituency.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  const flashCategories = ['All', 'State Government', 'Local Government', 'Citizen Rights', 'Financial Accountability'];
  const filteredCards = flashcards.filter(c => cardCategory === 'All' || c.category === cardCategory);

  // Chat send
  const sendChat = useCallback(async (text: string) => {
    if (!text.trim() || chatLoading) return;
    const userMsg: ChatMessage = { role: 'user', text };
    setChatHistory(h => [...h, userMsg]);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'chat',
          message: text,
          context: { history: chatHistory.map(m => ({ role: m.role, parts: [{ text: m.text }] })) },
        }),
      });
      const data = await res.json();
      setChatHistory(h => [...h, { role: 'model', text: data.reply || 'Sorry, I could not get a response.' }]);
    } catch {
      setChatHistory(h => [...h, { role: 'model', text: 'Network error. Please check your connection and try again.' }]);
    } finally {
      setChatLoading(false);
    }
  }, [chatHistory, chatLoading]);

  const quickPrompts = [
    'How do I track a government project?',
    'What are my rights as a citizen?',
    'How is Osun State budget shared?',
    'How do I report corruption?',
  ];

  const totalBudget = projects.reduce((s, p) => s + p.budgetNGN, 0);
  const totalCO2 = projects.reduce((s, p) => s + p.co2SavedKg, 0);
  const completed = projects.filter(p => p.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-6 gap-4">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:block">Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-none">Civic & Accountability Hub</h1>
              <p className="text-[10px] text-muted-foreground">Powered by Gemini AI · Osun State</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground hidden sm:block">Live Data</span>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 py-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xl font-black">{formatNGN(totalBudget)}</p>
            <p className="text-[10px] text-primary-foreground/70 uppercase tracking-wider">Total Budget Tracked</p>
          </div>
          <div className="text-center border-x border-primary-foreground/20">
            <p className="text-xl font-black">{completed}/{projects.length}</p>
            <p className="text-[10px] text-primary-foreground/70 uppercase tracking-wider">Projects Completed</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black">{(totalCO2 / 1000).toFixed(0)}t</p>
            <p className="text-[10px] text-primary-foreground/70 uppercase tracking-wider">CO₂ Saved</p>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="container mx-auto px-4 md:px-6 pt-6">
        <div className="flex bg-muted rounded-2xl p-1.5 gap-1 max-w-lg">
          {[
            { id: 'projects' as Tab, label: 'Projects', icon: TrendingUp },
            { id: 'flashcards' as Tab, label: 'Flashcards', icon: BookOpen },
            { id: 'chat' as Tab, label: 'Imole AI', icon: MessageCircle },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${tab === id ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── PROJECTS TAB ─────────────────────────────────────── */}
      {tab === 'projects' && (
        <div className="container mx-auto px-4 md:px-6 py-8 space-y-6">
          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects, LGAs, constituencies..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-white shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="h-11 px-4 rounded-xl border border-border bg-white shadow-sm text-sm focus:ring-2 focus:ring-primary outline-none"
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Project Cards */}
          {projLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1,2,3,4].map(i => <div key={i} className="h-56 bg-muted rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {filteredProjects.map(project => (
                <div key={project.id} className="group bg-white rounded-2xl border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 overflow-hidden">
                  {/* Card Top */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{categoryIcon[project.category] || '🏗️'}</span>
                        <div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor[project.status]}`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{project.lga} LGA</p>
                        <p className="text-[10px] text-muted-foreground">{project.constituency}</p>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm leading-snug text-foreground mb-3 line-clamp-2">{project.title}</h3>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Progress</span>
                        <span className="font-bold text-foreground">{project.progressPercent}%</span>
                      </div>
                      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${progressBarColor(project.progressPercent)} rounded-full transition-all duration-1000`}
                          style={{ width: `${project.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-muted/60 rounded-xl p-2.5">
                        <p className="text-muted-foreground">Total Budget</p>
                        <p className="font-bold text-foreground">{formatNGN(project.budgetNGN)}</p>
                      </div>
                      <div className="bg-muted/60 rounded-xl p-2.5">
                        <p className="text-muted-foreground">Released</p>
                        <p className="font-bold text-foreground">{formatNGN(project.amountReleasedNGN)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{project.beneficiaries?.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Leaf className="h-3 w-3 text-emerald-500" />{(project.co2SavedKg/1000).toFixed(1)}t CO₂</span>
                    </div>
                    <button
                      onClick={() => setAuditProject(project)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> AI Audit <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!projLoading && filteredProjects.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="font-semibold">No projects found</p>
              <p className="text-sm">Try a different search or category filter</p>
            </div>
          )}
        </div>
      )}

      {/* ── FLASHCARDS TAB ───────────────────────────────────── */}
      {tab === 'flashcards' && (
        <div className="container mx-auto px-4 md:px-6 py-8 space-y-6">
          <div className="text-center mb-2">
            <h2 className="text-2xl font-bold">Civic Knowledge Cards</h2>
            <p className="text-sm text-muted-foreground mt-1">Tap a card to reveal · Test yourself with Gemini AI</p>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap">
            {flashCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setCardCategory(cat)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${cardCategory === cat ? 'bg-primary text-primary-foreground border-primary' : 'bg-white text-muted-foreground border-border hover:border-primary/50'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {cardLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCards.map(card => <FlipCard key={card.id} card={card} />)}
            </div>
          )}
        </div>
      )}

      {/* ── CHAT TAB ─────────────────────────────────────────── */}
      {tab === 'chat' && (
        <div className="container mx-auto px-4 md:px-6 py-6 max-w-2xl">
          <div className="bg-white rounded-3xl border border-border shadow-xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 280px)', minHeight: '480px' }}>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">Imole AI</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                  Powered by Google Gemini · Civic Assistant
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-md' : 'bg-muted text-foreground rounded-tl-md'}`}>
                    {msg.text.split('\n').map((line, j) => (
                      <p key={j} className={j > 0 ? 'mt-1' : ''}
                        dangerouslySetInnerHTML={{
                          __html: line
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Imole is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Prompts */}
            {chatHistory.length <= 1 && (
              <div className="px-4 pb-2 flex gap-2 flex-wrap">
                {quickPrompts.map(p => (
                  <button key={p} onClick={() => sendChat(p)} className="text-[11px] px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary font-medium hover:bg-primary/10 transition-colors whitespace-nowrap">
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendChat(chatInput)}
                  placeholder="Ask about Osun State governance, projects, rights..."
                  className="flex-1 h-11 px-4 rounded-xl border border-border bg-muted/40 focus:bg-white text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                />
                <button
                  onClick={() => sendChat(chatInput)}
                  disabled={chatLoading || !chatInput.trim()}
                  className="h-11 w-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 flex items-center justify-center transition-all"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Drawer Overlay */}
      {auditProject && <ProjectAuditDrawer project={auditProject} onClose={() => setAuditProject(null)} />}
    </div>
  );
}
