import { APP_API_URL } from "@/lib/APP_API_URL";
import handelError from "@/lib/handleError";
import collectionApiStore from "@/zustand/collectionApi.store";
import loadingStore from "@/zustand/loading.store";
import notesStore from "@/zustand/notes.store";
import selectedCollectionStore from "@/zustand/selectedCollection.store";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useContext, createContext, ReactNode, useEffect } from "react";

const NotesContext = createContext<any>("");

export default function NotesContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  // ! handlers
  const { collectionApi, editCollectionApi } = collectionApiStore(
    (state) => state
  );
  const { editNotes } = notesStore((state) => state);
  const { setLoading } = loadingStore((state) => state);
  const { collectionId } = selectedCollectionStore((state) => state);

  const getNotes = async () => {
    try {
      setLoading(true);
      let { data } = await axios.get(
        `${APP_API_URL}/api/notes?collectionId=${collectionId}`
      );
      editNotes(data);
    } catch (error) {
      handelError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateNote = async (id, done) => {
    try {
      setLoading(true);
      await axios.put(`${APP_API_URL}/api/notes?id=${id}`, { done: !done });
      getNotes();
    } catch (error) {
      handelError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteNote = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${APP_API_URL}/api/notes?id=${id}`);
      getNotes();
    } catch (error) {
      handelError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NotesContext.Provider
      value={{ getNotes, handleDeleteNote, handleUpdateNote }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export const useNotesContext = () => useContext(NotesContext);
