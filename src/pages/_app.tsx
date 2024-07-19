import { AppProps } from "next/app";
import "@/../styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
// components
import Header from "@/components/SINGLE-USE/Header/Header";
import FooterInput from "@/components/SINGLE-USE/FooterInput/FooterInput";
import DontRenderWhen from "@/components/REUSABLE/DontRenderWhen/DontRenderWhen";
import Loading from "@/components/REUSABLE/Loading/Loading";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";
import NotesContextProvider from "@/context/NotesContext";
export default function AppLayout({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Task Flow</title>
      </Head>
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        <Loading />
        <NotesContextProvider>
          <DontRenderWhen route={["/login", "/profile/[[...index]]"]}>
            <Header />
          </DontRenderWhen>
          <Component {...pageProps} />
          <DontRenderWhen route={["/login", "/profile/[[...index]]"]}>
            <FooterInput />
          </DontRenderWhen>
        </NotesContextProvider>
        <Toaster />
      </ClerkProvider>
    </>
  );
}
