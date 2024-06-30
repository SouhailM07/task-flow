import { create } from "zustand"
import { persist } from "zustand/middleware"

const selectedCollectionStore = create(persist((set) => ({
    collectionId: "",
    setCollectionId: (st) => set(({ collectionId: st }))
}), { name: "selectedCollection" }))

export default selectedCollectionStore;