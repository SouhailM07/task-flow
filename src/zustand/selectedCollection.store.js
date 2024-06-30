import { create } from "zustand"
import { persist } from "zustand/middleware"

const selectedCollectionStore = create(persist((set) => ({
    collection: "",
    setCollection: (st) => set(({ collection: st }))
}), { name: "selectedCollection" }))

export default selectedCollectionStore;