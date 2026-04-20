import { useState } from 'react'
import { BookOpen, CheckCircle, ChevronRight, ChevronLeft, Plus, Trash2, ChevronDown, ChevronUp, Save } from 'lucide-react'
import { storage, newId, formatDate } from '../utils/storage'

// Harvard Center for Digital Thriving – IMAGINE AI Framework (adapted)
const STEPS = [
  {
    letter: 'I',
    title: 'Identify the Task',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    accent: 'text-violet-700',
    description: 'Be specific about what you\'re trying to accomplish — and what kind of thinking the task actually requires from you.',
    fields: [
      { key: 'taskDescription', label: 'What is the task?', prompt: 'Describe the assignment or problem in your own words. What is actually being asked of you?', rows: 3 },
      { key: 'thinkingRequired', label: 'What kind of thinking does it require?', prompt: 'Does it require creative thinking? Analysis? Synthesis? Personal opinion? Memorization? Research? Be specific.', rows: 3 },
      { key: 'learningGoal', label: 'What\'s the learning goal?', prompt: 'What is your teacher (or you) actually hoping you learn or practice by doing this?', rows: 2 },
    ],
  },
  {
    letter: 'M',
    title: 'Map Your Values',
    color: 'from-blue-500 to-brand-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    accent: 'text-blue-700',
    description: 'Before deciding anything, clarify what you actually value in this situation — academically and personally.',
    fields: [
      { key: 'academicValues', label: 'What do you value academically here?', prompt: 'e.g. Building skill? Getting a good grade? Understanding the material? Saving time? All of these?', rows: 3 },
      { key: 'personalValues', label: 'What do you value personally?', prompt: 'e.g. Being honest with yourself? Doing something that feels like yours? Getting it done efficiently?', rows: 3 },
      { key: 'tensions', label: 'Are there any tensions?', prompt: 'Do any of these values conflict? e.g. Efficiency vs. learning. Speed vs. authenticity.', rows: 2 },
    ],
  },
  {
    letter: 'A',
    title: 'Assess AI Capabilities',
    color: 'from-teal-500 to-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    accent: 'text-teal-700',
    description: 'What can AI actually do well here — and where does it fall short or mislead?',
    fields: [
      { key: 'aiStrengths', label: 'Where could AI genuinely help?', prompt: 'What specific parts of this task could AI assist with usefully? (e.g. brainstorming, proofreading, explaining a concept)', rows: 3 },
      { key: 'aiLimitations', label: 'Where might AI mislead or fall short?', prompt: 'What might AI get wrong, oversimplify, or produce that sounds right but isn\'t? (e.g. hallucinated facts, generic responses, no personal voice)', rows: 3 },
      { key: 'aiRisks', label: 'What\'s the risk if you use it carelessly?', prompt: 'What might you miss out on learning? What might you submit that doesn\'t reflect your actual thinking?', rows: 2 },
    ],
  },
  {
    letter: 'G',
    title: 'Generate Your Criteria',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    accent: 'text-amber-700',
    description: 'Based on what you\'ve identified so far, what criteria will you use to decide?',
    fields: [
      { key: 'criteria', label: 'What criteria matter most to you?', prompt: 'e.g. "AI use should help me think more clearly, not replace my thinking." or "I\'ll use AI only if it helps me learn the concept, not just produce an answer."', rows: 4 },
      { key: 'boundaries', label: 'What limits will you set for yourself?', prompt: 'Be specific. e.g. "I\'ll draft the argument myself first, then use AI to check for logical gaps." or "I won\'t paste AI text directly."', rows: 3 },
    ],
  },
  {
    letter: 'I',
    title: 'Implement Thoughtfully',
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
    border: 'border-green-100',
    accent: 'text-green-700',
    description: 'Now decide and act — using the clarity you\'ve built in the previous steps.',
    fields: [
      { key: 'decision', label: 'What is your decision?', prompt: 'Will you use AI? If so, exactly how and for what? If not, why not?', rows: 3 },
      { key: 'howImplemented', label: 'How did you actually implement this?', prompt: 'Describe what you did — what prompts you used, how you used the output, what you changed or ignored.', rows: 4 },
    ],
  },
  {
    letter: 'N',
    title: 'Note What Happened',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    accent: 'text-rose-700',
    description: 'After completing the task, document what actually occurred — honestly.',
    fields: [
      { key: 'whatActuallyHappened', label: 'What actually happened?', prompt: 'Did you follow your plan? What surprised you? Did AI help in ways you expected — or cause problems you didn\'t anticipate?', rows: 4 },
      { key: 'thinkingOwned', label: 'What thinking is genuinely yours?', prompt: 'Which parts of the finished work reflect your own thinking, choices, and voice?', rows: 3 },
    ],
  },
  {
    letter: 'E',
    title: 'Evaluate and Grow',
    color: 'from-brand-600 to-brand-700',
    bg: 'bg-brand-50',
    border: 'border-brand-100',
    accent: 'text-brand-700',
    description: 'Reflect on the full experience and decide what you\'ll carry forward.',
    fields: [
      { key: 'didItWork', label: 'Did your approach align with your values?', prompt: 'Looking at the criteria you set in Step G — did you live up to them? Where did you fall short?', rows: 3 },
      { key: 'whatLearned', label: 'What did you learn — about the subject, and about AI?', prompt: 'Not just about the assignment topic, but about how AI tools work, their limitations, and your relationship with them.', rows: 3 },
      { key: 'nextTime', label: 'What will you do differently next time?', prompt: 'One or two specific adjustments for your next decision.', rows: 2 },
    ],
  },
]

function StepIndicator({ steps, currentStep, onJump }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {steps.map((s, i) => (
        <button
          key={i}
          onClick={() => onJump(i)}
          className={`w-9 h-9 rounded-xl font-bold text-sm transition-all duration-150 ${
            i === currentStep
              ? 'bg-brand-700 text-white scale-110 shadow-md'
              : i < currentStep
              ? 'bg-teal-500 text-white'
              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
          }`}
          title={s.title}
        >
          {s.letter}
        </button>
      ))}
    </div>
  )
}

function ImagineForm({ onSave, onCancel }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [title, setTitle] = useState('')
  const [saved, setSaved] = useState(false)

  function setAnswer(key, val) {
    setAnswers(a => ({ ...a, [key]: val }))
  }

  const step = STEPS[currentStep]
  const isLast = currentStep === STEPS.length - 1
  const isFirst = currentStep === 0

  const stepFilled = step.fields.filter(f => answers[f.key]?.trim()).length

  function handleSave() {
    const entry = {
      id: newId(),
      title: title || answers['taskDescription']?.slice(0, 60) || 'IMAGINE Session',
      answers,
      completedSteps: currentStep + 1,
      totalSteps: STEPS.length,
      createdAt: new Date().toISOString(),
    }
    onSave(entry)
    setSaved(true)
  }

  return (
    <div className="card border-2 border-brand-200 bg-brand-50/20 space-y-6">
      {/* Wizard header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-brand-900 flex items-center gap-2">
            <BookOpen size={18} className="text-brand-700" /> IMAGINE Session
          </h3>
          <p className="text-xs text-slate-500 mt-1">Step {currentStep + 1} of {STEPS.length}: <strong>{step.title}</strong></p>
        </div>
        <StepIndicator steps={STEPS} currentStep={currentStep} onJump={setCurrentStep} />
      </div>

      {/* Session title (first step only) */}
      {currentStep === 0 && (
        <div>
          <label className="block text-sm font-semibold mb-1.5">Session Title (optional)</label>
          <input
            className="input-field"
            placeholder="e.g. 'Hamlet essay — should I use AI?'"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
      )}

      {/* Step card */}
      <div className={`rounded-2xl border ${step.border} ${step.bg} p-5 space-y-4`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center text-xl font-extrabold shadow-sm`}>
            {step.letter}
          </div>
          <div>
            <h4 className="font-bold text-lg">{step.title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          {step.fields.map(({ key, label, prompt, rows }) => (
            <div key={key}>
              <label className={`block text-sm font-semibold mb-1.5 ${step.accent}`}>{label}</label>
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
        </div>

        <p className="text-xs text-slate-400 text-right">
          {stepFilled}/{step.fields.length} prompts answered this step
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-2">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          {!isFirst && (
            <button onClick={() => setCurrentStep(s => s - 1)} className="btn-secondary text-sm">
              <ChevronLeft size={15} /> Back
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {!isLast ? (
            <button onClick={() => setCurrentStep(s => s + 1)} className="btn-primary text-sm">
              Next <ChevronRight size={15} />
            </button>
          ) : (
            <button onClick={handleSave} className={`btn-primary text-sm ${saved ? 'bg-teal-600 hover:bg-teal-700' : ''}`}>
              {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Session</>}
            </button>
          )}
          {!isLast && (
            <button
              onClick={handleSave}
              className="btn-secondary text-sm"
            >
              <Save size={14} /> Save Progress
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function SessionCard({ session, onDelete }) {
  const [open, setOpen] = useState(false)
  const pct = Math.round((session.completedSteps / session.totalSteps) * 100)

  return (
    <div className="card border border-slate-100 overflow-hidden">
      <button className="w-full flex items-start gap-3 text-left" onClick={() => setOpen(o => !o)}>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-800 truncate">{session.title}</h3>
            <span className={`badge ${pct === 100 ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'}`}>
              {pct === 100 ? '✓ Complete' : `${session.completedSteps}/${session.totalSteps} steps`}
            </span>
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-600 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-slate-400">{formatDate(session.createdAt)}</span>
          </div>
        </div>
        <div className="shrink-0 text-slate-400 mt-0.5">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {open && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
          {STEPS.slice(0, session.completedSteps).map((step, i) => (
            <div key={i}>
              <p className={`text-xs font-bold ${step.accent} mb-2`}>
                {step.letter} — {step.title}
              </p>
              <div className="space-y-2 pl-3 border-l-2 border-slate-100">
                {step.fields.map(f => session.answers[f.key] && (
                  <div key={f.key}>
                    <span className="text-xs font-semibold text-slate-600">{f.label}: </span>
                    <span className="text-xs text-slate-600 whitespace-pre-wrap">{session.answers[f.key]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => onDelete(session.id)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ImagineFramework() {
  const [sessions, setSessions] = useState(() => storage.getImagineEntries())
  const [showForm, setShowForm] = useState(false)

  function handleSave(entry) {
    storage.saveImagineEntry(entry)
    setSessions(storage.getImagineEntries())
    setShowForm(false)
  }

  function handleDelete(id) {
    storage.deleteImagineEntry(id)
    setSessions(storage.getImagineEntries())
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">IMAGINE Framework</h1>
          <p className="text-slate-500 leading-relaxed max-w-2xl">
            A seven-step decision framework from{' '}
            <span className="font-semibold text-slate-700">Harvard's Center for Digital Thriving</span>.
            Move beyond "Is AI allowed?" toward a values-centered, agency-first decision every time.
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary shrink-0">
          <Plus size={16} /> New Session
        </button>
      </div>

      {/* Step overview */}
      <div className="card bg-slate-50 border-slate-100 overflow-hidden">
        <h3 className="font-bold mb-4">The Seven Steps</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {STEPS.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${s.bg} border ${s.border}`}>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center font-bold shrink-0`}>
                {s.letter}
              </div>
              <div>
                <p className={`text-sm font-semibold ${s.accent}`}>{s.title}</p>
                <p className="text-xs text-slate-500 line-clamp-1">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <ImagineForm onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}

      {/* Past sessions */}
      {sessions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Your Sessions ({sessions.length})</h2>
          <div className="space-y-3">
            {sessions.map(s => (
              <SessionCard key={s.id} session={s} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {sessions.length === 0 && !showForm && (
        <div className="card text-center py-16 border-dashed border-2 border-slate-200">
          <BookOpen size={40} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-lg font-bold text-slate-400 mb-2">No sessions yet</h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
            Start an IMAGINE session the next time you're deciding whether to use AI on an
            assignment. Work through all seven steps — or save progress and come back.
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={16} /> Start First Session
          </button>
        </div>
      )}

      {/* Citation */}
      <div className="card bg-amber-50 border-amber-100">
        <h3 className="font-bold text-amber-900 mb-2">About the IMAGINE Framework</h3>
        <p className="text-sm text-amber-800 leading-relaxed">
          The IMAGINE AI framework was developed by Harvard's{' '}
          <strong>Center for Digital Thriving</strong> to help students and educators move
          "beyond binary allowed-vs.-banned narratives" about AI toward values-centered,
          agency-first decisions. It emphasizes that the goal is not to avoid AI — it's to
          use it (or not) in ways that are honest, intentional, and genuinely yours.
        </p>
      </div>
    </div>
  )
}
