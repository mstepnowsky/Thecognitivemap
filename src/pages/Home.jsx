import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Compass, BookOpen, ArrowRight, MapPin, Sparkles, ChevronRight } from 'lucide-react'
import { storage } from '../utils/storage'

const TOOLS = [
  {
    to: '/routines',
    icon: Brain,
    color: 'from-violet-500 to-brand-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    badge: 'text-violet-700 bg-violet-100',
    label: 'Thinking Routines',
    tagline: 'Make your thinking visible',
    description:
      'Use Project Zero\'s proven routines — See-Think-Wonder, Claim-Support-Question, and more — to slow down and think deeply before (and after) using AI.',
  },
  {
    to: '/map',
    icon: Compass,
    color: 'from-teal-500 to-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    badge: 'text-teal-700 bg-teal-100',
    label: 'My AI Map',
    tagline: 'Own your AI decisions',
    description:
      'Your personal Cognitive Ecology Map. Log every time you decide to use (or not use) AI on an assignment, and track how your thinking evolves across the semester.',
  },
  {
    to: '/imagine',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    badge: 'text-amber-700 bg-amber-100',
    label: 'IMAGINE Framework',
    tagline: 'Beyond allowed vs. banned',
    description:
      'A values-centered, seven-step framework from Harvard\'s Center for Digital Thriving. Move from "Is AI allowed?" to "Should I use AI here, and how?"',
  },
]

const QUOTE = {
  text: 'AI does not reduce the thinking required for intellectual work. It relocates it. These tools are designed to make sure that thinking lands where it belongs — with you.',
  author: 'Potkalitsky',
}

export default function Home() {
  const [student, setStudent] = useState(() => storage.getStudent())
  const [nameInput, setNameInput] = useState('')
  const [editing, setEditing] = useState(!storage.getStudent())

  const routineCount = storage.getRoutineEntries().length
  const mapCount = storage.getMapEntries().length
  const imagineCount = storage.getImagineEntries().length

  function saveName(e) {
    e.preventDefault()
    if (!nameInput.trim()) return
    const data = { name: nameInput.trim(), joinedAt: new Date().toISOString() }
    storage.setStudent(data)
    setStudent(data)
    setEditing(false)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white px-8 py-14 md:px-14">
        {/* decorative grid lines */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-teal-400" />
            <span className="text-teal-400 text-sm font-semibold tracking-wide uppercase">
              The Cognitive Map
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            AI doesn't do your thinking.<br />
            <span className="text-teal-400">You do.</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-8">
            Tools for grades 7–12 to think critically about AI — when to use it,
            how to use it, and what stays yours.
          </p>
          {student ? (
            <div className="flex flex-wrap gap-3">
              <Link to="/routines" className="btn-primary bg-teal-500 hover:bg-teal-600">
                Start a Thinking Routine <ArrowRight size={16} />
              </Link>
              <Link to="/map" className="btn-secondary border-slate-600 text-slate-200 hover:bg-brand-800 bg-transparent">
                Open My AI Map
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      {/* Name setup / welcome */}
      {editing ? (
        <section className="card max-w-lg mx-auto text-center space-y-4">
          <Sparkles size={32} className="mx-auto text-teal-500" />
          <h2 className="text-xl font-bold">Welcome! What's your name?</h2>
          <p className="text-slate-500 text-sm">We'll save your work in your browser so you can pick up where you left off.</p>
          <form onSubmit={saveName} className="flex gap-2">
            <input
              className="input-field flex-1"
              placeholder="First name or nickname"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn-primary">Go</button>
          </form>
        </section>
      ) : (
        <section className="grid grid-cols-3 gap-4 sm:gap-6 max-w-lg mx-auto text-center">
          {[
            { label: 'Routines', count: routineCount, to: '/routines', color: 'text-violet-600' },
            { label: 'Map Entries', count: mapCount, to: '/map', color: 'text-teal-600' },
            { label: 'IMAGINE Sessions', count: imagineCount, to: '/imagine', color: 'text-amber-600' },
          ].map(({ label, count, to, color }) => (
            <Link key={to} to={to} className="card hover:shadow-md transition-shadow text-center group">
              <div className={`text-3xl font-extrabold ${color}`}>{count}</div>
              <div className="text-xs text-slate-500 mt-1 group-hover:text-slate-700 transition-colors">{label}</div>
            </Link>
          ))}
        </section>
      )}

      {/* Tool cards */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Your Thinking Toolkit</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TOOLS.map(({ to, icon: Icon, color, bg, border, badge, label, tagline, description }) => (
            <Link
              key={to}
              to={to}
              className={`card border ${border} hover:shadow-lg transition-all duration-200 group flex flex-col gap-4`}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-sm`}>
                <Icon size={22} />
              </div>
              <div>
                <span className={`badge ${badge} mb-2`}>{tagline}</span>
                <h3 className="text-lg font-bold mb-1">{label}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
              <div className="mt-auto flex items-center gap-1 text-sm font-semibold text-brand-700 group-hover:gap-2 transition-all">
                Open <ChevronRight size={15} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="card bg-brand-50 border-brand-100 max-w-3xl mx-auto text-center space-y-3">
        <blockquote className="text-lg md:text-xl font-medium text-brand-900 leading-relaxed italic">
          "{QUOTE.text}"
        </blockquote>
        <cite className="text-sm text-brand-700 not-italic font-semibold">— {QUOTE.author}</cite>
      </section>

      {/* How it works */}
      <section>
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Notice Your Thinking', body: 'Before reaching for AI, use a Thinking Routine to clarify what you already know, what you\'re curious about, and what you actually need.' },
            { step: '02', title: 'Decide Intentionally', body: 'Walk through the IMAGINE framework to make an active, values-based choice — not a reflexive one — about whether and how to use AI.' },
            { step: '03', title: 'Map Your Semester', body: 'Log each decision in your AI Map. Over time, you\'ll see patterns in how you think and negotiate your relationship with AI tools.' },
          ].map(({ step, title, body }) => (
            <div key={step} className="card flex gap-4">
              <span className="text-3xl font-extrabold text-slate-200 leading-none select-none">{step}</span>
              <div>
                <h3 className="font-bold mb-1">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
