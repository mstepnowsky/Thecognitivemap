import { useState } from 'react'
import { Eye, MessageSquare, RefreshCw, HelpCircle, Plus, Trash2, ChevronDown, ChevronUp, Save, CheckCircle } from 'lucide-react'
import { storage, newId, formatDate } from '../utils/storage'

const ROUTINES = [
  {
    id: 'stw',
    icon: Eye,
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    accent: 'text-violet-700',
    badgeBg: 'bg-violet-100',
    label: 'See · Think · Wonder',
    tagline: 'Slow down and notice',
    description:
      'Use this routine when you encounter something new — a text, a prompt, a problem, or an AI-generated response. What do you actually observe? What does it make you think? What questions does it spark?',
    source: 'Project Zero, Harvard Graduate School of Education',
    fields: [
      { key: 'see',    label: 'See', prompt: 'What do you notice or observe? List specific details — don\'t interpret yet, just describe what\'s there.', rows: 4 },
      { key: 'think',  label: 'Think', prompt: 'What does this make you think? What interpretations, connections, or ideas come to mind?', rows: 4 },
      { key: 'wonder', label: 'Wonder', prompt: 'What questions does this raise? What are you curious about or unsure of?', rows: 4 },
    ],
    contextLabel: 'What are you looking at or working on?',
  },
  {
    id: 'csq',
    icon: MessageSquare,
    color: 'from-blue-500 to-brand-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    accent: 'text-blue-700',
    badgeBg: 'bg-blue-100',
    label: 'Claim · Support · Question',
    tagline: 'Build an argument carefully',
    description:
      'Use this routine to test any claim — including one made by an AI. A strong claim needs real evidence. Weak support or unexplained gaps are worth questioning.',
    source: 'Project Zero, Harvard Graduate School of Education',
    fields: [
      { key: 'claim',    label: 'Claim', prompt: 'What is the main claim or argument being made? State it clearly in your own words.', rows: 3 },
      { key: 'support',  label: 'Support', prompt: 'What evidence or reasoning backs this claim? Is it specific and credible?', rows: 4 },
      { key: 'question', label: 'Question', prompt: 'What would you challenge? What\'s missing, unclear, or needs more proof?', rows: 4 },
    ],
    contextLabel: 'What claim are you examining?',
  },
  {
    id: 'utnt',
    icon: RefreshCw,
    color: 'from-teal-500 to-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    accent: 'text-teal-700',
    badgeBg: 'bg-teal-100',
    label: 'I Used to Think… Now I Think…',
    tagline: 'Track how your thinking shifts',
    description:
      'Use this routine after learning something new, finishing a project, or experimenting with AI. It makes your intellectual growth visible — and worth keeping.',
    source: 'Project Zero, Harvard Graduate School of Education',
    fields: [
      { key: 'usedToThink', label: 'I Used to Think…', prompt: 'Before this experience, lesson, or assignment — what did you think or believe about this topic?', rows: 4 },
      { key: 'nowIThink',   label: 'Now I Think…', prompt: 'What do you think now? What changed, deepened, or surprised you?', rows: 4 },
      { key: 'whatChanged', label: 'What Caused the Shift?', prompt: 'What specifically — a reading, a conversation, a failure, an AI response — shifted your thinking?', rows: 3 },
    ],
    contextLabel: 'What topic or experience is this about?',
  },
  {
    id: 'wmys',
    icon: HelpCircle,
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    accent: 'text-amber-700',
    badgeBg: 'bg-amber-100',
    label: 'What Makes You Say That?',
    tagline: 'Unpack your reasoning',
    description:
      'Use this routine to push past surface reactions — yours or an AI\'s. An interpretation is only as strong as the reasoning behind it. What\'s actually driving this conclusion?',
    source: 'Project Zero, Harvard Graduate School of Education',
    fields: [
      { key: 'interpretation', label: 'Interpretation or Conclusion', prompt: 'What is the interpretation, conclusion, or response you (or the AI) arrived at?', rows: 3 },
      { key: 'evidence',       label: 'Evidence Behind It', prompt: 'What specific evidence, data, or experience supports this conclusion?', rows: 4 },
      { key: 'assumptions',    label: 'Hidden Assumptions', prompt: 'What assumptions are baked in? What is taken for granted that might not be true?', rows: 4 },
      { key: 'alternative',    label: 'An Alternative Reading', prompt: 'What\'s another reasonable interpretation of the same evidence?', rows: 3 },
    ],
    contextLabel: 'What interpretation or response are you examining?',
  },
]

function RoutineCard({ routine }) {
  const { id, icon: Icon, color, bg, border, accent, badgeBg, label, tagline, description, source, fields, contextLabel } = routine

  const [expanded, setExpanded] = useState(false)
  const [context, setContext] = useState('')
  const [answers, setAnswers] = useState({})
  const [saved, setSaved] = useState(false)
  const [entries, setEntries] = useState(() => storage.getRoutineEntries().filter(e => e.routineId === id))
  const [showHistory, setShowHistory] = useState(false)

  function setAnswer(key, val) {
    setAnswers(a => ({ ...a, [key]: val }))
    setSaved(false)
  }

  function save() {
    const entry = {
      id: newId(),
      routineId: id,
      routineLabel: label,
      context,
      answers,
      createdAt: new Date().toISOString(),
    }
    storage.saveRoutineEntry(entry)
    setEntries(storage.getRoutineEntries().filter(e => e.routineId === id))
    setSaved(true)
    setContext('')
    setAnswers({})
    setTimeout(() => setSaved(false), 3000)
  }

  function deleteEntry(eid) {
    storage.deleteRoutineEntry(eid)
    setEntries(storage.getRoutineEntries().filter(e => e.routineId === id))
  }

  const filled = fields.filter(f => answers[f.key]?.trim()).length

  return (
    <div className={`card border ${border} overflow-hidden`}>
      {/* Header */}
      <button
        className="w-full flex items-start gap-4 text-left"
        onClick={() => setExpanded(e => !e)}
      >
        <div className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-sm`}>
          <Icon size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-lg">{label}</h3>
            <span className={`badge ${badgeBg} ${accent}`}>{tagline}</span>
            {entries.length > 0 && (
              <span className="badge bg-slate-100 text-slate-600">{entries.length} saved</span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed line-clamp-2">{description}</p>
        </div>
        <div className="shrink-0 text-slate-400 mt-1">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="mt-6 space-y-5">
          <p className="text-xs text-slate-400 italic">Source: {source}</p>

          {/* Context */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">{contextLabel}</label>
            <input
              className="input-field"
              placeholder="e.g. 'Chapter 3 of The Giver' or 'AI-generated essay intro'"
              value={context}
              onChange={e => { setContext(e.target.value); setSaved(false) }}
            />
          </div>

          {/* Fields */}
          {fields.map(({ key, label: fLabel, prompt, rows }) => (
            <div key={key}>
              <label className="block text-sm font-semibold mb-1.5">
                <span className={`${accent} mr-1`}>{fLabel}</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">{prompt}</p>
              <textarea
                className="textarea-field"
                rows={rows}
                placeholder="Write your response here…"
                value={answers[key] || ''}
                onChange={e => setAnswer(key, e.target.value)}
              />
            </div>
          ))}

          {/* Progress + Save */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              {filled}/{fields.length} prompts answered
            </span>
            <button
              onClick={save}
              disabled={filled === 0 && !context}
              className={`btn-primary gap-2 ${saved ? 'bg-teal-600 hover:bg-teal-700' : ''}`}
            >
              {saved ? (
                <><CheckCircle size={15} /> Saved!</>
              ) : (
                <><Save size={15} /> Save Entry</>
              )}
            </button>
          </div>

          {/* History */}
          {entries.length > 0 && (
            <div className="border-t border-slate-100 pt-4">
              <button
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-800 mb-3"
                onClick={() => setShowHistory(h => !h)}
              >
                {showHistory ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                Past entries ({entries.length})
              </button>
              {showHistory && (
                <div className="space-y-4">
                  {entries.map(e => (
                    <div key={e.id} className={`${bg} rounded-xl p-4 border ${border}`}>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          {e.context && <p className="font-semibold text-sm">{e.context}</p>}
                          <p className="text-xs text-slate-400">{formatDate(e.createdAt)}</p>
                        </div>
                        <button
                          onClick={() => deleteEntry(e.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          aria-label="Delete entry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {fields.map(f => e.answers[f.key] && (
                          <div key={f.key}>
                            <span className={`text-xs font-bold ${accent}`}>{f.label}: </span>
                            <span className="text-xs text-slate-700 whitespace-pre-wrap">{e.answers[f.key]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ThinkingRoutines() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-extrabold mb-2">Thinking Routines</h1>
        <p className="text-slate-500 leading-relaxed max-w-2xl">
          These four routines from{' '}
          <span className="font-semibold text-slate-700">Project Zero</span> at Harvard make your
          thinking visible — before, during, and after you work with AI. Pick one that fits your
          current task. Expand it, fill in your thinking, and save your responses.
        </p>
      </div>

      {/* Callout */}
      <div className="card bg-brand-50 border-brand-100 flex gap-3 items-start">
        <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center shrink-0 mt-0.5">
          <HelpCircle size={15} />
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-900 mb-1">Why thinking routines?</p>
          <p className="text-sm text-brand-800 leading-relaxed">
            "AI relocates thinking — it doesn't eliminate it. These routines are how you make sure
            that thinking stays with you." The goal isn't to slow you down; it's to make sure
            the intellectual work is genuinely yours.
          </p>
        </div>
      </div>

      {/* Routine cards */}
      <div className="space-y-4">
        {ROUTINES.map(r => <RoutineCard key={r.id} routine={r} />)}
      </div>
    </div>
  )
}
