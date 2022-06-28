import { signOut, getAuth } from "firebase/auth";

export default function HeaderUserMenu() {
  function signOutHandler(e) {
    e.preventDefault();

    signOut(getAuth());
  }
  return (
    <ul className="header__usernav">
      <li className="header__usernav--subitem">
        <a onClick={signOutHandler}>Sign Out</a>
      </li>
    </ul>
  );
}
