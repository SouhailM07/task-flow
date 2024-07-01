import { UserProfile } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function ProfileRoute() {
  return (
    <main className="flexCenter">
      <UserProfile />
    </main>
  );
}
