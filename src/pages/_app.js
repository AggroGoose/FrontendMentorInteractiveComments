import "../styles/globals.scss";
import { UserProvider } from "../app/UserContext";
import { CommentProvider } from "../app/CommentContext";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <CommentProvider>
        <Component {...pageProps} />
      </CommentProvider>
    </UserProvider>
  );
}

export default MyApp;
