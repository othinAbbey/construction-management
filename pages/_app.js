import "@/styles/globals.css";
import Head from "next/head";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import { PRODUCT } from "../lib/pm";

export default function App({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gray-50 text-gray-800">
      <Head>
        <title>{PRODUCT}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Project management, BOQ extraction and material sourcing for construction companies." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SiteNav />
      <main className="flex-1"><Component {...pageProps} /></main>
      <SiteFooter />
    </div>
  );
}
