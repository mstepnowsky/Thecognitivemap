const KEYS = {
  student: 'tcm_student',
  routineEntries: 'tcm_routine_entries',
  mapEntries: 'tcm_map_entries',
  imagineEntries: 'tcm_imagine_entries',
}

export const storage = {
  getStudent: () => {
    try { return JSON.parse(localStorage.getItem(KEYS.student)) } catch { return null }
  },
  setStudent: (data) => localStorage.setItem(KEYS.student, JSON.stringify(data)),

  getRoutineEntries: () => {
    try { return JSON.parse(localStorage.getItem(KEYS.routineEntries)) || [] } catch { return [] }
  },
  saveRoutineEntry: (entry) => {
    const entries = storage.getRoutineEntries()
    const idx = entries.findIndex(e => e.id === entry.id)
    if (idx >= 0) entries[idx] = entry
    else entries.unshift(entry)
    localStorage.setItem(KEYS.routineEntries, JSON.stringify(entries))
  },
  deleteRoutineEntry: (id) => {
    const entries = storage.getRoutineEntries().filter(e => e.id !== id)
    localStorage.setItem(KEYS.routineEntries, JSON.stringify(entries))
  },

  getMapEntries: () => {
    try { return JSON.parse(localStorage.getItem(KEYS.mapEntries)) || [] } catch { return [] }
  },
  saveMapEntry: (entry) => {
    const entries = storage.getMapEntries()
    const idx = entries.findIndex(e => e.id === entry.id)
    if (idx >= 0) entries[idx] = entry
    else entries.unshift(entry)
    localStorage.setItem(KEYS.mapEntries, JSON.stringify(entries))
  },
  deleteMapEntry: (id) => {
    const entries = storage.getMapEntries().filter(e => e.id !== id)
    localStorage.setItem(KEYS.mapEntries, JSON.stringify(entries))
  },

  getImagineEntries: () => {
    try { return JSON.parse(localStorage.getItem(KEYS.imagineEntries)) || [] } catch { return [] }
  },
  saveImagineEntry: (entry) => {
    const entries = storage.getImagineEntries()
    const idx = entries.findIndex(e => e.id === entry.id)
    if (idx >= 0) entries[idx] = entry
    else entries.unshift(entry)
    localStorage.setItem(KEYS.imagineEntries, JSON.stringify(entries))
  },
  deleteImagineEntry: (id) => {
    const entries = storage.getImagineEntries().filter(e => e.id !== id)
    localStorage.setItem(KEYS.imagineEntries, JSON.stringify(entries))
  },
}

export const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
