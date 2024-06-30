import { create } from "zustand"

const notesCollectionsStore = create((set) => ({
    notesCollections: [],
    editNotesCollections: (st) => set(({ notesCollections: st }))
}))

export default notesCollectionsStore;