"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
import {
  faChevronDown,
  faCloud,
  faPlus,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MyButton from "@/components/REUSABLE/MyButton/MyButton";
import { Input } from "@/components/ui/input";

export default function Header() {
  const { isSignedIn } = useAuth();
  return (
    <header>
      <nav className="bg-primaryBlack text-white flexBetween py-[0.7rem] pl-[1rem] pr-[2rem]">
        <h1 className="text-[1.7rem] font-bold">Todo App</h1>
        <section className="flex items-center gap-x-[1rem]">
          <NotesCollections />
          {isSignedIn ? (
            <UserButton />
          ) : (
            <FontAwesomeIcon
              icon={faUserCircle}
              className="text-[1.8rem]"
              role="button"
              onClick={() => alert("hi")}
            />
          )}
        </section>
      </nav>
    </header>
  );
}

//

const NotesCollections = () => {
  let [toggle, setToggle] = useState<boolean>(false);
  return (
    <article>
      <button
        onClick={() => setToggle(!toggle)}
        className="flex items-center gap-x-[1rem]"
      >
        <span className="uppercase font-medium">Project One</span>
        <FontAwesomeIcon icon={faChevronDown} />
      </button>
      {toggle && (
        <div className=" absolute min-w-[20rem]  p-2 bg-white rounded-lg shadow-2xl translate-y-[1rem] translate-x-[-12rem] text-black">
          <CreateCollection />
        </div>
      )}
    </article>
  );
};

const CreateCollection = () => {
  return (
    <Dialog>
      <DialogTrigger className="flexCenter gap-x-[1rem] w-full bg-slate-200 p-2 rounded-lg">
        <span>New Collection</span>
        <FontAwesomeIcon icon={faPlus} />
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>New Collection</DialogTitle>
          <div>
            <Input
              className="mt-[1rem]"
              placeholder="Enter your collection name here..."
            />
          </div>
        </DialogHeader>
        <DialogFooter>
          <MyButton
            icon={faCloud}
            label="Save"
            color="bg-green-500 text-white"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
