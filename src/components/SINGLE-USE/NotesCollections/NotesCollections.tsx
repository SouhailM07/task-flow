"use client";
import "./notescollections.css";
import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
} from "react";
import axios from "axios";
import {
  faChevronDown,
  faCloud,
  faPlus,
  faTrash,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MyButton from "@/components/REUSABLE/MyButton/MyButton";
import { APP_API_URL } from "@/lib/APP_API_URL";
import handleError from "@/lib/handleError";
import { useUser } from "@clerk/nextjs";
import { PopoverClose } from "@radix-ui/react-popover";
import MyDialog from "@/components/REUSABLE/MyDialog/MyDialog";
import { useToast } from "@/components/ui/use-toast";
// ? zustand
import selectedCollectionStore from "@/zustand/selectedCollection.store";
import notesCollectionsStore from "@/zustand/notesCollections.store";
import loadingStore from "@/zustand/loading.store";

// ! contexts
const NotesCollectionsContext: any = createContext("");

export default function NotesCollections() {
  const { notesCollections } = notesCollectionsStore((state) => state);
  const { collection } = selectedCollectionStore((state) => state);
  return (
    <LOCAL_CONTEXT_BOX>
      <article>
        <Popover>
          <PopoverTrigger className="flex items-center gap-x-[1rem]">
            <span className="uppercase font-medium">{collection?.name}</span>
          </PopoverTrigger>
          <PopoverContent className="translate-x-[-5rem] ">
            <ul role="list" className="max-h-[11rem] overflow-y-auto pr-1">
              {notesCollections.map((e: any, i) => (
                <NotesCollections__RenderItem key={i} e={e} />
              ))}
            </ul>
            <CreateCollection triggerStyle="flexCenter gap-x-[1rem] min-w-full bg-slate-200 p-2 rounded-lg" />
          </PopoverContent>
        </Popover>
      </article>
    </LOCAL_CONTEXT_BOX>
  );
}

const CreateCollection = ({ triggerStyle }) => {
  const [inputState, setInputState] = useState("");
  const { handleCreateAccount }: any = useContext(NotesCollectionsContext);

  return (
    <MyDialog
      triggerStyle={triggerStyle}
      trigger={
        <>
          <span>New Collection</span>
          <FontAwesomeIcon icon={faPlus} />
        </>
      }
    >
      <DialogHeader>
        <DialogTitle>New Collection</DialogTitle>
        <div>
          <Input
            className="mt-[1rem]"
            value={inputState}
            onChange={(e) => setInputState(e.target.value)}
            placeholder="Enter your collection name here..."
          />
        </div>
      </DialogHeader>
      <DialogFooter>
        <DialogClose>
          <MyButton
            handler={() => handleCreateAccount(inputState)}
            icon={faCloud}
            label="Save"
            color="bg-green-500 text-white"
          />
        </DialogClose>
      </DialogFooter>
    </MyDialog>
  );
};

const NotesCollections__RenderItem = ({ e }) => {
  const { setCollection } = selectedCollectionStore((state) => state);
  const { handleSelectCollection }: any = useContext(NotesCollectionsContext);
  return (
    <div
      onClick={() => handleSelectCollection(e)}
      role="listitem"
      className="mb-[1rem] h-[2.7rem] items-center w-full bg-neutral-800 text-white rounded-lg grid grid-cols-[2fr_1fr]"
    >
      <PopoverClose className="w-full h-full ">
        <span>{e?.name}</span>
      </PopoverClose>
      <div className="space-x-[1rem] mx-auto">
        <MyDialog_Edit collection={e} />
        <MyDialog_Delete collection={e} />
      </div>
    </div>
  );
};

const MyDialog_Edit = ({ collection }) => {
  let [editValue, setEditValue] = useState<string>(collection?.name);
  const { handleEditNotesCollection }: any = useContext(
    NotesCollectionsContext
  );
  return (
    <MyDialog
      trigger={
        <FontAwesomeIcon
          title="edit"
          aria-label="edit"
          icon={faWrench}
          className="text-blue-500"
        />
      }
    >
      <DialogHeader>
        <DialogTitle className="text-blue-500">Warning </DialogTitle>
        <div className="">
          <Input
            className="mt-[1rem]"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
        </div>
      </DialogHeader>
      <DialogFooter>
        <DialogClose role="div">
          <MyButton
            handler={() => handleEditNotesCollection(collection, editValue)}
            icon={faWrench}
            label="Edit"
            color="bg-blue-500 text-white"
          />
        </DialogClose>
      </DialogFooter>
    </MyDialog>
  );
};

const MyDialog_Delete = ({ collection }) => {
  const { handleDeleteNoteCollection }: any = useContext(
    NotesCollectionsContext
  );

  return (
    <MyDialog
      trigger={
        <FontAwesomeIcon
          title="delete"
          aria-label="delete"
          icon={faTrash}
          className="text-red-500"
        />
      }
    >
      <DialogHeader>
        <DialogTitle className="text-red-500">Warning </DialogTitle>
        <div className="">
          You are about to delete
          <span className="text-red-500 font-bold"> {collection?.name}</span> ,
          are you sure you want to delete it ?
        </div>
      </DialogHeader>
      <DialogFooter>
        <DialogClose role="div">
          <MyButton
            handler={() => handleDeleteNoteCollection(collection)}
            icon={faTrash}
            label="Delete"
            color="bg-red-500 text-white"
          />
        </DialogClose>
      </DialogFooter>
    </MyDialog>
  );
};

const LOCAL_CONTEXT_BOX = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const { setLoading } = loadingStore((state) => state);
  const { collection, setCollection } = selectedCollectionStore(
    (state) => state
  );
  const { toast } = useToast();
  const { notesCollections, editNotesCollections } = notesCollectionsStore(
    (state) => state
  );
  // ! handlers
  const getCollections = async () => {
    try {
      setLoading(true);
      const userRes = await axios.get(
        `${APP_API_URL}/api/users?clerkId=${user?.id}`
      );
      const collectionsRes = await axios.get(
        `${APP_API_URL}/api/notesCollections?userId=${userRes.data._id}`
      );
      editNotesCollections(collectionsRes.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleSelectCollection = async (e) => {
    try {
      setLoading(false);
      let res = await axios.get(
        `${APP_API_URL}/api/notesCollections?collectionId=${e._id}`
      );
      setCollection(res.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddCollection = async (id, inputState) => {
    try {
      const res = await axios
        .post(`${APP_API_URL}/api/notesCollections`, {
          name: inputState,
          user: id,
        })
        .then(() =>
          toast({ description: "New Collection was added Successfully" })
        )
        .then(getCollections);
    } catch (error) {
      handleError(error);
    }
  };

  const handleCreateAccount = async (inputState) => {
    try {
      const res = await axios.get(
        `${APP_API_URL}/api/users?clerkId=${user?.id}`
      );
      await handleAddCollection(res.data._id, inputState);
    } catch (error: any) {
      if (error.response.status === 404) {
        try {
          const res = await axios.post(`${APP_API_URL}/api/users`, {
            clerkId: user?.id,
            notesCollections: [],
          });
          await handleAddCollection(res.data._id, inputState);
        } catch (err) {
          handleError(err);
        }
      } else {
        handleError(error);
      }
    }
  };
  const handleDeleteNoteCollection = async (collection) => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `${APP_API_URL}/api/notesCollections?collectionId=${collection?._id}`
      );
      toast({ description: "Collection was deleted Successfully" });
      await getCollections();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleEditNotesCollection = async (collection, editValue) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${APP_API_URL}/api/notesCollections?collectionId=${collection?._id}`,
        {
          name: editValue,
        }
      );
      toast({ description: "Collection was updated Successfully" });
      await getCollections();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      getCollections();
      console.log(notesCollections);
    }
  }, [user]);
  return (
    <NotesCollectionsContext.Provider
      value={{
        getCollections,
        handleCreateAccount,
        handleDeleteNoteCollection,
        handleEditNotesCollection,
        handleSelectCollection,
      }}
    >
      {children}
    </NotesCollectionsContext.Provider>
  );
};
