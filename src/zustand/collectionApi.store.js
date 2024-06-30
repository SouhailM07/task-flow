import { create } from "zustand"

const collectionApiStore = create((set) => ({
    collectionApi: {},
    editCollectionApi: (st) => set(({ collectionApi: st }))
}))

export default collectionApiStore;