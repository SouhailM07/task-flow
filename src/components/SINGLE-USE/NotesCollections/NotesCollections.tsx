"use client";
import "./notescollections.css";
import { useState, useEffect } from "react";
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
import loadingStore from "@/zustand/loading.store";
import selectedCollectionStore from "@/zustand/selectedCollection.store";
import { PopoverClose } from "@radix-ui/react-popover";
import MyDialog from "@/components/REUSABLE/MyDialog/MyDialog";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
export default function NotesCollections() {
  const [notesCollections, setNotesCollections] = useState([]);
  const { setLoading } = loadingStore((state) => state);
  const { user } = useUser();
  const getCollections = async () => {
    try {
      setLoading(true);
      const userRes = await axios.get(
        `${APP_API_URL}/api/users?clerkId=${user?.id}`
      );
      const collectionsRes = await axios.get(
        `${APP_API_URL}/api/notesCollections?userId=${userRes.data._id}`
      );
      setNotesCollections(collectionsRes.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getCollections();
    }
  }, [user]);

  const { collection } = selectedCollectionStore((state) => state);
  return (
    <article>
      <Popover>
        <PopoverTrigger className="flex items-center gap-x-[1rem]">
          <span className="uppercase font-medium">{collection}</span>
          <FontAwesomeIcon icon={faChevronDown} />
        </PopoverTrigger>
        <PopoverContent className="translate-x-[-5rem] ">
          <ScrollArea role="list" className="h-[11rem] pr-4">
            {notesCollections.map((e: any, i) => (
              <NotesCollections__RenderItem key={i} e={e} />
            ))}
          </ScrollArea>
          <CreateCollection
            getCollections={getCollections}
            triggerStyle="flexCenter gap-x-[1rem] min-w-full bg-slate-200 p-2 rounded-lg"
          />
        </PopoverContent>
      </Popover>
    </article>
  );
}

const CreateCollection = ({ triggerStyle, getCollections }) => {
  const [inputState, setInputState] = useState("");
  const { user } = useUser();

  const handleAddCollection = async (id) => {
    try {
      const res = await axios
        .post(`${APP_API_URL}/api/notesCollections`, {
          name: inputState,
          user: id,
        })
        .then(getCollections);
      // console.log(res);
    } catch (error) {
      handleError(error);
    }
  };

  const handleCreateAccount = async () => {
    try {
      const res = await axios.get(
        `${APP_API_URL}/api/users?clerkId=${user?.id}`
      );
      await handleAddCollection(res.data._id);
    } catch (error: any) {
      if (error.response.status === 404) {
        try {
          const res = await axios.post(`${APP_API_URL}/api/users`, {
            clerkId: user?.id,
            notesCollections: [],
          });
          await handleAddCollection(res.data._id);
        } catch (err) {
          handleError(err);
        }
      } else {
        handleError(error);
      }
    }
  };

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
            handler={handleCreateAccount}
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
  const handleSelect = () => setCollection(e?.name);
  const { toast } = useToast();
  return (
    <div
      onClick={handleSelect}
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
  return (
    <MyDialog
      trigger={
        <FontAwesomeIcon
          title="edit"
          aria-label="edit"
          role="button"
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
        <DialogClose>
          <MyButton
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
  const { setLoading } = loadingStore((state) => state);
  // ! handlers
  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `${APP_API_URL}/api/notesCollections?collectionId=${collection?._id}`
      );
      setLoading(false);
      // console.log(res);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  //! render
  const { toast } = useToast();

  return (
    <MyDialog
      trigger={
        <FontAwesomeIcon
          title="delete"
          aria-label="delete"
          role="button"
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
        <DialogClose>
          <MyButton
            handler={handleDelete}
            icon={faTrash}
            label="Delete"
            color="bg-red-500 text-white"
          />
        </DialogClose>
      </DialogFooter>
    </MyDialog>
  );
};
