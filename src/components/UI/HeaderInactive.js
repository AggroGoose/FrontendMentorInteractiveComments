import db from "../../app/firebase";

export default function HeaderInactive() {
  const signInHandler = () => {
    db.signInWithGithub();
  };
  return (
    <a className="header__signin" onClick={signInHandler}>
      [ SIGN IN WITH GITHUB ]
    </a>
  );
}
