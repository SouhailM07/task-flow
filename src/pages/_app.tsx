import { AppProps } from "next/app";
import "@/../styles/globals.css";
import { useRouter } from "next/router";
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
      <DontRenderWhen route={["/login"]}>
        <Header />
      </DontRenderWhen>
      <Component {...pageProps} />
      <DontRenderWhen route={["/login"]}>
        <FooterInput />
      </DontRenderWhen>
      <Toaster />
    </ClerkProvider>
  );
}
