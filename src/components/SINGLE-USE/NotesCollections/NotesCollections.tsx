import { useState } from "react";
import {
  faBars,
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
import { useAuth } from "@clerk/nextjs";
import { PopoverClose } from "@radix-ui/react-popover";
import MyDialog from "@/components/REUSABLE/MyDialog/MyDialog";
import { useToast } from "@/components/ui/use-toast";
// ? zustand
import notesCollectionsStore from "@/zustand/notesCollections.store";
import collectionApiStore from "@/zustand/collectionApi.store";
import { useRouter } from "next/router";
import { useCollectionContext } from "@/context/CollectionsContext";
import selectedCollectionStore from "@/zustand/selectedCollection.store";

// ! contexts

export default function NotesCollections() {
  // ! there is a weird error about this one , maybe it's an asynchronous error
  const { notesCollections } = notesCollectionsStore((state) => state);
  let { collectionApi } = collectionApiStore((state) => state);
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <article>
      <Popover>
        <PopoverTrigger
          onClick={() => {
            if (!isSignedIn && isLoaded) {
              router.push("/login");
              return null;
            }
          }}
          className="flex items-center gap-x-[1rem]"
        >
          <span className="uppercase font-medium max-sm:hidden">
            {collectionApi?.name || "select one"}
          </span>
          <span className="sm:hidden">
            <FontAwesomeIcon icon={faBars} />
          </span>
        </PopoverTrigger>
        <PopoverContent className="sm:translate-x-[-5rem] ">
          <ul role="list" className="max-h-[11rem] overflow-y-auto pr-1">
            {notesCollections.map((e: any, i) => (
              <NotesCollections__RenderItem key={i} e={e} />
            ))}
          </ul>
          <CreateCollection triggerStyle="flexCenter gap-x-[1rem] min-w-full bg-slate-200 p-2 rounded-lg" />
        </PopoverContent>
      </Popover>
    </article>
  );
}

const CreateCollection = ({ triggerStyle }) => {
  const [inputState, setInputState] = useState("");
  const { handleCreateAccount }: any = useCollectionContext();

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
            color="bg-green-500 text-white "
            borderBottomColor="rgb(22 163 74)"
          />
        </DialogClose>
      </DialogFooter>
    </MyDialog>
  );
};

const NotesCollections__RenderItem = ({ e }) => {
  const { handleSelectCollection }: any = useCollectionContext();
  return (
    <div
      role="listitem"
      className="mb-[1rem] h-[2.7rem] items-center w-full bg-neutral-800 text-white rounded-lg grid grid-cols-[2fr_1fr]"
    >
      <PopoverClose className="w-full max-h-full overflow-hidden overflow-ellipsis whitespace-nowrap  ">
        <span
          className="w-full h-full grid text-center pl-2"
          onClick={() => handleSelectCollection(e)}
        >
          {e?.name}
        </span>
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
  const { handleEditNotesCollection }: any = useCollectionContext();
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
            color="bg-blue-500 text-white "
            borderBottomColor="rgb(37 99 235)"
          />
        </DialogClose>
      </DialogFooter>
    </MyDialog>
  );
};

const MyDialog_Delete = ({ collection }) => {
  const { handleDeleteNoteCollection }: any = useCollectionContext();

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
            borderBottomColor="rgb(220 38 38)"
          />
        </DialogClose>
      </DialogFooter>
    </MyDialog>
  );
};
