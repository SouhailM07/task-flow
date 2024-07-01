"use client";
import { createContext, ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Note from "@/components/REUSABLE/Note/Note";
import { APP_API_URL } from "@/lib/APP_API_URL";
import handelError from "@/lib/handleError";
import collectionApiStore from "@/zustand/collectionApi.store";
import selectedCollectionStore from "@/zustand/selectedCollection.store";
import loadingStore from "@/zustand/loading.store";
import notesStore from "@/zustand/notes.store";
import { useAuth, useUser } from "@clerk/nextjs";

export const NotesContext: any = createContext("");

export default function IndexRoute() {
  const { collectionApi } = collectionApiStore((state) => state);
  const { notes } = notesStore((state) => state);

  return (
    <NOTES_CONTEXT_BOX>
      {!collectionApi?.name ? (
        <div className="fixed w-full h-full top-0 flexCenter z-[-1]">
          Select a Note Collection
        </div>
      ) : notes.length > 0 ? (
        <main className="grid place-items-center overflow-x-hidden  py-[1rem] h-MAX">
          <motion.ul
            initial={{ border: "2px solid transparent" }}
            animate={{ border: "2px solid gray" }}
            transition={{ delay: 0.2 * notes.length + 0.5 }}
            className="rounded-md max-sm:w-[92%] max-md:w-[80%] max-md:space-y-[1rem]"
          >
            {notes.map((e, i) => (
              <Note key={i} index={i} {...e} />
            ))}
          </motion.ul>
        </main>
      ) : (
        <div className="flexCenter mt-[4rem]">Empty</div>
      )}
    </NOTES_CONTEXT_BOX>
  );
}

const NOTES_CONTEXT_BOX = ({ children }: { children: ReactNode }) => {
  const { collectionApi, editCollectionApi } = collectionApiStore(
    (state) => state
  );
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { notes, editNotes } = notesStore((state) => state);
  const { setLoading } = loadingStore((state) => state);
  const { collectionId, setCollectionId } = selectedCollectionStore(
    (state) => state
  );

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

  useEffect(() => {
    if (collectionId && isSignedIn && isLoaded) {
      getNotes();
    }
    if (!isSignedIn && isLoaded) {
      // setCollectionId("");
    }
    if (isSignedIn && isLoaded) {
      console.log("user is signed in");
    }
  }, [collectionId, isSignedIn, isLoaded, user]);
  return (
    <NotesContext.Provider value={{ handleDeleteNote, handleUpdateNote }}>
      {children}
    </NotesContext.Provider>
  );
};
