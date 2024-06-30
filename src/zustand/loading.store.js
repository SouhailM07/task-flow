import { create } from "zustand"

const loadingStore = create((set) => ({
    loading: false,
    setLoading: (st) => set({ loading: st })
}))

export default loadingStore