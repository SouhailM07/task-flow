"use client";
import { useUser, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect } from "react";
// shadcn-ui
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPowerOff,
  faUser,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function MyUserButton() {
  const { user } = useUser();
  const router = useRouter();
  const { signOut } = useClerk();
  // ! handlers
  const handleGoProfile = () => router.push("/profile");
  const handleSignOut = () => {
    signOut();
    setTimeout(() => router.reload(), 200);
  };
  useEffect(() => {}, [user]);
  return (
    <Popover>
      <PopoverTrigger>
        {user?.hasImage ? (
          <Image
            className="rounded-full"
            // @ts-ignore
            src={user?.imageUrl}
            alt="img"
            width={40}
            height={40}
          />
        ) : (
          <FontAwesomeIcon
            icon={faUserCircle}
            className="text-[1.8rem]"
            role="button"
          />
        )}
      </PopoverTrigger>
      <PopoverContent className="flex-col flex items-start font-medium">
        <button
          onClick={handleGoProfile}
          className="p-2 w-full text-start flexBetween hover:bg-neutral-400 rounded-md"
        >
          <span>Profile</span>
          <FontAwesomeIcon icon={faUser} className="p-2 rounded-full" />
        </button>
        <button
          onClick={handleSignOut}
          className="p-2 w-full text-start flexBetween hover:bg-neutral-400 rounded-md"
        >
          <span>Sign out</span>
          <FontAwesomeIcon
            icon={faPowerOff}
            className="bg-red-500 text-white p-2 rounded-full"
          />
        </button>
      </PopoverContent>
    </Popover>
  );
}
