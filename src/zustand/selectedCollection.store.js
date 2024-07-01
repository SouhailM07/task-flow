import { create } from "zustand"


const selectedCollectionStore = create((set) => ({
    collectionId: "",
    setCollectionId: (st) => set(({ collectionId: st }))
}))

export default selectedCollectionStore;