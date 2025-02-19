import { Input } from "@/components/ui/input";
import MyButton from "@/components/REUSABLE/MyButton/MyButton";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
// ! zustand
import selectedCollectionStore from "@/zustand/selectedCollection.store";
import loadingStore from "@/zustand/loading.store";
import collectionApiStore from "@/zustand/collectionApi.store";
// ? lib
import { APP_API_URL } from "@/lib/APP_API_URL";
import handelError from "@/lib/handleError";
import notesStore from "@/zustand/notes.store";
export default function FooterInput() {
  let [noteValue, setNoteValue] = useState<string>("");
  const { collectionApi } = collectionApiStore((state) => state);
  const { setLoading } = loadingStore((state) => state);
  const { collectionId } = selectedCollectionStore((state) => state);
  const { toast } = useToast();
  // ! handlers
  const { notes, editNotes } = notesStore((state) => state);

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
  const handleAddNote = async () => {
    try {
      let isNoteExist = notes.filter((e) => e.note == noteValue).length;
      if (isNoteExist) {
        toast({
          variant: "destructive",
          description: "Note Already Exist",
          duration: 3000,
        });
        return;
      }
      if (noteValue.length > 0) {
        if (collectionId.length > 0) {
          setLoading(true);
          let res = await axios.post(`${APP_API_URL}/api/notes`, {
            note: noteValue,
            done: "false",
            notesCollection: collectionId,
          });
          // add an ability to update notes store
          getNotes();
          toast({ description: "New Todo was added successfully" });
        } else {
          // toast
          toast({
            variant: "destructive",
            description: "Select or Create a Notes Collections",
            duration: 3000,
          });
        }
      }
    } catch (error) {
      handelError(error);
    } finally {
      setNoteValue("");
      setLoading(false);
    }
  };
  return (
    <section className=" fixed bottom-0 w-full pt-[0.5rem] bg-white pb-[1rem]  px-[1rem] md:px-[2rem] flexBetween gap-x-[2rem] border-t border-gray-400">
      <Input
        value={noteValue}
        onChange={(e) => setNoteValue(e.target.value)}
        placeholder="Add a new todo"
      />
      <MyButton
        role="button"
        handler={handleAddNote}
        label="Add"
        color="bg-primaryBlack text-white "
        borderBottomColor="rgb(10 10 10)"
      />
    </section>
  );
}
