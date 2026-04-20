import { useState } from 'react'
import { Plus, Trash2, Compass, ChevronDown, ChevronUp, CheckCircle, Save, Filter } from 'lucide-react'
import { storage, newId, formatDate } from '../utils/storage'

const AI_USE_OPTIONS = [
  { value: 'none',     label: '🚫 Did not use AI',           color: 'text-slate-600 bg-slate-100' },
  { value: 'minimal',  label: '🔍 Used AI minimally',        color: 'text-blue-700 bg-blue-100' },
  { value: 'moderate', label: '⚡ Used AI moderately',        color: 'text-amber-700 bg-amber-100' },
  { value: 'heavily',  label: '🤖 Relied heavily on AI',     color: 'text-red-700 bg-red-100' },
]

const SUBJECT_OPTIONS = [
  'English / Language Arts', 'History / Social Studies', 'Science', 'Math',
  'Foreign Language', 'Art / Music', 'Computer Science', 'Other',
]

const EMPTY_FORM = {
  assignment: '',
  subject: '',
  aiUse: '',
  howUsed: '',
  whyDecided: '',
  whatIOwn: '',
  reflection: '',
  wouldChange: '',
}

function AiUseBadge({ value }) {
  const opt = AI_USE_OPTIONS.find(o => o.value === value)
  if (!opt) return null
  return <span className={`badge ${opt.color}`}>{opt.label}</span>
}

function EntryCard({ entry, onDelete }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="card border border-slate-100 overflow-hidden">
      <button className="w-full flex items-start gap-3 text-left" onClick={() => setOpen(o => !o)}>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-800 truncate">{entry.assignment || 'Untitled Entry'}</h3>
            {entry.aiUse && <AiUseBadge value={entry.aiUse} />}
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            {entry.subject && <span>{entry.subject}</span>}
            <span>{formatDate(entry.createdAt)}</span>
          </div>
        </div>
        <div className="shrink-0 text-slate-400 mt-0.5">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {open && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          {[
            { label: 'How I Used AI', value: entry.howUsed },
            { label: 'Why I Made This Decision', value: entry.whyDecided },
            { label: 'What Thinking Stayed Mine', value: entry.whatIOwn },
            { label: 'Reflection', value: entry.reflection },
            { label: 'What I\'d Change', value: entry.wouldChange },
          ].filter(f => f.value).map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs font-bold text-teal-700 mb-0.5">{label}</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{value}</p>
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => onDelete(entry.id)}
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

function NewEntryForm({ onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saved, setSaved] = useState(false)

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function handleSave() {
    if (!form.assignment.trim()) return
    const entry = { id: newId(), ...form, createdAt: new Date().toISOString() }
    onSave(entry)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="card border-2 border-teal-200 bg-teal-50/30 space-y-5">
      <h3 className="font-bold text-lg text-teal-800 flex items-center gap-2">
        <Compass size={18} className="text-teal-600" /> New Map Entry
      </h3>

      {/* Assignment + Subject */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Assignment or Task <span className="text-red-500">*</span></label>
          <input
            className="input-field"
            placeholder="e.g. 'Persuasive essay on climate policy'"
            value={form.assignment}
            onChange={e => set('assignment', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Subject</label>
          <select
            className="input-field bg-white"
            value={form.subject}
            onChange={e => set('subject', e.target.value)}
          >
            <option value="">Select subject…</option>
            {SUBJECT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* AI Use level */}
      <div>
        <label className="block text-sm font-semibold mb-2">How much did you use AI?</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {AI_USE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => set('aiUse', opt.value)}
              className={`text-sm px-3 py-2.5 rounded-xl border-2 font-medium transition-all duration-150 text-left
                ${form.aiUse === opt.value
                  ? 'border-teal-500 bg-teal-50 text-teal-800'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional: how used */}
      {form.aiUse && form.aiUse !== 'none' && (
        <div>
          <label className="block text-sm font-semibold mb-1.5">How did you use AI specifically?</label>
          <p className="text-xs text-slate-500 mb-2">Be specific: brainstorming? drafting? checking facts? editing? generating ideas?</p>
          <textarea
            className="textarea-field"
            rows={3}
            placeholder="e.g. 'I used ChatGPT to generate a list of counterarguments, then chose the 2 I found most interesting and developed them myself.'"
            value={form.howUsed}
            onChange={e => set('howUsed', e.target.value)}
          />
        </div>
      )}

      {/* Why decided */}
      <div>
        <label className="block text-sm font-semibold mb-1.5">Why did you make this decision?</label>
        <p className="text-xs text-slate-500 mb-2">What made you choose to use (or not use) AI for this task? What was your reasoning?</p>
        <textarea
          className="textarea-field"
          rows={3}
          placeholder="e.g. 'I wanted to practice my own argument structure first. AI would have short-circuited that.'"
          value={form.whyDecided}
          onChange={e => set('whyDecided', e.target.value)}
        />
      </div>

      {/* What I own */}
      <div>
        <label className="block text-sm font-semibold mb-1.5">What thinking stayed 100% yours?</label>
        <p className="text-xs text-slate-500 mb-2">Even if you used AI, identify the intellectual moves that were genuinely your own.</p>
        <textarea
          className="textarea-field"
          rows={3}
          placeholder="e.g. 'The thesis, all the transitions, and the final paragraph. Those felt like real choices I made.'"
          value={form.whatIOwn}
          onChange={e => set('whatIOwn', e.target.value)}
        />
      </div>

      {/* Reflection */}
      <div>
        <label className="block text-sm font-semibold mb-1.5">Reflection</label>
        <p className="text-xs text-slate-500 mb-2">Looking back: did your decision serve your learning? What did you gain or lose?</p>
        <textarea
          className="textarea-field"
          rows={3}
          placeholder="e.g. 'I think I learned less because I didn't struggle with the counterarguments myself. But I got the draft done faster.'"
          value={form.reflection}
          onChange={e => set('reflection', e.target.value)}
        />
      </div>

      {/* Would change */}
      <div>
        <label className="block text-sm font-semibold mb-1.5">What would you do differently?</label>
        <textarea
          className="textarea-field"
          rows={2}
          placeholder="e.g. 'Next time I'd write a rough outline myself before asking AI for ideas.'"
          value={form.wouldChange}
          onChange={e => set('wouldChange', e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button onClick={onCancel} className="btn-secondary">Cancel</button>
        <button
          onClick={handleSave}
          disabled={!form.assignment.trim()}
          className={`btn-primary ${saved ? 'bg-teal-600 hover:bg-teal-700' : ''}`}
        >
          {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save to Map</>}
        </button>
      </div>
    </div>
  )
}

export default function CognitiveMap() {
  const [entries, setEntries] = useState(() => storage.getMapEntries())
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')

  function handleSave(entry) {
    storage.saveMapEntry(entry)
    setEntries(storage.getMapEntries())
    setShowForm(false)
  }

  function handleDelete(id) {
    storage.deleteMapEntry(id)
    setEntries(storage.getMapEntries())
  }

  const filtered = filter === 'all' ? entries : entries.filter(e => e.aiUse === filter)

  const counts = AI_USE_OPTIONS.reduce((acc, opt) => {
    acc[opt.value] = entries.filter(e => e.aiUse === opt.value).length
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">My AI Map</h1>
          <p className="text-slate-500 leading-relaxed max-w-2xl">
            Your <span className="font-semibold text-slate-700">Cognitive Ecology Map</span> — a
            student-owned record of how you've negotiated AI use across your work this semester.
            Every entry is a data point about your own thinking.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary shrink-0"
        >
          <Plus size={16} /> Add Entry
        </button>
      </div>

      {/* Stats bar */}
      {entries.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {AI_USE_OPTIONS.map(opt => (
            <div key={opt.value} className="card text-center py-4">
              <div className="text-2xl font-extrabold text-slate-800">{counts[opt.value] || 0}</div>
              <div className="text-xs text-slate-500 mt-1">{opt.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* New entry form */}
      {showForm && (
        <NewEntryForm onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}

      {/* Filter + entries */}
      {entries.length > 0 && (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs text-slate-500 font-semibold">Filter:</span>
            {[{ value: 'all', label: 'All' }, ...AI_USE_OPTIONS].map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  filter === opt.value
                    ? 'bg-brand-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt.label} {opt.value !== 'all' && `(${counts[opt.value] || 0})`}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">No entries match this filter.</p>
            ) : (
              filtered.map(e => <EntryCard key={e.id} entry={e} onDelete={handleDelete} />)
            )}
          </div>
        </>
      )}

      {/* Empty state */}
      {entries.length === 0 && !showForm && (
        <div className="card text-center py-16 border-dashed border-2 border-slate-200">
          <Compass size={40} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-lg font-bold text-slate-400 mb-2">Your map is empty</h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
            Add your first entry after completing an assignment. Track how you think about AI
            use situation by situation, across the whole semester.
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={16} /> Add First Entry
          </button>
        </div>
      )}

      {/* About section */}
      <div className="card bg-teal-50 border-teal-100">
        <h3 className="font-bold text-teal-900 mb-2">What is a Cognitive Ecology Map?</h3>
        <p className="text-sm text-teal-800 leading-relaxed">
          Developed from Potkalitsky's framework, the Cognitive Ecology Map is your personal record
          of negotiated AI use — situation by situation, across the semester. It's not about whether
          you used AI. It's about <em>owning</em> the decision each time and watching how your
          relationship with AI tools evolves as your thinking gets stronger.
        </p>
      </div>
    </div>
  )
}
