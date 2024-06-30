import "./dontrenderwhen.css";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
export default function DontRenderWhen({
  children,
  route,
}: {
  children: ReactNode;
  route: string[];
}) {
  const router = useRouter();

  if (route.includes(router.pathname)) {
    return null;
  }
  return <>{children}</>;
}
