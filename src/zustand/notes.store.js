import { create } from "zustand"

const notesStore = create((set) => ({
    notes: [],
    editNotes: (st) => set(({ notes: st }))
}))

export default notesStore;