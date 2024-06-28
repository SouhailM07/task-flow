import { AppProps } from "next/app";
import "@/../styles/globals.css";
import { useRouter } from "next/router";
import { ClerkProvider } from "@clerk/nextjs";
// components
import Header from "@/components/SINGLE-USE/Header/Header";

export default function AppLayout({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <Header />
      <Component {...pageProps} />
    </ClerkProvider>
  );
}
