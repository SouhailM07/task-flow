"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
import {
  faChevronDown,
  faCloud,
  faPlus,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import NotesCollections from "@/components/SINGLE-USE/NotesCollections/NotesCollections";

export default function Header() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  return (
    <header className="sticky top-0">
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
              onClick={() => router.push("login")}
            />
          )}
        </section>
      </nav>
    </header>
  );
}

//
