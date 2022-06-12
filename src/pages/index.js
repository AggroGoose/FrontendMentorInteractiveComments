import Head from "next/head";
import Footer from "../components/UI/Footer";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Interactive Comments</title>
        <meta
          name="description"
          content="Comment Project by AggroGoose for Frontend Mentor"
        />
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>

      <main>
        <h1>Organizing Comments</h1>
      </main>

      <Footer />
    </div>
  );
}
