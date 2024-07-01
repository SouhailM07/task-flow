import { AppProps } from "next/app";
import "@/../styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
// components
import Header from "@/components/SINGLE-USE/Header/Header";
import FooterInput from "@/components/SINGLE-USE/FooterInput/FooterInput";
import DontRenderWhen from "@/components/REUSABLE/DontRenderWhen/DontRenderWhen";
import Loading from "@/components/REUSABLE/Loading/Loading";
import { Toaster } from "@/components/ui/toaster";

export default function AppLayout({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <Loading />
      <DontRenderWhen route={["/login", "/profile/[[...index]]"]}>
        <Header />
      </DontRenderWhen>
      <Component {...pageProps} />
      <DontRenderWhen route={["/login", "/profile/[[...index]]"]}>
        <FooterInput />
      </DontRenderWhen>
      <Toaster />
    </ClerkProvider>
  );
}
