import { signOut, getAuth } from "firebase/auth";
import Image from "next/image";

export default function HeaderActive({ user }) {
  function signOutHandler() {
    signOut(getAuth());
  }

  const iStyle = {
    borderRadius: "100%",
  };

  return (
    <div className="header__user">
      <p>{user.display}</p>
      <div className="header__user--img" onClick={signOutHandler}>
        <Image src={user.picture} height={35} width={35} style={iStyle} />
      </div>
    </div>
  );
}
