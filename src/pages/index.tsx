import { motion } from "framer-motion";
import Note from "@/components/REUSABLE/Note/Note";
import collectionApiStore from "@/zustand/collectionApi.store";
import notesStore from "@/zustand/notes.store";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useNotesContext } from "@/context/NotesContext";
import selectedCollectionStore from "@/zustand/selectedCollection.store";
import { useCollectionContext } from "@/context/CollectionsContext";

export default function IndexRoute() {
  const { collectionApi } = collectionApiStore((state) => state);
  const { notes } = notesStore((state) => state);
  const { isSignedIn, isLoaded } = useAuth();
  const { getNotes } = useNotesContext();
  const { handleGetCollectionApi, getCollections } = useCollectionContext();

  const { collectionId } = selectedCollectionStore((state) => state);
  useEffect(() => {
    console.log("check render");
    if (collectionId && isSignedIn && isLoaded) {
      getNotes();
      getCollections();
      handleGetCollectionApi();
    }
  }, [collectionId, isSignedIn, isLoaded]);

  if (!collectionApi?.name) {
    <div className="fixed w-full h-full top-0 flexCenter z-[-1]">
      Select a Note Collection
    </div>;
  } else if (notes.length) {
    return (
      <main className="grid px-[1rem] md:px-[2rem] place-items-center overflow-x-hidden  py-[1rem] h-MAX">
        <motion.ul
          initial={{ border: "2px solid transparent" }}
          animate={{ border: "2px solid gray" }}
          transition={{ delay: 0.2 * notes.length + 0.5 }}
          className="rounded-md max-md:space-y-[1rem]"
        >
          {notes.map((e, i) => (
            <Note key={i} index={i} {...e} />
          ))}
        </motion.ul>
      </main>
    );
  }
  return <div className="flexCenter mt-[4rem]">Empty</div>;
}
